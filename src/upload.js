import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { API_ORIGIN } from './constant'
import { useQuery } from './hooks'
import { formatter as tagFormatter } from './tag'

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

export const Select = styled.select`
  background-color: var(--bg-color);
`

const typeHash = {
  image: {
    subPath: '/images/new',
    payloadKey: 'images',
  },
  audio: {
    subPath: '/audio/segements',
    payloadKey: 'audioFiles',
  },
  video: {},
  common: {
    subPath: '/assets/new',
    payloadKey: 'assets',
  },
}

const imgTypeSet = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/apng',
  'image/avif',
  'image/gif',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
])

export function Upload({ useOriginalName = false }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [tagOpts, setTagOpts] = useState([])
  const [selectedTag, setSelectedTag] = useState('')
  const tagOptsRef = useRef(tagOpts)
  const { data: tags = [], loading } = useQuery({
    url: `${API_ORIGIN}/tags`,
    formatter: tagFormatter,
  })

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
    if (selectedFiles.length === 0) return
    for (const e of selectedFiles) {
      const nArr = e.name.split('.')
      const tArr = e.type.split('/')
      const fn = useOriginalName
        ? e.name
        : `${nArr[0]}_${e.lastModified}.${nArr[1] || tArr[1]}`
      formData.append(typeHash.common.payloadKey, e, fn)
    }

    formData.append('tags', JSON.stringify(selectedTag ? [selectedTag] : []))

    fetch(`${API_ORIGIN}${typeHash.common.subPath}`, {
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

  function onChangeFn(ev) {
    const { value } = ev.target
    setSelectedTag(value)
  }

  useEffect(() => {
    const opts = []
    const addSet = new Set()
    const delSet = new Set()

    const curSet = new Set(tagOptsRef.current)
    const curNameSet = new Set(tagOptsRef.current.map((e) => e.name))

    const newNameSet = new Set(tags.map((e) => e.name))

    for (const e of tags) {
      const { name } = e
      if (!curNameSet.has(name)) addSet.add(name)
    }
    for (const e of newNameSet) {
      if (!curNameSet.has(e)) delSet.add(e)
    }

    for (const e of curSet) {
      if (!delSet.has(e.name)) opts.push(e)
    }

    for (const e of addSet) {
      opts.push({ name: e, disabled: false })
    }

    tagOptsRef.current = opts
    setTagOpts(opts)
  }, [tags])

  const ph = ''

  return (
    <UploadWrap>
      <ImageInput>
        <Inp>+</Inp>
        <input
          className="image-input"
          type="file"
          multiple
          onChange={onFileChange}
          value={inputVal}
        />
      </ImageInput>
      <button onClick={onFileUpload}>Upload!</button>
      <Select value={selectedTag} onChange={onChangeFn} placeholder={ph}>
        <option key={''} value={''} disabled>
          Select tags
        </option>
        {tagOpts.map((e) => (
          <option key={e.name} value={e.name} disabled={e.disabled}>
            {e.name}
          </option>
        ))}
      </Select>
      <Row>
        <UploadQueueSect>
          {selectedFiles.map((e, i) => {
            return imgTypeSet.has(e.type) ? (
              <Img key={i} file={e} deleteFn={() => deleteFn(i)} />
            ) : (
              <p key={i}>
                {e.name} <button onClick={() => deleteFn(i)}>delete</button>
              </p>
            )
          })}
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
      <img src={image} alt="preview image" loading="lazy" />
      <a href="" onClick={delFn}>
        delete
      </a>
    </PerLocal>
  )
}
