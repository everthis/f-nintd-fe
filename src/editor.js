import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { Pane } from './pane'
import { Tags } from './tag'
import { ImgFromUrl } from './image'

const Wrap = styled.div`
  position: relative;
`
const EditorWrap = styled.div`
  position: relative;
  display: inline-block;
  min-width: 500px;
  min-height: 400px;
  border: 1px solid #333;
  resize: both;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 5px 45px 5px 5px;
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
  position: absolute;
  top: 100%;
  button:first-child {
    margin-right: 3em;
  }
`

export function Editor({ imgList }) {
  const ref = useRef(null)
  const arr = Array.from(imgList)
  const [title, setTitle] = useState('')
  const [showPane, setShowPane] = useState(false)
  const [imgs, setImgs] = useState([])
  const [items, setItems] = useState([])

  const preview = () => {}
  const save = () => {
    const res = {
      body: [],
      title: '',
      path: '',
    }
    res.title = title
    res.path = title.toLowerCase().split(' ').join('_')
    for (const e of items) {
      res.body.push({
        type: e.type,
        val: e.val,
      })
    }
    console.log(res)

    fetch('http://192.168.2.114:8087/articles/new', {
      method: 'POST',
      body: JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((d) => d.text())
      .then((d) => alert('ok'))
  }
  const addImageToTheEnd = () => {
    setShowPane(true)
  }

  const closePane = () => {
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
    fetch('http://192.168.2.114:8087/images/byTags?tags=' + tagVal, {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((d) => {
        setRemoteListFn(d)
      })
  }
  function updateTags(v) {
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

  function clearEditor() {
    setItems([])
  }

  return (
    <Wrap>
      <TitleRow>
        <label>
          Title:
          <input value={title} onChange={(ev) => setTitle(ev.target.value)} />
        </label>
      </TitleRow>
      <EditorWrap>
        {items.map((e) => (
          <Section key={e.val}>
            <SectionContent>
              {e.type === 'img' ? <img src={e.val} /> : null}
              {e.type === 'text' ? <p>{e.val}</p> : null}
            </SectionContent>
            <SectionOp>
              <OpBtn onClick={() => moveUp(e)}>up</OpBtn>
              <OpBtn onClick={() => moveDown(e)}>down</OpBtn>
            </SectionOp>
          </Section>
        ))}
        <p>
          <button onClick={addImageToTheEnd}>Add Image</button>
        </p>
      </EditorWrap>
      <Op>
        <button onClick={clearEditor}>Clear editor</button>
        <button onClick={preview}>Preview</button>
        <button onClick={save}>Save</button>
      </Op>
      {showPane ? (
        <PaneWrap>
          <Pane width='100%' height='100%' onClose={closePane}>
            <Tags
              showAddTag={false}
              updateTags={updateTags}
              disableDel={true}
            />
            <ImgSection>
              {imgs.map((e) => (
                <ImgWrap key={e.name}>
                  <ImgInnerContainer checked={e.selected}>
                    <ImgInner checked={e.selected}>
                      <ImgFromUrl
                        opts={[]}
                        tags={e.tags}
                        url={e.name}
                        dimension={e.dimension}
                        hideTags={true}
                        hideDel={true}
                        selectCb={selectCbFn}
                        hideSelect={true}
                      />
                    </ImgInner>
                  </ImgInnerContainer>
                  <Select>
                    <input
                      type='checkbox'
                      checked={e.selected}
                      onChange={(ev) => selectCbFn(e.name, ev.target.checked)}
                    />
                  </Select>
                </ImgWrap>
              ))}
            </ImgSection>
            <OpSection>
              <button onClick={toggleSelectAll}>Select All</button>
              <button onClick={applySelected}>Apply</button>
            </OpSection>
          </Pane>
        </PaneWrap>
      ) : null}
    </Wrap>
  )
}

function SelectPane() {}
