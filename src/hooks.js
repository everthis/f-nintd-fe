import React, { useState, useEffect } from 'react'

const defaultFormatter = (d) => d
export function useQuery({ url, formatter = defaultFormatter }) {
  const [err, setErr] = useState(null)
  const [data, setData] = useState(undefined)
  const [loading, setLoading] = useState(false)

  const queryData = () => {
    setLoading(true)
    return fetch(url)
      .then((d) => d.json())
      .then((d) => setData(formatter(d)))
      .catch((e) => setErr(e))
      .finally((d) => setLoading(false))
  }
  useEffect(() => {
    queryData()
  }, [url])

  return { err, data, loading, queryData }
}
