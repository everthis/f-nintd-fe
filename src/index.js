import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Create } from './create'
import { HomePage } from './homepage'
import { Preview } from './preview'

import './index.scss'

function Null() {
  return 'Null'
}

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Null />,
    },
    {
      path: '/homepage',
      element: <HomePage />,
    },
    {
      path: '/articles',
      element: <Create />,
    },
    {
      path: '/article/:id',
      element: <Preview />,
    },
  ])

  return <RouterProvider router={router} />
}

const mountNode = document.getElementById('app')
ReactDOM.createRoot(mountNode).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
)
