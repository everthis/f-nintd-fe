import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import Image from './articleImg'
import { API_ORIGIN } from './constant'

const Margin = styled.div`
  margin: 6em 0;
`
const ArticleItem = styled.div`
  cursor: pointer;
`
const ArticleItemContent = styled.span`
  border: 1px solid #333;
`
const DeleteIcon = styled.span`
  color: #fff;
  background-color: #000;
  padding: 0 0.5em;
  margin: 0;
`
function ListItem({ payload, onClick }) {
  const { title, id } = payload
  const deleteItem = () => {
    const obj = {
      id,
    }
    fetch(`${API_ORIGIN}/article/del`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((d) => d.text())
  }
  return (
    <ArticleItem>
      <ArticleItemContent onClick={onClick}>{title}</ArticleItemContent>
      <DeleteIcon onClick={deleteItem}>X</DeleteIcon>
    </ArticleItem>
  )
}
export function Article(props) {
  const [list, setList] = useState([])
  const [content, setContent] = useState({})
  useEffect(() => {
    fetch(`${API_ORIGIN}/articles/list`, {})
      .then((d) => d.json())
      .then((d) => {
        setList(d)
      })
  }, [])

  return (
    <Margin>
      <div>
        {list.map((e) => (
          <ListItem key={e.path} payload={e} onClick={() => setContent(e)} />
        ))}
      </div>
      <Image title={content.title ?? ''} images={content.content || []} />
    </Margin>
  )
}
