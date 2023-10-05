import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { ImgFromUrl } from './image'
import { API_ORIGIN } from './constant'

const RemoteListSect = styled.div`
  user-select: none;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 900px;
  img {
    width: 100%;
  }
`
const defaultTags = []
export function RemoteImageList({ tags = defaultTags, cb, selectCb }) {
  const [remoteList, setRemoteList] = useState([])

  function setRemoteListFn(arr) {
    arr.forEach((e) => {
      e.tags = e.tags.map((e) => ({ name: e, selected: false }))
    })
    setRemoteList(arr)
  }
  function queryByTags(tagVal) {
    fetch(`${API_ORIGIN}/image/byTags?tags=` + tagVal, {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((d) => {
        setRemoteListFn(d)
      })
  }
  function retrieveImgsBySelectedTags() {
    const arr = tags.filter((e) => e.selected)
    if (arr.length) {
      const qs = arr.map((e) => e.name).join(',')
      queryByTags(qs)
    } else {
      setRemoteList([])
    }
  }
  useEffect(() => {
    retrieveImgsBySelectedTags()
  }, [tags])

  useEffect(() => {
    if (tags.length === 0) {
      queryByTags('')
    }
  }, [])

  useEffect(() => {
    cb(remoteList)
  }, [remoteList])

  const delCb = () => {
    retrieveImgsBySelectedTags()
  }

  const opts = tags.map((e) => e.name)
  // console.log(remoteList)
  return (
    <RemoteListSect>
      {remoteList.map((e) => (
        <ImgFromUrl
          opts={opts}
          tags={e.tags}
          url={e.name}
          key={e.name}
          dimension={e.dimension}
          selectCb={selectCb}
          delCb={delCb}
        />
      ))}
    </RemoteListSect>
  )
}
