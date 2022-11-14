import { GradientOptions } from 'audiomotion-analyzer'

type ColorStop = {
  pos: number
  color: string
}

export interface GradientInformation
  extends Omit<GradientOptions, 'colorStops'> {
  colorStops: ColorStop[]
  name: string
  id: number
}
