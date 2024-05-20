import React, { useRef, useEffect, useState, useId } from 'react'
import styled from 'styled-components'
import { postData } from './utils'
import { API_ORIGIN, TYPE } from './constant'
import { useQuery, usePostData } from './hooks'
import { VdotsIcon } from './icon'
import { Tags } from './tag'

const ListWrap = styled.div`
  padding-right: 2rem;
`
function SingleVideo({ data }) {
  const { src } = data
  return (
    <div>
      <video src={src} playsinline />
    </div>
  )
}
function VideoList({ list, onSelectChange, chkSelected, toggleOpts }) {
  // console.log(list)
  return (
    <ListWrap>
      {list.map((e, i) => (
        <SingleVideo
          key={i}
          onSelectChange={onSelectChange}
          data={e}
          toggleOpts={toggleOpts}
          chkSelected={chkSelected}
        />
      ))}
    </ListWrap>
  )
}

export function VideoStateLess({
  list,
  onSelectChange = () => {},
  chkSelected,
  toggleOpts,
}) {
  if (list.length === 0 || list[0].type !== TYPE.ONE_FRAME_VIDEO) return null
  return (
    <VideoList
      list={list}
      chkSelected={chkSelected}
      onSelectChange={onSelectChange}
      toggleOpts={toggleOpts}
    />
  )
}
