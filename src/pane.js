import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { CloseIcon } from './icon'

const Wrap = styled.span`
  display: inline-block;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  min-height: 400px;
  border: 1px solid #333;
  resize: both;
  overflow: auto;
  background-color: ${({ bgColor }) => bgColor};
  position: relative;
  padding-top: 24px;
`
const Head = styled.div`
  background-color: #ddd;
  padding: 3px 50px 2px 5px;
  height: 23px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  &:active {
    cursor: grabbing;
    background-color: #777;
  }
`
const Body = styled.div`
  padding: 2px 5px;
  height: 100%;
  max-height: calc(100vh - 100px);
  overflow-x: hidden;
  overflow-y: scroll;
`

export function Pane({
  show = false,
  width = '400px',
  height = '',
  x = 0,
  y = 0,
  top = 0,
  right = 0,
  header = null,
  body = null,
  bgColor = '#fff',
  children,
  onClose = () => {},
}) {
  const ref = useRef(null)
  const [canMove] = useState(false)
  // const [initPos, setInitPos] = useState([0, 0])
  const [pos, setPos] = useState([0, 0])
  const [shift, setShift] = useState([0, 0])
  const canMoveRef = useRef(canMove)
  const shiftRef = useRef(shift)
  const initPosRef = useRef([0, 0])
  const posRef = useRef(pos)
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
    const newP = [ev.pageX - s[0] - i[0], ev.pageY - s[1] - i[1]]
    setPos(newP)
    posRef.current = newP
  }
  function mouseUp(ev) {
    canMoveRef.current = false
  }

  function resize(ev) {
    const { left, top } = ref.current.getBoundingClientRect()
    const { scrollX, scrollY } = window
    // setInitPos([left + scrollX, top + scrollY])
    const p = posRef.current
    initPosRef.current = [left + scrollX - p[0], top + scrollY - p[1]]
  }

  const styles = {
    transform: `translate3d(${pos[0]}px, ${pos[1]}px, 0)`,
  }
  useEffect(() => {
    resize()
    const { scrollX, scrollY } = window
    setPos([scrollX, scrollY])

    window.addEventListener('mousedown', mouseDown)
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseup', mouseUp)
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('mousedown', mouseDown)
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mouseup', mouseUp)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const closePane = () => {
    onClose()
  }

  return (
    <Wrap bgColor={bgColor} style={styles} width={width} height={height}>
      <Head ref={ref}>
        {header}
        <CloseIcon size='20px' onClick={closePane} />
      </Head>
      <Body>{body || children}</Body>
    </Wrap>
  )
}
