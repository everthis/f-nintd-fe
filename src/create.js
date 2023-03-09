import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import styled from 'styled-components'

import { Tags } from './tag'
import { Upload } from './upload'

import { Toolbar } from './toolbar'
import { Pane } from './pane'
import { Editor } from './editor'
import { Article } from './article'
import { RemoteImageList } from './remoteImageList'
import { Nav } from './nav'

import './index.scss'

const VertGap = styled.div`
  ${({ height }) => (height ? `height: ${height};` : '')}
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

export function Create(props) {
  const { name } = props
  const [tags, setTags] = useState([])
  const [showArticleList, setShowArticleList] = useState(false)
  const [showAudio, setShowAudio] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showRemote, setShowRemote] = useState(false)
  const [checkedSet, setCheckedSet] = useState(new Set())
  const uploadBody = useMemo(() => <Upload tags={tags} />, [tags])
  const articleListBody = useMemo(
    () => (showArticleList ? <Article /> : null),
    [showArticleList]
  )
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
  const remoteBody = React.useMemo(() => {
    return <RemoteImageList tags={tags} cb={remoteChange} selectCb={selectCb} />
  }, [tags])

  const remoteOnClose = () => {
    const clone = tags.slice()
    clone.forEach((e) => (e.selected = false))
    setTags(clone)
  }

  const closeUploadPane = () => {
    setShowUpload(false)
  }
  const closeArticleListPane = () => {
    setShowArticleList(false)
  }

  return (
    <>
      <Nav />
      <VertGap height="1em" />
      <Tags tags={tags} updateTags={setTags} />
      <HorLine />
      <Toolbar
        showUpload={showUpload}
        setShowUpload={setShowUpload}
        showArticleList={showArticleList}
        setShowArticleList={setShowArticleList}
        showAudio={showAudio}
        setShowAudio={setShowAudio}
      />
      <HorLine />
      <EditorContainer>
        <Editor imgList={checkedSet} />
      </EditorContainer>
      <PaneContainer left="calc(100vw - 570px)" top="55px" show={showRemote}>
        <Pane
          show={showRemote}
          bgColor="#fff"
          body={remoteBody}
          width="500px"
          showClose
          onClose={remoteOnClose}
        />
      </PaneContainer>
      <PaneContainer left="calc(100vw - 500px)" top="55px" show={showUpload}>
        <Pane
          show={showUpload}
          bgColor="#fff"
          body={uploadBody}
          onClose={closeUploadPane}
        />
      </PaneContainer>

      <PaneContainer
        left="calc(100vw - 500px)"
        top="55px"
        show={showArticleList}
      >
        <Pane
          show={showArticleList}
          bgColor="#fff"
          body={articleListBody}
          onClose={closeArticleListPane}
        />
      </PaneContainer>
    </>
  )
}
