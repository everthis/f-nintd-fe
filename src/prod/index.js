import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Link, Route, Switch } from 'wouter-preact'

import { ArticlePage } from './article'
import { HomePage } from './homepage'

import '../index.scss'

function App() {
  /*
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
  */
  return (
    <>
      <Switch>
        <Route path="/" component={HomePage} />

        {/* article */}
        <Route path="/article/:id" component={ArticlePage} />


        {/* Default route in a switch */}
        <Route>404: No such page!</Route>
      </Switch>
    </>
  );
}

const mountNode = document.getElementById('app')
ReactDOM.createRoot(mountNode).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
