import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { Pane } from './pane'
import { Tags } from './tag'
import { API_ORIGIN, EMPTY_SET, TYPE } from './constant'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DeleteIcon,
  InsertIcon,
  InsertBeforeIcon,
  InsertAfterIcon,
  RefreshIcon,
  ReverseIcon,
  AddIcon,
  SaveIcon,
  ManageIcon,
  CoverIcon,
} from './icon'
import { PaneContainer } from './pane'
import { AssetGridPane } from './AssetGridPane'
import { ImgComp } from './image'
import { AudioItem } from './audio'
import { PerText } from './text'

const Wrap = styled.div`
  position: relative;
`
const EditorWrap = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  min-height: 400px;
  max-height: 50vh;
  border: 1px solid #333;
  resize: both;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 5px 45px 5px 45px;
  img {
    width: 100%;
  }
`

const Select = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  input {
    width: 16px;
    height: 16px;
  }
`

const PaneWrap = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 70vw;
  height: 70vh;
`
const TitleRow = styled.div`
  margin: 0 0 5px 0;
  input {
    display: block;
    margin: 0;
    width: 100%;
  }
`

const Section = styled.section`
  position: relative;
`
const SectionContent = styled.section`
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem;
`
const SectionOp = styled.span`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translate3d(0, -50%, 0);
`
const ImgSection = styled.section`
  padding: 5px 0;
  display: flex;
  flex-wrap: wrap;
`
const OpSection = styled.div``
const OpBtn = styled.span`
  display: block;
  cursor: pointer;
  text-align: center;
  margin: 5px;
  border-bottom: 1px solid #333;
  & + & {
    margin-top: 25px;
  }
`
const ImgWrap = styled.span`
  position: relative;
  display: inline-block;
  padding: 3px;
  width: 20%;
`
const ImgInnerContainer = styled.div`
  background-color: ${({ checked }) => (checked ? '#717de9' : '#ddd')};
`
const ImgInner = styled.div`
  transition: transform 0.135s cubic-bezier(0, 0, 0.2, 1);
  transform: ${({ checked }) =>
    checked
      ? 'translateZ(0px) scale3d(0.89, 0.91, 1)'
      : 'translateZ(0px) scale3d(1, 1, 1)'};
`

const Op = styled.div`
  margin-top: 1em;
  display: flex;
  justify-content: space-between;
  gap: 1em;
`

const PreOp = styled.div`
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translate3d(0, -50%, 0);
`

const VertGap = styled.div`
  ${({ height }) => (height ? `height: ${height};` : '')}
`

const CoverWrap = styled.div`
  max-width: 600px;
  margin-bottom: 1rem;
  img {
    width: 100%;
  }
`
const RefreshWrap = styled.span`
  position: absolute;
  left: 50%;
  top: -1rem;
`

const AbsPos = styled.span`
  position: absolute;
  left: 100%;
  top: 50%;
