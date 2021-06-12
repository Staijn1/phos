import {
  Body,
  Controller,
  Delete,
  Example,
  Get,
  Path,
  Post,
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
      id: 14,
      name: 'Tie Dye',
      bgColor: '#111',
      colorStops: [
        {
          pos: 0.038,
          color: 'rgb( 15, 209, 165 )',
        },
        {
          pos: 0.208,
          color: 'rgb( 15, 157, 209 )',
        },
        {
          pos: 0.519,
          color: 'rgb( 133, 13, 230 )',
        },
        {
          pos: 0.731,
          color: 'rgb( 230, 13, 202 )',
        },
        {
          pos: 0.941,
          color: 'rgb( 242, 180, 107 )',
        },
      ],
    },
    {
      id: 0,
      name: 'Clouds',
      bgColor: '#212224',
      colorStops: [
        {
          pos: 0.731,
          color: '#2b4051',
        },
        {
          pos: 0.519,
          color: '#3F5567',
        },
        {
          pos: 0.208,
          color: '#A7B8BE',
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

  @Put('gradients/{id}')
  @SuccessResponse(200, 'OK')
  public editGradient(
    @Path('id') id: number,
    @Body() gradient: GradientInformation
  ): Promise<GradientInformation[]> {
    return this.informationService.editVisualizerGradient(id, gradient)
  }

  @Delete('gradients/{id}')
  @SuccessResponse(200, 'OK')
  public removeGradient(
    @Path('id') id: number
  ): Promise<GradientInformation[]> {
    this.setStatus(200)
    return this.informationService.removeVisualizerGradient(id)
  }

  @Post('gradients')
  @SuccessResponse(201, 'Created')
  public addGradient(
    @Body() content: GradientInformation
  ): Promise<GradientInformation[]> {
    this.setStatus(201)
    return this.informationService.addVisualizerGradient(content)
  }
}
