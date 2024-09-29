/**
 * Convert Hex string to RGB array
 * @param hex
 * @returns [R, G, B] array where R,G,B values range from 0 to 255
 */
export const hexToRgb = (hex: string): number[] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

/**
 * Convert RGB array to Hex string
 * @param r
 * @param g
 * @param b
 * @returns Hex string
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Calculate the average color for a segment of the payload
 * @param segment The segment of the payload
 * @returns The average color
 */
export const calculateAverageColor = (segment: string[]): string => {
  let r = 0, g = 0, b = 0;

  for (const color of segment) {
    const rgb = hexToRgb(color);
    r += rgb[0];
    g += rgb[1];
    b += rgb[2];
  }

  r = Math.round(r / segment.length);
  g = Math.round(g / segment.length);
  b = Math.round(b / segment.length);

  return rgbToHex(r, g, b);
}
