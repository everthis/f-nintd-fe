import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const TagsWrap = styled.div`
  user-select: none;
`
const TagWrap = styled.span`
  margin-right: 10px;
  border: 1px solid #333;
  padding: 0;
  display: inline-block;
`
const TagName = styled.span`
  cursor: pointer;
  display: inline-block;
  padding: 1px 5px;
  ${({ selected }) => {
    return `background-color: ${selected ? '#fbf12b' : 'white'};`
  }}
`
const DelTag = styled.span`
  padding: 1px 5px;
  margin: 0;
  cursor: pointer;
  background-color: #333;
  color: #fff;
`
export function Tags({ updateTags = () => {}, showAddTag = true }) {
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  function listTags() {
    fetch('http://192.168.2.114:8087/images/tags', {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((arr) => {
        arr = arr.map((e) => ({ name: e, selected: false }))
        setTags(arr)
        updateTags(arr)
      })
  }

  function buildTagItem() {}

  useEffect(() => {
    listTags()
  }, [])

  function toggleSelect(name) {
    const t = tags.find((e) => e.name === name)
    if (t) {
      const clone = tags.slice(0)
      t.selected = !t.selected
      setTags(clone)
      updateTags(clone)
    }
  }

  const tagsRes = tags.map((e) => (
    <Tag
      toggleSelect={toggleSelect}
      name={e.name}
      key={e.name}
      selected={e.selected}
    />
  ))

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
      {showAddTag ? (
        <>
          <input value={newTag} onChange={newTagOnChange} />
          <button onClick={addTag}>Add Tag</button>
        </>
      ) : null}
    </TagsWrap>
  )
}

function Tag({ name, selected, toggleSelect }) {
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
      <TagName selected={selected} onClick={() => toggleSelect(name)}>
        {name}
      </TagName>
      <DelTag onClick={delTag}>x</DelTag>
    </TagWrap>
  )
}
