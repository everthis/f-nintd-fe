import React, { useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { API_ORIGIN, TYPE } from './constant'
import Image, { SingleImage } from './articleImg'
import { AudioItem } from './audio'
import { useQuery } from './hooks'
import { PerText } from './text'
import { Btn } from './btn'

const Center = styled.div`
  text-align: center;
`

const ArticleTitle = styled.h1``
const ArticleContent = styled.section`
  max-width: 900px;
  margin: 0 auto;
`
const ActiveMedia = styled.div``
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
        {content.body ? (
          <Content list={content.body} audioOnly={content.audioOnly} />
        ) : null}
      </ArticleContent>
    </Center>
  )
}

function AudioItemWrap(props) {
  return <AudioItem {...props} showWaveformBtn={false} />
}

function ContentItem({ data, controlCollector }) {
  let Comp = null
  const { type } = data
  switch (type) {
    case TYPE.IMG:
    case 'img':
      Comp = SingleImage
      break
    case TYPE.AUDIO:
      Comp = AudioItemWrap
      break
    case TYPE.TEXT:
      Comp = PerText
      break
    default:
  }
  return <Comp data={data} controlCollector={controlCollector} />
}

class DoublyLinkedNode {
  constructor(val) {
    this.prev = null
    this.next = null
    this.val = val
  }
}

class Control {
  constructor() {
    this.idNodeMap = new Map()
    this.root = new DoublyLinkedNode(null)
    this.tail = this.root
    this.cur = this.root
    this.status = 'paused' // paused, playing
  }
  set(id, val) {
    const node = new DoublyLinkedNode(val)
    this.idNodeMap.set(id, node)
    this.tail.next = node
    node.prev = this.tail
    this.tail = node
  }
  next() {
    if (this.cur.val) {
      this.pause()
    }
    if (this.cur.next == null) return
    const { val } = this.cur.next
    if (val) {
      val.play()
      this.cur = this.cur.next
    }
  }
  prev() {
    if (this.cur.val) {
      this.pause()
    }
    if (this.cur.prev == null) return
    const node = this.cur.prev
    if (node.val) {
      node.val.play()
    }
    this.cur = node
  }
  act(name) {
    if (this.cur.val == null) return
    const { [name]: fn } = this.cur.val
    if (fn) fn()
  }
  toggle() {
    this.act('toggle')
  }
  start() {
    this.act('start')
  }
  pause() {
    this.act('pause')
  }
}

function Content({ list, audioOnly }) {
  const [activeItem, setActiveItem] = useState(null)
  const controlCollector = useMemo(() => new Control(), [])
  const chk = () => {
    console.log(controlCollector)
  }
  const playAll = () => {
    controlCollector.next()
  }
  const next = () => {
    controlCollector.next()
  }
  const prev = () => {
    controlCollector.prev()
  }
  return (
    <>
      {audioOnly ? (
        <ActiveMedia>
          <Btn onClick={chk}>chk</Btn>
          <Btn onClick={playAll}>play all</Btn>
          <Btn onClick={next}>Next</Btn>
          <Btn onClick={prev}>Prev</Btn>
        </ActiveMedia>
      ) : null}
      {list.map((e) => (
        <ContentItem
          key={e.id}
          data={e}
          controlCollector={audioOnly ? controlCollector : undefined}
        />
      ))}
    </>
  )
}
