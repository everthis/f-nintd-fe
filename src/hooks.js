import React, { useState, useEffect, useMemo, useCallback } from 'react'

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

export function useChecked(selectedItems) {
  const selectedKeySet = useMemo(() => {
    const set = new Set()
    for (const e of selectedItems) {
      const { type, id } = e
      const k = `${type},${id}`
      set.add(k)
    }
    return set
  }, [selectedItems])

  const chkExists = useCallback(
    (e) => {
      const { type, id } = e
      const k = `${type},${id}`
      return selectedKeySet.has(k)
    },
    [selectedKeySet]
  )

  return { chkExists }
}
