import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { postData } from './utils'
import { API_ORIGIN } from './constant'
import { useQuery } from './hooks'
import { VdotsIcon } from './icon'
import { Tags } from './tag'

const Btn = styled.span`
  border: 1px solid #333;
  cursor: pointer;
`

const Wrap = styled.div`
  position: relative;
`

const ListWrap = styled.div`
  padding-right: 4rem;
`
const InputSection = styled.div`
  position: sticky;
  top: 0;
  background-color: var(--bg-color);
  z-index: 1;
`
const Pre = styled.pre`
  white-space: break-spaces;
  background-color: #e4e9ec;
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
  top: 0;
  right: 100%;
  width: 30rem;
  font-size: 14px;
  background-color: var(--bg-color);
  border: var(--border);
`

export function TextPane() {
  const ref = useRef()
  const [list, setList] = useState([])
  const {
    data = [],
    loading,
    queryData,
  } = useQuery({ url: `${API_ORIGIN}/texts` })
  const addText = () => {
    const val = ref.current.value
    if (val == null || val.trim() === '') return
    postData(`${API_ORIGIN}/text/new`, { content: val }).then((d) => {
      ref.current.value = ''
      queryData()
    })
  }

  return (
    <Wrap>
      <InputSection>
        <textarea rows="5" cols="50" ref={ref} />
        <Btn onClick={addText}>Add text</Btn>
      </InputSection>

      {loading ? (
        <p>loading</p>
      ) : (
        <ListWrap>
          {data.map((e, i) => (
            <PerText key={i} data={e} />
          ))}
        </ListWrap>
      )}
    </Wrap>
  )
}

function PerText({ data }) {
  const [showOpts, setShowOpts] = useState(false)

  const toggleOpts = () => setShowOpts(!showOpts)
  const { id } = data

  return (
    <Pre>
      {data.content}
      <Pos>
        <VdotsIcon onClick={toggleOpts} size="20px" />
        {showOpts ? <OptsPane textId={id} /> : null}
      </Pos>
    </Pre>
  )
}

function OptsPane({ textId }) {
  const [tags, setTags] = useState([])

  const toggleTag = (tag, selected) => {
    postData(`${API_ORIGIN}/text_tag_relation`, {
      textId,
      tag,
      selected,
    })
  }

  return (
    <OptsPaneWrap>
      <Tags
        tags={tags}
        updateTags={setTags}
        toggleTag={toggleTag}
        showAddTag={false}
        disableDel
      />
    </OptsPaneWrap>
  )
}
