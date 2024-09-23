import React, { useState, useEffect, useRef } from "react"
import { processTag } from "./m3u8player"
const url =
  "https://assets.everthis.com/uploads/audio/upload_6a233b1539c0a24e45899b6c3152debc_dir/upload_6a233b1539c0a24e45899b6c3152debc.m3u8"

export function M3u8PlayerTest() {
  const ref = useRef(null)
  useEffect(() => {
    processTag(ref.current)
  }, [])
  return (
    <div>
      <div>
        <audio src={url} ref={ref} />
      </div>
      <div>
        <button onClick={() => ref.current.play()}>play</button>
        <button onClick={() => ref.current.pause()}>pause</button>
      </div>
    </div>
  )
}
