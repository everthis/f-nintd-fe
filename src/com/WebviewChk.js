import React, { useRef, useId } from 'react'
import styled from 'styled-components'
import { OpenInBrowser } from './OpenInBrowser'

function isWebview() {
  if (typeof window === undefined) {
    return false
  }

  let navigator = window.navigator

  const standalone = navigator.standalone
  const userAgent = navigator.userAgent.toLowerCase()
  const safari = /safari/.test(userAgent)
  const ios = /iphone|ipod|ipad|macintosh/.test(userAgent)
  const ios_ipad_webview = ios && !safari

  return ios
    ? (!standalone && !safari) || ios_ipad_webview
    : userAgent.includes('wv')
}

export function WebviewChk() {
  return isWebview() ? <OpenInBrowser /> : null
}
