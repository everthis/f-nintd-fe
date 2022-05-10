import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const PerRemote = styled.div``

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

export function ImgFromUrl({ url, opts, tags: defaultTags }) {
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
  //   fetch('http://192.168.2.114:8087/images/update', {
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
    fetch('http://192.168.2.114:8087/image_tag_relation/add', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((d) => d.text())
  }
  function ListObjects() {
    fetch('http://192.168.2.114:8087/images/list', {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((arr) => {
        setRemoteList(arr)
      })
  }
  function delRemote(url) {
    const obj = { url }
    fetch('http://192.168.2.114:8087/images/del', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((d) => d.text())
      .then((d) => ListObjects())
  }

  const ph = 'Select tags'

  return (
    <PerRemote>
      <div>
        <img src={url} alt='preview image' />
      </div>
      <div>
        <button onClick={() => delRemote(url)}>delete Remote</button>
        {/* <input value={tags} onChange={onChangeFn} /> */}
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
        {/* <button onClick={updateTags}>Update</button> */}
      </div>
    </PerRemote>
  )
}

function Tag({ name, image }) {
  function delTag() {
    const obj = {
      tag: name,
      image,
    }
    fetch('http://192.168.2.114:8087/image_tag_relation/del', {
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
