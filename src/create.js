import React, { useState, useEffect, useMemo, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import styled from 'styled-components'

import { Tags, AddTag, listTags, AddTagPane } from './tag'
import { Upload } from './upload'

import { Toolbar } from './toolbar'
import { Pane, PaneContainer } from './pane'
import { Editor } from './editor'
import { Article } from './article'
import { RemoteImageList } from './remoteImageList'
import { Header } from './header'
import { Audio } from './audio'
import { ImageGridPane } from './imageGridPane'

import './index.scss'
import * as Faye from 'faye'
import { API_ORIGIN } from './constant'
import { postData } from './utils'
import { TextPane } from './text'

const VertGap = styled.div`
  ${({ height }) => (height ? `height: ${height};` : '')}
`
const HorLine = styled.hr`
  margin: 0.4em 0;
  border-top: none;
  border-color: #333;
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
  const [showText, setShowText] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showRemote, setShowRemote] = useState(false)
  const [checkedSet, setCheckedSet] = useState(new Set())
  const [showImg, setShowImg] = useState(false)
  const [showAddTag, setShowAddTag] = useState(false)
  const [fayeIns, setFayeIns] = useState(null)
  const [paneMap, setPaneMap] = useState(new Map())

  const uploadBody = useMemo(
    () => (showUpload ? <Upload /> : null),
    [showUpload]
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
    return <RemoteImageList cb={remoteChange} selectCb={selectCb} />
  }, [])

  const imageGridBody = React.useMemo(
    () =>
      showImg ? (
        <ImageGridPane
          showActions={false}
          showPane={showImg}
          setShowPane={setShowImgFn}
          onConfirm={() => {}}
        />
      ) : null,
    [showImg]
  )

  const addTagBody = React.useMemo(
    () => (showAddTag ? <AddTagPane /> : null),
    [showAddTag]
  )

  const addTextBody = React.useMemo(
    () => (showText ? <TextPane /> : null),
    [showText]
  )

  const remoteOnClose = () => {
    const clone = tags.slice()
    clone.forEach((e) => (e.selected = false))
    setTags(clone)
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
  function setStkVal(name, shouldShow) {
    if (paneMap.has(name)) {
      paneMap.delete(name)
      if (shouldShow) {
        // exist, active, bring it to front
        paneMap.set(name, 1)
      }
    } else {
      if (shouldShow) {
        paneMap.set(name, 1)
      }
    }
    setPaneMap(new Map(paneMap))
  }
  const setShowUploadFn = (val) => {
    setStkVal('upload', val)
    setShowUpload(val)
  }
  const setShowArticleListFn = (val) => {
    setStkVal('article', val)
    setShowArticleList(val)
  }
  const setShowAudioFn = (val) => {
    setStkVal('audio', val)
    setShowAudio(val)
  }
  const setShowTextFn = (val) => {
    setStkVal('text', val)
    setShowText(val)
  }
  const setShowImgFn = (val) => {
    setStkVal('image', val)
    setShowImg(val)
  }
  const setShowAddTagFn = (val) => {
    setStkVal('tag', val)
    setShowAddTag(val)
  }

  const hash = {
    upload: (
      <Pane
        onClick={() => setShowUploadFn(true)}
        key="upload"
        left={300}
        top={55}
        show={showUpload}
        bgColor="var(--bg-color)"
        body={uploadBody}
        onClose={() => setShowUploadFn(false)}
      />
    ),
    image: (
      <Pane
        onClick={() => setShowImgFn(true)}
        key="image"
        left={200}
        top={55}
        show={showImg}
        bgColor="var(--bg-color)"
        width="80vw"
        height="80vh"
        body={imageGridBody}
        onClose={() => setShowImgFn(false)}
      />
    ),
    audio: (
      <Pane
        onClick={() => setShowAudioFn(true)}
        key="audio"
        left={400}
        top={55}
        show={showAudio}
        bgColor="var(--bg-color)"
        body={audioBody}
        onClose={() => setShowAudioFn(false)}
      />
    ),
    article: (
      <Pane
        onClick={() => setShowArticleListFn(true)}
        key="article"
        left={500}
        top={55}
        show={showArticleList}
        bgColor="var(--bg-color)"
        body={articleListBody}
        onClose={() => setShowArticleListFn(false)}
        width="600px"
      />
    ),
    text: (
      <Pane
        onClick={() => setShowTextFn(true)}
        key="text"
        left={200}
        top={55}
        show={showText}
        bgColor="var(--bg-color)"
        width="80vw"
        height="70vh"
        body={addTextBody}
        onClose={() => setShowTextFn(false)}
      />
    ),
    tag: (
      <Pane
        onClick={() => setShowAddTagFn(true)}
        key="tag"
        left={200}
        top={55}
        show={showAddTag}
        bgColor="var(--bg-color)"
        width="50vw"
        height="30vh"
        body={addTagBody}
        onClose={() => setShowAddTagFn(false)}
      />
    ),
  }

  return (
    <>
      <Header />
      <VertGap height="1em" />

      <HorLine />
      <Toolbar
        showUpload={showUpload}
        setShowUpload={setShowUploadFn}
        showArticleList={showArticleList}
        setShowArticleList={setShowArticleListFn}
        showAudio={showAudio}
        setShowAudio={setShowAudioFn}
        showText={showText}
        setShowText={setShowTextFn}
        showImg={showImg}
        setShowImg={setShowImgFn}
        showAddTag={showAddTag}
        setShowAddTag={setShowAddTagFn}
      />
      <HorLine />
      <p>
        <button onClick={publish}>publish</button>
      </p>
      <EditorContainer>
        <Editor imgList={checkedSet} />
      </EditorContainer>
      {/* images pane when tags selected */}
      <Pane
        left={100}
        top={55}
        show={showRemote}
        bgColor="var(--bg-color)"
        body={remoteBody}
        width="600px"
        showClose
        onClose={remoteOnClose}
      />
      {Array.from(paneMap.keys()).map((k) => hash[k])}
    </>
  )
}
