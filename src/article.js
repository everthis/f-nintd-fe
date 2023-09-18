import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Link, redirect, useNavigate } from 'react-router-dom'

import Image from './articleImg'
import { API_ORIGIN } from './constant'

const Margin = styled.div`
  margin: 1em 0;
`
const ArticleItem = styled.div`
  position: relative;
  & + & {
    margin-top: 0.6em;
  }
`
const ArticleItemContent = styled.div`
  border: 1px solid #333;
  padding: 0 0.5em;
`
const DeleteIcon = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
  color: #beb1b1;
  background-color: var(--bg-color);
  padding: 0 0.5em;
  margin: 0;
  border: 1px solid #000;
  &:hover {
    color: #fff;
  }
`
function ListItem({
  payload,
  onClick,
  onDelete,
  styles = { maxWidth: '400px' },
}) {
  const { title, id, cover } = payload
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
    })
      .then((d) => d.text())
      .then((d) => onDelete())
  }
  return (
    <ArticleItem style={styles}>
      <ArticleItemContent onClick={onClick}>
        <img src={cover} loading="lazy" />
        <Link to={`/article/${id}`} target="_blank" rel="noopener noreferrer">
          {title}
        </Link>
      </ArticleItemContent>
      <DeleteIcon onClick={deleteItem}>X</DeleteIcon>
    </ArticleItem>
  )
}
export function Article(props) {
  const [list, setList] = useState([])
  const [content, setContent] = useState({})
  const navigate = useNavigate()

  const getArticleList = () => {
    fetch(`${API_ORIGIN}/article_list_with_cover`, {})
      .then((d) => d.json())
      .then((d) => {
        setList(d)
      })
  }

  const itemDelCb = () => {
    getArticleList()
    setContent({})
  }
  const articleClickCb = (e) => {
    // navigate(`/article/${e.id}`)
  }
  useEffect(() => {
    getArticleList()
  }, [])
  return (
    <Margin>
      <div>
        {list.map((e) => (
          <ListItem
            key={e.path}
            payload={e}
            onDelete={itemDelCb}
            onClick={() => articleClickCb(e)}
          />
        ))}
      </div>
      <Image title={content.title ?? ''} images={content.body || []} />
    </Margin>
  )
}
