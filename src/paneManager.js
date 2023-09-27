import React, { useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import styled from 'styled-components'

const Wrap = styled.div``

export function PaneManager({ panes }) {
  return <Wrap>{panes}</Wrap>
}
