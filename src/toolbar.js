import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'

import { Theme } from './theme'
import { ThemeWrap } from './header'

const ToolbarWrap = styled.div`
  display: flex;
  gap: 8px;
  user-select: none;
  justify-content: center;
  align-items: center;
`

import {
  UploadIcon,
  ImgIcon,
  ListIcon,
  AudioIcon,
  AddTagIcon,
  TextIcon,
  MenuIcon,
  WriteIcon,
  QuoteIcon,
  WaveformIcon,
  AntiDiagonalLinkIcon,
  CombineIcon,
  VideoIcon,
  HomeIcon,
  LegoIcon,
} from './icon'
import { API_ORIGIN } from './constant'

export function Toolbar({
  showUpload,
  setShowUpload,
  showArticleList,
  setShowArticleList,
  showAudio,
  setShowAudio,
  showText,
  setShowText,
  showImg,
  setShowImg,
  showAddTag,
  setShowAddTag,
  showCreate,
  setShowCreate,
  showWaveform,
  setShowWaveform,
  showCombine,
  setShowCombine,
  showLink,
  setShowLink,
  showOneFrameVideo,
  setShowOneFrameVideo,
  showComponent,
  setShowComponent,
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
  function toggleText() {
    setShowText(!showText)
  }
  function toggleComponent() {
    setShowComponent(!showComponent)
  }

  function toggleAddTag() {
    setShowAddTag(!showAddTag)
  }
  function toggleCreate() {
    setShowCreate(!showCreate)
  }
  function toggleWaveform() {
    setShowWaveform(!showWaveform)
  }
  function toggleCombine() {
    setShowCombine(!showCombine)
  }
  function toggleLink() {
    setShowLink(!showLink)
  }
  function toggleVideo() {
    setShowOneFrameVideo(!showOneFrameVideo)
  }
  function listImagesWithoutTags() {
    fetch(`${API_ORIGIN}/images/withoutTags`, {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((arr) => {})
  }
  return (
    <ToolbarWrap>
      <UploadIcon checked={showUpload} onClick={toggleUpload} />
      <WriteIcon checked={showCreate} onClick={toggleCreate} />
      <AddTagIcon checked={showAddTag} onClick={toggleAddTag} />
      <ImgIcon checked={showImg} onClick={toggleImg} />
      <AudioIcon checked={showAudio} onClick={toggleAudio} />
      <VideoIcon checked={showOneFrameVideo} onClick={toggleVideo} />
      <TextIcon checked={showText} onClick={toggleText} />
      <WaveformIcon checked={showWaveform} onClick={toggleWaveform} />
      <LegoIcon checked={showComponent} onClick={toggleComponent} />
      <AntiDiagonalLinkIcon
        checked={showLink}
        onClick={toggleLink}
        size={'22px'}
      />
      <CombineIcon checked={showCombine} onClick={toggleCombine} />
      <ListIcon checked={showArticleList} onClick={toggleList} />
      {/* <MenuIcon checked={showAddTag} onClick={toggleAddTag} /> */}
      <ThemeWrap>
        <Theme />
      </ThemeWrap>

      <HomeIcon />
      <Link to='/homepage' style={{ marginRight: '1em' }}>
        Homepage
      </Link>

      {/* <button onClick={listImagesWithoutTags}>List Images Without Tags</button> */}
    </ToolbarWrap>
  )
}
