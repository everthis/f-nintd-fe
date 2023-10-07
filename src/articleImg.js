import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import useNativeLazyLoading from '@charlietango/use-native-lazy-loading'
import { InView, useInView } from 'react-intersection-observer'

const ImgWrap = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: ${({ ratio }) => (ratio ? ratio : '75%')};
  background-color: var(--bg-color);
`

const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
`

const LazyImage = ({ width, height, src, ...rest }) => {
  const supportsLazyLoading = useNativeLazyLoading()
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
    skip: supportsLazyLoading !== false,
  })

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        paddingBottom: `${(height / width) * 100}%`,
        background: '#F5F5F5',
      }}
    >
      {inView || supportsLazyLoading ? (
        <img
          {...rest}
          src={src}
          width={width}
          height={height}
          loading='lazy'
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
          }}
        />
      ) : null}
    </div>
  )
}

export function SingleImage({ data }) {
  const staticPrefix = ''
  const img = data
  const src = `${staticPrefix}${img.val || img.name}`
  const { dimension = '' } = img
  const [width, height] = dimension.split(',').map((e) => +e)
  return <LazyImage key={src} src={src} width={width} height={height} />
}

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
          const { dimension = '' } = img
          const [width, height] = dimension.split(',').map((e) => +e)
          return (
            // <VisibilitySensor
            //   partialVisibility={true}
            //   onChange={(bool) => onChange(src, bool)}
            //   key={src}
            //   offset={{ top: -300, bottom: -300 }}
            // >
            //   {({ isVisible }) => (
            //     <ImgWrap ratio={ratio}>
            //       {isVisible ? <Img src={src} /> : null}
            //     </ImgWrap>
            //   )}
            // </VisibilitySensor>
            <LazyImage key={src} src={src} width={width} height={height} />
          )
        })}
      </section>
    </div>
  )
}
