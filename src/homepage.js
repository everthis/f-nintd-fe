import React, { useState, useEffect, useRef } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import { Nav } from './nav'

function HomePageComp() {
  return <Nav />
}

export const HomePage = React.memo(HomePageComp)
