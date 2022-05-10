import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const UploadWrap = styled.div`
  user-select: none;
`
const Row = styled.div`
  display: flex;
`
const UploadQueueSect = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 900px;
  max-width: 1000px;
`
const ImageInput = styled.div`
  position: relative;
  .image-input {
    cursor: pointer;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
`
const Inp = styled.div`
  border-radius: 6px;
  border: 1px dashed #333;
  height: 5em;
  width: 100%;
  text-align: center;
  line-height: 5em;
  font-size: 24px;
`
const PerLocal = styled.div`
  img {
    display: inline-block;
    max-width: 100%;
  }
`

export function Upload({ tags = [], setTags = () => {} }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [inputVal, setInputVal] = useState('')

  // On file select (from the pop up)
  function onFileChange(event) {
    const { files } = event.target
    if (files.length) {
      const newList = [...files, ...selectedFiles]
      setSelectedFiles(newList)
    }
  }

  // On file upload (click the upload button)
  function onFileUpload() {
    const formData = new FormData()
    for (const e of selectedFiles) {
      const nArr = e.name.split('.')
      const tArr = e.type.split('/')
      const fn = `${nArr[0]}_${e.lastModified}.${nArr[1] || tArr[1]}`
      formData.append('images', e, fn)
    }

    fetch('http://192.168.2.114:8087/images/new', {
      method: 'POST',
      body: formData,
    })
      .then((d) => d.text())
      .then((d) => {
        setSelectedFiles([])
      })
  }

  function deleteFn(i) {
    const clone = [...selectedFiles]
    clone.splice(i, 1)
    setSelectedFiles(clone)
  }

  return (
    <UploadWrap>
      <ImageInput>
        <Inp>+</Inp>
        <input
          className='image-input'
          type='file'
          multiple
          onChange={onFileChange}
          value={inputVal}
        />
      </ImageInput>
      <button onClick={onFileUpload}>Upload!</button>

      <Row>
        <UploadQueueSect>
          {selectedFiles.map((e, i) => (
            <Img key={i} file={e} deleteFn={() => deleteFn(i)} />
          ))}
        </UploadQueueSect>
      </Row>
    </UploadWrap>
  )
}

function Img({ file, deleteFn }) {
  const image = URL.createObjectURL(file)
  const delFn = (ev) => {
    ev.preventDefault()
    deleteFn()
  }
  return (
    <PerLocal>
      <img src={image} alt='preview image' />
      <a href='' onClick={delFn}>
        delete
      </a>
    </PerLocal>
  )
}
