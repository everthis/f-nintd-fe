import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import { Nav } from './nav'
import { API_ORIGIN } from './constant'
import { ToggleIcon } from './icon'

const theme = {
  dark: {
    '--bg-color': '#FFF4BE',
    '--bg-active': '#202020',
    '--color': '#333',
    '--active-color': '#fff',
  },
  light: {
    '--bg-color': '#ffffff',
    '--bg-active': '#818cab',
    '--color': '#424242',
    '--active-color': '#333',
  },
}

const Wrap = styled.span`
  display: inline-flex;
  align-items: center;
  min-width: 5em;
`

function ThemeComp() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') ?? 'light'
  )

  const setLight = () => {
    setThemeFn('light')
    localStorage.setItem('theme', 'light')
  }

  const setDark = () => {
    setThemeFn('dark')
    localStorage.setItem('theme', 'dark')
  }

  useEffect(() => {
    const preferredTheme = localStorage.getItem('theme')
    if (preferredTheme === 'dark') {
      setThemeFn('dark')
    } else {
      setThemeFn('light')
    }
  }, [])

  const toggleTheme = () => {
    if (theme === 'light') {
      setDark()
      setTheme('dark')
    } else {
      setLight()
      setTheme('light')
    }
  }

  return (
    <Wrap>
      <ToggleIcon size='20px' onClick={toggleTheme} />
      <span>{theme}</span>
    </Wrap>
  )
}

export const Theme = React.memo(ThemeComp)

// theme.js

function setThemeFn(themeChoice) {
  const el = document.querySelector(':root')
  const hash = theme[themeChoice]
  Object.keys(hash).forEach((k) => {
    el.style.setProperty(k, hash[k])
  })
}
