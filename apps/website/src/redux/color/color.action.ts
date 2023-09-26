/**
 * @deprecated Use {@link ChangeLedstripColors} instead
 * @param {string[]} color
 * @param {boolean} updateLedstrips
 * @return {{payload: string[], updateLedstrips: boolean, type: string}}
 */
export const colorChange = (color: string[], updateLedstrips: boolean) => ({
  type: 'COLOR_CHANGE',
  payload: color,
  updateLedstrips: updateLedstrips,
});
