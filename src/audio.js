import React, { useState, useEffect, useRef } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import Hls from 'hls.js'
import styled from 'styled-components'
import { Nav } from './nav'
import { API_ORIGIN } from './constant'
import { PlayIcon, PauseIcon } from './icon'

const HiddenInput = styled.input`
  opacity: 0;
`
const ProgressWrap = styled.div`
  position: relative;
  progress {
    display: block;
    width: 100%;
    border-radius: 0;
    height: 10px;
  }
  progress::-webkit-progress-bar {
    background-color: #fff;
    border: 1px solid #c4b2b2;
    border-radius: 0;
  }
  progress::-webkit-progress-value {
    background-color: purple;
  }
  ${HiddenInput} {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    cursor: pointer;
  }
`

const Actions = styled.span``

const FixedRightWidthRow = styled.div`
  position: relative;
  padding-right: 2.5em;
  display: flex;
  height: 2em;

  ${Actions} {
    position: absolute;
    top: 0;
    right: 0;
  }
  ${ProgressWrap} {
    width: 100%;
  }
`

function secondsToHms(d) {
  d = Number(d)
  const h = Math.floor(d / 3600)
  const m = Math.floor((d % 3600) / 60)
  const s = Math.floor((d % 3600) % 60)

  const hDisplay = h > 0 ? h + ':' : ''
  const mDisplay = m > 0 ? m.toString().padStart(2, '0') + ':' : '00:'
  const sDisplay = s > 0 ? s.toString().padStart(2, '0') : '00'
  return hDisplay + mDisplay + sDisplay
}

function AudioPlayer({ source, name }) {
  const ref = useRef()
  const progressRef = useRef()
  const [isReadyToPlay, setIsReadyToPlay] = useState(false)
  const [val, setVal] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = ref.current

    function timeupdate() {
      const percentage = (audio.currentTime / audio.duration) * 100
      if (!isNaN(percentage)) setVal(percentage)
    }
    function seeked(ev) {
      audio.play()
    }
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 6,
      })
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        setIsReadyToPlay(true)
      })
      hls.on(Hls.Events.LEVEL_LOADED, function () {
        setDuration(audio.duration)
      })
      hls.loadSource(source)
      hls.attachMedia(audio)
      audio.addEventListener('timeupdate', timeupdate)
      audio.addEventListener('seeked', seeked)
    }

    return () => {
      if (Hls.isSupported()) {
        audio.removeEventListener('timeupdate', timeupdate)
        audio.removeEventListener('seeked', seeked)
      }
    }
  }, [])

  function togglePlay() {
    const audio = ref.current
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }

  function rangeChange(ev) {
    const audio = ref.current
    const v = (Number(ev.target.value) / 100) * audio.duration
    if (!isNaN(v)) {
      audio.currentTime = v
    }
    setVal(Number(ev.target.value))
  }

  const btnContent =
    ref.current == null ? (
      <PlayIcon />
    ) : ref.current.paused ? (
      <PlayIcon />
    ) : (
      <PauseIcon />
    )

  return (
    <div>
      <audio ref={ref} />
      {/* important, use transparent range input */}
      {/* important, range input above progress */}
      <div>{name}</div>
      <FixedRightWidthRow>
        <ProgressWrap>
          <progress value={val} max={100} />
          <HiddenInput
            type='range'
            onChange={rangeChange}
            ref={progressRef}
            value={val}
            max={100}
          />
          <div>
            {secondsToHms(duration)}/
            {secondsToHms(ref.current?.currentTime || 0)}
          </div>
        </ProgressWrap>
        <Actions>
          <span disabled={!isReadyToPlay} onClick={togglePlay}>
            {btnContent}
          </span>
        </Actions>
      </FixedRightWidthRow>
    </div>
  )
}

function AudioItem({ data }) {
  const { name, m3u8_name, folder, url } = data
  return (
    <div
      style={{
        marginBottom: '0.5em',
        borderBottom: '1px solid #ddd',
        paddingBottom: '0.5em',
      }}
    >
      <AudioPlayer source={url} name={name} />
    </div>
  )
}

function AudioList({ list }) {
  return (
    <>
      {list.map((e) => (
        <AudioItem key={e.folder} data={e} />
      ))}
    </>
  )
}

export function Audio() {
  const [audioList, setAudioList] = useState([])

  function getList() {
    fetch(`${API_ORIGIN}/audio/list`, {})
      .then((d) => d.json())
      .then((d) => {
        setAudioList(d)
      })
  }

  useEffect(() => {
    getList()
    return () => {
      setAudioList([])
    }
  }, [])

  return (
    <div>
      <AudioList list={audioList} />
    </div>
  )
}
