import React, { useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'

export function Nav() {
  return (
    <div>
      <Link to="/homepage" style={{ marginRight: '1em' }}>
        Homepage
      </Link>
      <Link to="/articles">Articles</Link>
    </div>
  )
}
