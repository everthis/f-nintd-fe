import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const PlayerWrap = styled.div``
const Active = styled.div``
const List = styled.div``
/*
active
  |
  |
 List
*/
export function Layout() {
  return (
    <PlayerWrap>
      <Active>active</Active>
      <List></List>
    </PlayerWrap>
  )
}
