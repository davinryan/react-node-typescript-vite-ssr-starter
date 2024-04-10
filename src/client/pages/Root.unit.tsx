import {describe, it, expect} from 'vitest'
import {render} from '@testing-library/react'
import {Root} from './Root.tsx'

describe('App test suite', () => {

  it('should contain text Lorem Ipsum', () => {
    // Assemble
    const {getByTestId} = render(<Root data={{}}></Root>)

    // Act
    const titleDescriptionElement = getByTestId('myed-root-title-description')

    // Assert
    expect(titleDescriptionElement).toHaveTextContent("Lorem Ipsum");
  })
})