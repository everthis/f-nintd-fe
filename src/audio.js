import React, { useState, useEffect, useRef, useCallback, useId } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import Hls from 'hls.js'
import styled from 'styled-components'

import { Nav } from './nav'
import { API_ORIGIN, EMPTY_ARR, EMPTY_SET, TYPE } from './constant'
import {
  PlayIcon,
  PauseIcon,
  WaveformIcon,
  VdotsIcon,
  EditIconV2,
  CorrectIcon,
  CancelIcon,
} from './icon'
import { useQuery, useChecked, usePostData } from './hooks'
import { AudioWave } from './audioWave'
import { ImgFromUrl } from './image'

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
    display: block;
  }
`

const Actions = styled.span`
  display: flex;
  gap: 5px;
  padding-left: 5px;
  button {
    cursor: pointer;
  }
`

const FixedRightWidthRow = styled.div`
  position: relative;
  flex-wrap: nowrap;
  display: flex;
  height: ${({ height }) => height};

  ${Actions} {
    flex-grow: 0;
    flex-shrink: 0;
  }
  ${ProgressWrap} {
    flex: 1;
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
const BlockInput = styled.input`
  display: inline-block;
  flex: 1;
  outline: none;
  border: 1px solid #333;
`
const InputWrap = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin: 0 0 0.5rem 0;
`
const NameOps = styled.span`
  flex-grow: 0;
  flex-shrink: 0;
  padding: 0 0.5rem;
`
const AudioName = styled.div`
  text-align: left;
`

const ProgressStatus = styled.div`
  text-align: left;
`
const TwoColWrap = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
`
const CoverInnerWrap = styled.div`
  height: 100%;
`
const CoverWrap = styled.div`
  width: 105px;
  background: black;
  align-self: stretch;
`
const RightWrap = styled.div`
  flex: 1;
`
export function isWechat() {
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
function isPlaying(el) {
  if (!el.paused) {
    return true
  } else {
    return false
  }
}

function AudioPlayer({
  data,
  toggleOpts,
  updateCb,
  showEdit = false,
  showWaveformBtn = true,
  waveformHeight = '2rem',
  controlCollector,
}) {
  const { name, url: source, id, waveform, cover } = data
  const ref = useRef()
  const nameInputRef = useRef()
  const progressRef = useRef()
  const [isReadyToPlay, setIsReadyToPlay] = useState(false)
  const [val, setVal] = useState(0)
  const [duration, setDuration] = useState(0)
  const [shouldShowPlayer, setShouldShowPlayer] = useState(true)
  const [status, setStatus] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const { loading: genPeaksInProgress, postData: genPeaksFn } = usePostData()
  const [audioName, setAudioName] = useState(name)
  const { loading: nameChangeInProgress, postData: submitNameChange } =
    usePostData()

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
    if (controlCollector) {
      controlCollector.endCb()
    }
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

  function togglePlay() {
    const media = ref.current
    if (media.paused) {
      playMedia()
    } else {
      pauseMedia()
    }
  }
  function playMedia() {
    if (controlCollector) controlCollector.pause()
    const media = ref.current
    if (media) {
      if (controlCollector) {
        controlCollector.setCurNodeById(id)
      }
      media.play()
    }
  }
  function pauseMedia() {
    const media = ref.current
    if (media) {
      media.pause()
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
    }).then(updateCb)
  }
  function toggleEdit() {
    setIsEditMode(!isEditMode)
  }
  function changeName() {
    const el = nameInputRef.current
    const val = el.value
    submitNameChange({
      url: `${API_ORIGIN}/audio/${id}`,
      method: 'PATCH',
      payload: {
        name: val,
      },
    }).then(() => {
      setAudioName(val)
      setIsEditMode(false)
      updateCb()
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

  useEffect(() => {
    if (controlCollector)
      controlCollector.set(id, {
        toggle: togglePlay,
        play: playMedia,
        pause: pauseMedia,
        isPlaying: () => isPlaying(ref.current),
      })
  }, [])

  const btnContent =
    ref.current == null ? (
      <PlayIcon />
    ) : ref.current.paused ? (
      <PlayIcon />
    ) : (
      <PauseIcon />
    )

  if (!shouldShowPlayer) return null
  return (
    <div>
      <audio ref={ref} playsInline preload='metadata' />
      <TwoColWrap>
        <CoverWrap>
          {cover ? (
            <CoverInnerWrap>
              <ImgFromUrl data={cover} />
            </CoverInnerWrap>
          ) : null}
        </CoverWrap>
        <RightWrap>
          {/* important, use transparent range input */}
          {/* important, range input above progress */}
          {isEditMode ? (
            <InputWrap>
              <BlockInput ref={nameInputRef} defaultValue={audioName} />
              <NameOps>
                <CancelIcon onClick={toggleEdit} />
                <CorrectIcon onClick={changeName} />
              </NameOps>
            </InputWrap>
          ) : (
            <AudioName className={'sfs pl5'}>{audioName}</AudioName>
          )}

          <FixedRightWidthRow height={waveformHeight}>
            <ProgressWrap>
              <WaveControl>
                {waveform ? (
                  <WaveformWrap>
                    <AudioWave url={waveform} />
                  </WaveformWrap>
                ) : null}
                <ProgressContrlWrap>
                  <progress className='progress' value={val} max={100} />
                  <HiddenInput
                    type='range'
                    onChange={rangeChange}
                    ref={progressRef}
                    value={val}
                    max={100}
                  />
                </ProgressContrlWrap>
              </WaveControl>
            </ProgressWrap>
            <Actions>
              <span style={{ width: '.5rem' }}></span>
              {showWaveformBtn ? (
                <button onClick={genPeaks} disabled={!!waveform}>
                  <WaveformIcon />
                </button>
              ) : null}

              <button
                type='button'
                title='toggle play'
                disabled={isWechat() ? false : !isReadyToPlay}
                onClick={togglePlay}
                className={'ps-btn'}
              >
                {btnContent}
              </button>
              {toggleOpts ? (
                <button>
                  <VdotsIcon
                    onClick={(ev) => toggleOpts(ev, data)}
                    size='20px'
                  />
                </button>
              ) : null}
              {showEdit ? (
                <button>
                  <EditIconV2 onClick={toggleEdit} size='28px' />
                </button>
              ) : null}
            </Actions>
          </FixedRightWidthRow>
          <ProgressStatus>
            <div className={'sfs pl5'}>
              {secondsToHms(ref.current?.currentTime || 0)}/
              {secondsToHms(duration)}
              {status ? ` (${status})` : null}
            </div>
          </ProgressStatus>
        </RightWrap>
      </TwoColWrap>
    </div>
  )
}

export function AudioItem({
  data,
  toggleOpts,
  loading,
  updateCb,
  showEdit,
  showWaveformBtn,
  controlCollector,
}) {
  if (data == null || data.type !== TYPE.AUDIO) return null
  if (loading) return <div>Loading</div>

  return (
    <StyledAudioItem
      style={{
        marginBottom: '0',
        borderBottom: '1px solid #333',
        paddingBottom: '0',
      }}
    >
      <AudioPlayer
        data={data}
        toggleOpts={toggleOpts}
        updateCb={updateCb}
        showEdit={showEdit}
        showWaveformBtn={showWaveformBtn}
        controlCollector={controlCollector}
      />
    </StyledAudioItem>
  )
}

function AudioList({
  list,
  onSelectChange,
  chkSelected,
  toggleOpts,
  refetchList,
}) {
  const ref = useRef()
  const rootRef = useRef()
  const pageSize = 6
  const [page, setPage] = useState(0)
  const pageRef = useRef(page)
  const chkExists = chkSelected

  useEffect(() => {
    pageRef.current = page
  }, [page])
  useEffect(() => {
    const el = ref.current
    const observer = new IntersectionObserver((entries, oo) => {
      // console.log('trigger', oo)
      if (entries[0].isIntersecting) {
        // el is visible
        // console.log('vis')
        const page = pageRef.current
        if ((page + 1) * pageSize < list.length) {
          setPage(page + 1)
          observer.unobserve(el)
          observer.observe(el)
        }
      } else {
        // console.log('not vis')
        // el is not visible
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const itemsToDisplay = list.slice(0, (page + 1) * pageSize)
  return (
    <div ref={rootRef}>
      {itemsToDisplay.map((e) => (
        <AudioItemWrap key={e.id}>
          {onSelectChange ? (
            <SelectWrap>
              <input
                type='checkbox'
                value={e.id}
                name='audio'
                checked={chkExists(e)}
                onChange={(ev) => onSelectChange(e, ev.target.checked)}
              />
            </SelectWrap>
          ) : null}
          <AudioItem data={e} toggleOpts={toggleOpts} updateCb={refetchList} />
        </AudioItemWrap>
      ))}
      <div ref={ref} style={{ height: '45px' }}></div>
    </div>
  )
}

function AudioListV2({ list, onSelectChange, selectedItems = EMPTY_SET }) {
  const { chkExists } = useChecked(selectedItems)
  const itemCount = list.length

  const Row = useCallback(
    ({ index, data }) => {
      console.log(index)
      const e = data[index]
      return (
        <AudioItemWrap key={e.id}>
          {onSelectChange ? (
            <SelectWrap>
              <input
                type='checkbox'
                value={e.id}
                name='audio'
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
    <AutoSizer style={{ width: '100%', height: '100%' }}>
      {({ height, width }) => {
        console.log('resize', height, width)
        return (
          <List
            height={height}
            itemCount={itemCount}
            itemSize={87}
            itemData={list}
            width={width}
            overscanCount={2}
            className='ll'
          >
            {Row}
          </List>
        )
      }}
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
  chkSelected = () => {},
  toggleOpts = () => {},
  refetchList,
}) {
  if (list.length === 0 || list[0].type !== TYPE.AUDIO) return null
  return (
    <AudioList
      list={list}
      chkSelected={chkSelected}
      onSelectChange={onSelectChange}
      toggleOpts={toggleOpts}
      refetchList={refetchList}
    />
  )
}
