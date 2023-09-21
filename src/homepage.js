import React, { useState, useEffect, useRef } from 'react'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import styled from 'styled-components'
import { API_ORIGIN } from './constant'
import { Card } from './card'
import { useQuery } from './hooks'

const Wrap = styled.div`
  max-width: 800px;
  padding: 0.5rem;
  margin: 1rem auto;
`

function HomePageComp() {
  const { data = [], err } = useQuery({
    url: `${API_ORIGIN}/article_list_with_cover`,
  })
  return (
    <Wrap>
      <h1>Games gallery</h1>
      {data.map((e, i) => (
        <Card key={i} {...e} />
      ))}
    </Wrap>
  )
}

export const HomePage = React.memo(HomePageComp)
