import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import VisibilitySensor from 'react-visibility-sensor'

const ImgWrap = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: ${({ ratio }) => (ratio ? ratio : '75%')};
  background-color: #ddd;
`

const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
`
export default function Image(props) {
  const { title, images, ratio } = props
  const [loaded, setLoaded] = useState(false)

  const staticPrefix = ''
  const status = {}
  const onChange = (id, isVisible) => {
    if (isVisible) status[id] = true
  }
  return (
    <div key={title}>
      <h1>{title}</h1>
      <section>
        {images.map((img) => {
          const src = `${staticPrefix}${img.val}`
          return (
            <VisibilitySensor
              partialVisibility={true}
              onChange={(bool) => onChange(src, bool)}
              key={src}
              offset={{ top: -300, bottom: -300 }}
            >
              {({ isVisible }) => (
                <ImgWrap ratio={ratio}>
                  {isVisible ? <Img src={src} /> : null}
                </ImgWrap>
              )}
            </VisibilitySensor>
          )
        })}
      </section>
    </div>
  )
}
