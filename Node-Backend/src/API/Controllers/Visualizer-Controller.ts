import {
  Body,
  Controller,
  Delete,
  Example,
  Get,
  Path,
  Put,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa'
import { InformationService } from '../Services/InformationService'
import { GradientInformation } from '../../Types/GradientInformation'
import { ModeInformation } from '../../Types/ModeInformation'

@Route('visualizer')
@Tags('visualizer')
export class VisualizerController extends Controller {
  private readonly informationService: InformationService = new InformationService()

  @Get('gradients')
  @SuccessResponse(200, 'OK')
  @Example<GradientInformation[]>([
    {
      name: 'Apple',
      bgColor: '#111',
      colorStops: [
        {
          pos: 0.1667,
          color: '#61bb46',
        },
        {
          pos: 1,
          color: '#009ddc',
        },
      ],
    },
    {
      name: 'Aurora',
      bgColor: '#0e172a',
      colorStops: [
        {
          pos: 0.1,
          color: 'hsl( 120, 100%, 50% )',
        },
        {
          pos: 1,
          color: 'hsl( 216, 100%, 50% )',
        },
      ],
    },
  ])
  public async getGradients(): Promise<GradientInformation[]> {
    this.setStatus(200)

    return this.informationService.getVisualizerGradients()
  }

  @Get('modes')
  @SuccessResponse(200, 'OK')
  @Example<ModeInformation[]>([
    {
      mode: 0,
      name: 'Discrete frequencies',
    },
    {
      mode: 1,
      name: '1/24th octave bands',
    },
  ])
  public getVisualizerModes(): Promise<ModeInformation[]> {
    this.setStatus(200)
    return this.informationService.getVisualizerModes()
  }

  @Put('gradients/{name}')
  @SuccessResponse(204, 'No content')
  public editGradient(
    @Path('name') name: string,
    @Body() gradient: GradientInformation
  ): Promise<void> {
    return this.informationService.editVisualizerGradient(name, gradient)
  }

  @Delete('gradients/{name}')
  @SuccessResponse(200, 'OK')
  public removeGradient(
    @Path('name') name: string
  ): Promise<GradientInformation[]> {
    this.setStatus(200)
    return this.informationService.removeVisualizerGradient(name)
  }
}
