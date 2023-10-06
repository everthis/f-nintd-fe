import React, { useState, useEffect, useRef } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import Hls from 'hls.js'
import styled from 'styled-components'
import { Nav } from './nav'
import { API_ORIGIN } from './constant'
import { PlayIcon, PauseIcon } from './icon'
import { useQuery } from './hooks'

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
    background-color: var(--bg-color);
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
const SelectWrap = styled.span``
const StyledAudioItem = styled.div``
const AudioItemWrap = styled.div`
  display: flex;
  flex-wrap: nowrap;
  ${StyledAudioItem} {
    flex: 1;
  }
`
function isWechat() {
  return /MicroMessenger/i.test(window.navigator.userAgent)
}
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
  const [shouldShowPlayer, setShouldShowPlayer] = useState(true)
  const [paused, setPaused] = useState(true)
  const [status, setStatus] = useState('')

  // if (source) source += '#t=0.1'

  function canplay(ev) {
    setStatus(ev.type)
    setIsReadyToPlay(true)
  }
  function loadstart(ev) {
    setStatus(ev.type)
  }
  function loadedmetadata(ev) {
    setStatus(ev.type)
  }
  function loadeddata(ev) {
    setStatus(ev.type)
  }
  function progress(ev) {
    // console.log('progress', ev)
    // setStatus(ev.type)
  }
  function pause(ev) {
    setStatus(ev.type)
  }
  function playing(ev) {
    setStatus(ev.type)
  }
  function canplaythrough(ev) {
    setStatus(ev.type)
  }
  function waiting(ev) {
    setStatus(ev.type)
  }
  function play(ev) {
    setStatus(ev.type)
  }
  function ended(ev) {
    setStatus(ev.type)
  }
  function durationchange(ev) {
    setDuration(ev.target.duration)
  }

  useEffect(() => {
    const audio = ref.current

    function timeupdate() {
      const percentage = (audio.currentTime / audio.duration) * 100
      if (!isNaN(percentage)) setVal(percentage)
    }
    function seeked(ev) {
      setStatus(ev.type)
      // audio.play()
      // setPaused(false)
    }

    audio.addEventListener('loadstart', loadstart)
    audio.addEventListener('loadedmetadata', loadedmetadata)
    audio.addEventListener('progress', progress)
    audio.addEventListener('pause', pause)
    audio.addEventListener('playing', playing)
    audio.addEventListener('loadeddata', loadeddata)
    audio.addEventListener('timeupdate', timeupdate)
    audio.addEventListener('seeked', seeked)
    audio.addEventListener('canplay', canplay)
    audio.addEventListener('canplaythrough', canplaythrough)
    audio.addEventListener('play', play)
    audio.addEventListener('waiting', waiting)
    audio.addEventListener('ended', ended)
    audio.addEventListener('durationchange', durationchange)

    if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      // audio.addEventListener('canplay', canplay)
      audio.src = source
      audio.load()
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 6,
      })
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        setIsReadyToPlay(true)
      })
      hls.on(Hls.Events.LEVEL_LOADED, function (ev, data) {
        // setDuration(data.details.totalduration)
      })
      hls.loadSource(source)
      hls.attachMedia(audio)
    } else {
      setShouldShowPlayer(false)
    }

    return () => {
      audio.removeEventListener('loadstart', loadstart)
      audio.removeEventListener('loadedmetadata', loadedmetadata)
      audio.removeEventListener('progress', progress)
      audio.removeEventListener('pause', pause)
      audio.removeEventListener('playing', playing)
      audio.removeEventListener('loadeddata', loadeddata)
      audio.removeEventListener('timeupdate', timeupdate)
      audio.removeEventListener('seeked', seeked)
      audio.removeEventListener('canplay', canplay)
      audio.removeEventListener('canplaythrough', canplaythrough)
      audio.removeEventListener('play', play)
      audio.removeEventListener('waiting', waiting)
      audio.removeEventListener('ended', ended)
      audio.removeEventListener('durationchange', durationchange)
      if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        // audio.removeEventListener('canplay', canplay)
      }
    }
  }, [])

  function togglePlay(ev) {
    const audio = ref.current
    if (audio.paused) {
      audio.play()
      setPaused(false)
    } else {
      audio.pause()
      setPaused(true)
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

  // const btnContent =
  //   ref.current == null ? (
  //     <PlayIcon />
  //   ) : ref.current.paused ? (
  //     <PlayIcon />
  //   ) : (
  //     <PauseIcon />
  //   )

  const btnContent = paused ? <PlayIcon /> : <PauseIcon />

  if (!shouldShowPlayer) return null
  return (
    <div>
      <audio ref={ref} playsInline preload='metadata' />
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
            {status ? ` (${status})` : null}
          </div>
        </ProgressWrap>
        <Actions>
          <button
            type='button'
            title='toggle play'
            disabled={isWechat() ? false : !isReadyToPlay}
            onClick={togglePlay}
          >
            {btnContent}
          </button>
        </Actions>
      </FixedRightWidthRow>
    </div>
  )
}

export function AudioItem({ data }) {
  const { name, m3u8_name, folder, url } = data
  return (
    <StyledAudioItem
      style={{
        marginBottom: '0.5em',
        borderBottom: '1px solid #ddd',
        paddingBottom: '0.5em',
      }}
    >
      <AudioPlayer source={url} name={name} />
    </StyledAudioItem>
  )
}

function AudioList({ list, onSelectChange }) {
  return (
    <>
      {list.map((e) => (
        <AudioItemWrap key={e.folder}>
          {onSelectChange ? (
            <SelectWrap>
              <input
                type='checkbox'
                value={e.id}
                name='audio'
                onChange={onSelectChange}
              />
            </SelectWrap>
          ) : null}
          <AudioItem data={e} />
        </AudioItemWrap>
      ))}
    </>
  )
}

export function Audio() {
  // const [audioList, setAudioList] = useState([])
  const { data: audioList = [], loading } = useQuery({
    url: `${API_ORIGIN}/audio/list`,
  })

  return (
    <div>
      {loading ? 'loading' : ''}
      <AudioList list={audioList} />
    </div>
  )
}

export function AudioStateLess({ list = [], onSelectChange, showSelect }) {
  return <AudioList list={list} onSelectChange={onSelectChange} />
}
