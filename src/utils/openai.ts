import { GRID } from 'typings'
import { createGridFromDigits } from './grid'

const STORAGE_KEY = 'sudoku_openai_api_key'

export const getStoredOpenAIApiKey = (): string => {
  if (typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? ''
  } catch (error) {
    console.error('Failed to read OpenAI API key from storage', error)
    return ''
  }
}

export const setStoredOpenAIApiKey = (key: string): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, key)
  } catch (error) {
    console.error('Failed to store OpenAI API key', error)
  }
}

export const clearStoredOpenAIApiKey = (): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear OpenAI API key', error)
  }
}

interface IRequestSudokuParams {
  apiKey: string
  dataUrl: string
  signal?: AbortSignal
}

interface OpenAISudokuPayload {
  grid: number[][]
}

const SYSTEM_PROMPT =
  'You are a helpful assistant that reads Sudoku puzzles from images and responds strictly with JSON matching {"grid":[[...],[...],...]} using digits 1-9 for givens and 0 for blanks. Never include explanations, markdown, or text outside the JSON literal.'

const USER_PROMPT =
  'Extract the Sudoku puzzle from this image and return only JSON in the form {"grid":[[...],[...],...]} with nine rows of nine integers (0-9). Use 0 for empty cells. Do not add extra commentary.'

export const requestSudokuGridFromImage = async ({
  apiKey,
  dataUrl,
  signal,
}: IRequestSudokuParams): Promise<GRID> => {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-5-chat-latest',
      input: [
        {
          role: 'developer',
          content: [
            {
              type: 'input_text',
              text: SYSTEM_PROMPT,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: USER_PROMPT,
            },
            {
              type: 'input_image',
              image_url: dataUrl,
            },
          ],
        },
      ],
    }),
  })

  const json = await response.json()

  if (!response.ok) {
    const errorMessage = json?.error?.message || 'OpenAI request failed'
    throw new Error(errorMessage)
  }

  const extractTextContent = (): string | null => {
    if (Array.isArray(json?.output)) {
      for (const item of json.output) {
        const text = item?.content?.find?.((c: any) => c?.type === 'output_text')
        if (text?.text) return text.text
        const altText = item?.content?.find?.((c: any) => c?.type === 'text')
        if (altText?.text) return altText.text
      }
    }

    if (typeof json?.output_text === 'string') {
      return json.output_text
    }

    if (json?.choices?.[0]?.message?.content) {
      const legacyContent = json.choices[0].message.content
      if (typeof legacyContent === 'string') return legacyContent
      if (Array.isArray(legacyContent)) {
        const textPart = legacyContent.find((part: any) => part?.type === 'text')
        if (textPart?.text) return textPart.text
      }
    }

    return null
  }

  const content = extractTextContent()
  if (!content) {
    throw new Error('Unexpected response format from OpenAI')
  }

  let payload: OpenAISudokuPayload
  try {
    const normalized = content.trim()
    const withoutFence = normalized
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```$/i, '')
      .trim()

    const firstBrace = withoutFence.indexOf('{')
    const lastBrace = withoutFence.lastIndexOf('}')
    const jsonSegment =
      firstBrace !== -1 && lastBrace !== -1
        ? withoutFence.slice(firstBrace, lastBrace + 1)
        : withoutFence

    payload = JSON.parse(jsonSegment) as OpenAISudokuPayload
  } catch (error) {
    console.error('Failed to parse OpenAI response', error, content)
    throw new Error('Unable to parse grid from OpenAI response')
  }

  if (
    !payload?.grid ||
    !Array.isArray(payload.grid) ||
    payload.grid.length !== 9 ||
    payload.grid.some((row) => !Array.isArray(row) || row.length !== 9)
  ) {
    throw new Error('OpenAI did not return a 9x9 grid')
  }

  return createGridFromDigits(payload.grid)
}
