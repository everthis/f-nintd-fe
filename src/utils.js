export function postData({
  url,
  method = 'POST',
  payload = null,
  shouldStringify = true,
  headers = {},
}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: shouldStringify ? JSON.stringify(payload) : payload,
  }
  if (!shouldStringify) opts.headers = headers
  return fetch(url, opts)
    .then((d) => d.json())
    .catch((e) => ({ err: e }))
}

export function serialize(obj, prefix) {
  let str = [],
    p
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      let k = prefix ? prefix + '[' + p + ']' : p,
        v = obj[p]
      str.push(
        v !== null && typeof v === 'object'
          ? serialize(v, k)
          : encodeURIComponent(k) + '=' + encodeURIComponent(v)
      )
    }
  }
  return str.join('&')
}

export function downloadAndCreateHash(urlToFile) {
  return fetch(urlToFile)
    .then(function (response) {
      // Get it as blob
      return response.blob() // returns a promise
    })
    .then((blob) => {
      // Calculate the hash from it
      return calculateMD5(blob)
    })
}
