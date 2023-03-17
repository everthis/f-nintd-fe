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
import { Audio } from './audio'
import { ImageGridPane } from './imageGridPane'

import './index.scss'
import * as Faye from 'faye'
import { API_ORIGIN } from './constant'

const VertGap = styled.div`
  ${({ height }) => (height ? `height: ${height};` : '')}
`
const HorLine = styled.hr`
  margin: 0.4em 0;
  border-top: none;
  border-color: #333;
`
const PaneContainer = styled.span`
  position: absolute;
  z-index: ${({ show }) => (show ? 1 : -1)};
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
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
  const [showImg, setShowImg] = useState(false)
  const [fayeIns, setFayeIns] = useState(null)

  const uploadBody = useMemo(() => <Upload tags={tags} />, [tags])
  const uploadAudio = useMemo(
    () => <Upload tags={tags} type="audio" useOriginalName />,
    [tags]
  )
  const audioBody = useMemo(() => (showAudio ? <Audio /> : null), [showAudio])
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

  const imageGridBody = React.useMemo(
    () => (
      <ImageGridPane
        showActions={false}
        showPane={showImg}
        setShowPane={setShowImg}
        onConfirm={() => {}}
      />
    ),
    [showImg]
  )

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
  const closeAudio = () => {
    setShowAudio(false)
  }
  const closeImgGridPane = () => {
    setShowImg(false)
  }
  useEffect(() => {
    const client = new Faye.Client(`${API_ORIGIN}/faye`)
    console.log(Faye, client)
    setFayeIns(client)
    return () => {
      client.disconnect()
    }
  }, [])
  const genRand = (len) => {
    return Math.random()
      .toString(36)
      .substring(2, len + 2)
  }
  function publish() {
    if (fayeIns) {
      fayeIns.publish('/foo', genRand(12))
    }
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
        showImg={showImg}
        setShowImg={setShowImg}
      />
      <HorLine />
      <p>
        <button onClick={publish}>publish</button>
      </p>
      <EditorContainer>
        <Editor imgList={checkedSet} />
      </EditorContainer>
      {/* images pane when tags selected */}
      <PaneContainer left="calc(100vw - 570px)" top="55px" show={showRemote}>
        <Pane
          show={showRemote}
          bgColor="#fff"
          body={remoteBody}
          width="600px"
          showClose
          onClose={remoteOnClose}
        />
      </PaneContainer>
      {/* upload pane */}
      <PaneContainer left="calc(100vw - 500px)" top="55px" show={showUpload}>
        <Pane
          show={showUpload}
          bgColor="#fff"
          body={uploadBody}
          onClose={closeUploadPane}
        />
      </PaneContainer>
      {/* article pane */}
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
      {/* audio pane */}
      <PaneContainer left="calc(100vw - 500px)" top="55px" show={showAudio}>
        <Pane
          show={showAudio}
          bgColor="#fff"
          body={audioBody}
          onClose={closeAudio}
        />
      </PaneContainer>
      {/* images pane */}
      <PaneContainer left="200px" top="55px" show={showImg}>
        <Pane
          show={showImg}
          bgColor="#fff"
          width="80vw"
          height="80vh"
          body={imageGridBody}
          onClose={closeImgGridPane}
        />
      </PaneContainer>
    </>
  )
}
