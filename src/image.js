import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { API_ORIGIN } from './constant'

const PerRemote = styled.div`
  position: relative;
  img {
    width: 100%;
  }
`

const Select = styled.span`
  position: absolute;
  top: 0;
  right: 0;
`

const StyledImg = styled.image`
  display: inline-block;
  max-width: 100%;
`
const TagWrap = styled.span`
  margin-right: 10px;
`
const DelTag = styled.span`
  padding: 1px 5px;
  cursor: pointer;
  background-color: #333;
  color: #fff;
`

const ImgWrap = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: ${({ ratio }) => ratio * 100}%;
  img {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
  }
`

export function ImgFromUrl({
  url,
  opts,
  dimension = '',
  tags: defaultTags,
  selectCb = () => {},
  hideTags = false,
  hideDel = false,
  hideSelect = true,
}) {
  const [tags, setTags] = useState(defaultTags || [])
  const options = opts
  const [remoteList, setRemoteList] = useState([])

  // function updateTags() {
  //   const arr = url.split('/')
  //   const name = arr[arr.length - 1]
  //   const tagsArr = tags.split(',')
  //   const tagsObj = {}
  //   for (const e of tagsArr) tagsObj[e] = 1
  //   const obj = { name, tags: tagsObj }
  //   fetch(`${API_ORIGIN}/images/update', {
  //     method: 'POST',
  //     body: JSON.stringify(obj),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   }).then((d) => d.text())
  // }

  useEffect(() => {
    setTags(defaultTags)
  }, [defaultTags])

  function onChangeFn(e) {
    // setTags(e.target.value)
    console.log(e.target.value)
    const val = e.target.value
    if (val === '') return
    const idx = tags.map((e) => e.name).indexOf(val)
    addRelation(val)
    if (idx === -1) {
      tags.push({ name: val, selected: false })
      setTags(tags.slice(0))
    }
  }

  const tagsSet = new Set(tags.map((e) => e.name))
  const arr = options.map((e, i) => {
    if (tagsSet.has(e)) {
      return {
        val: e,
        label: e,
        disabled: true,
      }
    } else {
      return {
        val: e,
        label: e,
        disabled: false,
      }
    }
  })

  function addRelation(tag) {
    const obj = {
      tag,
      image: url,
    }
    fetch(`${API_ORIGIN}/image_tag_relation/add`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((d) => d.text())
  }
  function ListObjects() {
    fetch(`${API_ORIGIN}/images/list`, {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((arr) => {
        setRemoteList(arr)
      })
  }
  function delRemote(url) {
    const obj = { url }
    fetch(`${API_ORIGIN}/images/del`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((d) => d.text())
      .then((d) => ListObjects())
  }

  function selectChange(ev) {
    selectCb(url, ev.target.checked)
  }

  const ph = 'Select tags'
  const [width, height] = (dimension || '').split(',')
  return (
    <PerRemote>
      <div>
        {height ? (
          <RatioImg url={url} width={width} height={height} />
        ) : (
          <img src={url} alt="preview image" />
        )}
      </div>
      <div>
        {hideDel ? null : (
          <button onClick={() => delRemote(url)}>delete Remote</button>
        )}

        {/* <input value={tags} onChange={onChangeFn} /> */}
        {hideTags ? null : (
          <>
            {tags.map((e) => (
              <Tag name={e.name} image={url} key={e.name}>
                {e.name}
              </Tag>
            ))}
            <select value={''} onChange={onChangeFn} placeholder={ph}>
              <option key={''} value={''} disabled>
                Select tags
              </option>
              {arr.map((e) => (
                <option key={e.val} value={e.val} disabled={e.disabled}>
                  {e.label}
                </option>
              ))}
            </select>
          </>
        )}
        {/* <button onClick={updateTags}>Update</button> */}
      </div>
      {hideSelect ? null : (
        <Select>
          <input type='checkbox' onChange={selectChange} />
        </Select>
      )}
    </PerRemote>
  )
}

function RatioImg({ width, height, url }) {
  return (
    <ImgWrap ratio={height / width} url={url}>
      <img src={url} />{' '}
    </ImgWrap>
  )
}

function Tag({ name, image }) {
  function delTag() {
    const obj = {
      tag: name,
      image,
    }
    fetch(`${API_ORIGIN}/image_tag_relation/del`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((d) => d.text())
  }
  return (
    <TagWrap>
      <span>{name}</span>
      <DelTag onClick={delTag}>x</DelTag>
    </TagWrap>
  )
}
