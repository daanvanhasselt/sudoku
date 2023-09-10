import React, { FC } from 'react'
import { Row } from './row'
import { Cell } from './cell'
import { Container } from './container'

export const Grid: FC = () => {
  return (
    <Container data-tag="grid-container">
      {React.Children.toArray(
        [...Array(9)].map((_, index) => (
          <Row data-tag="grid-row">
            {React.Children.toArray(
              [...Array(9)].map((_, index) => (
                <Cell data-tag="grid-cell">{index}</Cell>
              ))
            )}
          </Row>
        ))
      )}
    </Container>
  )
}
