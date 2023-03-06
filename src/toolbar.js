import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { UploadIcon, ImgIcon, ListIcon } from './icon'
import { API_ORIGIN } from './constant'

export function Toolbar({ showUpload, setShowUpload }) {
  const [uploadChecked, setUploadChecked] = useState(showUpload)
  const [imgChecked, setImgChecked] = useState(false)

  function toggleUpload() {
    const nextVal = !uploadChecked
    setShowUpload(nextVal)
    setUploadChecked(!uploadChecked)
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
      <UploadIcon checked={uploadChecked} onClick={toggleUpload} />
      <ImgIcon checked={imgChecked} onClick={toggleImg} />
      <ListIcon />
      {/* <button onClick={listImagesWithoutTags}>List Images Without Tags</button> */}
    </>
  )
}
