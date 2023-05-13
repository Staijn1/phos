import { GradientOptions } from "audiomotion-analyzer";

export type ColorStop = { pos: number; color: string };
export interface GradientInformation
  extends Omit<GradientOptions, 'colorStops'> {
  colorStops: ColorStop[]
  name: string
  id: number
}

export interface GradientInformationExtended extends GradientInformation {
  collapsed?: boolean;
  sliderOptions: any;
}
