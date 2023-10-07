import React, { useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'

import { Pane } from './pane'
import { Tags, formatter as tagsFormatter } from './tag'
import { ImgFromUrl } from './image'
import { API_ORIGIN, EMPTY_ARR, TYPE } from './constant'
import { useQuery } from './hooks'
import { downloadAndCreateHash } from './utils'
import { AudioStateLess } from './audio'

const StickyWrap = styled.div``
const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  > ${StickyWrap} {
    flex-grow: 0;
    position: sticky;
    background-color: var(--bg-color);
    z-index: 1;
    margin-top: 0;
    padding-top: 0.5em;
  }
  > ${StickyWrap}:first-child {
    top: 0;
  }
  > div:last-child {
    bottom: 0;
    padding-bottom: 0.5em;
  }
  > section {
    flex: 1;
  }
`
const ContentWrap = styled.div`
  flex: 1;
  overflow-y: scroll;
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
  position: relative;
`
const OpSection = styled.div`
  padding-top: 1rem;
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
const ImgMidContainer = styled.div`
  background-color: ${({ checked }) => (checked ? '#d6c0c0' : 'transparent')};
`
const ImgInner = styled.div`
  transition: transform 0.135s cubic-bezier(0, 0, 0.2, 1);
  transform: ${({ checked }) =>
    checked
      ? 'translateZ(0px) scale3d(0.89, 0.91, 1)'
      : 'translateZ(0px) scale3d(1, 1, 1)'};
`
const Status = styled.span`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--bg-color);
  z-index: 1;
`
const TypeSelectionWrap = styled.div`
  margin-bottom: 0.5rem;
`

const AudioSection = styled.div`
  position: relative;
`

const qsOfTags = (set = new Set()) =>
  Array.from(set)
    .map((e) => encodeURIComponent(e.name))
    .join(',')
const formatter = (arr) => {
  arr.forEach((e) => {
    e.tags = e.tags.map((e) => ({ name: e, selected: false }))
    e.selected = false
  })
  return arr
}
export function AssetGridPane({
  showPane,
  setShowPane,
  onConfirm,
  showActions = true,
  singleSelect = false,
  disabledSet = new Set(),
}) {
  const [selectedTags, setSelectedTags] = useState(new Set())
  const [type, setType] = useState(TYPE.IMG)
  const [selectedAudio, setSelectedAudio] = useState(new Map())
  const [showOptsPane, setShowOptsPane] = useState(false)
  const [selectedItems, setSelectedItems] = useState(new Set())
  const {
    data: tags = EMPTY_ARR,
    loading: tagsLoading,
    queryData,
  } = useQuery({ url: `${API_ORIGIN}/tags` })
  const fetchImgParams = useMemo(
    () => (selectedTags.size ? { tags: qsOfTags(selectedTags) } : undefined),
    [selectedTags]
  )
  const {
    data: items = EMPTY_ARR,
    loading: fetching,
    queryData: queryByTags,
  } = useQuery({
    url: `${API_ORIGIN}/${type}/byTags`,
    params: fetchImgParams,
    // formatter,
    // shouldFetch: (_, params) => params.tags.length > 0,
  })

  // const closePane = () => {
  //   setTags([])
  //   setImgs([])

  //   setShowPane(false)
  // }

  // function setRemoteListFn(arr) {
  //   arr.forEach((e) => {
  //     e.tags = e.tags.map((e) => ({ name: e, selected: false }))
  //     e.selected = false
  //   })
  //   setImgs(arr)
  // }

  function selectCbFn(item, bool, isSingleSelect) {
    const clone = new Set(selectedItems)
    if (bool) {
      if (!clone.has(item)) {
        if (isSingleSelect) clone.clear()
        clone.add(item)
      }
    } else {
      if (clone.has(item)) clone.delete(item)
    }
    setSelectedItems(clone)
    // const clone = [...imgs]
    // if (isSingleSelect) {
    //   for (const e of clone) {
    //     if (e.name === url) {
    //       e.selected = bool
    //     } else e.selected = false
    //   }
    //   setImgs(clone)
    //   return
    // }
    // for (const e of clone) {
    //   if (e.name === url) {
    //     e.selected = bool
    //     break
    //   }
    // }
    // setImgs(clone)
  }

  function applySelected() {
    onConfirm(Array.from(selectedItems))
  }
  // function applySelected() {
  //   const imgsArr = imgs.filter((e) => e.selected)
  //   const res = []
  //   const resImgs = imgsArr.map((e) => {
  //     e.type = TYPE.IMG
  //     e.val = e.name
  //     e.dimension = e.dimension
  //     return e
  //   })
  //   const resAudio = []
  //   for (const e of selectedAudio.values()) {
  //     resAudio.push({
  //       id: e.id,
  //       type: TYPE.AUDIO,
  //       url: e.url,
  //       name: e.name,
  //     })
  //   }

  //   res.push(...resImgs, ...resAudio)
  //   onConfirm(res)
  // }

  function isAllSelected() {
    return items.every((e) => selectedItems.has(e))
  }
  function toggleSelectAll() {
    if (!isAllSelected()) {
      const newSet = new Set()
      for (const e of items) {
        newSet.add(e)
      }
      setSelectedItems(newSet)
    } else {
      setSelectedItems(new Set())
    }
  }
  // function toggleSelectAll() {
  //   if (type === TYPE.IMG) {
  //     const clone = imgs.slice(0)
  //     const allChecked = imgs.filter((e) => e.selected).length === imgs.length
  //     clone.forEach((e) => (e.selected = allChecked ? false : true))
  //     setImgs(clone)
  //   } else if (type === TYPE.AUDIO) {
  //   }
  // }

  function toggleTag(item, selected) {
    const clone = new Set(selectedTags)
    if (selected) {
      if (!clone.has(item)) clone.add(item)
    } else {
      if (clone.has(item)) clone.delete(item)
    }
    setSelectedTags(clone)
    // const clone = tags.slice()
    // for (const e of clone) {
    //   if (e.name === name) e.selected = selected
    // }
    // setTags(clone)
  }

  // useEffect(() => {
  //   if (data && type === TYPE.IMG) {
  //     setImgs(data)
  //     setAudios([])
  //   }
  //   if (data && type === TYPE.AUDIO) {
  //     setImgs([])
  //     setAudios(data)
  //   }
  // }, [data])

  // useEffect(() => {
  //   if (fetching) setSelectedAudio(new Set())
  // }, [fetching])

  // async function chkDup() {
  //   const hash = {}
  //   for (const e of imgs) {
  //     const h = await downloadAndCreateHash(e.name)
  //     if (hash[h] == null) hash[h] = 0
  //     hash[h]++
  //   }

  //   console.log(hash)
  //   console.log(Object.keys(hash).length, imgs.length)
  // }
  // chkDup()

  function onTypeChange(ev) {
    setType(ev.target.value)
  }

  function findAudioById(id) {
    for (const e of items) {
      if (e.id === id) return e
    }
  }

  function onAudioSelectChange(ev) {
    const { value, checked } = ev.target
    const clone = new Map(selectedAudio)
    const id = +value
    if (checked) {
      clone.set(id, findAudioById(id))
    } else clone.delete(id)
    setSelectedAudio(clone)
  }

  function validImgFormat(arr) {
    if (arr.length === 0 || arr[0].type !== TYPE.IMG) return false
    return true
  }

  return showPane ? (
    <Wrap>
      <StickyWrap>
        <Tags
          tags={tags}
          showAddTag={false}
          toggleTag={toggleTag}
          disableDel={true}
          loading={tagsLoading}
          selectedTags={selectedTags}
        />
        <TypeSelectionWrap>
          <b>Type:</b>
          <label>
            <input
              type="radio"
              name="queryType"
              value={TYPE.IMG}
              checked={type === TYPE.IMG}
              onChange={onTypeChange}
              disabled={fetching}
            />
            image
          </label>
          <label>
            <input
              type="radio"
              name="queryType"
              value={TYPE.AUDIO}
              checked={type === TYPE.AUDIO}
              onChange={onTypeChange}
              disabled={fetching}
            />
            audio
          </label>
        </TypeSelectionWrap>
      </StickyWrap>
      <ContentWrap>
        {type === TYPE.IMG ? (
          <ImgSection>
            {fetching ? (
              <Status>
                <b>loading</b>
              </Status>
            ) : null}
            {!fetching &&
              validImgFormat(items) &&
              items.map((e) => (
                <ImgWrap key={e.name}>
                  <ImgInnerContainer checked={e.selected}>
                    <ImgMidContainer checked={disabledSet.has(e.name)}>
                      <ImgInner checked={e.selected || disabledSet.has(e.name)}>
                        <ImgFromUrl
                          opts={[]}
                          data={e}
                          tags={e.tags}
                          url={e.name}
                          dimension={e.dimension}
                          hideTags={true}
                          hideDel={true}
                          selectCb={selectCbFn}
                          hideSelect={true}
                        />
                      </ImgInner>
                    </ImgMidContainer>
                  </ImgInnerContainer>
                  {showActions && (
                    <Select>
                      {singleSelect ? (
                        <input
                          type="radio"
                          value={e.name}
                          name="radio"
                          checked={selectedItems.has(e)}
                          onChange={(ev) =>
                            selectCbFn(e, ev.target.checked, true)
                          }
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={selectedItems.has(e)}
                          disabled={disabledSet.has(e)}
                          onChange={(ev) => selectCbFn(e, ev.target.checked)}
                        />
                      )}
                    </Select>
                  )}
                </ImgWrap>
              ))}
            {showOptsPane ? <p>ops</p> : null}
          </ImgSection>
        ) : null}
        {type === TYPE.AUDIO ? (
          <AudioSection>
            {fetching ? (
              <Status>
                <b>loading</b>
              </Status>
            ) : null}
            {!fetching && (
              <AudioStateLess
                list={items}
                onSelectChange={showActions ? selectCbFn : null}
                selectedItems={selectedItems}
              />
            )}
          </AudioSection>
        ) : null}
      </ContentWrap>
      {showActions && (
        <OpSection>
          {singleSelect ? null : (
            <button onClick={toggleSelectAll}>Toggle Select All</button>
          )}
          <button onClick={applySelected}>Apply</button>
        </OpSection>
      )}
    </Wrap>
  ) : null
}
