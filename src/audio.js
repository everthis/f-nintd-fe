import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import Hls from 'hls.js'
import styled from 'styled-components'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

import { Nav } from './nav'
import { API_ORIGIN, EMPTY_ARR, EMPTY_SET, TYPE } from './constant'
import { PlayIcon, PauseIcon, WaveformIcon } from './icon'
import { useQuery, useChecked, usePostData } from './hooks'
import { AudioWave } from './audioWave'

const HiddenInput = styled.input`
  opacity: 0;
`
const ProgressWrap = styled.div`
  position: relative;
  ${HiddenInput} {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    cursor: pointer;
    height: 100%;
    margin: 0;
  }
`

const Actions = styled.span`
  display: flex;
  gap: 10px;
  button {
    cursor: pointer;
  }
`

const FixedRightWidthRow = styled.div`
  position: relative;
  padding-right: 6.5em;
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

const WaveformWrap = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`
const ProgressContrlWrap = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
`
const WaveControl = styled.div`
  height: 100%;
`

const ProgressStatus = styled.div``
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

function AudioPlayer({ source, name, id, waveform }) {
  const ref = useRef()
  const progressRef = useRef()
  const [isReadyToPlay, setIsReadyToPlay] = useState(false)
  const [val, setVal] = useState(0)
  const [duration, setDuration] = useState(0)
  const [shouldShowPlayer, setShouldShowPlayer] = useState(true)
  const [paused, setPaused] = useState(true)
  const [status, setStatus] = useState('')
  const { loading: genPeaksInProgress, postData: genPeaksFn } = usePostData()

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
  function genPeaks() {
    genPeaksFn({
      url: `${API_ORIGIN}/waveform/fromM3U8`,
      payload: {
        audio_id: id,
        m3u8: source,
      },
    })
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
      <audio ref={ref} playsInline preload="metadata" />
      {/* important, use transparent range input */}
      {/* important, range input above progress */}
      <div>{name}</div>
      <FixedRightWidthRow>
        <ProgressWrap>
          <WaveControl>
            {waveform ? (
              <WaveformWrap>
                <AudioWave url={waveform} />
              </WaveformWrap>
            ) : null}
            <ProgressContrlWrap>
              <progress className="progress" value={val} max={100} />
              <HiddenInput
                type="range"
                onChange={rangeChange}
                ref={progressRef}
                value={val}
                max={100}
              />
            </ProgressContrlWrap>
          </WaveControl>
        </ProgressWrap>
        <Actions>
          <button onClick={genPeaks}>
            <WaveformIcon />
          </button>
          <button
            type="button"
            title="toggle play"
            disabled={isWechat() ? false : !isReadyToPlay}
            onClick={togglePlay}
          >
            {btnContent}
          </button>
        </Actions>
      </FixedRightWidthRow>
      <ProgressStatus>
        <div>
          {secondsToHms(ref.current?.currentTime || 0)}/{secondsToHms(duration)}
          {status ? ` (${status})` : null}
        </div>
      </ProgressStatus>
    </div>
  )
}

export function AudioItem({ data }) {
  const { name, url, id, waveform } = data
  return (
    <StyledAudioItem
      style={{
        marginBottom: '0.5em',
        borderBottom: '1px solid #ddd',
        paddingBottom: '0.5em',
      }}
    >
      <AudioPlayer source={url} name={name} id={id} waveform={waveform} />
    </StyledAudioItem>
  )
}

function AudioList({ list, onSelectChange, selectedItems = EMPTY_SET }) {
  const { chkExists } = useChecked(selectedItems)
  // console.log(selectedItems)
  return (
    <>
      {list.map((e) => (
        <AudioItemWrap key={e.id}>
          {onSelectChange ? (
            <SelectWrap>
              <input
                type="checkbox"
                value={e.id}
                name="audio"
                checked={chkExists(e)}
                onChange={(ev) => onSelectChange(e, ev.target.checked)}
              />
            </SelectWrap>
          ) : null}
          <AudioItem data={e} />
        </AudioItemWrap>
      ))}
    </>
  )
}

function AudioListV2({ list, onSelectChange, selectedItems = EMPTY_SET }) {
  const { chkExists } = useChecked(selectedItems)
  const itemCount = list.length

  const Row = useCallback(
    ({ index, data }) => {
      const e = data[index]
      return (
        <AudioItemWrap key={e.id}>
          {onSelectChange ? (
            <SelectWrap>
              <input
                type="checkbox"
                value={e.id}
                name="audio"
                checked={chkExists(e)}
                onChange={(ev) => onSelectChange(e, ev.target.checked)}
              />
            </SelectWrap>
          ) : null}
          <AudioItem data={e} />
        </AudioItemWrap>
      )
    },
    [onSelectChange, selectedItems]
  )

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={itemCount}
          itemSize={87}
          itemData={list}
          width={width}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
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

export function AudioStateLess({
  list = EMPTY_ARR,
  onSelectChange,
  showSelect,
  selectedItems = EMPTY_SET,
}) {
  if (list.length === 0 || list[0].type !== TYPE.AUDIO) return null
  return (
    <AudioListV2
      list={list}
      selectedItems={selectedItems}
      onSelectChange={onSelectChange}
    />
  )
}
