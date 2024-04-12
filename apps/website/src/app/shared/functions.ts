import {constrain, RoomState} from '@angulon/interfaces';
import {GlobalVars} from './constants';
import {RGBObject} from './types/types';
import {merge} from 'lodash';
import {ClientNetworkState} from '../../redux/networkstate/ClientNetworkState';
import iro from '@jaames/iro';


/**
 * Map a number from one scale to another. This function is the same as the map() function from arduino.
 * For example, input 2 from a scale 1 to 4 becomes: 5 from scale 1 to 10
 * @param value
 * @param start1
 * @param stop1
 * @param start2
 * @param stop2
 * @param withinBounds
 * @returns A number within the new range
 */
export const mapNumber = (value: number, start1: number, stop1: number, start2: number, stop2: number, withinBounds = false): number => {
  const newval = (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
};

/**
 * Get red, green and blue input and calcule the BGR integer. This is needed for razer chroma
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @returns {number}
 */
export const calculateBGRInteger = (red: number, green: number, blue: number): number => {
  if (red === undefined || red === null || green === undefined || green === null || blue === undefined || blue === null) {
    throw new Error('Invalid parameters!');
  }
  return 65536 * blue + 256 * green + red;
};


/**
 * Put a value 0 to 255 in to get a color value.
 * The colours are a transition r -> g -> b -> back to r
 * Inspired by the Adafruit examples.
 * @param {number} pos
 * @return {number}
 */
export function color_wheel(pos: number): number {
  pos = 255 - pos;
  if (pos < 85) {
    return ((255 - pos * 3) << 16) | ((0) << 8) | (pos * 3);
  } else if (pos < 170) {
    pos -= 85;
    return ((0) << 16) | ((pos * 3) << 8) | (255 - pos * 3);
  } else {
    pos -= 170;
    return ((pos * 3) << 16) | ((255 - pos * 3) << 8) | (0);
  }
}

/**
 * Returns true if the two colors are similar
 * @param color1
 * @param color2
 * @param threshold
 */
export const areColorsSimilar = (color1: iro.Color, color2: iro.Color, threshold = 100): boolean => {
  const rgb1 = color1.rgb;
  const rgb2 = color2.rgb;

  const distance = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );

  return distance < threshold;
};

/**
 * Seperate an RGB number into seperate red, green and blue values.
 * @param {number} rgb
 * @return {number[]}
 */
export function convertRGBIntegerToArray(rgb: number): number[] {
  const red = (rgb >> 16) & 0xFF;
  const green = (rgb >> 8) & 0xFF;
  const blue = rgb & 0xFF;
  return [red, green, blue];
}

/**
 * Generate a random number
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Add one byte to another, saturating at 0xFF
 * @param i - first byte to add
 * @param j - second byte to add
 *  * @returns the sum of i & j, capped at 0xFF
 */
export function qadd8(i: number, j: number): number {
  let t = i + j;
  if (t > 255) {
    t = 255;
  }
  return t;
}

/**
 * subtract one byte from another, saturating at 0x00
 * @returns i - j with a floor of 0
 */
export function qsub8(i: number, j: number): number {
  let t = i - j;
  if (t < 0) {
    t = 0;
  }
  return t;
}

/**
 * Warm a color by temperature
 * @param {number} temperature
 * @return {any}
 * @constructor
 */
export function WarmColor(temperature: number): any {
  const heatcolor: RGBObject = {
    r: undefined,
    g: undefined,
    b: undefined
  };

  // Scale 'heat' down from 0-255 to 0-191,
  // which can then be easily divided into three
  // equal 'thirds' of 64 units each.
  const t192 = mapNumber(temperature, 0, 255, 0, 191);

  // calculate a value that ramps up from
  // zero to 255 in each 'third' of the scale.
  let heatramp = t192 & 0x3F; // 0..63
  heatramp <<= 2; // scale up to 0..252
  // now figure out which third of the spectrum we're in:
  if (t192 & 0x80) {
    // we're in the hottest third
    heatcolor.r = 255; // full red
    heatcolor.g = 255; // full green
    heatcolor.b = heatramp; // ramp up blue
  } else if (t192 & 0x40) {
    // we're in the middle third
    heatcolor.r = 255; // full red
    heatcolor.g = heatramp; // ramp up green
    heatcolor.b = 0; // no blue

  } else {
    // we're in the coolest third
    heatcolor.r = heatramp; // ramp up red
    heatcolor.g = 0; // no green
    heatcolor.b = 0; // no blue
  }

  return heatcolor;
}

/**
 * Same as warm color, but makes color colder.
 * @param {number} temperature
 * @return {any}
 * @constructor
 */
