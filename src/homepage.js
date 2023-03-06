import React, { useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'

import { Nav } from './nav'

export function HomePage() {
  return (
    <>
      <h1>Homepage</h1>
      <Nav />
    </>
  )
}
