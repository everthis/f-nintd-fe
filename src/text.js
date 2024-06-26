import React, { useRef, useEffect, useState, useId } from 'react'
import styled from 'styled-components'
import { postData } from './utils'
import { API_ORIGIN, TYPE } from './constant'
import { useQuery, usePostData } from './hooks'
import { VdotsIcon } from './icon'
import { Tags } from './tag'

const Btn = styled.span`
  border: 1px solid #333;
  cursor: pointer;
`

const Wrap = styled.div`
  position: relative;
`

const Textarea = styled.textarea`
  background-color: var(--bg-color);
`

const ListWrap = styled.div`
  padding-right: 2rem;
`
const InputSection = styled.div`
  position: sticky;
  top: 0;
  background-color: var(--bg-color);
  z-index: 1;
`
const Pre = styled.pre`
  white-space: break-spaces;
  background-color: var(--highlight-color);
  padding: 0.2rem;
  font-size: 14px;
  position: relative;
`

const Pos = styled.span`
  position: absolute;
  left: 100%;
  top: 0;
  font-size: 0;
`

const OptsPaneWrap = styled.div`
  position: absolute;
  right: 2rem;
  width: 30rem;
  font-size: 14px;
  background-color: var(--bg-color);
  border: var(--border);
`
const SelectWrap = styled.span``

const SingleTextWrap = styled.div`
  display: flex;
  padding: 0.5rem 0;
  ${Pre} {
    flex: 1;
    margin: 0;
  }
`

export function AddTextPane() {
  const ref = useRef()
  const comRef = useRef()
  const inputSecRef = useRef()

  const addText = () => {
    const val = ref.current.value
    if (val == null || val.trim() === '') return
    postData({ url: `${API_ORIGIN}/text/new`, payload: { content: val } }).then(
      (d) => {
        ref.current.value = ''
      }
    )
  }

  const addCom = () => {
    const val = comRef.current.value
    if (val == null || val.trim() === '') return
    postData({
      url: `${API_ORIGIN}/component/new`,
      payload: { name: val },
    }).then((d) => {
      comRef.current.value = ''
    })
  }

  return (
    <Wrap>
      <InputSection ref={inputSecRef}>
        <Textarea rows='5' cols='50' ref={ref} />
        <Btn onClick={addText}>Add text</Btn>
      </InputSection>
      <div>
        <Textarea rows='5' cols='50' ref={comRef} />
        <Btn onClick={addCom}>Add component</Btn>
      </div>
    </Wrap>
  )
}

export function TextPane() {
  const ref = useRef()
  const inputSecRef = useRef()
  const [activeId, setActiveId] = useState(null)
  const [showOpts, setShowOpts] = useState(false)
  const [optsCoord, setOptsCoord] = useState([0, 0])
  const {
    data = [],
    loading,
    queryData,
  } = useQuery({ url: `${API_ORIGIN}/texts` })
  const addText = () => {
    const val = ref.current.value
    if (val == null || val.trim() === '') return
    postData({ url: `${API_ORIGIN}/text/new`, payload: { content: val } }).then(
      (d) => {
        ref.current.value = ''
        queryData()
      }
    )
  }
  const toggleOpts = (id, ev) => {
    setActiveId(id)
    const { top } = ev.currentTarget.getBoundingClientRect()
    const inputSecEl = inputSecRef.current
    const paneEl = inputSecEl.parentElement.parentElement
    const obj = inputSecRef.current.getBoundingClientRect()
    if (id === activeId) {
      if (!showOpts) {
        setOptsCoord([null, top - obj.top + paneEl.scrollTop])
      }
      setShowOpts(!showOpts)
    } else {
      setOptsCoord([null, top - obj.top + paneEl.scrollTop])
      setShowOpts(true)
    }
  }

  return (
    <Wrap>
      <InputSection ref={inputSecRef}>
        <Textarea rows='5' cols='50' ref={ref} />
        <Btn onClick={addText}>Add text</Btn>
      </InputSection>

      {loading ? (
        <p>loading</p>
      ) : (
        <ListWrap>
          {data.map((e, i) => (
            <PerText
              key={i}
              data={e}
              toggleOpts={(ev) => toggleOpts(e.id, ev)}
              showOpts
            />
          ))}
          {showOpts ? <OptsPane textId={activeId} pos={optsCoord} /> : null}
        </ListWrap>
      )}
    </Wrap>
  )
}

export function PerText({ data, toggleOpts = () => {}, showOpts = false }) {
  return (
    <Pre>
      {data.content}
      {showOpts ? (
        <Pos>
          <VdotsIcon onClick={toggleOpts} size='20px' />
        </Pos>
      ) : null}
    </Pre>
  )
}

function OptsPane({ textId, pos }) {
  const {
    data: tags = [],
    loading,
    queryData: querySelectedTags,
  } = useQuery({
    url: `${API_ORIGIN}/textTagRelation/text/${textId}`,
  })

  const { loading: posting, postData } = usePostData()
  const toggleTag = (tag, selected) => {
    postData({
      url: `${API_ORIGIN}/textTagRelation`,
      payload: {
        textId,
        tag: tag.name,
        selected,
      },
    }).then(() => querySelectedTags())
  }

  const selectedTags = new Set(tags.filter((e) => e.selected))

  return (
    <OptsPaneWrap style={{ top: pos[1] + 'px' }}>
      <Tags
        loading={loading || posting}
        tags={tags}
        toggleTag={toggleTag}
        showAddTag={false}
        selectedTags={selectedTags}
        disableDel
      />
    </OptsPaneWrap>
  )
}

export function SingleTextWithLoading({ data, loading, showOpts, toggleOpts }) {
  if (loading) return <p>Loading</p>
  if (data?.type !== TYPE.TEXT) return null
  return <PerText data={data} showOpts={showOpts} toggleOpts={toggleOpts} />
}
function SingleText({ onSelectChange, data, toggleOpts, chkSelected }) {
  return (
    <SingleTextWrap>
      {onSelectChange ? (
        <SelectWrap>
          <input
            type='checkbox'
            value={data.id}
            name='audio'
            checked={chkSelected(data)}
            onChange={(ev) => onSelectChange(data, ev.target.checked)}
          />
        </SelectWrap>
      ) : null}
      <PerText
        key={data.id}
        data={data}
        toggleOpts={(ev) => toggleOpts(ev, data)}
        showOpts
      />
    </SingleTextWrap>
  )
}
function TextList({ list, onSelectChange, chkSelected, toggleOpts }) {
  // console.log(list)
  return (
    <ListWrap>
      {list.map((e, i) => (
        <SingleText
          key={i}
          onSelectChange={onSelectChange}
          data={e}
          toggleOpts={toggleOpts}
          chkSelected={chkSelected}
        />
      ))}
    </ListWrap>
  )
}

export function TextStateLess({
  list,
  onSelectChange = () => {},
  chkSelected,
  toggleOpts,
}) {
  if (list.length === 0 || list[0].type !== TYPE.TEXT) return null
  return (
    <TextList
      list={list}
      chkSelected={chkSelected}
      onSelectChange={onSelectChange}
      toggleOpts={toggleOpts}
    />
  )
}
