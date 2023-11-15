export type RazerChromaSDKResponse = {
  result: ChromaSDKErrorCodes
}

/**
 * Possible error codes returned from the Razer SDK
 * Taken from the official documentation.
 * {@link https://assets.razerzone.com/dev_portal/websocket/html/_rz_errors_8h_source.html}
 */
export enum ChromaSDKErrorCodes {
  INVALID = -1,
  SUCCESS = 0,
  ACCESS_DENIED = 5,
  INVALID_HANDLE = 6,
  NOT_SUPPORTED = 50,
  INVALID_PARAMETER = 87,
  SERVICE_NOT_ACTIVE = 1062,
  SINGLE_INSTANCE_APP = 1152,
  DEVICE_NOT_CONNECTED = 1167,
  NOT_FOUND = 1168,
  REQUEST_ABORTED = 1235,
  ALREADY_INITIALIZED = 1247,
  RESOURCE_DISABLED = 4309,
  DEVICE_NOT_AVAILABLE = 4319,
  NOT_VALID_STATE = 5023,
  NO_MORE_ITEMS = 259,
  FAILED = 2147500037,
}


/**
 * The keyboard layout is a 2D array of numbers where each number represents a key on the keyboard
 * 6 rows 22 columns, no more, no less.
 */
export type KeyboardLayout =
  [
    KeyboardRow,
    KeyboardRow,
    KeyboardRow,
    KeyboardRow,
    KeyboardRow,
    KeyboardRow
  ];

export type KeyboardRow = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];

export const KEYBOARD_ROWS = 6;

export const KEYBOARD_COLUMNS = 22;


/**
 * Mouse constants and layout
 */
export type MouseLayout =
  [
    MouseRow,
    MouseRow,
    MouseRow,
    MouseRow,
    MouseRow,
    MouseRow,
    MouseRow,
    MouseRow,
    MouseRow
  ];

export type MouseRow = [number, number, number, number, number, number, number];

export const MOUSE_ROWS = 9;

export const MOUSE_COLUMNS = 7;

export enum ChromaKeyboardEffectType {
  CHROMA_CUSTOM_KEY = "CHROMA_CUSTOM_KEY",
  CHROMA_STATIC = "CHROMA_STATIC",
  CHROMA_CUSTOM = "CHROMA_CUSTOM",
  CHROMA_NONE = "CHROMA_NONE",
}

export enum ChromaHeadsetEffectType {
  CHROMA_CUSTOM_KEY = "CHROMA_CUSTOM_KEY",
  CHROMA_STATIC = "CHROMA_STATIC",
  CHROMA_CUSTOM = "CHROMA_CUSTOM",
  CHROMA_NONE = "CHROMA_NONE",
}

export enum ChromaMouseEffectType {
  CHROMA_NONE = "CHROMA_NONE",
  CHROMA_CUSTOM2 = "CHROMA_CUSTOM2",
  CHROMA_STATIC = "CHROMA_STATIC",
}
