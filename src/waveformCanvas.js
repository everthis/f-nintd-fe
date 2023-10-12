import EventEmitter from 'event-emitter'

/*
 * virtual-dom hook for drawing to the canvas element.
 */
class CanvasHook {
  constructor(peaks, offset, bits, color, scale, height, barWidth, barGap) {
    this.peaks = peaks
    // http://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element
    this.offset = offset
    this.color = color
    this.bits = bits
    this.scale = scale
    this.height = height
    this.barWidth = barWidth
    this.barGap = barGap
  }

  static drawFrame(cc, h2, x, minPeak, maxPeak, width, gap) {
    const min = Math.abs(minPeak * h2)
    const max = Math.abs(maxPeak * h2)

    // draw max
    cc.fillRect(x, 0, width, h2 - max)
    // draw min
    cc.fillRect(x, h2 + min, width, h2 - min)
    // draw gap
    if (gap !== 0) {
      cc.fillRect(x + width, 0, gap, h2 * 2)
    }
  }

  hook(canvas, prop, prev) {
    // canvas is up to date
    if (
      prev !== undefined &&
      prev.peaks === this.peaks &&
      prev.scale === this.scale &&
      prev.height === this.height
    ) {
      return
    }

    const scale = this.scale
    const len = canvas.width / scale
    const cc = canvas.getContext('2d')
    const h2 = canvas.height / scale / 2
    const maxValue = 2 ** (this.bits - 1)
    const width = this.barWidth
    const gap = this.barGap
    const barStart = width + gap

    cc.clearRect(0, 0, canvas.width, canvas.height)

    cc.save()
    cc.fillStyle = this.color
    cc.scale(scale, scale)

    for (let pixel = 0; pixel < len; pixel += barStart) {
      const minPeak = this.peaks[(pixel + this.offset) * 2] / maxValue
      const maxPeak = this.peaks[(pixel + this.offset) * 2 + 1] / maxValue
      CanvasHook.drawFrame(cc, h2, pixel, minPeak, maxPeak, width, gap)
    }

    cc.restore()
  }
}

export default CanvasHook

class Cls {
  constructor() {
    const ctx = config.ac || new AudioContext()
  }
  calculatePeaks(samplesPerPixel, sampleRate) {
    const cueIn = secondsToSamples(this.cueIn, sampleRate)
    const cueOut = secondsToSamples(this.cueOut, sampleRate)

    this.setPeaks(
      extractPeaks(
        this.buffer,
        samplesPerPixel,
        this.peakData.mono,
        cueIn,
        cueOut
      )
    )
  }

  setPeaks(peaks) {
    this.peaks = peaks
  }
}

export function samplesToSeconds(samples, sampleRate) {
  return samples / sampleRate
}

export function secondsToSamples(seconds, sampleRate) {
  return Math.ceil(seconds * sampleRate)
}

export function samplesToPixels(samples, resolution) {
  return Math.floor(samples / resolution)
}

export function pixelsToSamples(pixels, resolution) {
  return Math.floor(pixels * resolution)
}

export function pixelsToSeconds(pixels, resolution, sampleRate) {
  return (pixels * resolution) / sampleRate
}

export function secondsToPixels(seconds, resolution, sampleRate) {
  return Math.ceil((seconds * sampleRate) / resolution)
}

export const STATE_UNINITIALIZED = 0
export const STATE_LOADING = 1
export const STATE_DECODING = 2
export const STATE_FINISHED = 3

export class Loader {
  constructor(src, audioContext, ee = EventEmitter()) {
    this.src = src
    this.ac = audioContext
    this.audioRequestState = STATE_UNINITIALIZED
    this.ee = ee
  }

  setStateChange(state) {
    this.audioRequestState = state
    this.ee.emit('audiorequeststatechange', this.audioRequestState, this.src)
  }

  fileProgress(e) {
    let percentComplete = 0

    if (this.audioRequestState === STATE_UNINITIALIZED) {
      this.setStateChange(STATE_LOADING)
    }

    if (e.lengthComputable) {
      percentComplete = (e.loaded / e.total) * 100
    }

    this.ee.emit('loadprogress', percentComplete, this.src)
  }

  fileLoad(e) {
    const audioData = e.target.response || e.target.result

    this.setStateChange(STATE_DECODING)

    return new Promise((resolve, reject) => {
      this.ac.decodeAudioData(
        audioData,
        (audioBuffer) => {
          this.audioBuffer = audioBuffer
          this.setStateChange(STATE_FINISHED)

          resolve(audioBuffer)
        },
        (err) => {
          if (err === null) {
            // Safari issues with null error
            reject(Error('MediaDecodeAudioDataUnknownContentType'))
          } else {
            reject(err)
          }
        }
      )
    })
  }
}

export class BlobLoader extends Loader {
  /*
   * Loads an audio file via a FileReader
   */
  load() {
    return new Promise((resolve, reject) => {
      if (
        this.src.type.match(/audio.*/) ||
        // added for problems with Firefox mime types + ogg.
        this.src.type.match(/video\/ogg/)
      ) {
        const fr = new FileReader()

        fr.readAsArrayBuffer(this.src)

        fr.addEventListener('progress', (e) => {
          super.fileProgress(e)
        })

        fr.addEventListener('load', (e) => {
          const decoderPromise = super.fileLoad(e)

          decoderPromise
            .then((audioBuffer) => {
              resolve(audioBuffer)
            })
            .catch(reject)
        })

        fr.addEventListener('error', reject)
      } else {
        reject(Error(`Unsupported file type ${this.src.type}`))
      }
    })
  }
}
