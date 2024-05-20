import React, { useCallback, useState, useEffect } from 'react'

import * as Faye from 'faye'
import { API_ORIGIN, EMPTY_ARR, TYPE, EMPTY_SET, EMPTY_MAP } from './constant'
import { useQuery, useChecked, usePostData, useCombineSets } from './hooks'
import styled from 'styled-components'

const Center = styled.div`
  margin: 0 auto;
  max-width: 100%;
`

const VideoWrap = styled.div`
  background-color: gray;
  position: relative;
  video {
    display: block;
    width: 100%;
    position: relative;
    z-index:0;
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

export function Test() {
  // const [items, setItems] = useCallback([])
  const {
    data: items = EMPTY_ARR,
    loading: fetching,
    queryData: queryByTags,
  } = useQuery({
    url: `${API_ORIGIN}/oneFrameVideo/byTags`,
    // formatter,
    // shouldFetch: (_, params) => params.tags.length > 0,
  })
  useEffect(() => {
    return () => {}
  }, [])

  if (fetching) return null
  return (
    <Center>
      {items.map((e) => (
        <VideoWrap>
          <video
            key={e.id}
            src={e.src}
            muted
            loop
            playsinline
            autoplay='autoplay'
          />
          <Mask />
        </VideoWrap>
      ))}
    </Center>
  )
}
