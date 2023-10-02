export class GlobalVars {
  public static NUM_LEDS = 30;
  public static rand16seed = 1337;
}

export type Theme = {
  name: string;
  color: string;
}
export const themes: Theme[] = [
  { name: "default", color: "#3e92cc" },
  { name: "carrot", color: "#e18a3a" },
  { name: "banana", color: "#F5CF38" },
  { name: "cherry", color: "#c0392b" },
  { name: "sunday", color: "#41888" },
  { name: "leaf", color: "#27ae60" },
  { name: "candy-cane", color: "#cf8093" },
  { name: "seaweed", color: "#999c41" },
  { name: "sulfur", color: "#485156" },
  { name: "yucca", color: "#1a5c40" },
  { name: "walnut", color: "#6d6552" },
  { name: "elderberry", color: "#cb5845" },
];

export const visualizerModeId = 72;
