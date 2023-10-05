import React, { useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'

import { Pane } from './pane'
import { Tags, formatter as tagsFormatter } from './tag'
import { ImgFromUrl } from './image'
import { API_ORIGIN, TYPE } from './constant'
import { useQuery } from './hooks'
import { downloadAndCreateHash } from './utils'
import { AudioStateLess } from './audio'

const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  > div {
    flex-grow: 0;
    position: sticky;
    background-color: var(--bg-color);
    z-index: 1;
    margin-top: 0;
    padding-top: 0.5em;
  }
  > div:first-child {
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
  margin-bottom: .5rem;
`

const AudioSection = styled.div``

const qsOfTags = (arr = []) =>
  arr
    .filter((e) => e.selected)
    .map((e) => e.name)
    .join(',')
const formatter = (arr) => {
  arr.forEach((e) => {
    e.tags = e.tags.map((e) => ({ name: e, selected: false }))
    e.selected = false
  })
  return arr
}
export function ImageGridPane({
  showPane,
  setShowPane,
  onConfirm,
  showActions = true,
  singleSelect = false,
  disabledSet = new Set(),
}) {
  const [tags, setTags] = useState([])
  const [imgs, setImgs] = useState([])
  const [audios, setAudios] = useState([])
  const [type, setType] = useState(TYPE.IMG)
  const [selectedAudio, setSelectedAudio] = useState(new Map())
  const {
    data: tagsData,
    loading: tagsLoading,
    queryData,
  } = useQuery({ url: `${API_ORIGIN}/tags`, formatter: tagsFormatter })
  const fetchImgParams = useMemo(
    () => (tags && tags.length ? { tags: qsOfTags(tags) } : undefined),
    [tags]
  )
  const {
    data,
    loading: fetching,
    queryData: queryByTags,
  } = useQuery({
    url: `${API_ORIGIN}/${type}/byTags`,
    params: fetchImgParams,
    formatter,
    // shouldFetch: (_, params) => params.tags.length > 0,
  })

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
    const res = []
    const resImgs = imgsArr.map((e) => {
      e.type = TYPE.IMG
      e.val = e.name
      e.dimension = e.dimension
      return e
    })
    const resAudio = []
    for (const e of selectedAudio.values()) {
      resAudio.push({
        id: e.id,
        type: TYPE.AUDIO,
        url: e.url,
        name: e.name,
      })
    }

    res.push(...resImgs, ...resAudio)
    onConfirm(res)
  }

  function toggleSelectAll() {
    if (type === TYPE.IMG) {
      const clone = imgs.slice(0)
      const allChecked = imgs.filter((e) => e.selected).length === imgs.length
      clone.forEach((e) => (e.selected = allChecked ? false : true))
      setImgs(clone)
    } else if (type === TYPE.AUDIO) {
    }
  }

  function toggleTag(name, selected) {
    const clone = tags.slice()
    for (const e of clone) {
      if (e.name === name) e.selected = selected
    }
    setTags(clone)
  }

  useEffect(() => {
    if (showPane === false) {
      setTags([])
    }
  }, [showPane])
  useEffect(() => {
    if (!tagsLoading) {
      setTags(tagsData)
    }
  }, [tagsLoading])

  useEffect(() => {
    if (data && type === TYPE.IMG) {
      setImgs(data)
      setAudios([])
    }
    if (data && type === TYPE.AUDIO) {
      setImgs([])
      setAudios(data)
    }
  }, [data])

  useEffect(() => {
    if (fetching) setSelectedAudio(new Set())
  }, [fetching])

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
    for (const e of audios) {
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

  return showPane ? (
    <Wrap>
      <Tags
        tags={tags}
        showAddTag={false}
        toggleTag={toggleTag}
        disableDel={true}
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
      {type === TYPE.IMG ? (
        <ImgSection>
          {fetching ? (
            <Status>
              <b>loading</b>
            </Status>
          ) : null}
          {!fetching &&
            imgs.map((e) => (
              <ImgWrap key={e.name}>
                <ImgInnerContainer checked={e.selected}>
                  <ImgMidContainer checked={disabledSet.has(e.name)}>
                    <ImgInner checked={e.selected || disabledSet.has(e.name)}>
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
                  </ImgMidContainer>
                </ImgInnerContainer>
                {showActions && (
                  <Select>
                    {singleSelect ? (
                      <input
                        type='radio'
                        value={e.name}
                        name='radio'
                        checked={e.selected}
                        onChange={(ev) =>
                          selectCbFn(e.name, ev.target.checked, true)
                        }
                      />
                    ) : (
                      <input
                        type='checkbox'
                        checked={e.selected}
                        disabled={disabledSet.has(e.name)}
                        onChange={(ev) => selectCbFn(e.name, ev.target.checked)}
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
              list={audios}
              onSelectChange={showActions ? onAudioSelectChange : null}
            />
          )}
        </AudioSection>
      ) : null}
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
