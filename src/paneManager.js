import React, { useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import styled from 'styled-components'

const Wrap = styled.div``

export function PaneManager({ panes }) {
  return <Wrap>{panes}</Wrap>
}

/*

push
delete
activate

set(a, true) // if a ---> A exists, bring A to front, otherwise, push A to stack
set(a, false) // if a ---> A exists, delete A from stack, otherwise, do nothing




*/
