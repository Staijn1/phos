export const colorChange = (color: string[], updateLedstrips: boolean) => ({
  type: 'COLOR_CHANGE',
  payload: color,
  updateLedstrips,
});
