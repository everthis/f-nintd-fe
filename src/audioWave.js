import React, { useCallback, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { API_ORIGIN, TYPE } from './constant'
import { samlpePeaks, samplePeaksData } from './utils'
import { useQuery } from './hooks'

const Wrap = styled.div`
  height: 100%;
  button {
    border: none;
  }
`
// background-color: #FFD500;
const Wave = styled.div`
  height: 100%;
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
`

export function AudioWave({ url }) {
  const ref = useRef()
  const { data, loading } = useQuery({ url, includeCredentials: false })

  const dpr = window.devicePixelRatio
  function wave(peaks) {
    const canvas = ref.current
    // console.log(peaks.length)
    const peaksData = samplePeaksData(peaks, canvas.width / dpr)
    // console.log(peaksData.length)
    // console.log(peaksData)
    const bits = 16
    let singleBarPixel = ~~(canvas.width / dpr / (peaksData.length / 2))
    singleBarPixel = singleBarPixel < 1 ? 1 : singleBarPixel
    // const barWidth = 1
    const barGap = 0
    const color = '#005BBB'
    const offset = 0

    const scale = dpr
    // const len = canvas.width / scale
    const cc = canvas.getContext('2d')
    const h2 = canvas.height / scale / 2
    const maxValue = 2 ** (bits - 1)
    // const width = barWidth
    const gap = barGap
    // const barStart = width + gap

    cc.clearRect(0, 0, canvas.width, canvas.height)

    cc.save()
    cc.fillStyle = color
    cc.scale(scale, scale)
    // console.log(singleBarPixel)
    for (let idx = 0, len = peaksData.length / 2; idx < len; idx++) {
      const minPeak = peaksData[(idx + offset) * 2] / maxValue
      const maxPeak = peaksData[(idx + offset) * 2 + 1] / maxValue
      drawFrame(
        cc,
        h2,
        idx * singleBarPixel,
        minPeak,
        maxPeak,
        singleBarPixel,
        gap
      )
    }

    cc.restore()
  }

  function drawFrame(cc, h2, x, minPeak, maxPeak, width, gap) {
    const min = Math.abs(minPeak * h2)
    const max = Math.abs(maxPeak * h2)
    // console.log(x, 0, width, h2 - max)
    // console.log(x, h2 + min, width, h2 - min)

    // draw max
    cc.fillRect(x, 0, width, h2 - max)
    // draw min
    cc.fillRect(x, h2 + min, width, h2 - min)
    // draw gap
    if (gap !== 0) {
      cc.fillRect(x + width, 0, gap, h2 * 2)
    }
  }

  useEffect(() => {
    const canvas = ref.current
    const obj = canvas.getBoundingClientRect()
    const { width, height } = obj
    canvas.width = width * dpr
    canvas.height = height * dpr
  }, [])
  if (!loading) {
    wave(data)
  }

  return (
    <Wrap>
      <Wave>
        <canvas ref={ref} />
      </Wave>
    </Wrap>
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
        <AudioWave url={e.m3u8} />
      ))}
    </>
  )
}
