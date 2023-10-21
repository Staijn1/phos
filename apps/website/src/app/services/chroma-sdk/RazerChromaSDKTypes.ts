export type RazerChromaSDKTypes = Record<string, unknown>;

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
