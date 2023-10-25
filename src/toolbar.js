import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'

import { Theme } from './theme'
import { ThemeWrap } from './header'

const ToolbarWrap = styled.div`
  display: flex;
  gap: 5px;
  user-select: none;
  justify-content: center;
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

  function toggleAddTag() {
    setShowAddTag(!showAddTag)
  }
  function toggleCreate() {
    setShowCreate(!showCreate)
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
      <TextIcon checked={showText} onClick={toggleText} />
      <ListIcon checked={showArticleList} onClick={toggleList} />
      {/* <MenuIcon checked={showAddTag} onClick={toggleAddTag} /> */}
      <ThemeWrap>
        <Theme />
      </ThemeWrap>

      <Link to='/homepage' style={{ marginRight: '1em' }}>
        Homepage
      </Link>

      {/* <button onClick={listImagesWithoutTags}>List Images Without Tags</button> */}
    </ToolbarWrap>
  )
}
