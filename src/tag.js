import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { API_ORIGIN } from './constant'
import { DeleteIcon } from './icon'
import { useQuery } from './hooks'

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
    return `background-color: ${
      selected ? 'var(--bg-active)' : 'var(--bg-color)'
    };
    color: ${selected ? 'var(--active-color)' : 'var(--color)'};
    `
  }}
`
const DelTag = styled.span`
  padding: 1px 5px;
  margin: 0;
  cursor: pointer;
  vertical-align: middle;
  color: #fff;
`

export function AddTag({ addCallback }) {
  const [newTag, setNewTag] = useState('')
  function newTagOnChange(e) {
    setNewTag(e.target.value)
  }

  function addTag(newTag) {
    const obj = {
      name: newTag,
    }
    return fetch(`${API_ORIGIN}/tags/new`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((d) => d.text())
      .then((d) => {
        if (addCallback) addCallback()
        setNewTag('')
      })
  }

  return (
    <>
      <input value={newTag} onChange={newTagOnChange} />
      <button onClick={() => addTag(newTag)}>Add Tag</button>
    </>
  )
}

export function listTags() {
  return fetch(`${API_ORIGIN}/images/tags`, {
    method: 'GET',
  })
    .then((d) => d.json())
    .then((arr) => {
      arr = arr.map((e) => ({ name: e, selected: false }))
      return arr
    })
}

export function Tags({
  tags = [],
  updateTags = () => {},
  showAddTag = true,
  disableDel = false,
  toggleTag = () => {},
}) {
  // const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')

  function buildTagItem() {}

  const queryFormatter = useCallback((d) => {
    const arr = d.map((e) => ({ name: e, selected: false }))
    updateTags(arr)
  }, [])

  const { loading, queryData } = useQuery({
    url: `${API_ORIGIN}/images/tags`,
    formatter: queryFormatter,
  })

  function toggleSelect(name, selected) {
    toggleTag(name, selected)
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
      listTags={queryData}
    />
  ))

  function newTagOnChange(e) {
    setNewTag(e.target.value)
  }

  return (
    <TagsWrap>
      <span>
        <b>Tags: {loading ? 'loading' : ''}</b>
      </span>
      <div>
        {tagsRes}
        {showAddTag ? <AddTag addCallback={queryData} /> : null}
      </div>
    </TagsWrap>
  )
}

function Tag({ name, selected, toggleSelect, disableDel = false, listTags }) {
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
      <TagName
        selected={selected}
        onClick={() => toggleSelect(name, !selected)}
      >
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
