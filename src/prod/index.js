import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { ArticlePage } from './article'
import { HomePage } from './homepage'

import '../index.scss'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/article/:id',
      element: <ArticlePage />,
    },
  ])

  return <RouterProvider router={router} />
}

const mountNode = document.getElementById('app')
ReactDOM.createRoot(mountNode).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
