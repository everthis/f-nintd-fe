import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import styled from 'styled-components'

import { Tags } from './tag'
import { ImgFromUrl } from './image'

const Row = styled.div`
  display: flex;
`
const UploadQueueSect = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 900px;
  max-width: 1000px;
`

const RemoteListSect = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 900px;
`
const PerLocal = styled.div`
  img {
    display: inline-block;
    max-width: 100%;
  }
`
const PerRemote = styled.div``

const StyledImg = styled.image`
  display: inline-block;
  max-width: 100%;
`

function App(props) {
  const { name } = props
  const [tags, setTags] = useState([])
  return (
    <>
      <h1>Upload {name}</h1>
      <Tags updateTags={setTags} />
      <Upload tags={tags} setTags={setTags} />
    </>
  )
}

function Upload({ tags, setTags }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [img, setImg] = useState(null)
  const [remoteList, setRemoteList] = useState([])

  const [tagVal, setTagVal] = useState('')
  // On file select (from the pop up)
  function onFileChange(event) {
    // Update the state
    console.log(event.target.files)
    const { files } = event.target
    if (files.length) {
      const newList = [...files, ...selectedFiles]
      console.log(newList)
      setSelectedFiles(newList)
    }
  }

  // On file upload (click the upload button)
  function onFileUpload() {
    // Create an object of formData
    const formData = new FormData()

    for (const e of selectedFiles) {
      const nArr = e.name.split('.')
      const tArr = e.type.split('/')
      const fn = `${nArr[0]}_${e.lastModified}.${nArr[1] || tArr[1]}`
      // console.log(fn)
      // Update the formData object
      formData.append('images', e, fn)
    }

    // Details of the uploaded file
    // console.log(formData);

    // Request made to the backend api
    // Send formData object
    // fetch("api/uploadfile", formData);
    fetch('http://192.168.2.114:8087/images/new', {
      method: 'POST',
      body: formData,
    })
      .then((d) => d.text())
      .then((d) => {
        ListObjects()
        setSelectedFiles([])
      })
  }

  // File content to be displayed after
  // file upload is complete
  function fileData() {
    if (selectedFiles) {
      // setImage(URL.createObjectURL(event.target.files[0]));

      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {selectedFiles.name}</p>
          <p>File Type: {selectedFiles.type}</p>
          <p>{/* <img src={image} alt="preview image" /> */}</p>
          <p>Last Modified: {selectedFiles.lastModifiedDate.toDateString()}</p>
        </div>
      )
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      )
    }
  }

  function deleteFn(i) {
    const clone = [...selectedFiles]
    clone.splice(i, 1)
    setSelectedFiles(clone)
  }

  function ListObjects() {
    fetch('http://192.168.2.114:8087/images/list', {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((arr) => {
        setRemoteList(arr)
      })
  }

  const onChangeFn = (e) => {
    setTagVal(e.target.value)
  }
  function queryByTag() {
    fetch('http://192.168.2.114:8087/images/byTags?tags=' + tagVal, {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((d) => {
        setRemoteList(d)
      })
  }

  function listTags() {
    fetch('http://192.168.2.114:8087/images/tags', {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((arr) => {
        // prepend null placeholder
        // arr.unshift('')
        setTags(arr)
      })
  }

  useEffect(() => {
    listTags()
  }, [])
  return (
    <>
      <input type='file' multiple onChange={onFileChange} value={inputVal} />
      <button onClick={onFileUpload}>Upload!</button>
      <button onClick={ListObjects}>List</button>
      <input value={tagVal} onChange={onChangeFn} />
      <button onClick={queryByTag}>Query By Tag</button>
      <Row>
        <UploadQueueSect>
          {selectedFiles.map((e, i) => (
            <Img key={i} file={e} deleteFn={() => deleteFn(i)} />
          ))}
        </UploadQueueSect>
        <RemoteListSect>
          {remoteList.map((e) => (
            <ImgFromUrl opts={tags} tags={e.tags} url={e.name} key={e.name} />
          ))}
        </RemoteListSect>
      </Row>
    </>
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

const mountNode = document.getElementById('app')
ReactDOM.createRoot(mountNode).render(<App name='Jane' />)
