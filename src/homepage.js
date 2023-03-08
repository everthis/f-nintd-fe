import React, { useState, useEffect, useRef } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import Hls from 'hls.js'
import { Nav } from './nav'
import { Audio } from './audio'

function HomePageComp() {
  return (
    <>
      <h1>Homepage</h1>
      <Nav />
      <Audio />
    </>
  )
}

export const HomePage = React.memo(HomePageComp)
