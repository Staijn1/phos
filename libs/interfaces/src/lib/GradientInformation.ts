import {GradientOptions} from 'audiomotion-analyzer'
import {ArrayTwoOrMore} from "./ArrayTwoOrMore";

type ColorStop = {
  pos: number
  color: string
}

export interface GradientInformation
  extends Omit<GradientOptions, 'colorStops'> {
  colorStops: ArrayTwoOrMore<ColorStop>
  name: string
  id: number
}

export interface GradientInformationExtended extends GradientInformation {
  collapsed?: boolean;
  sliderOptions: any;
}
