import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { ImgFromUrl } from './image'

const RemoteListSect = styled.div`
  user-select: none;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 900px;
  img {
    width: 100%;
  }
`

export function RemoteImageList({ tags, cb, selectCb }) {
  const [remoteList, setRemoteList] = useState([])

  function setRemoteListFn(arr) {
    arr.forEach((e) => {
      e.tags = e.tags.map((e) => ({ name: e, selected: false }))
    })
    setRemoteList(arr)
  }
  function queryByTags(tagVal) {
    fetch('http://192.168.2.114:8087/images/byTags?tags=' + tagVal, {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((d) => {
        setRemoteListFn(d)
      })
  }
  useEffect(() => {
    const arr = tags.filter((e) => e.selected)
    if (arr.length) {
      const qs = arr.map((e) => e.name).join(',')
      queryByTags(qs)
    } else {
      setRemoteList([])
    }
  }, [tags])

  useEffect(() => {
    if (tags.length === 0) {
      queryByTags('')
    }
  }, [])

  useEffect(() => {
    cb(remoteList)
  }, [remoteList])

  const opts = tags.map((e) => e.name)

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
        />
      ))}
    </RemoteListSect>
  )
}
