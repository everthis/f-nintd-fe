// export const LOCAL = 'https://hk4.everthis.com:8083'
export const LOCAL = 'http://localhost:8083'
// export const LOCAL = 'http://192.168.2.114:8083'

export const API_ORIGIN = PRODUCTION ? 'https://hk4.everthis.com:8083' : LOCAL

export const TYPE = {
  IMG: 'image',
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
  ONE_FRAME_VIDEO: 'oneFrameVideo',
  TEXT: 'text',
  WAVEFORM: 'waveform',
}

export const EMPTY_OBJ = {}
export const EMPTY_ARR = []
export const EMPTY_SET = new Set()
export const EMPTY_MAP = new Map()
