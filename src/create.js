import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import styled from 'styled-components'

import { AddTagPane } from './tag'
import { Upload } from './upload'

import { Toolbar } from './toolbar'
import { Pane } from './pane'
import { Editor } from './editor'
import { Article } from './article'
import { RemoteImageList } from './remoteImageList'
import { Audio } from './audio'
import { AssetGridPane } from './AssetGridPane'
import { DownloaderPage } from './downloader'

import './index.scss'

import { API_ORIGIN, TYPE } from './constant'
import { TextPane, AddTextPane } from './text'

const VertGap = styled.div`
  ${({ height }) => (height ? `height: ${height};` : '')}
`
const HorLine = styled.hr`
  margin: 0.4em 0;
  border-top: none;
  border-color: #333;
`

const EditorContainer = styled.div`
  display: block;
  width: 650px;
  margin: 0 auto;
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
  const [showDownload, setShowDownload] = useCS(
    'download',
    false,
    setStkVal
  )
  const [showAudio, setShowAudio] = useCS('audio', false, setStkVal)
  const [showOneFrameVideo, setShowOneFrameVideo] = useCS(
    'oneFrameVideo',
    false,
    setStkVal
  )
  const [showComponent, setShowComponent] = useCS('component', false, setStkVal)
  const [showText, setShowText] = useCS('text', false, setStkVal)
  const [showUpload, setShowUpload] = useCS('upload', false, setStkVal)
  const [showImg, setShowImg] = useCS('image', false, setStkVal)
  const [showAddTag, setShowAddTag] = useCS('tag', false, setStkVal)
  const [showCreateText, setShowCreateText] = useCS(
    'createText',
    false,
    setStkVal
  )
  const [showWaveform, setShowWaveform] = useCS('waveform', false, setStkVal)
  const [showCombine, setShowCombine] = useCS('combine', false, setStkVal)
  const [showLink, setShowLink] = useCS('link', false, setStkVal)

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
      : { left: 50, top: 30 }
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
            key='upload'
            left={left}
            top={top}
            bgColor='var(--bg-color)'
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
            key='image'
            left={left}
            top={top}
            bgColor='var(--bg-color)'
            width='80vw'
            height='80vh'
            body={
              <AssetGridPane
                showActions={false}
                showPane
                setShowPane={setShowImg}
                onConfirm={() => {}}
                defaultType={TYPE.IMAGE}
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
            key='audio'
            left={left}
            top={top}
            show
            bgColor='var(--bg-color)'
            // body={<Audio />}
            width='90vw'
            height='85vh'
            body={
              <AssetGridPane
                showActions={false}
                showPane
                setShowPane={setShowAudio}
                onConfirm={() => {}}
                defaultType={TYPE.AUDIO}
              />
            }
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
            key='article'
            left={left}
            top={top}
            show
            bgColor='var(--bg-color)'
            body={<Article />}
            onClose={(ev) => {
              ev.stopPropagation()
              setShowArticleList(false)
            }}
            width='600px'
          />
        ),
    text:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowText(true)}
            key='text'
            left={left}
            top={top}
            show
            bgColor='var(--bg-color)'
            width='80vw'
            height='70vh'
            body={
              <AssetGridPane
                showActions={false}
                showPane
                setShowPane={setShowText}
                onConfirm={() => {}}
                defaultType={TYPE.TEXT}
              />
            }
            onClose={(ev) => {
              ev.stopPropagation()
              setShowText(false)
            }}
          />
        ),
    oneFrameVideo:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowOneFrameVideo(true)}
            key='oneFrameVideo'
            left={left}
            top={top}
            show
            bgColor='var(--bg-color)'
            width='80vw'
            height='70vh'
            body={
              <AssetGridPane
                showActions={false}
                showPane
                setShowPane={setShowOneFrameVideo}
                onConfirm={() => {}}
                defaultType={TYPE.ONE_FRAME_VIDEO}
              />
            }
            onClose={(ev) => {
              ev.stopPropagation()
              setShowOneFrameVideo(false)
            }}
          />
        ),
    component:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowComponent(true)}
            key='component'
            left={left}
            top={top}
            show
            bgColor='var(--bg-color)'
            width='80vw'
            height='70vh'
            body={
              <AssetGridPane
                showActions={false}
                showPane
                setShowPane={setShowComponent}
                onConfirm={() => {}}
                defaultType={TYPE.COMPONENT}
              />
            }
            onClose={(ev) => {
              ev.stopPropagation()
              setShowComponent(false)
            }}
          />
        ),
    waveform:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowWaveform(true)}
            key='waveform'
            left={left}
            top={top}
            show
            bgColor='var(--bg-color)'
            width='80vw'
            height='70vh'
            body={
              <AssetGridPane
                showActions={false}
                showPane
                setShowPane={setShowWaveform}
                onConfirm={() => {}}
                defaultType={TYPE.WAVEFORM}
              />
            }
            onClose={(ev) => {
              ev.stopPropagation()
              setShowWaveform(false)
            }}
          />
        ),
    tag:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowAddTag(true)}
            key='tag'
            left={left}
            top={top}
            show
            bgColor='var(--bg-color)'
            width='60vw'
            height='86vh'
            body={<AddTagPane />}
            onClose={(ev) => {
              ev.stopPropagation()
              setShowAddTag(false)
            }}
          />
        ),
    createText:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowCreateText(true)}
            key='createText'
            left={left}
            top={top}
            show
            bgColor='var(--bg-color)'
            width='70vw'
            height='70vh'
            body={<AddTextPane />}
            onClose={(ev) => {
              ev.stopPropagation()
              setShowCreateText(false)
            }}
          />
        ),
    combine:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowCombine(true)}
            key='combine'
            left={left}
            top={top}
            show
            bgColor='var(--bg-color)'
            width='90vw'
            height='90vh'
            body={<></>}
            onClose={(ev) => {
              ev.stopPropagation()
              setShowCombine(false)
            }}
          />
        ),
    link:
      ({ left, top }) =>
      () =>
        (
          <Pane
            onClick={() => setShowLink(true)}
            key='link'
            left={left}
            top={top}
            show
            bgColor='var(--bg-color)'
            width='60vw'
            height='60vh'
            body={<></>}
            onClose={(ev) => {
              ev.stopPropagation()
              setShowLink(false)
            }}
          />
        ),
    download:
      ({ left, top }) =>
      () => (
        <Pane
          onClick={() => setShowDownload(true)}
          key='download'
          left={left}
          top={top}
          show
          bgColor='var(--bg-color)'
          width='60vw'
          height='60vh'
          body={<DownloaderPage />}
          onClose={(ev) => {
            ev.stopPropagation()
            setShowDownload(false)
          }}
        />
      )
  }
  return (
    <>
      <Toolbar
        showUpload={showUpload}
        setShowUpload={setShowUpload}
        showArticleList={showArticleList}
        setShowArticleList={setShowArticleList}
        showAudio={showAudio}
        setShowAudio={setShowAudio}
        showOneFrameVideo={showOneFrameVideo}
        setShowOneFrameVideo={setShowOneFrameVideo}
        showText={showText}
        setShowText={setShowText}
        showImg={showImg}
        setShowImg={setShowImg}
        showAddTag={showAddTag}
        setShowAddTag={setShowAddTag}
        showCreate={showCreateText}
        setShowCreate={setShowCreateText}
        showWaveform={showWaveform}
        setShowWaveform={setShowWaveform}
        showCombine={showCombine}
        setShowCombine={setShowCombine}
        showLink={showLink}
        setShowLink={setShowLink}
        showComponent={showComponent}
        setShowComponent={setShowComponent}
        showDownload={showDownload}
        setShowDownload={setShowDownload}
      />
      <VertGap height="0.4em"
      />
      <HorLine />

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
