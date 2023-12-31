import React, { FC, Children } from 'react'
import { Row } from './row'
import Cell from './cell'
import { Container } from './container'
import Xarrow from 'react-xarrows'

export const Grid: FC = () => {
  return (
    <Container data-tag="grid-container">
      {Children.toArray(
        [...Array(9)].map((_, rowIndex) => (
          <Row data-tag="grid-row">
            {Children.toArray(
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
      {/* <Xarrow
        start="cell00"
        end="cell08"
        showHead={true}
        showTail={true}
        path="smooth"
        curveness={0.15}
      /> */}
    </Container>
  )
}
