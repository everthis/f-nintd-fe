import React, { useState, useEffect } from 'react'

import { serialize } from './utils'

const defaultFormatter = (d) => d
const defaultParams = {}
export function useQuery({
  url,
  params = defaultParams,
  formatter = defaultFormatter,
  fetchMannually = false,
  shouldFetch = () => true,
}) {
  const [err, setErr] = useState(null)
  const [data, setData] = useState(undefined)
  const [loading, setLoading] = useState(false)

  const queryData = () => {
    setLoading(true)
    const reqUrl =
      url + `${Object.keys(params).length ? '?' + serialize(params) : ''}`
    return fetch(reqUrl)
      .then((d) => d.json())
      .then((d) => setData(formatter(d)))
      .catch((e) => setErr(e))
      .finally((d) => setLoading(false))
  }
  useEffect(() => {
    if (!fetchMannually) {
      if (shouldFetch(url, params)) queryData()
    }
  }, [url, params])

  return { err, data, loading, queryData }
}
