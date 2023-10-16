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

export function streamData(response, readCb) {
  const reader = response.body.getReader()
  // read() returns a promise that resolves when a value has been received
  reader
    .read()
    .then(function pump({ done, value }) {
      readCb({ done, value })
      if (done) {
        // Do something with last chunk of data then exit reader
        return
      }
      // Otherwise do something here to process current chunk

      // Read some more, and call this function again
      return reader.read().then(pump)
    })
    .catch((err) => console.error(err))
}

export function samlpePeaks(arr, targetLen) {
  return pare(arr, targetLen)
}
function pare(a, m) {
  let b = new Array(m)
  let n2 = a.length - 2
  let m2 = m - 2
  b[0] = a[0]
  let i = 0
  let j = 0
  while (j < n2) {
    let diff = (i + 1) * n2 - (j + 1) * m2
    if (diff < n2 / 2) {
      i += 1
      j += 1
      b[i] = a[j]
    } else {
      j += 1
    }
  }
  b[m2 + 1] = a[n2 + 1]
  return b
}
