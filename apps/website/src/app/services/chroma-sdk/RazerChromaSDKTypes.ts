export type RazerChromaSDKTypes = unknown;

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
  ]

export type KeyboardRow = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]

export const KEYBOARD_ROWS = 6;

export const KEYBOARD_COLUMNS = 22;
