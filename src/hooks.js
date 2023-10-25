import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { serialize, postData as postDataFn } from './utils'
import { EMPTY_OBJ } from './constant'

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
    return fetch(reqUrl, {
      credentials: 'include',
    })
      .then((d) => d.json())
      .then((d) => setData(formatter(d)))
      .catch((e) => setErr(e))
      .finally((d) => setLoading(false))
  }
  const shouldFetchNow = shouldFetch(url, params)
  useEffect(() => {
    if (!fetchMannually) {
      if (shouldFetchNow) queryData()
    }
  }, [url, params, shouldFetchNow])

  return { err, data, loading, queryData }
}

export function useChecked(selectedItems) {
  const genKey = (e) => {
    const { type, id } = e
    const k = `${type},${id}`
    return k
  }
  const selectedKeySet = useMemo(() => {
    const set = new Set()
    for (const e of selectedItems) {
      const k = genKey(e)
      set.add(k)
    }
    return set
  }, [selectedItems])

  const chkExists = useCallback(
    (e) => {
      const k = genKey(e)
      return selectedKeySet.has(k)
    },
    [selectedKeySet]
  )

  const chkExistItem = useCallback(
    (e) => {
      const targetKey = genKey(e)
      let res = null
      for (const item of selectedItems) {
        const k = genKey(item)
        if (k === targetKey) {
          res = item
          break
        }
      }
      return res
    },
    [selectedKeySet]
  )

  return { chkExists, chkExistItem }
}

export function useCombineSets(...sets) {
  const [res, setRes] = useState(new Set())

  useEffect(() => {
    const tmp = new Set()
    for (const s of sets) {
      for (const e of s) tmp.add(e)
    }
    setRes(tmp)
  }, [...sets])

  return res
}

export function usePostData(/*{
  url,
  method = 'POST',
  payload = EMPTY_OBJ,
  shouldStringify = true,
  headers = EMPTY_OBJ,
}*/) {
  const [loading, setLoading] = useState(false)
  const postData = useCallback(
    ({
      url,
      method = 'POST',
      payload = EMPTY_OBJ,
      shouldStringify = true,
      headers,
    }) => {
      setLoading(true)
      /*{ url, method, payload, shouldStringify, headers } */
      return postDataFn({
        url,
        method,
        payload,
        shouldStringify,
        headers,
      }).finally(() => setLoading(false))
    },
    []
  )

  return { loading, postData }
}
