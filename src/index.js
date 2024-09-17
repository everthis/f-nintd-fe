import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom/client"
import { render } from "preact";

// import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Link, Route, Switch } from "wouter-preact";
import { Create } from "./create";
import { HomePage } from "./homepage";
import { Preview } from "./preview";
import { Waveform } from "./waveform";
import { AudioWave } from "./audioWave";
import { Test } from "./test";

import "./index.scss";

function Null() {
  return "Null";
}

function App() {
  /*
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
  */
  return (
    <>
      <Switch>
        <Route path="/" component={Null} />
        {/* dashboard */}
        <Route path="/dashboard" component={Create} />
        {/* homepage */}
        <Route path="/homepage" component={HomePage} />
        {/* article */}
        <Route path="/article/:id" component={Preview} />
        {/* test */}
        <Route path="/test" component={Test} />

        {/* Default route in a switch */}
        <Route>404: No such page!</Route>
      </Switch>
    </>
  );
}

const mountNode = document.getElementById("app");
render(<App />, mountNode);
