import React, { useRef, useEffect, useState, useId, useMemo } from 'react'
import styled from 'styled-components'
import { postData } from './utils'
import { API_ORIGIN, TYPE } from './constant'
import { useQuery, usePostData } from './hooks'
import { VdotsIcon } from './icon'
import { Tags } from './tag'
import { isWechat } from './audio'
import { OpenInBrowser } from './com/OpenInBrowser'

const ListWrap = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: start;
  gap: .3rem;
  flex-wrap: wrap;
`
const VideoInnerWrap = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: ${({ ratio }) => ratio * 100}%;
  video {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
`
const VideoWrap = styled.div`
  position: relative;
  width: 33%;
  ${({ checked }) => (checked ? ' background-color: blue;' : '')}
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
const PHWrap = styled.div`
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index:0;
background-color: #ddd;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
`
const L = styled.div`
font-size: 32px;
`
const S =styled.div``
const VideoContainer = styled.div`
${({ checked }) =>
  checked ? 'transform: translateZ(0px) scale3d(0.95,0.91,1);' : ''}
`
function calcRatio(dimension) {
  const arr = dimension.split(',').map((e) => +e)
  return arr[1] / arr[0]
}
function LoadingPH({ text, subText }) {
  return <PHWrap><L>{text}</L><S>{subText}</S></PHWrap>
}
export function PureVideo({ data }) {
  const { src, dimension } = data
  const ref = useRef()
  const ratio = calcRatio(dimension)
  const inWechat = isWechat()
  const loadingText = useMemo(
    () => (inWechat ? <OpenInBrowser /> : 'Loading'),
    [inWechat]
  )

  /*
  useEffect(() => {
    const v = ref.current
    v.addEventListener('pause', function (e) {
      v.play()
    })
    v.addEventListener('ended', function (e) {
      v.play()
    })

    return () => {
      v.pause()
      v.removeAttribute('src') // empty source
      v.load()
    }
  }, [])
*/
  /*
  useEffect(() => {
    const v = ref.current
    const play = () => v.play()
    const stop = () => {
      v.pause()
      v.removeAttribute('src') // empty source
      v.load()
    }
    const addSrcAttr = () => {
      v.setAttribute('src', src)
    }
    const observer = new IntersectionObserver((entries, oo) => {
      // console.log('trigger', oo)
      if (entries[0].isIntersecting) {
        // el is visible
        console.log('vis')
        if (!v.hasAttribute('src')) addSrcAttr()
        v.pause()
        // v.addEventListener('pause', play)
        // v.addEventListener('ended', play)
      } else {
        console.log('not vis')
        // el is not visible
        // v.removeEventListener('pause', play)
        // v.removeEventListener('ended', play)
        // stop()
      }
    })

    observer.observe(v)
    return () => {
      stop()
      observer.disconnect()
    }
  }, [])
  */
  useEffect(() => {
    const v = ref.current
    if (v == null) return
    const play = () => v.play()
    const pause = () => {
      console.log('pause')
      v.pause()
    }
    const stop = () => {
      v.pause()
      v.removeAttribute('src') // empty source
      v.load()
    }
    const addSrcAttr = () => {
      v.setAttribute('src', src)
    }

    v.addEventListener('play', pause)
    const observer = new IntersectionObserver((entries, oo) => {
      if (entries[0].isIntersecting) {
        console.log('vis')
        if (!v.hasAttribute('src')) addSrcAttr()
      } else {
        console.log('not vis')
        // el is not visible
        // v.removeEventListener('pause', play)
        // v.removeEventListener('ended', play)
        stop()
      }
    })
    observer.observe(v)
    return () => {
      stop()
      observer.disconnect()
    }
  }, [])
  const subText = 'It may not work if your device or system does not support HDR.'
  return (
    <VideoInnerWrap ratio={ratio}>
      <LoadingPH text={loadingText} subText={subText} />
      {inWechat ? null : (
        <video
          ref={ref}
          src={src}
          muted
          loop
          playsInline
          autoPlay='autoplay'
          preload='auto'
        />
      )}
      <Mask />
    </VideoInnerWrap>
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
