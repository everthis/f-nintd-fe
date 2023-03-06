import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import styled from 'styled-components'

import { Tags } from './tag'
import { ImgFromUrl } from './image'
import { Upload } from './upload'

import { RemoteImageList } from './remoteImageList'
import { Toolbar } from './toolbar'
import { Pane } from './pane'
import { Editor } from './editor'
import { Article } from './article'

import './index.scss'

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
const HorLine = styled.hr`
  margin: 1em 0;
  border-top: none;
  border-color: #333;
`
const PaneContainer = styled.span`
  position: absolute;
  z-index: ${({ show }) => (show ? 1 : -1)};
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  visibility: ${({ show }) => (show ? 'show' : 'hidden')};
`
const EditorContainer = styled.div`
  display: inline-block;
  width: 600px;
`

function App(props) {
  const { name } = props
  const [tags, setTags] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [showRemote, setShowRemote] = useState(false)
  const [checkedSet, setCheckedSet] = useState(new Set())
  const uploadBody = <Upload tags={tags} />
  const remoteChange = (arr) => {
    if (arr.length) {
      setShowRemote(true)
    } else {
      setShowRemote(false)
    }
  }
  const selectCb = (url, val) => {
    const clone = new Set(checkedSet)
    if (val) {
      clone.add(url)
    } else {
      clone.delete(url)
    }
    setCheckedSet(clone)
  }
  const remoteBody = (
    <RemoteImageList tags={tags} cb={remoteChange} selectCb={selectCb} />
  )
  return (
    <>
      <Tags updateTags={setTags} />
      <HorLine />
      <Toolbar showUpload={showUpload} setShowUpload={setShowUpload} />
      <HorLine />
      <EditorContainer>
        <Editor imgList={checkedSet} />
      </EditorContainer>
      <PaneContainer left='calc(100vw - 570px)' top='55px' show={showRemote}>
        <Pane
          show={showRemote}
          bgColor='#fff'
          body={remoteBody}
          width='500px'
        />
      </PaneContainer>
      <PaneContainer left='calc(100vw - 500px)' top='55px' show={showUpload}>
        <Pane show={showUpload} bgColor='#fff' body={uploadBody} />
      </PaneContainer>
      <Article />
    </>
  )
}

const mountNode = document.getElementById('app')
ReactDOM.createRoot(mountNode).render(<App name='Jane' />)
