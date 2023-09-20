import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Link, redirect, useNavigate } from 'react-router-dom'

import Image from './articleImg'
import { API_ORIGIN } from './constant'
import { EditIcon, DeleteIcon } from './icon'

const Margin = styled.div`
  margin: 1em 0;
`
const ArticleItem = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  & + & {
    margin-top: 0.6em;
  }
`
const ArticleItemContent = styled.div`
  border: 1px solid #333;
  padding: 0 0.5em;
`
const OpWrap = styled.span`
  flex-grow: 0;
  > span {
    margin-left: 0.5rem;
  }
`
const DeleteIconWrap = styled.span`
  cursor: pointer;
  display: inline-block;
  color: #beb1b1;
  background-color: var(--bg-color);
  padding: 0 0.5em;
  margin: 0;
  border: 1px solid #000;
  &:hover {
    color: #fff;
  }
`
const EditIconWrap = styled.span`
  display: inline-block;
  border: 1px solid #000;
`

function ListItem({
  payload,
  onClick,
  onDelete,
  styles = { maxWidth: '800px' },
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
  const editItem = (ev) => {
    ev.target.dispatchEvent(
      new CustomEvent('editArticle', {
        bubbles: true,
        detail: { id },
      })
    )
  }

  return (
    <ArticleItem style={styles}>
      <ArticleItemContent onClick={onClick}>
        <img src={cover} loading="lazy" />
        <Link to={`/article/${id}`} target="_blank" rel="noopener noreferrer">
          {title}
        </Link>
      </ArticleItemContent>
      <OpWrap>
        <EditIconWrap onClick={editItem}>
          <EditIcon />
        </EditIconWrap>
        <DeleteIconWrap onClick={deleteItem}>
          <DeleteIcon />
        </DeleteIconWrap>
      </OpWrap>
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
