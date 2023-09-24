import React, { useState, useEffect, useRef } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useNavigate,
} from 'react-router-dom'
import styled from 'styled-components'
import { Nav } from './nav'
import { API_ORIGIN } from './constant'
import { Theme } from './theme'
import { ImgComp } from './image'

const maxWidth = '720px'
const minWidth = '300px'
const Wrap = styled.div`
  border: 1px solid #ddd;
  cursor: pointer;
  &:hover {
    border: 1px solid #333;
  }
  & + & {
    margin-top: 1rem;
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
  max-width: ${maxWidth};
  min-width: ${minWidth};
  gap: 15px;
  margin: 0 auto;
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

const dspc =
  'https://news.xbox.com/en-us/wp-content/uploads/sites/2/2022/10/Key-Art-1920x1080_en-dd3eccb23c290f6bb38d.jpg'
const dspt = 'Dyson Sphere Program'

const erc = 'https://www.videogameschronicle.com/files/2022/02/sds5.jpg'
const ert = 'Elden Ring'

const ds3c = 'https://wallpaperset.com/w/full/0/9/1/209465.jpg'
const ds3t = 'Dark Souls 3'

const sdtc =
  'https://whatifgaming.com/wp-content/uploads/2021/03/Sekiro-Shadows-Die-Twice.jpg'
const sdtt = 'Sekiro Shadows Die Twice'

const fh5c =
  'https://www.motortrend.com/uploads/sites/25/2021/06/001-forza-horizon5-lead.jpg'
const fh5t = 'Forza Horizon 5'

const botwc =
  'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58'
const botwt = 'The Legend of Zelda™: Breath of the Wild'

const totkc =
  'https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2023/08/03/Zelda-TearsAnotherCover.jpg'
const totkt = 'The Legend of Zelda™: Tears of the Kingdom'

const acc =
  'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000027619/9989957eae3a6b545194c42fec2071675c34aadacd65e6b33fdfe7b3b6a86c3a'
const act = 'Animal Crossing™: New Horizons'

const gta5c =
  'https://assets.xboxservices.com/assets/0b/17/0b179504-412d-4af7-9e00-3e3d92633577.jpg?n=GTA-V_GLP-Page-Hero-1084_1920x1080.jpg'
const gta5t = 'Grand Theft Auto V'

const smoc =
  'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000001130/c42553b4fd0312c31e70ec7468c6c9bccd739f340152925b9600631f2d29f8b5'
const smot = 'Super Mario Odyssey™'

const sc1c =
  'https://www.allkeyshop.com/blog/wp-content/uploads/Starcraft-Remastered_BANNER.jpg'
const sc1t = 'StarCraft'

const sc2c =
  'https://techraptor.net/sites/default/files/styles/image_header/public/2020-07/starcraft%202%20wings%20of%20liberty.jpg?itok=WzTeN0S_'
const sc2t = 'StarCraft 2'

const d3c =
  'https://ams3.digitaloceanspaces.com/web01.ho-sting/videogamesartwork_com/public/concept-art/1590652404/diablo3-cover-03-logo.jpg'
const d3t = 'Diablo 3'

const re4rc =
  'https://blog.playstation.com/tachyon/2022/06/157120f7a4344d5f81aa9ad097c16a31cd177904.jpg'
const re4rt = 'Resident Evil 4 Remake'

const re2rc =
  'https://cdn2.tfx.company/images/clickwallpapers-residentevil2remake-jogos-4k-img1.jpg'
const re2rt = 'Resident Evil 2 Remake'

const gt7c = 'https://www.gran-turismo.com/images/c/i1W3k7FXLZd7AEE.jpg'
const gt7t = 'Gran Turismo® 7'

const gowrc =
  'https://image.api.playstation.com/vulcan/ap/rnd/202207/1117/4uH3OH4dQtHMe2gmdFuth02u.jpg'
const gowrt = 'God of War Ragnarök'

const bsic =
  'https://cdn1.epicgames.com/offer/df2da503f2074f078f8090da3c27ec47/EGS_BioShockInfiniteCompleteEdition_MassMediaGames_S1_2560x1440-bf29199cfe7a76f62965f582571024f6'
const bsit = 'BioShock Infinite'

export function Card({ cover = {}, title = '', id }) {
  const navigate = useNavigate()
  const clickCb = () => navigate(`/article/${id}`)
  return (
    <Wrap onClick={clickCb}>
      <ImgWrap>
        <ImgComp {...cover} />
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
  { cover: dspc, title: dspt },
  { cover: erc, title: ert },
  { cover: ds3c, title: ds3t },
  { cover: sdtc, title: sdtt },
  { cover: fh5c, title: fh5t },
  { cover: botwc, title: botwt },
  { cover: totkc, title: totkt },
  { cover: smoc, title: smot },
  { cover: acc, title: act },
  { cover: gta5c, title: gta5t },
  { cover: sc1c, title: sc1t },
  { cover: sc2c, title: sc2t },
  { cover: d3c, title: d3t },
  { cover: re4rc, title: re4rt },
  { cover: re2rc, title: re2rt },
  { cover: gt7c, title: gt7t },
  { cover: gowrc, title: gowrt },
  { cover: bsic, title: bsit },
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
