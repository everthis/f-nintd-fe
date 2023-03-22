import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { Nav } from './nav'
import { API_ORIGIN } from './constant'
import Image from './articleImg'

const Center = styled.div`
  text-align: center;
`

const ArticleTitle = styled.h1``
const ArticleContent = styled.section`
  max-width: 900px;
  margin: 0 auto;
`

export function Preview({}) {
  const { id } = useParams()

  const [article, setArticle] = useState({
    title: '',
    content: [],
  })

  const getArticle = (id) => {
    fetch(`${API_ORIGIN}/article/${id}`, {})
      .then((d) => d.json())
      .then((d) => {
        setArticle(d)
      })
  }

  useEffect(() => {
    getArticle(id)
  }, [id])

  const { title, content } = article
  return (
    <Center>
      <Nav />
      <ArticleTitle>{title}</ArticleTitle>
      <ArticleContent>
        <Image images={content?.body || []} />
      </ArticleContent>
    </Center>
  )
}
