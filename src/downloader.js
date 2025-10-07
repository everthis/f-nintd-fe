import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { usePostData } from './hooks'
import { API_ORIGIN, EMPTY_ARR, EMPTY_SET, TYPE } from './constant'

const Wrap = styled.div`
  padding: 1em 0.5em;
  textarea {
    width: 100%;
  }
`
const TA = styled.textarea`
  width: 100%;
  max-width: 100%;
  min-height: 100%;
`
const BtnWrap = styled.div`
  padding: 0.5em 0;
`
const LinkWrap = styled.div`
  padding: 0.2em 0;
`
const ImgWrap = styled.div`
  img {
    max-width: 100%;
    display: block;
  }
`
const A = styled.a`
  word-break: break-all;
`
const ClearBtn = styled.button`
  margin-left: 1em;
`
const H3 = styled.h3`
  margin: 0 0 0.5em 0;
`
const HowToWrap = styled.div`
  padding: 0.5em;
`

export function Downloader(props) {
  const textareaRef = useRef()
  const { loading, postData } = usePostData()
  const [listData, setListData] = React.useState(EMPTY_ARR)

  const download = () => {
    const text = textareaRef.current.value
    console.log(text)
    if (text.trim()) {
      setListData(EMPTY_ARR)
      postData({
        url: `${API_ORIGIN}/downloader/douyin`,
        method: 'POST',
        payload: {
          text,
        },
      }).then((resp) => {
        const { data } = resp

        if (data && data.length) {
          setListData(data)
        }
      })
    }
  }
  return (
    <Wrap>
      <H3>Douyin Video Downloader</H3>
      <TA rows={3} ref={textareaRef} />
      <BtnWrap>
        <button onClick={download} disabled={loading}>
          {loading ? 'Processing...' : 'Download'}
        </button>
        <ClearBtn
          onClick={() => {
            setListData(EMPTY_ARR)
            if (textareaRef.current) {
              textareaRef.current.value = ''
            }
          }}
        >
          Clear
        </ClearBtn>
      </BtnWrap>
      {listData.length ? (
        <div>
          {listData.map((item, idx) => {
            return item.type === 'video' ? (
              <div key={idx}>
                <img
                  src={item.data[0].originCover.url_list[0]}
                  alt=''
                  style={{ maxWidth: '200px' }}
                />
                <div>Download Link:</div>
                {item.data[0].url === item.data[1].url ? (
                  <LinkWrap key={item.data[0].url}>
                    <A href={item.data[0].url} target='_blank' rel='noreferrer'>
                      {item.data[0].url}
                    </A>
                  </LinkWrap>
                ) : (
                  item.data.map((e) => (
                    <LinkWrap key={e.url}>
                      <A href={e.url} target='_blank' rel='noreferrer'>
                        {e.url}
                      </A>
                    </LinkWrap>
                  ))
                )}
              </div>
            ) : item.type === 'note' ? (
              <div key={idx}>
                <div>{item.text}</div>
                {item.data && item.data.length ? (
                  <ImgWrap>
                    {item.data.map((img, i) => (
                      <img key={img.uri} src={img.urlList[0]} alt='' />
                    ))}
                  </ImgWrap>
                ) : null}
              </div>
            ) : null
          })}
        </div>
      ) : null}
    </Wrap>
  )
}

function DouyinHowTo() {
  return (
    <HowToWrap>
      <h3>How to use:</h3>
      <div>
        1. Open Douyin App (Chinese Tiktok) or TikTok App, find the video you
        want to download.
      </div>
      <div>2. Click Share button, then click Copy Link.</div>
      <div>3. Paste the link in the textarea above, then click Download.</div>
      <div>4. Wait for a while, you will get the download link.</div>
      <div>
        Note: If you are using TikTok App, make sure the video is from Douyin
        (Chinese Tiktok), otherwise it may not work.
      </div>
    </HowToWrap>
  )
}

export function DownloaderPage(props) {
  return (
    <div>
      <Downloader />
      <DouyinHowTo />
    </div>
  )
}
