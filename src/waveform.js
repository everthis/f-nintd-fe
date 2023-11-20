import React, { useCallback, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { API_ORIGIN, TYPE } from './constant'
import { useQuery } from './hooks'

const WaveWrap = styled.div`
  height: 128px;
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
`

export function Waveform({ url }) {
  const ref = useRef()

  const { data, loading } = useQuery({ url, includeCredentials: false })

  function draw(peaks) {
    const bits = 16
    const barWidth = 1
    const scale = window.devicePixelRatio
    const barGap = 0
    const color = 'purple'
    const offset = 0
    const canvas = ref.current
    // const len = canvas.width / scale
    const len = peaks.length / scale
    const cc = canvas.getContext('2d')
    const h2 = canvas.height / scale / 2
    const maxValue = 2 ** (bits - 1)
    const width = barWidth
    const gap = barGap
    const barStart = width + gap

    cc.clearRect(0, 0, canvas.width, canvas.height)

    cc.save()
    cc.fillStyle = color
    cc.scale(scale, scale)
    console.log(len, scale, len, h2, maxValue, width, gap)
    //2 1000 64 32768 1 0
    // 1 300 75 32768 1 0

    // 2 1000 64 32768 1 0
    const start = new Date()
    for (let pixel = 0; pixel < len; pixel += barStart) {
      const minPeak = peaks[(pixel + offset) * 2] / maxValue
      const maxPeak = peaks[(pixel + offset) * 2 + 1] / maxValue
      drawFrame(cc, h2, pixel, minPeak, maxPeak, width, gap)
    }

    cc.restore()

    console.log(new Date().getTime() - start.getTime())
  }

  function drawFrame(cc, h2, x, minPeak, maxPeak, width, gap) {
    const min = Math.abs(minPeak * h2)
    const max = Math.abs(maxPeak * h2)

    // draw max
    cc.fillRect(x, 0, width, h2 - max)
    // draw min
    cc.fillRect(x, h2 + min, width, h2 - min)
    // draw gap
    if (gap !== 0) {
      cc.fillRect(x + width, 0, gap, h2 * 2)
    }
  }
  if (!loading) {
    draw(data)
  }
  useEffect(() => {
    const { width, height } = ref.current.getBoundingClientRect()
    console.log(width, height)
    ref.current.width = width * devicePixelRatio
    ref.current.height = height * devicePixelRatio
    ref.current.style = {
      width: `${width}px`,
      height: `${height}px`,
      aspectRatio: `auto ${width}/${height}`,
    }
  }, [])

  return (
    <WaveWrap>
      <canvas ref={ref} />
    </WaveWrap>
  )
}

export function WaveformStateLess({
  list,
  onSelectChange,
  chkSelected,
  toggleOpts,
}) {
  if (list.length === 0 || list[0].type !== TYPE.WAVEFORM) return null
  return (
    <>
      {list.map((e) => (
        <Waveform url={e.m3u8} />
      ))}
    </>
  )
}
