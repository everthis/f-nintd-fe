import React, { useState, useEffect, useRef } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import Hls from 'hls.js'
import { Nav } from './nav'
import { API_ORIGIN } from './constant'

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
        // 'https://assets.everthis.com/uploads/audio/segments/segments.m3u8'
        'https://assets.everthis.com/uploads/audio/upload_546de32a6c14b6bdbeb046fa6d6e38cf_dir/upload_546de32a6c14b6bdbeb046fa6d6e38cf.m3u8'
      )
      hls.attachMedia(video)
    }
  }, [])

  function play() {
    const video = ref.current
    video.play()
  }

  function getList() {
    fetch(`${API_ORIGIN}/audio/list`, {})
      .then((d) => d.json())
      .then((d) => {
        console.log(d)
      })
  }

  return (
    <>
      <p>Ready: {isReadyToPlay ? 'Yes' : 'No'}</p>
      <audio controls ref={ref}></audio>
      <button onClick={play}>play</button>
      <button onClick={getList}>get list</button>
    </>
  )
}