export function ColdColor(temperature: number): any {
  const heatcolor: RGBObject = {
    r: undefined,
    g: undefined,
    b: undefined
  };

  // Scale 'heat' down from 0-255 to 0-191,
  // which can then be easily divided into three
  // equal 'thirds' of 64 units each.
  const t192 = mapNumber(temperature, 0, 255, 0, 191);

  // calculate a value that ramps up from
  // zero to 255 in each 'third' of the scale.
  let coldramp = t192 & 0x3F; // 0..63
  coldramp <<= 2; // scale up to 0..252

  // now figure out which third of the spectrum we're in:
  if (t192 & 0x80) {
    // we're in the hottest third
    heatcolor.r = coldramp; // ramp up red
    heatcolor.g = 255; // full green
    heatcolor.b = 255; // full blue
  } else if (t192 & 0x40) {
    // we're in the middle third
    heatcolor.r = 0; // no red
    heatcolor.g = coldramp; // ramp up green
    heatcolor.b = 255; // full blue

  } else {
    // we're in the coolest third
    heatcolor.r = 0; // no blue
    heatcolor.g = 0; // no green
    heatcolor.b = coldramp; // ramp up blue
  }

  return heatcolor;
}

/**
 * Returns a new, random wheel index with a minimum distance of 42 from pos.
 */
export function get_random_wheel_index(pos: number): number {
  let r = 0;
  let x = 0;
  let y = 0;
  let d = 0;

  while (d < 42) {
    r = random8();
    x = Math.abs(pos - r);
    y = 255 - x;
    d = Math.min(x, y);
  }

  return r;
}

/**
 * fast 8-bit random number generator shamelessly borrowed from FastLED
 * @return {number}
 */
export function random8(): number {
  GlobalVars.rand16seed = (GlobalVars.rand16seed * 2053) + 13849;
  return ((GlobalVars.rand16seed + (GlobalVars.rand16seed >> 8)) & 0xFF);
}

export const getDeviceType = (): string | void => {
  const userAgent = navigator.userAgent;
  const devices: Map<string, boolean> = new Map([
    ['iPad', /iPad/.test(userAgent)],
    ['iPhone', /iPhone/.test(userAgent)],
    ['Android', /Android/.test(userAgent)],
    ['Windows', /Windows/.test(userAgent)]
  ]);

  for (const [key, value] of devices) {
    if (value) return key;
  }
};

/**
 * Loads an object from the localstorage, merges it with the default value so any new keys are added with their default values.
 * If the key does not exist in the local storage, the entire default object is returned.
 * @param key
 * @param defaultValue
 */
export const loadObjectFromLocalStorage = (key: string, defaultValue: Record<string, unknown> | Array<unknown>) => {
  const localStorageItem = localStorage.getItem(key);
  if (localStorageItem) {
    const parsedItem = JSON.parse(localStorageItem);
    return merge(defaultValue, parsedItem);
  }
  return defaultValue;
};

/**
 * Prefixes the current URL with "api.". Used to deploy to different environments, production and demo.
 * @example "https://some.domain.com" becomes "https://api.some.domain.com"
 */
export const prefixURLWithApi = () => {
  // Get the current URL
  const currentUrl = window.location.href;

  // Split the URL into its parts
  const urlParts = currentUrl.split('//');

  // Check if we have the protocol and hostname
  if (urlParts.length === 2) {
    const [protocol, rest] = urlParts;
    const [hostname] = rest.split('/');

    // Add "api." to the hostname
    const modifiedHostname = 'api.' + hostname;

    // Reconstruct the modified URL
    return `${protocol}//${modifiedHostname}`;
  } else {
    // Invalid URL format
    return currentUrl;
  }
};

export interface ThemeColors {
  primary: string;
  primaryFocus: string;
  primaryContent: string;
  secondary: string;
  secondaryFocus: string;
  secondaryContent: string;
  accent: string;
  accentFocus: string;
  accentContent: string;
  neutral: string;
  neutralFocus: string;
  neutralContent: string;
  base100: string;
  base200: string;
  base300: string;
  baseContent: string;
  info: string;
  infoContent: string;
  success: string;
  successContent: string;
  warning: string;
  warningContent: string;
  error: string;
  errorContent: string;
}


/**
 * Function to return a state object based on the currently selected rooms.
 * Multiple rooms can be selected at once and we assume that the state of the selected rooms is the same.
 * If no rooms are selected we return null.
 * @param state
 */
export const getStateOfSelectedRooms = (state: ClientNetworkState | null | undefined): RoomState | null => {
  if (!state) return null;

  const selectedRoomIds = state.selectedRooms.map(room => room.id);
  const selectedRooms = state.rooms.filter(room => selectedRoomIds.includes(room.id));

  if (selectedRooms.length === 0) return null;

  return selectedRooms[0].state;
};
