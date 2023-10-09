import React, { useRef } from 'react'
import styled from 'styled-components'

export const Button = styled.button`
  display: ${({ type }) => type};
  margin: 0 auto;
  inline-size: ${({ type }) => (type === 'block' ? '100%' : 'auto')};
`

export function Btn(props) {
  const { children, type = 'inline-block', ...restprops } = props
  return (
    <Button type={type} {...restprops}>
      {children}
    </Button>
  )
}
