import { GlobalVars } from './constants'

/**
 * Map a value from one scale to another. This function is the same as the map() function from arduino.
 * For example, input 2 from a scale 1 to 4 becomes: 5 from scale 1 to 10
 * @param value
 * @param start1
 * @param stop1
 * @param start2
 * @param stop2
 * @param {boolean} withinBounds
 * @returns {number}
 */
export function map(value, start1, stop1, start2, stop2, withinBounds = false): number {
  const newval = (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
  if (!withinBounds) {
    return newval
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2)
  } else {
    return constrain(newval, stop2, start2)
  }
}

/**
 * Limit a number to a certain maximum.
 * @param value
 * @param low
 * @param high
 * @returns {number}
 */
export function constrain(value, low, high): number {
  return Math.max(Math.min(value, high), low)
}

/**
 * Get red, green and blue input and calcule the BGR integer. This is needed for razer chroma
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @returns {number}
 */
export function calculateBGRInteger(red: number, green: number, blue: number): number {
  if (red === undefined || red === null || green === undefined || green === null || blue === undefined || blue === null) {
    throw new Error('Invalid parameters!')
  }
  return 65536 * blue + 256 * green + red
}


/**
 * Put a value 0 to 255 in to get a color value.
 * The colours are a transition r -> g -> b -> back to r
 * Inspired by the Adafruit examples.
 * @param {number} pos
 * @return {number}
 */
export function color_wheel(pos: number): number {
  pos = 255 - pos
  if (pos < 85) {
    return ((255 - pos * 3) << 16) | ((0) << 8) | (pos * 3)
  } else if (pos < 170) {
    pos -= 85
    return ((0) << 16) | ((pos * 3) << 8) | (255 - pos * 3)
  } else {
    pos -= 170
    return ((pos * 3) << 16) | ((255 - pos * 3) << 8) | (0)
  }
}

/**
 * Seperate an RGB number into seperate red, green and blue values.
 * @param {number} rgb
 * @return {number[]}
 */
export function convertRGBIntegerToArray(rgb: number): number[] {
  const red = (rgb >> 16) & 0xFF
  const green = (rgb >> 8) & 0xFF
  const blue = rgb & 0xFF
  return [red, green, blue]
}

/**
 * Generate a random number
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Add one byte to another, saturating at 0xFF
 * @param i - first byte to add
 * @param j - second byte to add
 *  * @returns the sum of i & j, capped at 0xFF
 */
export function qadd8(i: number, j: number): number {
  let t = i + j
  if (t > 255) {
    t = 255
  }
  return t
}

/**
 * subtract one byte from another, saturating at 0x00
 * @returns i - j with a floor of 0
 */
export function qsub8(i: number, j: number): number {
  let t = i - j
  if (t < 0) {
    t = 0
  }
  return t
}

/**
 * Warm a color by temperature
 * @param {number} temperature
 * @return {any}
 * @constructor
 */
export function WarmColor(temperature: number): any {
  const heatcolor = {
    r: undefined,
    g: undefined,
    b: undefined,
  }

  // Scale 'heat' down from 0-255 to 0-191,
  // which can then be easily divided into three
  // equal 'thirds' of 64 units each.
  const t192 = map(temperature, 0, 255, 0, 191)

  // calculate a value that ramps up from
  // zero to 255 in each 'third' of the scale.
  let heatramp = t192 & 0x3F // 0..63
  heatramp <<= 2 // scale up to 0..252
  // now figure out which third of the spectrum we're in:
  if (t192 & 0x80) {
    // we're in the hottest third
    heatcolor.r = 255 // full red
    heatcolor.g = 255 // full green
    heatcolor.b = heatramp // ramp up blue
  } else if (t192 & 0x40) {
    // we're in the middle third
    heatcolor.r = 255 // full red
    heatcolor.g = heatramp // ramp up green
    heatcolor.b = 0 // no blue

  } else {
    // we're in the coolest third
    heatcolor.r = heatramp // ramp up red
    heatcolor.g = 0 // no green
    heatcolor.b = 0 // no blue
  }

  return heatcolor
}

/**
 * Same as warm color, but makes color colder.
 * @param {number} temperature
 * @return {any}
 * @constructor
 */
export function ColdColor(temperature: number): any {
  const heatcolor = {
    r: undefined,
    g: undefined,
    b: undefined,
  }

  // Scale 'heat' down from 0-255 to 0-191,
  // which can then be easily divided into three
  // equal 'thirds' of 64 units each.
  const t192 = map(temperature, 0, 255, 0, 191)

  // calculate a value that ramps up from
  // zero to 255 in each 'third' of the scale.
  let coldramp = t192 & 0x3F // 0..63
  coldramp <<= 2 // scale up to 0..252

  // now figure out which third of the spectrum we're in:
  if (t192 & 0x80) {
    // we're in the hottest third
    heatcolor.r = coldramp // ramp up red
    heatcolor.g = 255 // full green
    heatcolor.b = 255 // full blue
  } else if (t192 & 0x40) {
    // we're in the middle third
    heatcolor.r = 0 // no red
    heatcolor.g = coldramp // ramp up green
    heatcolor.b = 255 // full blue

  } else {
    // we're in the coolest third
    heatcolor.r = 0 // no blue
    heatcolor.g = 0 // no green
    heatcolor.b = coldramp // ramp up blue
  }

  return heatcolor
}

/**
 * Returns a new, random wheel index with a minimum distance of 42 from pos.
 */
export function get_random_wheel_index(pos: number): number {
  let r = 0
  let x = 0
  let y = 0
  let d = 0

  while (d < 42) {
    r = random8()
    x = Math.abs(pos - r)
    y = 255 - x
    d = Math.min(x, y)
  }

  return r
}

/**
 * fast 8-bit random number generator shamelessly borrowed from FastLED
 * @return {number}
 */
export function random8(): number {
  GlobalVars.rand16seed = (GlobalVars.rand16seed * 2053) + 13849
  return ((GlobalVars.rand16seed + (GlobalVars.rand16seed >> 8)) & 0xFF)
}
