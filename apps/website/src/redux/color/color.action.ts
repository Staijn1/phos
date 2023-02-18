import iro from "@jaames/iro";

export const colorChange = (color: iro.Color[]) => ({
  type: 'COLOR_CHANGE',
  payload: color
});
