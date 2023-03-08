import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { UploadIcon, ImgIcon, ListIcon } from './icon'
import { API_ORIGIN } from './constant'

export function Toolbar({ showUpload, setShowUpload }) {
  const [imgChecked, setImgChecked] = useState(false)

  function toggleUpload() {
    setShowUpload(!showUpload)
  }
  function toggleImg() {
    setImgChecked(!imgChecked)
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
      <ListIcon />
      {/* <button onClick={listImagesWithoutTags}>List Images Without Tags</button> */}
    </>
  )
}
