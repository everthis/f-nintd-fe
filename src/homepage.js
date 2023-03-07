import React, { useState, useEffect, useRef } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import Hls from 'hls.js'
import { Nav } from './nav'

function HomePageComp() {
  const ref = useRef()
  const [isReadyToPlay, setIsReadyToPlay] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (Hls.isSupported()) {
      const hls = new Hls()
      console.log('load')
      hls.loadSource(
        'https://assets.everthis.com/uploads/audio/segments/segments.m3u8'
      )
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        setIsReadyToPlay(true)
      })
    }
  }, [])

  function play() {
    const video = ref.current
    video.play()
  }
  return (
    <>
      <h1>Homepage</h1>
      <Nav />
      <p>Ready: {isReadyToPlay ? 'Yes' : 'No'}</p>
      <audio ref={ref}></audio>
      <button onClick={play}>play</button>
    </>
  )
}

export const HomePage = React.memo(HomePageComp)
