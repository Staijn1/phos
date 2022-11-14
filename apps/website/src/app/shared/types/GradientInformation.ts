import {GradientOptions} from 'audiomotion-analyzer'

export interface GradientInformation extends GradientOptions {
  name: string;
  id: number
}


export interface GradientInformationExtended extends GradientInformation {
  collapsed?: boolean;
  sliderOptions: any;
}
