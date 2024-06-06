import React, { useRef, useId } from 'react'
import styled from 'styled-components'

export const Wrap = styled.div`
  background-color: #000;
  color: #fff;
`

export const CSSpan = styled.span`
  display: flex;
  height: 1.5rem;
  width: 1.5rem;
  flex-wrap: wrap;
  align-content: center;
  border-radius: 9999px;
  border-width: 2px;
  border-color: rgb(255 255 255);
  background-color: transparent;
  border-style: solid;
  @media (min-width: 1024px) {
    height: 2rem;
    width: 2rem;
  }
`
export const CSWrap = styled.div`
  display: flex;
  align-items: center;
  svg {
    ${({ active, size }) =>
      active
        ? size === 'small'
          ? `display: block;
      stroke: color(display-p3 .4588 .9804 .298);`
          : `display:block;stroke: #000;position:relative;z-index:1;`
        : `display: none;`}
  }
  ${CSSpan} {
    ${({ active, size }) =>
      active
        ? size === 'small'
          ? `border-color: color(display-p3 .4588 .9804 .298);`
          : `
    border-color: transparent;
    background-color: #00FF00;
    background-color: color(display-p3 .4588 .9804 .298);
    `
        : ''}
    ${({ size }) =>
      size === 'small'
        ? `height: 1.25rem;
    width: 1.25rem;
    border-width: 1px;`
        : ''}
  }
`

export const CSLabel = styled.span`
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  @media (min-width: 1024px) {
    margin-left: 0.5rem;
  }
`
const Summary = styled.div`
  display: flex;
  padding: 2px 10px;
`
const CSSummary = styled.div`
  display: flex;
  padding: 2px 10px;
`
const Cr = Object.defineProperty
const Lr = (t, e, r) =>
  e in t
    ? Cr(t, e, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: r,
      })
    : (t[e] = r)
const Ie = (t, e, r) => (Lr(t, typeof e != 'symbol' ? e + '' : e, r), r)
const jr = () => {
  const t = []
  return (
    window.matchMedia('(color-gamut: srgb)').matches && t.push('srgb'),
    window.matchMedia('(color-gamut: p3)').matches && t.push('p3'),
    window.matchMedia('(color-gamut: rec2020)').matches && t.push('rec2020'),
    t
  )
}
class kr {
  constructor() {
    Ie(this, 'spaces')
    this.spaces = jr()
  }
  hasColorSpace(e) {
    return this.spaces.indexOf(e) > -1
  }
  isWideGamut() {
    return this.spaces.some((e) => e === 'p3' || e === 'rec2020')
  }
}
window.colorSpaces = new kr()

export function WideGamut(props) {
  const { children, type = 'inline-block', ...restprops } = props
  const res = {
    wideGamut: window.colorSpaces.isWideGamut(),
    srgb: window.colorSpaces.hasColorSpace('srgb'),
    p3: window.colorSpaces.hasColorSpace('p3'),
    rec2020: window.colorSpaces.hasColorSpace('rec2020'),
    hdr: window.matchMedia('(dynamic-range: high)').matches,
  }
  const fr = [
    ['wideGamut', 'Wide Gamut'],
    ['hdr', 'HDR'],
  ]
  const sr = [
    ['srgb', 'sRGB'],
    ['p3', 'DCI P3'],
    ['rec2020', 'BT.2020'],
  ]
  return (
    <Wrap type={type} {...restprops}>
      <Summary>
        {fr.map((e) => (
          <CS key={e[0]} active={res[e[0]]} label={e[1]} />
        ))}
      </Summary>
      <CSSummary>
        {sr.map((e) => (
          <CS key={e[0]} active={res[e[0]]} label={e[1]} size='small' />
        ))}
      </CSSummary>
    </Wrap>
  )
}

function CS({ active, size, label }) {
  return (
    <CSWrap active={active} size={size}>
      <CSSpan>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m4.5 12.75 6 6 9-13.5'
          ></path>
        </svg>
      </CSSpan>
      <CSLabel>{label}</CSLabel>
    </CSWrap>
  )
}
