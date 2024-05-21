import React, { useRef, useEffect, useState, useId } from 'react'
import styled from 'styled-components'
import { postData } from './utils'
import { API_ORIGIN, TYPE } from './constant'
import { useQuery, usePostData } from './hooks'
import { VdotsIcon } from './icon'
import { Tags } from './tag'

const ListWrap = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: start;
  gap: .3rem;
  flex-wrap: wrap;
`

const VideoWrap = styled.div`
  position: relative;
  width: 33%;
  ${({ checked }) => (checked ? ' background-color: blue;' : '')}
  video {
    display: block;
    width: 100%;
    position: relative;
    z-index: 0;
  }
`
const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
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
const VideoContainer = styled.div`
${({ checked }) =>
  checked ? 'transform: translateZ(0px) scale3d(0.95,0.91,1);' : ''}
`

export function PureVideo({ data }) {
  const { src } = data
  const ref = useRef()

  useEffect(() => {
    const v = ref.current
    v.addEventListener('pause', function (e) {
      v.play()
    })
    v.addEventListener('ended', function (e) {
      v.play()
    })
    return () => {}
  }, [])
  return (
    <>
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsinline
        autoplay='autoplay'
        webkit-playsinline
      />
      <Mask />
    </>
  )
}

function SingleVideo({
  data,
  onSelectChange,
  chkSelected,
  toggleOpts,
  showOpts = true,
}) {
  const checked = chkSelected(data)
  return (
    <VideoWrap checked={checked}>
      <VideoContainer checked={checked}>
        <PureVideo data={data} />
      </VideoContainer>
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
    </VideoWrap>
  )
}
function VideoList({ list, onSelectChange, chkSelected, toggleOpts }) {
  // console.log(list)
  return (
    <ListWrap>
      {list.map((e, i) => (
        <SingleVideo
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

export function VideoStateLess({
  list,
  onSelectChange = () => {},
  chkSelected,
  toggleOpts,
}) {
  if (list.length === 0 || list[0].type !== TYPE.ONE_FRAME_VIDEO) return null
  return (
    <VideoList
      list={list}
      chkSelected={chkSelected}
      onSelectChange={onSelectChange}
      toggleOpts={toggleOpts}
    />
  )
}
