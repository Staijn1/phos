import {
  Body,
  Controller,
  Deprecated,
  Get,
  Post,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa'
import {
  commandHandler,
  CommandHandler,
} from '../../CommandHandler/CommandHandler'
import { BrightnessInformation } from '../../Types/BrightnessInformation'
import { InformationService } from '../Services/InformationService'

@Route('brightness')
@Tags('Brightness')
export class BrightnessController extends Controller {
  private commandHandler: CommandHandler = commandHandler
  private informationService: InformationService = new InformationService()

  @Post('increase')
  @Deprecated()
  @SuccessResponse(202, 'Accepted')
  public async increaseBrightness(): Promise<void> {
    this.setStatus(202)
    this.commandHandler.increaseBrightness()
  }

  @Post('decrease')
  @Deprecated()
  @SuccessResponse(202, 'Accepted')
  public async decreaseBrightness(): Promise<void> {
    this.setStatus(202)
    this.commandHandler.decreaseBrightness()
  }

  @Post('set')
  @SuccessResponse(200, 'OK')
  public async setBrightness(
    @Body() brightness: BrightnessInformation
  ): Promise<BrightnessInformation> {
    return this.informationService.setBrightness(brightness.brightness)
  }

  @Get()
  @SuccessResponse(200, 'OK')
  public async getBrightness(): Promise<BrightnessInformation> {
    return this.informationService.getBrightness()
  }
}
