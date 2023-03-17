import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { API_ORIGIN } from './constant'
import { DeleteIcon } from './icon'

const TagsWrap = styled.div`
  user-select: none;
  display: flex;
  margin: 0.5em 0 0 0;
`
const TagWrap = styled.span`
  margin-right: 10px;
  border: 1px solid #333;
  padding: 0;
  display: inline-flex;
  margin: 0 0.5em 0.5em 0;
  height: 24px;
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
  vertical-align: middle;
  color: #fff;
`
export function Tags({
  tags = [],
  updateTags = () => {},
  showAddTag = true,
  disableDel = false,
}) {
  // const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  function listTags() {
    fetch(`${API_ORIGIN}/images/tags`, {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((arr) => {
        arr = arr.map((e) => ({ name: e, selected: false }))
        // setTags(arr)
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
      // setTags(clone)
      updateTags(clone)
    }
  }

  const tagsRes = tags.map((e) => (
    <Tag
      toggleSelect={toggleSelect}
      name={e.name}
      key={e.name}
      disableDel={disableDel}
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
    fetch(`${API_ORIGIN}/tags/new`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((d) => d.text())
      .then((d) => {
        listTags()
        setNewTag('')
      })
  }

  return (
    <TagsWrap>
      <span>
        <b>Tags: </b>
      </span>
      <div>
        {tagsRes}
        {showAddTag ? (
          <>
            <input value={newTag} onChange={newTagOnChange} />
            <button onClick={addTag}>Add Tag</button>
          </>
        ) : null}
      </div>
    </TagsWrap>
  )
}

function Tag({ name, selected, toggleSelect, disableDel = false }) {
  function delTag() {
    const obj = {
      name,
    }
    fetch(`${API_ORIGIN}/tags/del`, {
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
      {disableDel ? null : (
        <DelTag onClick={delTag}>
          <DeleteIcon size={'20px'} />
        </DelTag>
      )}
    </TagWrap>
  )
}
