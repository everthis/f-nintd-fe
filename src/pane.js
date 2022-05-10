import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const Wrap = styled.span`
  display: inline-block;
  width: ${({ width }) => width};
  min-height: 400px;
  border: 1px solid #333;
  resize: both;
  overflow: auto;
  background-color: ${({ bgColor }) => bgColor};
`
const Head = styled.div`
  background-color: #ddd;
  padding: 3px 5px 2px;
  cursor: grab;
  min-height: 18px;
  &:active {
    cursor: grabbing;
    background-color: #777;
  }
`
const Body = styled.div`
  padding: 2px 5px;
`

export function Pane({
  show = false,
  width = '400px',
  x = 0,
  y = 0,
  top = 0,
  right = 0,
  header = null,
  body = null,
  bgColor = '#fff',
}) {
  const ref = useRef(null)
  const [canMove] = useState(false)
  const [initPos, setInitPos] = useState([0, 0])
  const [pos, setPos] = useState([0, 0])
  const [shift, setShift] = useState([0, 0])
  const canMoveRef = useRef(canMove)
  const shiftRef = useRef(shift)
  const initPosRef = useRef(initPos)
  function mouseDown(ev) {
    if (ev.target !== ref.current) return
    const { left, top } = ev.target.getBoundingClientRect()
    shiftRef.current = [ev.clientX - left, ev.clientY - top]
    canMoveRef.current = true
  }
  function mouseMove(ev) {
    if (!canMoveRef.current) return
    const s = shiftRef.current
    const i = initPosRef.current
    setPos([ev.pageX - s[0] - i[0], ev.pageY - s[1] - i[1]])
  }
  function mouseUp(ev) {
    canMoveRef.current = false
  }

  const styles = {
    transform: `translate3d(${pos[0]}px, ${pos[1]}px, 0)`,
  }
  useEffect(() => {
    const { left, top } = ref.current.getBoundingClientRect()
    const { scrollX, scrollY } = window
    setInitPos([left + scrollX, top + scrollY])
    initPosRef.current = [left, top]
    window.addEventListener('mousedown', mouseDown)
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseup', mouseUp)

    return () => {
      window.removeEventListener('mousedown', mouseDown)
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mouseup', mouseUp)
    }
  }, [])

  return (
    <Wrap bgColor={bgColor} style={styles} width={width}>
      <Head ref={ref}>{header}</Head>
      <Body>{body}</Body>
    </Wrap>
  )
}
