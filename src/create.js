import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import styled from 'styled-components'

import { AddTagPane } from './tag'
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
  const fn = useCallback(
    (val) => {
      setHook(name, val)
      setState(val)
    },
    [name]
  )
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
  function calcNewPaneInitPos() {
    const panes = document.getElementsByClassName('pane')
    const last = panes[panes.length - 1]
    const { left, top } = last
      ? last.getBoundingClientRect()
      : { left: 50, top: 80 }
    return [left + 30, top + 30]
  }
  function setStkVal(name, shouldShow) {
    if (paneMap.has(name)) {
      if (shouldShow) {
        if (isLastInMap(paneMap, name)) return
        // exist, active, bring it to front
        const tmp = paneMap.get(name)
        paneMap.delete(name)
        paneMap.set(name, tmp)
      } else {
        paneMap.delete(name)
      }
    } else {
      if (shouldShow) {
        const [left, top] = calcNewPaneInitPos()
        paneMap.set(name, factory[name]({ left, top }))
      }
    }
    setPaneMap(new Map(paneMap))
  }

  const factory = {
    upload:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowUpload(true)}
            key="upload"
            left={left}
            top={top}
            bgColor="var(--bg-color)"
            body={<Upload />}
            onClose={(ev) => {
              ev.stopPropagation()
              setShowUpload(false)
            }}
          />
        ),
    image:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowImg(true)}
            key="image"
            left={left}
            top={top}
            bgColor="var(--bg-color)"
            width="80vw"
            height="80vh"
            body={
              <ImageGridPane
                showActions={false}
                showPane
                setShowPane={setShowImg}
                onConfirm={() => {}}
              />
            }
            onClose={(ev) => {
              ev.stopPropagation()
              setShowImg(false)
            }}
          />
        ),
    audio:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowAudio(true)}
            key="audio"
            left={left}
            top={top}
            show
            bgColor="var(--bg-color)"
            body={<Audio />}
            onClose={(ev) => {
              ev.stopPropagation()
              setShowAudio(false)
            }}
          />
        ),
    article:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowArticleList(true)}
            key="article"
            left={left}
            top={top}
            show
            bgColor="var(--bg-color)"
            body={<Article />}
            onClose={(ev) => {
              ev.stopPropagation()
              setShowArticleList(false)
            }}
            width="600px"
          />
        ),
    text:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowText(true)}
            key="text"
            left={left}
            top={top}
            show
            bgColor="var(--bg-color)"
            width="80vw"
            height="70vh"
            body={<TextPane />}
            onClose={(ev) => {
              ev.stopPropagation()
              setShowText(false)
            }}
          />
        ),
    tag:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowAddTag(true)}
            key="tag"
            left={left}
            top={top}
            show
            bgColor="var(--bg-color)"
            width="50vw"
            height="30vh"
            body={<AddTagPane />}
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
      {/* <Pane
        left={50}
        top={95}
        show={showRemote}
        bgColor="var(--bg-color)"
        body={remoteBody}
        width="600px"
        showClose
        onClose={remoteOnClose}
      /> */}
      {Array.from(paneMap.values()).map((fn) => fn())}
    </>
  )
}
