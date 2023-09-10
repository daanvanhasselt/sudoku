import React, { FC } from 'react'
import { Row } from './row'
import Cell from './cell'
import { Container } from './container'

export const Grid: FC = () => {
  return (
    <Container data-tag="grid-container">
      {React.Children.toArray(
        [...Array(9)].map((_, rowIndex) => (
          <Row data-tag="grid-row">
            {React.Children.toArray(
              [...Array(9)].map((_, colIndex) => (
                <Cell
                  data-tag="grid-cell"
                  colIndex={colIndex}
                  rowIndex={rowIndex}
                />
              ))
            )}
          </Row>
        ))
      )}
    </Container>
  )
}
