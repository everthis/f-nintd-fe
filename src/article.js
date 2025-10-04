import React, { useState, useEffect, useRef } from 'react'
import styled, {css} from 'styled-components'
import { Link, redirect, useNavigate } from 'react-router-dom'

import Image from './articleImg'
import { API_ORIGIN } from './constant'
import { EditIcon, DeleteIcon, MigrateIcon } from './icon'
import { ImgComp } from './image'
import { useQuery, usePostData } from './hooks'

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
  padding: 0.2em 0.5em;
  flex: 1;
`
const OpWrap = styled.span`
  flex-grow: 0;
  display: flex;
  align-items: center;
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

const VerticalLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`
const secStyle = css`
  padding: 0.5em;
  border: 1px solid #ddd;
`
const StatusWrap = styled.div`
  ${secStyle}
`
const VisibilityWrap = styled.div`
  ${secStyle}
`

function ListItem({
  payload,
  onClick,
  onDelete,
  onUpdate,
  idx,
  styles = { maxWidth: '800px' },
}) {
  const { title, id, cover, status, visibility } = payload
  const { loading, postData } = usePostData()
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
  const migrateItem = (ev) => {
    postData({ url: `${API_ORIGIN}/article/migrate/${id}`, method: 'PATCH' })
      .then(() => alert('ok'))
      .catch(() => alert('err'))
  }
  const handleStatusChange = (ev) => {
    const { checked, value } = ev.target
    const obj = { status: +value }
    fetch(`${API_ORIGIN}/article/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((d) => d.text())
      .then((d) => {
        const clone = { ...payload }
        clone.status = obj.status
        onUpdate(clone)
      })
  }
  const handleVisibilityChange = (ev) => {
    const { checked, value } = ev.target
    const obj = { visibility: +value }
    fetch(`${API_ORIGIN}/article/${id}/visibility`, {
      method: 'PATCH',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((d) => d.text())
      .then((d) => {
        const clone = { ...payload }
        clone.visibility = obj.visibility
        onUpdate(clone)
      })
  }
  const ARTICLE_STATUS = {
    WIP: 0,
    PUBLIC: 1,
  }
  const ARTICLE_VISIBILITY = {
    HIDDEN: 0,
    VISIBLE: 1,
  }

  return (
    <ArticleItem style={styles}>
      <ArticleItemContent onClick={onClick}>
        <ImgComp {...cover} name={cover.name || cover.val} />
        <Link to={`/article/${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
          {title}
        </Link>
      </ArticleItemContent>
      <OpWrap>
        <VerticalLayout>
          <StatusWrap>
            <label>
              <input
                type="radio"
                name={`article_${id}_status`}
                value={ARTICLE_STATUS.WIP}
                checked={status === 0}
                onChange={handleStatusChange}
              />{' '}
              work in progress
            </label>
            <br />
            <label>
              <input
                type="radio"
                name={`article_${id}_status`}
                value={ARTICLE_STATUS.PUBLIC}
                checked={status === 1}
                onChange={handleStatusChange}
              />{' '}
              public
            </label>
          </StatusWrap>
          <VisibilityWrap>
            <label>
              <input
                type="radio"
                name={`article_${id}_visibility`}
                value={ARTICLE_VISIBILITY.HIDDEN}
                checked={visibility === 0}
                onChange={handleVisibilityChange}
              />{' '}
              Hidden from list
            </label>
            <br />
            <label>
              <input
                type="radio"
                name={`article_${id}_visibility`}
                value={ARTICLE_VISIBILITY.VISIBLE}
                checked={visibility === 1}
                onChange={handleVisibilityChange}
              />{' '}
              Visible from list
            </label>
          </VisibilityWrap>
        </VerticalLayout>
        <EditIconWrap onClick={migrateItem}>
          <MigrateIcon />
        </EditIconWrap>
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
  const {
    data = [],
    loading,
    queryData,
  } = useQuery({ url: `${API_ORIGIN}/articleListWithCover?status=1,0` })

  const itemDelCb = () => {
    queryData()
    setContent({})
  }
  const articleClickCb = (e) => {
    // navigate(`/article/${e.id}`)
  }

  const updateItem = (idx, target) => {
    const clone = list.slice()
    clone[idx] = target
    setList(clone)
  }

  useEffect(() => {
    setList(data)
  }, [data])

  return (
    <Margin>
      <div>
        {loading ? 'loading' : null}
        {list.map((e, i) => (
          <ListItem
            key={e.path}
            idx={i}
            payload={e}
            onDelete={itemDelCb}
            onUpdate={(obj) => updateItem(i, obj)}
            onClick={() => articleClickCb(e)}
          />
        ))}
      </div>
      <Image title={content.title ?? ''} images={content.body || []} />
    </Margin>
  )
}
