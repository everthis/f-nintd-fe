import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const TagsWrap = styled.div``
const TagWrap = styled.span`
  margin-right: 10px;
`
const DelTag = styled.span`
  padding: 1px 5px;
  cursor: pointer;
  background-color: #333;
  color: #fff;
`
export function Tags({ updateTags }) {
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  function listTags() {
    fetch('http://192.168.2.114:8087/images/tags', {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((arr) => {
        setTags(arr)
        updateTags(arr)
      })
  }

  useEffect(() => {
    listTags()
  }, [])

  const tagsRes = tags.map((e) => <Tag name={e} key={e} />)

  function newTagOnChange(e) {
    setNewTag(e.target.value)
  }

  function addTag() {
    const obj = {
      name: newTag,
    }
    fetch('http://192.168.2.114:8087/tags/new', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((d) => d.text())
      .then((d) => listTags())
  }

  return (
    <TagsWrap>
      <b>Tags: </b>
      {tagsRes}
      <input value={newTag} onChange={newTagOnChange} />
      <button onClick={addTag}>Add Tag</button>
    </TagsWrap>
  )
}

function Tag({ name, selected }) {
  function delTag() {
    const obj = {
      name,
    }
    fetch('http://192.168.2.114:8087/tags/del', {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((d) => d.text())
      .then((d) => listTags())
  }
  return (
    <TagWrap>
      <span>{name}</span>
      <DelTag onClick={delTag}>x</DelTag>
    </TagWrap>
  )
}
