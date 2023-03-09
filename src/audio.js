import React, { useState, useEffect, useRef } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import Hls from 'hls.js'
import { Nav } from './nav'

export function Audio() {
  const ref = useRef()
  const [isReadyToPlay, setIsReadyToPlay] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        setIsReadyToPlay(true)
      })
      hls.loadSource(
        'https://assets.everthis.com/uploads/audio/segments/segments.m3u8'
      )
      hls.attachMedia(video)
    }
  }, [])

  function play() {
    const video = ref.current
    video.play()
  }
  return (
    <>
      <p>Ready: {isReadyToPlay ? 'Yes' : 'No'}</p>
      <audio controls ref={ref}></audio>
      <button onClick={play}>play</button>
    </>
  )
}