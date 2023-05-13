import { GradientOptions } from "audiomotion-analyzer";

export interface GradientInformation
  extends Omit<GradientOptions, 'colorStops'> {
  colorStops: { pos: number; color: string }[]
  name: string
  id: number
}

export interface GradientInformationExtended extends GradientInformation {
  collapsed?: boolean;
  sliderOptions: any;
}
