import Anthropic from '@anthropic-ai/sdk'
import { GRID } from 'typings'
import { createGridFromDigits } from './grid'

const STORAGE_KEY = 'sudoku_anthropic_api_key'

export const getStoredAnthropicApiKey = (): string => {
  if (typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? ''
  } catch (error) {
    console.error('Failed to read Anthropic API key from storage', error)
    return ''
  }
}

export const setStoredAnthropicApiKey = (key: string): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, key)
  } catch (error) {
    console.error('Failed to store Anthropic API key', error)
  }
}

export const clearStoredAnthropicApiKey = (): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear Anthropic API key', error)
  }
}

interface IRequestSudokuParams {
  apiKey: string
  dataUrl: string
  signal?: AbortSignal
}

const PROMPT =
  'Extract the Sudoku puzzle from this image. Return the grid as nine rows of nine integers, top row first, using digits 1-9 for given cells and 0 for empty cells.'

const GRID_SCHEMA = {
  type: 'object',
  properties: {
    grid: {
      type: 'array',
      description:
        'Nine rows of nine integers (0-9), top row of the puzzle first. 0 means an empty cell.',
      items: {
        type: 'array',
        items: { type: 'integer' },
      },
    },
  },
  required: ['grid'],
  additionalProperties: false,
}

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

const SUPPORTED_MEDIA_TYPES: ImageMediaType[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

const parseDataUrl = (
  dataUrl: string
): { mediaType: ImageMediaType; data: string } => {
  const match = /^data:([a-z0-9/+.-]+);base64,(.+)$/i.exec(dataUrl)
  if (!match) {
    throw new Error('Could not read the selected image')
  }
  const mediaType = match[1].toLowerCase() as ImageMediaType
  if (!SUPPORTED_MEDIA_TYPES.includes(mediaType)) {
    throw new Error(`Unsupported image type: ${match[1]}`)
  }
  return { mediaType, data: match[2] }
}

export const requestSudokuGridFromImage = async ({
  apiKey,
  dataUrl,
  signal,
}: IRequestSudokuParams): Promise<GRID> => {
  const { mediaType, data } = parseDataUrl(dataUrl)

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const response = await client.beta.messages.create(
    {
      model: 'claude-fable-5',
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      // Fable's safety classifiers can decline a request; "default" retries
      // it server-side on Anthropic's recommended fallback model.
      fallbacks: 'default',
      output_config: {
        format: { type: 'json_schema', schema: GRID_SCHEMA },
      },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data },
            },
            { type: 'text', text: PROMPT },
          ],
        },
      ],
    } as any,
    { signal }
  )

  if (response.stop_reason === 'refusal') {
    throw new Error(
      'Claude declined to read this image. Please try a different photo.'
    )
  }

  const textBlock = response.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Unexpected response format from Anthropic')
  }

  let payload: { grid?: number[][] }
  try {
    payload = JSON.parse(textBlock.text)
  } catch (error) {
    console.error('Failed to parse Anthropic response', error, textBlock.text)
    throw new Error('Unable to parse grid from the Anthropic response')
  }

  if (
    !payload?.grid ||
    !Array.isArray(payload.grid) ||
    payload.grid.length !== 9 ||
    payload.grid.some((row) => !Array.isArray(row) || row.length !== 9)
  ) {
    throw new Error('Claude did not return a 9x9 grid')
  }

  return createGridFromDigits(payload.grid)
}
