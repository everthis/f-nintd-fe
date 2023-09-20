import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { Pane } from './pane'
import { Tags } from './tag'
import { API_ORIGIN } from './constant'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DeleteIcon,
  InsertIcon,
  InsertBeforeIcon,
  InsertAfterIcon,
  RefreshIcon,
} from './icon'
import { PaneContainer } from './create'
import { ImageGridPane } from './imageGridPane'

const Wrap = styled.div`
  position: relative;
`
const EditorWrap = styled.div`
  position: relative;
  display: inline-block;
  min-width: 600px;
  min-height: 400px;
  max-height: 70vh;
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
const SectionContent = styled.section``
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
  button + button {
    margin-left: 3em;
  }
`

const PreOp = styled.div`
  position: absolute;
  right: 100%;
  top: 50%;
`

const VertGap = styled.div`
  ${({ height }) => (height ? `height: ${height};` : '')}
`

const CoverWrap = styled.div`
  max-width: 300px;
  img {
    width: 100%;
  }
`
const RefreshWrap = styled.span`
  position: absolute;
  left: 50%;
  top: -1rem;
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
  const activeImgInArticleRef = useRef(null)
  const editorRef = useRef()
  const articleIdRef = useRef()

  const preview = () => {}
  const save = () => {
    const res = {
      body: [],
      title: '',
      path: '',
      cover: '',
    }
    res.title = title
    res.path = title.toLowerCase().split(' ').join('_')
    for (const e of items) {
      res.body.push({
        type: e.type,
        val: e.val,
        dimension: e.dimension,
      })
    }
    if (coverImg?.name) {
      res.cover = coverImg.name
    }

    fetch(`${API_ORIGIN}/articles/new`, {
      method: 'POST',
      body: JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((d) => d.text())
      .then((d) => alert('ok'))
  }
  const addAssetsToTheEnd = () => {
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
    fetch(`${API_ORIGIN}/images/byTags?tags=` + tagVal, {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((d) => {
        setRemoteListFn(d)
      })
  }

  const insertAssets = (arr) => {
    if (activeImgInArticleRef.current != null) {
      const idx = activeImgInArticleRef.current
      const clone = items.slice()
      clone.splice(idx, 0, ...arr)
      setItems(clone)
    } else {
      setItems(arr)
    }
  }

  const coverSelectionBody = React.useMemo(
    () => (
      <ImageGridPane
        showActions
        singleSelect
        showPane={showCoverPane}
        setShowPane={setShowCoverPane}
        onConfirm={(res) => setCoverImg(res[0])}
      />
    ),
    [showCoverPane]
  )

  const imageGridBody = React.useMemo(() => {
    const disabledSet = new Set()
    for (const e of items) {
      disabledSet.add(e.val)
    }
    return (
      <ImageGridPane
        showActions
        showPane={showPane}
        setShowPane={setShowPane}
        onConfirm={(res) => {
          insertAssets(res)
          setShowPane(false)
        }}
        disabledSet={disabledSet}
      />
    )
  }, [showPane])

  // const insertImageGridBody = React.memo(() => (<ImageGridPane
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
      e.type = 'img'
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
    setItems([])
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
      })
  }

  function resetEditor() {
    articleIdRef.current.value = ''
    setTitle('')
    setItems([])
    setCoverImg('')
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
          <input value={title} onChange={titleChange} />
        </label>
      </TitleRow>
      <CoverWrap>
        {coverImg?.name ? <img src={coverImg.name} loading="lazy" /> : null}
      </CoverWrap>
      <EditorWrap>
        {items.map((e, idx) => (
          <Section key={e.val}>
            <PreOp>
              <OpBtn onClick={() => deleteItem(idx)}>
                <DeleteIcon />
              </OpBtn>
            </PreOp>
            <SectionContent>
              {e.type === 'img' ? <img src={e.val} loading="lazy" /> : null}
              {e.type === 'text' ? <p>{e.val}</p> : null}
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
      <Op>
        <button onClick={clearEditor}>Clear editor</button>
        <button onClick={addCover}>add cover</button>
        <button onClick={addAssetsToTheEnd}>Add Assets</button>
        <button onClick={preview}>Preview</button>
        <button onClick={save}>Save</button>
      </Op>
      <VertGap height="50px" />
      <PaneContainer left="200px" top="50px" show={showCoverPane}>
        <Pane
          show={showCoverPane}
          bgColor="var(--bg-color)"
          body={coverSelectionBody}
          width="80vw"
          height="80vh"
          onClose={() => setShowCoverPane(false)}
        />
      </PaneContainer>
      <PaneContainer left="200px" top="50px" show={showPane}>
        <Pane
          show={showPane}
          bgColor="var(--bg-color)"
          body={imageGridBody}
          width="80vw"
          height="80vh"
          onClose={() => setShowPane(false)}
        />
      </PaneContainer>
      <RefreshWrap onClick={resetEditor}>
        <RefreshIcon />
      </RefreshWrap>
    </Wrap>
  )
}

function SelectPane() {}
