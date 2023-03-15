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
  showImg,
  setShowImg,
}) {
  function toggleUpload() {
    setShowUpload(!showUpload)
  }
  function toggleImg() {
    setShowImg(!showImg)
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
      <ImgIcon checked={showImg} onClick={toggleImg} />
      <AudioIcon checked={showAudio} onClick={toggleAudio} />
      <ListIcon checked={showArticleList} onClick={toggleList} />
      {/* <button onClick={listImagesWithoutTags}>List Images Without Tags</button> */}
    </>
  )
}
