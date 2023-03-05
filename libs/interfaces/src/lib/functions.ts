/**
 * Limit a number to a certain maximum.
 * @param value
 * @param low
 * @param high
 * @returns {number}
 */
export function constrain(value: number, low: number, high: number): number {
  return Math.max(Math.min(value, high), low)
}
