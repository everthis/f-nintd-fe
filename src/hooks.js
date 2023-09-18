import React, { useState, useEffect } from 'react'

export function useQuery({ url, formatter = (d) => d }) {
  const [err, setErr] = useState(null)
  const [data, setData] = useState(null)
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
  }, [url, formatter])

  return { err, data, loading, queryData }
}
