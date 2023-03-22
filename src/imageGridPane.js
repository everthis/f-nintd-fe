import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { Pane } from './pane'
import { Tags } from './tag'
import { ImgFromUrl } from './image'
import { API_ORIGIN } from './constant'

const Wrap = styled.div`
  position: relative;
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

const ImgSection = styled.section`
  padding: 5px 0;
  display: flex;
  flex-wrap: wrap;
`
const OpSection = styled.div``

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

export function ImageGridPane({
  showPane,
  setShowPane,
  onConfirm,
  showActions = true,
  singleSelect = false,
}) {
  const [imgs, setImgs] = useState([])
  const [tags, setTags] = useState([])

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
  function updateTags(v) {
    setTags(v)
    const arr = v.filter((e) => e.selected).map((e) => e.name)
    if (arr.length) {
      queryByTags(arr.join(','))
    } else {
      setImgs([])
    }
  }

  function selectCbFn(url, bool, isSingleSelect) {
    const clone = [...imgs]
    if (isSingleSelect) {
      for (const e of clone) {
        if (e.name === url) {
          e.selected = bool
        } else e.selected = false
      }
      setImgs(clone)
      return
    }
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
    onConfirm(res)
  }

  function toggleSelectAll() {
    const clone = imgs.slice(0)
    const allChecked = imgs.filter((e) => e.selected).length === imgs.length
    clone.forEach((e) => (e.selected = allChecked ? false : true))
    setImgs(clone)
  }

  return showPane ? (
    <Wrap>
      <Tags
        tags={tags}
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
            {showActions && (
              <Select>
                {singleSelect ? (
                  <input
                    type="radio"
                    value={e.name}
                    name="radio"
                    checked={e.selected}
                    onChange={(ev) =>
                      selectCbFn(e.name, ev.target.checked, true)
                    }
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={e.selected}
                    onChange={(ev) => selectCbFn(e.name, ev.target.checked)}
                  />
                )}
              </Select>
            )}
          </ImgWrap>
        ))}
      </ImgSection>
      {showActions && (
        <OpSection>
          {singleSelect ? null : (
            <button onClick={toggleSelectAll}>Select All</button>
          )}
          <button onClick={applySelected}>Apply</button>
        </OpSection>
      )}
    </Wrap>
  ) : null
}
