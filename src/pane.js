import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { CloseIcon } from './icon'

export const PaneContainer = styled.span`
  position: fixed;
  z-index: ${({ show }) => (show ? 1 : -1)};
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
`
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
  background-color: var(--title-bg);
  padding: 3px 50px 2px 5px;
  height: 23px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  &:active {
    cursor: grabbing;
    background-color: var(--title-bg-active);
  }
`
const Body = styled.div`
  padding: 0 5px;
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
  right = 0,
  header = null,
  body = null,
  bgColor = '#fff',
  children,
  onClose = () => {},
  showClose = true,
  onClick = () => {},
  left = 0,
  top = 0,
}) {
  const ref = useRef(null)
  // const [initPos, setInitPos] = useState([0, 0])
  const [pos, setPos] = useState([0, 0])
  const leftTopRef = useRef([left, top])
  const canMoveRef = useRef(false)
  const shiftRef = useRef([0, 0])
  const initPosRef = useRef([0, 0])
  const posRef = useRef(pos)
  function mouseDown(ev) {
    if (ev.target !== ref.current) return
    // const { left, top } = ev.target.getBoundingClientRect()
    shiftRef.current = [ev.clientX, ev.clientY]
    canMoveRef.current = true
  }
  function mouseMove(ev) {
    if (!canMoveRef.current) return
    const s = shiftRef.current
    const i = initPosRef.current
    // const newP = [ev.pageX - s[0] - i[0], ev.pageY - s[1] - i[1]]
    const newP = [ev.clientX - s[0], ev.clientY - s[1]]
    setPos(newP)
    posRef.current = newP
  }
  function mouseUp(ev) {
    if (ev.target !== ref.current) return
    const s = shiftRef.current
    // const newP = [ev.pageX - s[0] - i[0], ev.pageY - s[1] - i[1]]
    const newP = [ev.clientX - s[0], ev.clientY - s[1]]
    const [legacyLeft, legacyTop] = leftTopRef.current
    leftTopRef.current = [legacyLeft + newP[0], legacyTop + newP[1]]
    setPos([0, 0])
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
    willChange: 'transform',
    left: leftTopRef.current[0],
    top: leftTopRef.current[1],
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
      setPos([0, 0])
    }
  }, [])

  useEffect(() => {
    if (!show) {
      setPos([0, 0])
      shiftRef.current = [0, 0]
      initPosRef.current = [0, 0]
    }
  }, [show])

  const closePane = () => {
    onClose()
  }

  return (
    <PaneContainer style={styles} onClick={onClick} show={show}>
      <Wrap bgColor={bgColor} width={width} height={height}>
        <Head ref={ref}>
          {header}
          {showClose ? <CloseIcon size="20px" onClick={closePane} /> : null}
        </Head>
        <Body>{body || children}</Body>
      </Wrap>
    </PaneContainer>
  )
}
