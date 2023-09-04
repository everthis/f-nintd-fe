import React, { useState, useEffect, useRef } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import { Nav } from './nav'
import { API_ORIGIN } from './constant'
import { Theme } from './theme'
import { Cards } from './card'

function Test() {
  const [cnt, setCnt] = useState(0)
  // function listTags() {
  //   // fetch(`${API_ORIGIN}/images/tags`, {
  //   fetch(`https://dummyjson.com/products/16`, {
  //     method: 'GET',
  //   })
  //     .then((d) => d.json())
  //     .then((arr) => {
  //       arr = arr.map((e) => ({ name: e, selected: false }))
  //       console.log(arr)
  //     })
  // }
  // useEffect(() => {
  //   listTags()
  // }, [])
  console.log('cnt', cnt)
  return (
    <p
      onClick={() => {
        setCnt(cnt + 1)
        setCnt(cnt + 1)
        setCnt(cnt + 1)
      }}
    >
      {cnt}
    </p>
  )
}

function HomePageComp() {
  const arr = Array(40).fill(0)
  return (
    <>
      <Test />
      <Nav />
      <Theme />
      <Cards />
    </>
  )
}

export const HomePage = React.memo(HomePageComp)
