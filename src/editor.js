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
  padding: 5px;
  img {
    width: 100%;
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

const Section = styled.section``
const ImgSection = styled.section`
  padding: 5px 0;
  display: flex;
  flex-wrap: wrap;
`
const ImgWrap = styled.span`
  display: inline-block;
  padding: 3px;
  width: 20%;
  transition: transform 0.135s cubic-bezier(0, 0, 0.2, 1);
  transform: ${({ checked }) =>
    checked
      ? 'translateZ(0px) scale3d(0.89, 0.91, 1)'
      : 'translateZ(0px) scale3d(1, 1, 1)'};
`

const Op = styled.div`
  position: absolute;
  bottom: 0;
`

export function Editor({ imgList }) {
  const ref = useRef(null)
  const arr = Array.from(imgList)
  const [title, setTitle] = useState('')
  const [showPane, setShowPane] = useState(false)
  const [imgs, setImgs] = useState([])

  const preview = () => {}
  const save = () => {}
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
  console.log(imgs)

  return (
    <Wrap>
      <EditorWrap>
        <TitleRow>
          <input value={title} onChange={setTitle} />
        </TitleRow>
        {arr.map((e) => (
          <Section key={e.val}>
            {e.type === 'img' ? <img src={e.val} /> : null}
            {e.type === 'text' ? <p>{e.val}</p> : null}
          </Section>
        ))}
        <p>
          <button onClick={addImageToTheEnd}>Add Image</button>
        </p>
        <Op>
          <button onClick={preview}>Preview</button>
          <button onClick={save}>Save</button>
        </Op>
      </EditorWrap>
      {showPane ? (
        <PaneWrap>
          <Pane width='100%' height='100%' onClose={closePane}>
            <Tags showAddTag={false} updateTags={updateTags} />
            <ImgSection>
              {imgs.map((e) => (
                <ImgWrap key={e.name} checked={e.selected}>
                  <ImgFromUrl
                    opts={[]}
                    tags={e.tags}
                    url={e.name}
                    dimension={e.dimension}
                    hideTags={true}
                    hideDel={true}
                    selectCb={selectCbFn}
                  />
                </ImgWrap>
              ))}
            </ImgSection>
          </Pane>
        </PaneWrap>
      ) : null}
    </Wrap>
  )
}

function SelectPane() {}
