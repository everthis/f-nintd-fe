import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { API_ORIGIN, TYPE } from './constant'
import Image, { SingleImage } from './articleImg'
import { AudioItem } from './audio'
import { useQuery } from './hooks'

const Center = styled.div`
  text-align: center;
`

const ArticleTitle = styled.h1``
const ArticleContent = styled.section`
  max-width: 900px;
  margin: 0 auto;
`
const defaultPayload = {
  title: '',
  content: {},
}
export function Preview({}) {
  const { id } = useParams()

  // const [article, setArticle] = useState({
  //   title: '',
  //   content: [],
  // })
  const { data: article = defaultPayload, loading } = useQuery({
    url: `${API_ORIGIN}/article/${id}`,
  })

  // const getArticle = (id) => {
  //   fetch(`${API_ORIGIN}/article/${id}`, {})
  //     .then((d) => d.json())
  //     .then((d) => {
  //       setArticle(d)
  //     })
  // }

  // useEffect(() => {
  //   getArticle(id)
  // }, [id])

  const { title, content } = article
  return (
    <Center>
      <ArticleTitle>{loading ? 'Loading' : title}</ArticleTitle>
      <ArticleContent>
        {/* <Image images={content.body || []} /> */}
        {content.body ? <Content list={content.body} /> : null}
      </ArticleContent>
    </Center>
  )
}

function ContentItem({ data }) {
  let Comp = null
  const { type } = data
  switch (type) {
    case TYPE.IMG:
    case 'img':
      Comp = SingleImage
      break
    case TYPE.AUDIO:
      Comp = AudioItem
      break
    default:
  }
  return <Comp data={data} />
}

function Content({ list }) {
  return (
    <>
      {list.map((e, idx) => (
        <ContentItem key={idx} data={e} />
      ))}
    </>
  )
}
