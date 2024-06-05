import React, { useCallback, useState, useEffect, useRef } from 'react'

import * as Faye from 'faye'
import { API_ORIGIN, EMPTY_ARR, TYPE, EMPTY_SET, EMPTY_MAP } from './constant'
import { useQuery, useChecked, usePostData, useCombineSets } from './hooks'
import styled from 'styled-components'
import {WideGamut} from './comp/WideGamut'

const Center = styled.div`
  margin: 0 auto;
  max-width: 900px;
  position: relative;
`

const VideoWrap = styled.div`
  background-color: gray;
  position: relative;
  video {
    display: inline-block;
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
const genRand = (len) => {
  return Math.random()
    .toString(36)
    .substring(2, len + 2)
}

function publish() {
  if (fayeIns) {
    fayeIns.publish('/foo', genRand(12))
  }
}

export function Test1() {
  const [fayeIns, setFayeIns] = useState(null)

  useEffect(() => {
    const client = new Faye.Client(`${API_ORIGIN}/faye`)
    // console.log(Faye, client)
    setFayeIns(client)
    return () => {
      client.disconnect()
    }
  }, [])

  return (
    <p>
      <button onClick={publish}>publish</button>
    </p>
  )
}

function Video({ item }) {
  const e = item
  const ref = useRef()
  useEffect(() => {
    const v = ref.current
    // const timer = setInterval(() => ref.current.play(), 1)
    v.addEventListener('pause', function (e) {
      v.play()
    })
    v.addEventListener('ended', function (e) {
      v.play()
    })
    return () => {
      // clearInterval(timer)
    }
  }, [])
  return (
    <VideoWrap>
      <video
        ref={ref}
        key={e.id}
        muted
        loop
        playsinline
        autoplay='autoplay'
        webkit-playsinline
      >
        <source src={e.src} />
      </video>
      <Mask />
    </VideoWrap>
  )
}
export function Test() {
  return <WideGamut />
  const {
    data: items = EMPTY_ARR,
    loading: fetching,
    queryData: queryByTags,
  } = useQuery({
    url: `${API_ORIGIN}/oneFrameVideo/byTags`,
  })

  // const fetching = false
  // const items = [
  //   {
  //     id: 1,
  //     src: "http://127.0.0.1:8088/u1.mp4",
  //   },
  //   {
  //     id: 2,
  //     src: "http://127.0.0.1:8088/u2.mp4",
  //   },
  //   {
  //     id: 3,
  //     src: "http://127.0.0.1:8088/u3.mp4",
  //   },
  //   {
  //     id: 4,
  //     src: "http://127.0.0.1:8088/u4.mp4",
  //   },
  //   {
  //     id: 5,
  //     src: "http://127.0.0.1:8088/u5.mp4",
  //   },
  // ]

  if (fetching) return null
  return (
    <Center>
      {items.map((e) => (
        <Video item={e} key={e.id} />
      ))}
      <Mask />
    </Center>
  )
}
