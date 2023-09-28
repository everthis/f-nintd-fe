import React, { useState, useEffect, useMemo, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import styled from 'styled-components'

import { Tags, AddTag, listTags, AddTagPane } from './tag'
import { Upload } from './upload'

import { Toolbar } from './toolbar'
import { Pane } from './pane'
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

const useCS = (name, initVal, setHook) => {
  const [state, setState] = useState(initVal)
  const fn = (val) => {
    setHook(name, val)
    setState(val)
  }
  return [state, fn]
}
export function Create() {
  const [tags, setTags] = useState([])
  const [showRemote, setShowRemote] = useState(false)
  const [showArticleList, setShowArticleList] = useCS(
    'article',
    false,
    setStkVal
  )
  const [showAudio, setShowAudio] = useCS('audio', false, setStkVal)
  const [showText, setShowText] = useCS('text', false, setStkVal)
  const [showUpload, setShowUpload] = useCS('upload', false, setStkVal)
  const [showImg, setShowImg] = useCS('image', false, setStkVal)
  const [showAddTag, setShowAddTag] = useCS('tag', false, setStkVal)
  const [fayeIns, setFayeIns] = useState(null)
  const [paneMap, setPaneMap] = useState(new Map())
  const [checkedSet, setCheckedSet] = useState(new Set())

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
          setShowPane={setShowImg}
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
  function isLastInMap(map, key) {
    const it = map.keys()
    let last
    for (const k of it) {
      last = k
    }
    return last === key
  }
  function setStkVal(name, shouldShow) {
    if (paneMap.has(name)) {
      if (shouldShow) {
        if (isLastInMap(paneMap, name)) return
        // exist, active, bring it to front
        paneMap.delete(name)
        paneMap.set(name, 1)
      } else {
        paneMap.delete(name)
      }
    } else {
      if (shouldShow) {
        paneMap.set(name, 1)
      }
    }
    setPaneMap(new Map(paneMap))
  }

  const hash = {
    upload: (
      <Pane
        onClick={() => setShowUpload(true)}
        key="upload"
        left={300}
        top={55}
        show={showUpload}
        bgColor="var(--bg-color)"
        body={uploadBody}
        onClose={(ev) => {
          ev.stopPropagation()
          setShowUpload(false)
        }}
      />
    ),
    image: (
      <Pane
        onClick={() => setShowImg(true)}
        key="image"
        left={200}
        top={55}
        show={showImg}
        bgColor="var(--bg-color)"
        width="80vw"
        height="80vh"
        body={imageGridBody}
        onClose={(ev) => {
          ev.stopPropagation()
          setShowImg(false)
        }}
      />
    ),
    audio: (
      <Pane
        onClick={() => setShowAudio(true)}
        key="audio"
        left={400}
        top={55}
        show={showAudio}
        bgColor="var(--bg-color)"
        body={audioBody}
        onClose={(ev) => {
          ev.stopPropagation()
          setShowAudio(false)
        }}
      />
    ),
    article: (
      <Pane
        onClick={() => setShowArticleList(true)}
        key="article"
        left={500}
        top={55}
        show={showArticleList}
        bgColor="var(--bg-color)"
        body={articleListBody}
        onClose={(ev) => {
          ev.stopPropagation()
          setShowArticleList(false)
        }}
        width="600px"
      />
    ),
    text: (
      <Pane
        onClick={() => setShowText(true)}
        key="text"
        left={200}
        top={55}
        show={showText}
        bgColor="var(--bg-color)"
        width="80vw"
        height="70vh"
        body={addTextBody}
        onClose={(ev) => {
          ev.stopPropagation()
          setShowText(false)
        }}
      />
    ),
    tag: (
      <Pane
        onClick={() => setShowAddTag(true)}
        key="tag"
        left={200}
        top={55}
        show={showAddTag}
        bgColor="var(--bg-color)"
        width="50vw"
        height="30vh"
        body={addTagBody}
        onClose={(ev) => {
          ev.stopPropagation()
          setShowAddTag(false)
        }}
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
        setShowUpload={setShowUpload}
        showArticleList={showArticleList}
        setShowArticleList={setShowArticleList}
        showAudio={showAudio}
        setShowAudio={setShowAudio}
        showText={showText}
        setShowText={setShowText}
        showImg={showImg}
        setShowImg={setShowImg}
        showAddTag={showAddTag}
        setShowAddTag={setShowAddTag}
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
