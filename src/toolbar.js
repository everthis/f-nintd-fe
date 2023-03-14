import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { UploadIcon, ImgIcon, ListIcon, AudioIcon } from './icon'
import { API_ORIGIN } from './constant'

export function Toolbar({
  showUpload,
  setShowUpload,
  showArticleList,
  setShowArticleList,
  showAudio,
  setShowAudio,
}) {
  const [imgChecked, setImgChecked] = useState(false)

  function toggleUpload() {
    setShowUpload(!showUpload)
  }
  function toggleImg() {
    setImgChecked(!imgChecked)
  }
  function toggleList() {
    setShowArticleList(!showArticleList)
  }

  function toggleAudio() {
    setShowAudio(!showAudio)
  }
  function listImagesWithoutTags() {
    fetch(`${API_ORIGIN}/images/withoutTags`, {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((arr) => {})
  }
  return (
    <>
      <UploadIcon checked={showUpload} onClick={toggleUpload} />
      <ImgIcon checked={imgChecked} onClick={toggleImg} />
      <AudioIcon checked={showAudio} onClick={toggleAudio} />
      <ListIcon checked={showArticleList} onClick={toggleList} />
      {/* <button onClick={listImagesWithoutTags}>List Images Without Tags</button> */}
    </>
  )
}
