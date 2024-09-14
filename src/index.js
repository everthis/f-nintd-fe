import React, { useState, useEffect } from "react"
// import ReactDOM from "react-dom/client"
import { render } from 'preact';

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Create } from "./create"
import { HomePage } from "./homepage"
import { Preview } from "./preview"
import { Waveform } from "./waveform"
import { AudioWave } from "./audioWave"
import { Test } from "./test"

import "./index.scss"

function Null() {
  return "Null"
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Null />,
    },
    {
      path: "/test",
      element: <Test />,
    },
    {
      path: "/homepage",
      element: <HomePage />,
    },
    {
      path: "/dashboard",
      element: <Create />,
    },
    {
      path: "/article/:id",
      element: <Preview />,
    },
    {
      path: "/test",
      element: <AudioWave />,
    },
  ])

  return <RouterProvider router={router} />
}

const mountNode = document.getElementById("app")
render(<App />, mountNode)

