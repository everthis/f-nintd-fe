import React, { useCallback, useState, useEffect } from "react"

import * as Faye from "faye"
import { API_ORIGIN } from "./constant"

const genRand = (len) => {
  return Math.random()
    .toString(36)
    .substring(2, len + 2)
}

function publish() {
  if (fayeIns) {
    fayeIns.publish("/foo", genRand(12))
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
  useEffect(() => {
    return () => {}
  }, [])

  const videoSrc = "http://localhost:8081/out_w1080_b.mp4"
  return (
    <div>
      <video src={videoSrc} playsinline />
    </div>
  )
}
