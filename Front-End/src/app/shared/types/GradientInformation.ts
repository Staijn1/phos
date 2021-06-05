import {GradientOptions} from 'audiomotion-analyzer';

export interface GradientInformation extends GradientOptions {
  name: string;
}


export interface GradientInformationExtended extends GradientInformation {
  collapsed: boolean;
  sliderOptions: any;
}
