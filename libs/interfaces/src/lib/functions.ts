/**
 * Limit a number to a certain maximum and minimum.
 * @param value
 * @param low
 * @param high
 * @returns {number}
 */
export function constrain(value: number, low: number, high: number): number {
  return Math.max(Math.min(value, high), low)
}

/**
 * Merge two arrays, where the second array overwrites matching indexes in the first array
 * Returns a new array, does not mutate the original arrays
 * @example mergeArrays([1, 2, 3], [4, 5]) => [4, 5, 3]
 * @param array1
 * @param array2
 */
export const mergeArrays = (array1: any[], array2: any[]) => {
  return array1.map((item, index) => {
    if (array2[index]) {
      return array2[index];
    } else {
      return item;
    }
  });
}
