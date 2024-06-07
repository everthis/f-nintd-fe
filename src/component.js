import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useId,
  useCallback,
} from 'react'
import styled from 'styled-components'
import { API_ORIGIN, TYPE } from './constant'

const ComWrap = styled.div`
  position: relative;
  width: 100%;
  ${({ checked }) => (checked ? ' background-color: blue;' : '')}
`
const ComContainer = styled.div``
const UpperLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;

`
const SelectWrap = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  input {
    height: 16px;
    width: 16px;
  }
`
const Pos = styled.span`
  font-size: 0;
  position: absolute;
  right: 0.2rem;
  bottom: 0.2rem;
  font-size: 0;
  background-color: var(--bg-color);
  opacity: 0.3;
  border-radius: 50%;
  overflow: hidden;
  &:hover {
    opacity: 0.9;
  }
`
const ListWrap = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: start;
  gap: .3rem;
  flex-wrap: wrap;
`
import { Com } from './com/index'
import { VdotsIcon } from './icon'

export function ComponentStateLess({
  list,
  onSelectChange,
  chkSelected,
  toggleOpts,
}) {
  if (list.length === 0 || list[0].type !== TYPE.COMPONENT) return null
  return (
    <ListWrap>
      {list.map((e, i) => (
        <ComponentWrap
          key={i}
          onSelectChange={onSelectChange}
          data={e}
          toggleOpts={toggleOpts}
          chkSelected={chkSelected}
        />
      ))}
    </ListWrap>
  )
}
function ComponentWrap({
  data,
  onSelectChange,
  chkSelected,
  toggleOpts,
  showOpts = true,
}) {
  const checked = chkSelected(data)
  return (
    <ComWrap checked={checked}>
      <ComContainer checked={checked}>
        <p>{data?.name}</p>
        <PureComp data={data} />
      </ComContainer>
      <UpperLayer>
        {onSelectChange ? (
          <SelectWrap>
            <input
              type='checkbox'
              value={data.id}
              name='oneFrameVideo'
              checked={checked}
              onChange={(ev) => onSelectChange(data, ev.target.checked)}
            />
          </SelectWrap>
        ) : null}
        {showOpts ? (
          <Pos>
            <VdotsIcon onClick={toggleOpts} size='20px' />
          </Pos>
        ) : null}
      </UpperLayer>
    </ComWrap>
  )
}
export function PureComp({ data }) {
  const { name, type } = data
  if (type !== 'component') return null
  const Comp = Com[name]
  return <Comp />
}
