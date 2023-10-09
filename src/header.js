import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Nav } from './nav'
import { Theme } from './theme'

const Center = styled.div`
  margin: 0 auto;
  text-align: center;
  display: flex;
  justify-content: center;
`
export const ThemeWrap = styled.span`
  margin: 0 0 0 1em;
`

export function Header() {
  return (
    <Center>
      <Nav />
      <ThemeWrap>
        <Theme />
      </ThemeWrap>
    </Center>
  )
}
