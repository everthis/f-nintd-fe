import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useId,
  useCallback,
} from 'react'
import styled from 'styled-components'

import { Com } from './com/index'

export function ComponentStateLess({ list }) {
  return (
    <>
      {list.map((e) => (
        <Single data={e} key={e.id} />
      ))}
    </>
  )
}
function Single({ data }) {
  const { name, type } = data
  if (type !== 'component') return null
  const Comp = Com[name]
  return (
    <>
      <p>{name}</p>
      <Comp />
    </>
  )
}
