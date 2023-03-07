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
function ListItem({ payload, onClick }) {
  const { title } = payload
  return <ArticleItem onClick={onClick}>{title}</ArticleItem>
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
