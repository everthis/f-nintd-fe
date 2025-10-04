import React, { useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'

import { API_ORIGIN, TYPE } from './constant'
import Image, { SingleImage } from './articleImg'
import { AudioItem } from './audio'
import { useQuery } from './hooks'
import { PerText } from './text'
import { PureVideo } from './video'
import { Btn } from './btn'
import { PauseIcon, PlayIcon, NextIcon, PreviousIcon, LoopIcon } from './icon'
import { Com } from './com/index'

const Center = styled.div`
  text-align: center;
`

const ArticleTitle = styled.h1``
const ArticleContent = styled.section`
  max-width: 900px;
  margin: 0 auto;
`
const ActiveMedia = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 15px;
  justify-content: center;
  padding: 1rem 0 1rem 0;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 9;
  button {
    margin: 0;
  }
`
const PreviewWrap = styled.section`
  button {
    border: none;
  }
`
const defaultPayload = {
  title: '',
  content: {},
}
export function Preview({}) {
  const { id } = useParams()

  const queryByTitle = isNaN(id)
console.log(id, queryByTitle)
  // const [article, setArticle] = useState({
  //   title: '',
  //   content: [],
  // })
  const { data: article = defaultPayload, loading } = useQuery({
    url: queryByTitle ? `${API_ORIGIN}/articleByTitle/${id}` : `${API_ORIGIN}/article/${id}`,
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
      {loading ? (
        <ArticleTitle>{'Loading'}</ArticleTitle>
      ) : content?.audioOnly ? null : (
        <ArticleTitle>{title}</ArticleTitle>
      )}
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
  const { type, name } = data
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
    case TYPE.ONE_FRAME_VIDEO:
      Comp = PureVideo
      break
    case TYPE.COMPONENT:
      Comp = Com[name]
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
    this.loop = false
    // this.status = 0 // 0: paused, >= 1: playing
  }
  set(id, val) {
    const node = new DoublyLinkedNode(val)
    this.idNodeMap.set(id, node)
    if (this.cur.val == null) this.cur = node
    this.tail.next = node
    node.prev = this.tail
    this.tail = node
  }
  setCurNodeById(id) {
    this.cur = this.idNodeMap.get(id)
  }
  next() {
    if (this.cur.val) {
      this.pause()
    }
    if (this.loop) {
      if (this.cur.next == null) {
        if (this.root.next == null) return
        this.cur = this.root.next
      } else {
        this.cur = this.cur.next
      }
    } else {
      if (this.cur.next == null) return
      this.cur = this.cur.next
    }
    this.cur.val.play()
  }
  prev() {
    if (this.cur.val) {
      this.pause()
    }
    if (this.cur.prev == null || this.cur.prev === this.root) return
    this.cur = this.cur.prev
    this.cur.val.play()
  }
  act(name) {
    if (this.cur.val == null) return
    const { [name]: fn } = this.cur.val
    if (fn) fn()
  }
  toggle() {
    this.act('toggle')
  }
  play() {
    this.act('play')
  }
  pause() {
    this.act('pause')
  }
  isPlaying() {
    for (const [
      _,
      {
        val: { isPlaying },
      },
    ] of this.idNodeMap) {
      const tmp = isPlaying()
      if (tmp) {
        return true
      }
    }
    return false
  }
  endCb() {
    if (this.loop) {
      this.next()
    }
  }
}

function Content({ list, audioOnly }) {
  const ref = useRef()
  const pageSize = 3
  const [page, setPage] = useState(0)
  const pageRef = useRef(page)
  const [loop, setLoop] = useState(false)
  const controlCollector = useMemo(() => new Control(), [])

  const play = () => {
    controlCollector.play()
  }
  const pause = () => {
    controlCollector.pause()
  }
  const next = () => {
    controlCollector.next()
  }
  const prev = () => {
    controlCollector.prev()
  }
  const toggleLoop = () => {
    setLoop(!loop)
  }

  useEffect(() => {
    pageRef.current = page
  }, [page])
  useEffect(() => {
    const el = ref.current
    const observer = new IntersectionObserver((entries, oo) => {
      // console.log('trigger', oo)
      if (entries[0].isIntersecting) {
        // el is visible
        // console.log('vis')
        const page = pageRef.current
        if ((page + 1) * pageSize < list.length) {
          setPage(page + 1)
          observer.unobserve(el)
          observer.observe(el)
        }
      } else {
        // console.log('not vis')
        // el is not visible
      }
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    controlCollector.loop = loop
  }, [loop])
  const itemsToDisplay = list.slice(0, (page + 1) * pageSize)
  return (
    <PreviewWrap>
      {audioOnly ? (
        <ActiveMedia>
          <Btn onClick={toggleLoop}>
            <LoopIcon checked={loop} />
          </Btn>
          <Btn onClick={play}>
            <PlayIcon />
          </Btn>
          <Btn onClick={pause}>
            <PauseIcon />
          </Btn>
          <Btn onClick={prev}>
            <PreviousIcon />
          </Btn>
          <Btn onClick={next}>
            <NextIcon />
          </Btn>
        </ActiveMedia>
      ) : null}
      {itemsToDisplay.map((e) => (
        <ContentItem
          key={e.id}
          data={e}
          controlCollector={audioOnly ? controlCollector : undefined}
        />
      ))}
      <div ref={ref} style={{ height: '15px' }}></div>
      {itemsToDisplay.length < list.length ? (
        <p>Loading</p>
      ) : (
        <p>End of line.</p>
      )}
    </PreviewWrap>
  )
}
