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
const Hint = styled.span`
  font-size: 12px;
`
const Label = styled.div`
  width: 3.3rem;
`
const AddTagPaneWrap = styled.div``

export function AddTag({ addCallback }) {
  const [newTag, setNewTag] = useState('')
  function newTagOnChange(e) {
    setNewTag(e.target.value)
  }

  function addTag(newTag) {
    const obj = {
      name: newTag,
    }
    return fetch(`${API_ORIGIN}/tag/new`, {
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
  showAddTag = true,
  disableDel = false,
  loading = false,
  toggleTag = () => {},
  selectedTags = new Set(),
  deleteCb = () => {},
}) {
  const tagsRes = tags.map((e) => (
    <Tag
      toggleSelect={toggleTag}
      data={e}
      key={e.id}
      disableDel={disableDel}
      selected={selectedTags.has(e)}
      deleteCb={deleteCb}
    />
  ))

  return (
    <TagsWrap>
      <Label>
        <div>
          <b>Tags:</b>
        </div>
        {loading ? <Hint>loading</Hint> : null}
      </Label>
      <div>
        {tagsRes}
        {showAddTag ? <AddTag addCallback={queryData} /> : null}
      </div>
    </TagsWrap>
  )
}

function Tag({ data, selected, toggleSelect, disableDel = false, deleteCb }) {
  const { name, id } = data
  function delTag() {
    const obj = {
      id,
    }
    fetch(`${API_ORIGIN}/tags/del`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((d) => d.text())
      .then((d) => deleteCb())
  }
  return (
    <TagWrap>
      <TagName
        selected={selected}
        onClick={() => toggleSelect(data, !selected)}
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

export const formatter = (arr) => arr.map((e) => ({ name: e, selected: false }))
export function AddTagPane({}) {
  const {
    data: tags,
    loading,
    queryData,
  } = useQuery({ url: `${API_ORIGIN}/tags` })
  const deleteCb = useCallback(() => {
    queryData()
  }, [])
  return (
    <AddTagPaneWrap>
      <AddTag addCallback={queryData} />
      <Tags
        tags={tags}
        loading={loading}
        showAddTag={false}
        deleteCb={deleteCb}
      />
    </AddTagPaneWrap>
  )
}