`

export function Editor() {
  const [title, setTitle] = useState('')
  const [showPane, setShowPane] = useState(false)
  const [showInsertPane, setShowInsertPane] = useState(false)
  const [showCoverPane, setShowCoverPane] = useState(false)
  const [imgs, setImgs] = useState([])
  const [items, setItems] = useState([])
  const [tags, setTags] = useState([])
  const [coverImg, setCoverImg] = useState(null)
  const [audioOnly, setAudioOnly] = useState(false)
  const activeImgInArticleRef = useRef(null)

  const editorRef = useRef()
  const articleIdRef = useRef()
  const audioOnlyRef = useRef()

  const preview = () => {}
  const save = () => {
    const res = {
      body: [],
      title: '',
      path: '',
      cover: {},
    }
    res.title = title
    res.path = title.toLowerCase().split(' ').join('_')
    for (const e of items) {
      res.body.push({
        type: e.type,
        id: e.id,
      })
    }

    if (coverImg?.val || coverImg?.name) {
      const { type, id } = coverImg
      res.cover = { type, id }
    }

    const articleId = +articleIdRef.current.value
    const withId = Boolean(articleId)
    if (withId) {
      res.id = articleId
    }
    if (audioOnlyRef.current) {
      const el = audioOnlyRef.current
      res.audioOnly = el.checked
    }

    fetch(
      `${API_ORIGIN}${withId ? '/article/' + articleId : '/articles/new'}`,
      {
        method: withId ? 'PATCH' : 'POST',
        body: JSON.stringify(res),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((d) => d.text())
      .then((d) => alert('ok'))
  }
  const manageAssets = () => {
    activeImgInArticleRef.current = null
    setShowPane(true)
  }

  const closePane = () => {
    setTags([])
    setImgs([])

    setShowPane(false)
  }

  function setRemoteListFn(arr) {
    arr.forEach((e) => {
      e.tags = e.tags.map((e) => ({ name: e, selected: false }))
      e.selected = false
    })
    setImgs(arr)
  }
  function queryByTags(tagVal) {
    fetch(`${API_ORIGIN}/image/byTags?tags=` + tagVal, {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((d) => {
        setRemoteListFn(d)
      })
  }

  const insertAssets = (arr) => {
    let clone = items.slice()
    if (activeImgInArticleRef.current != null) {
      const idx = activeImgInArticleRef.current
      clone.splice(idx, 0, ...arr)
    } else {
      // replace existing
      clone = arr
    }
    setItems(clone)
  }

  const coverSelectionBody = React.useMemo(
    () =>
      showCoverPane ? (
        <AssetGridPane
          showActions
          singleSelect
          showPane={showCoverPane}
          setShowPane={setShowCoverPane}
          onConfirm={(res) => {
            setCoverImg(res[0])
            setShowCoverPane(false)
          }}
        />
      ) : null,
    [showCoverPane]
  )

  const imageGridBody = React.useMemo(() => {
    const alreadySelectedSet = new Set()
    for (const e of items) {
      alreadySelectedSet.add(e)
    }
    return showPane ? (
      <AssetGridPane
        showActions
        showPane={showPane}
        setShowPane={setShowPane}
        disabledAssetsSet={
          activeImgInArticleRef.current == null ? EMPTY_SET : alreadySelectedSet
        }
        onConfirm={(res) => {
          insertAssets(res)
          setShowPane(false)
        }}
        alreadySelectedSet={alreadySelectedSet}
      />
    ) : null
  }, [showPane])

  // const insertImageGridBody = React.memo(() => (<AssetGridPane
  //   showActions
  //   showPane={showInsertPane}
  //   setShowPane={setShowInsertPane}
  //   onConfirm={(res) => setItems(res)}
  // />), [showInsertPane])

  function updateTags(v) {
    setTags(v)
    const arr = v.filter((e) => e.selected).map((e) => e.name)
    if (arr.length) {
      queryByTags(arr.join(','))
    } else {
      setImgs([])
    }
  }

  function selectCbFn(url, bool) {
    const clone = [...imgs]
    for (const e of clone) {
      if (e.name === url) {
        e.selected = bool
        break
      }
    }
    setImgs(clone)
  }

  function applySelected() {
    const imgsArr = imgs.filter((e) => e.selected)
    const res = imgsArr.map((e) => {
      e.type = TYPE.IMG
      e.val = e.name
      e.dimension = e.dimension
      return e
    })
    setItems(res)
  }

  function toggleSelectAll() {
    const clone = imgs.slice(0)
    const allChecked = imgs.filter((e) => e.selected).length === imgs.length
    clone.forEach((e) => (e.selected = allChecked ? false : true))
    setImgs(clone)
  }

  function moveUp(e) {
    const idx = items.indexOf(e)
    items.splice(idx, 1)
    const insertIdx = Math.max(0, idx - 1)
    items.splice(insertIdx, 0, e)
    setItems(items.slice())
  }

  function moveDown(e) {
    const idx = items.indexOf(e)
    items.splice(idx, 1)
    const insertIdx = Math.min(items.length, idx + 1)
    items.splice(insertIdx, 0, e)
    setItems(items.slice())
  }

  function insertHere(e) {}
  function insertBefore(e, idx) {
    activeImgInArticleRef.current = idx
    setShowPane(true)
  }
  function insertAfter(e, idx) {
    activeImgInArticleRef.current = idx + 1
    setShowPane(true)
  }

  function clearEditor() {
    resetEditor()
  }

  function titleChange(ev) {
    setTitle(ev.target.value)
  }

  function deleteItem(idx) {
    const clone = [...items]
    clone.splice(idx, 1)
    setItems(clone)
  }

  function addCover(ev) {
    setShowCoverPane(true)
  }

  function fetchArticle(id) {
    fetch(`${API_ORIGIN}/article/${id}`, {})
      .then((d) => d.json())
      .then((d) => {
        setItems(d.content.body)
        setTitle(d.title)
        setCoverImg(d.content.cover)
        setAudioOnly(d.content.audioOnly)
      })
  }

  function resetEditor() {
    articleIdRef.current.value = ''
    setTitle('')
    setItems([])
    setCoverImg({})
    setAudioOnly(false)
  }

  function reverseList() {
    const clone = items.slice()
    clone.reverse()
    setItems(clone)
  }

  function addAudio() {}
  function audioOnlyChange(ev) {
    setAudioOnly(ev.target.checked)
  }

  useEffect(() => {
    const cb = (ev) => {
      const { id } = ev.detail
      fetchArticle(id)
      articleIdRef.current.value = id
    }
    window.addEventListener('editArticle', cb)

    return () => window.removeEventListener('editArticle', cb)
  }, [])

  return (
    <Wrap ref={editorRef}>
      <input ref={articleIdRef} hidden />
      <TitleRow>
        <label>
          Title:
          <input type="text" value={title} onChange={titleChange} />
        </label>
      </TitleRow>

      <EditorWrap>
        {items.map((e, idx) => (
          <Section key={`${e.type},${e.id}`}>
            <PreOp>
              <OpBtn onClick={() => deleteItem(idx)}>
                <DeleteIcon />
              </OpBtn>
            </PreOp>
            <SectionContent>
              {e.type === TYPE.IMG || e.type === 'img' ? (
                <ImgComp {...e} />
              ) : null}
              {e.type === TYPE.AUDIO ? <AudioItem data={e} /> : null}
              {e.type === TYPE.TEXT ? (
                <PerText data={e} showOpts={false} />
              ) : null}
            </SectionContent>
            <SectionOp>
              <OpBtn onClick={() => moveUp(e)}>
                <ArrowUpIcon />
              </OpBtn>
              <OpBtn onClick={() => insertBefore(e, idx)}>
                <InsertBeforeIcon />
              </OpBtn>
              <OpBtn onClick={() => insertAfter(e, idx)}>
                <InsertAfterIcon />
              </OpBtn>
              <OpBtn onClick={() => moveDown(e)}>
                <ArrowDownIcon />
              </OpBtn>
            </SectionOp>
          </Section>
        ))}
      </EditorWrap>
      <div>
        <label>
          <input
            checked={audioOnly}
            type="checkbox"
            onChange={audioOnlyChange}
          />
          Audio only
        </label>
      </div>
      <Op>
        <button onClick={clearEditor}>
          <RefreshIcon />
          Clear editor
        </button>
        <button onClick={reverseList}>
          <ReverseIcon />
          reverse List
        </button>
        <button onClick={addCover}>
          <CoverIcon />
          add cover
        </button>
        <button onClick={manageAssets}>
          <ManageIcon />
          Manage Assets
        </button>
        {/* <button onClick={preview}>Preview</button> */}
        <button onClick={save}>
          <SaveIcon /> Save
        </button>
      </Op>
      <VertGap height="50px" />
      <CoverWrap>
        {coverImg?.name ? (
          <>
            <label>Cover:</label>
            <ImgComp {...coverImg} />
          </>
        ) : null}
      </CoverWrap>
      {showCoverPane ? (
        <Pane
          show={showCoverPane}
          bgColor="var(--bg-color)"
          body={coverSelectionBody}
          width="80vw"
          height="80vh"
          left={100}
          top={100}
          onClose={() => setShowCoverPane(false)}
        />
      ) : null}
      {showPane ? (
        <Pane
          left={100}
          top={100}
          show={showPane}
          bgColor="var(--bg-color)"
          body={imageGridBody}
          width="80vw"
          height="80vh"
          onClose={() => setShowPane(false)}
        />
      ) : null}
      {/* <RefreshWrap onClick={resetEditor}>
        
      </RefreshWrap> */}
    </Wrap>
  )
}

function SelectPane() {}
