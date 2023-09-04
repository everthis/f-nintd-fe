import React, { useState, useEffect, useRef } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import styled from 'styled-components'
import { Nav } from './nav'
import { API_ORIGIN } from './constant'
import { Theme } from './theme'

const maxWidth = '650px'
const minWidth = '300px'
const Wrap = styled.div`
  display: inline-block;
  max-width: ${maxWidth};
  min-width: ${minWidth};
  border: 1px solid #ddd;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 20px purple;
  }
`
const ImgWrap = styled.div`
  font-size: 0;
  img {
    height: auto;
    width: 100%;
  }
`
const CardTitle = styled.h3`
  text-align: center;
`
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`

const ac6c =
  'https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2023/04/27/armored-core-6-header.jpg'
const ac6t = 'Armored Core VI: Fires of Rubicon'
const w3c =
  'https://altarofgaming.com/wp-content/uploads/2023/02/the-witcher-3-wild-hunt-complete-edition-game-cover-altar-of-gaming-410.jpg'
const w3t = 'Witcher 3: Wild Hunt'
const rdr2c =
  'https://rocket-chainsaw.b-cdn.net/wp-content/uploads/2018/05/Red-Dead-Redemption-2-New-Logo.jpg'
const rdr2t = 'Red Dead Redemption 2'

const tlouc =
  'https://www.gizchina.com/wp-content/uploads/images/2023/03/The-Last-of-Us-Part-1.jpg'
const tlout = 'The Last of Us Part 1'

const tlouc2 =
  'https://image.api.playstation.com/vulcan/img/rnd/202010/2618/itbSm3suGHSSHIpmu9CCPBRy.jpg'
const tlout2 = 'The Last of Us Part 2'

const bbc =
  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d84f1809-9054-430c-95fa-27b17818bcea/dfli5qm-4b933a5d-1526-4d7e-85a9-4b4984e62bcb.png/v1/fill/w_1192,h_670,q_70,strp/ps4_bloodborne_cover_by_indra135_dfli5qm-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvZDg0ZjE4MDktOTA1NC00MzBjLTk1ZmEtMjdiMTc4MThiY2VhXC9kZmxpNXFtLTRiOTMzYTVkLTE1MjYtNGQ3ZS04NWE5LTRiNDk4NGU2MmJjYi5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.OHdSRKb31narHhmwp1FVJfUi-EHO3E2Pvl5fc07K_I8'
const bbt = 'Bloodborne'

const cp2077c =
  'https://cdna.artstation.com/p/assets/images/images/033/037/886/large/artur-tarnowski-malemain.jpg?1608208334'
const cp2077t = 'Cyberpunk 2077'

export function Card({ cover = '', title = '' }) {
  return (
    <Wrap>
      <ImgWrap>
        <img src={cover} loading="lazy" />
      </ImgWrap>
      <CardTitle>{title}</CardTitle>
    </Wrap>
  )
}
const defaultCards = [
  { cover: w3c, title: w3t },
  { cover: rdr2c, title: rdr2t },
  { cover: tlouc, title: tlout },
  { cover: tlouc2, title: tlout2 },
  { cover: ac6c, title: ac6t },
  { cover: bbc, title: bbt },
  { cover: cp2077c, title: cp2077t },
]

export function Cards({ data = defaultCards }) {
  return (
    <Container>
      {data.map((e, i) => (
        <Card key={i} title={e.title} cover={e.cover} />
      ))}
    </Container>
  )
}
