import React, { useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'

import { Pane } from './pane'
import { Tags, TagsWrap, formatter as tagsFormatter } from './tag'
import { ImgFromUrl, ImgFromUrlWrap } from './image'
import { API_ORIGIN, EMPTY_ARR, TYPE } from './constant'
import { useQuery, useChecked, usePostData } from './hooks'
import { AudioStateLess } from './audio'
import { Btn, Button } from './btn'

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
  overflow-x: hidden;
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
  user-select: none;
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
  background-color: ${({ checked }) => (checked ? 'red' : 'transparent')};
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
  user-select: none;
`

const AudioSection = styled.div`
  position: relative;
`

const qsOfTags = (set = new Set()) =>
  Array.from(set)
    .map((e) => encodeURIComponent(e.name))
    .join(',')
/*
const formatter = (arr) => {
  arr.forEach((e) => {
    e.tags = e.tags.map((e) => ({ name: e, selected: false }))
    e.selected = false
  })
  return arr
}
*/
export function AssetGridPane({
  showPane,
  setShowPane,
  onConfirm,
  showActions = true,
  singleSelect = false,
  alreadySelectedSet = new Set(),
}) {
  const [selectedTags, setSelectedTags] = useState(new Set())
  const [type, setType] = useState(TYPE.IMAGE)
  const [selectedAudio, setSelectedAudio] = useState(new Map())
  const [showOptsPane, setShowOptsPane] = useState(false)
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [activeItem, setActiveItem] = useState(null)
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

  const { chkExists } = useChecked(alreadySelectedSet)

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

  function toggleOpts(ev, item) {
    const val = !showOptsPane
    setShowOptsPane(val)
    if (val) {
      setActiveItem(item)
    } else {
      setActiveItem(null)
    }
  }

  function updateCb() {
    queryByTags()
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
              type='radio'
              name='queryType'
              value={TYPE.IMG}
              checked={type === TYPE.IMG}
              onChange={onTypeChange}
              disabled={fetching}
            />
            image
          </label>
          <label>
            <input
              type='radio'
              name='queryType'
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
                  <ImgInnerContainer checked={chkExists(e)}>
                    <ImgMidContainer checked={chkExists(e)}>
                      <ImgInner checked={chkExists(e)}>
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
                          toggleOpts={toggleOpts}
                        />
                      </ImgInner>
                    </ImgMidContainer>
                  </ImgInnerContainer>
                  {showActions && (
                    <Select>
                      {singleSelect ? (
                        <input
                          type='radio'
                          value={e.name}
                          name='radio'
                          checked={chkExists(e)}
                          onChange={(ev) =>
                            selectCbFn(e, ev.target.checked, true)
                          }
                        />
                      ) : (
                        <input
                          type='checkbox'
                          checked={chkExists(e)}
                          disabled={chkExists(e)}
                          onChange={(ev) => selectCbFn(e, ev.target.checked)}
                        />
                      )}
                    </Select>
                  )}
                </ImgWrap>
              ))}
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
                selectedItems={alreadySelectedSet}
              />
            )}
          </AudioSection>
        ) : null}

        <Opts
          show={showOptsPane}
          toggleDisplay={toggleOpts}
          type={type}
          id={activeItem?.id}
          updateCb={updateCb}
        />
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

const OptsBg = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: var(--color);
  opacity: 0;
  transition: transform 0.05s cubic-bezier(0.93, 0.24, 0.84, 0.59);
  will-change: transform, opacity;
  transform: translateX(100%);
  &.slide-in {
    transform: translateX(0);
    opacity: 0.5;
  }
  &.slide-out {
    transform: translateX(100%);
    opacity: 0;
  }
`
const OptsContent = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 40%;
  padding: 0.3rem;
  max-width: 900px;
  background-color: var(--bg-color);
  transition: transform 0.2s cubic-bezier(0.6, 0.8, 0.99, 0.8);
  will-change: transform;
  transform: translateX(100%);
  overflow-y: scroll;
  user-select: none;
  &.slide-in {
    transform: translateX(0);
  }
  &.slide-out {
    transform: translateX(100%);
  }
  ${TagsWrap} {
    flex: 1;
  }
  ${Button} {
    flex-grow: 0;
  }
`

function Opts({ show, toggleDisplay, type, id, updateCb }) {
  const ref = useRef()
  const bgRef = useRef()
  const [selectedTags, setSelectedTags] = useState(new Set())

  const shouldFetch = () => type != null && id != null
  const {
    data: imgData,
    loading,
    queryData: fetchRelation,
  } = useQuery({
    url: `${API_ORIGIN}/${type}TagRelation/${type}/${id}`,
    shouldFetch,
  })
  const { data: tags = EMPTY_ARR, loading: tagsLoading } = useQuery({
    url: `${API_ORIGIN}/tags`,
    shouldFetch,
  })

  const { loading: deleteItemInProgress, postData: execDeleteItem } =
    usePostData()
  const { loading: updateTagsInProgress, postData: execUpdateTag } =
    usePostData()

  useEffect(() => {
    if (ref.current == null) return
    if (show) {
      ref.current.classList.remove('slide-out')
      ref.current.classList.add('slide-in')
      bgRef.current.classList.remove('slide-out')
      bgRef.current.classList.add('slide-in')
    } else {
      ref.current.classList.remove('slide-in')
      ref.current.classList.add('slide-out')
      bgRef.current.classList.remove('slide-in')
      bgRef.current.classList.add('slide-out')
    }
  }, [show])

  useEffect(() => {
    if (tags.length && imgData) {
      const set = new Set()
      for (const t of imgData.tags) {
        set.add(t.id)
      }
      const res = new Set()
      for (const t of tags) {
        if (set.has(t.id)) res.add(t)
      }
      setSelectedTags(res)
    }
  }, [tags, imgData])

  const toggleTag = (item, selected) => {
    execUpdateTag({
      url: `${API_ORIGIN}/${type}TagRelation/${id}/${item.id}`,
      method: selected ? 'POST' : 'DELETE',
    }).then(() => {
      fetchRelation()
      updateCb()
    })
  }

  const deleteItem = () => {
    execDeleteItem({
      url: `${API_ORIGIN}/${type}/${id}`,
      method: 'DELETE',
    }).then(() => {
      updateCb()
      toggleDisplay()
    })
  }

  return (
    <>
      <OptsBg ref={bgRef} onClick={toggleDisplay}></OptsBg>
      <OptsContent ref={ref}>
        <ImgFromUrlWrap data={imgData} loading={loading} />
        <Tags
          tags={tags}
          showAddTag={false}
          toggleTag={toggleTag}
          disableDel={true}
          loading={tagsLoading}
          selectedTags={selectedTags}
        />
        <Btn type='block' onClick={deleteItem} style={{ padding: '.5rem' }}>
          Delete
        </Btn>
      </OptsContent>
    </>
  )
}
