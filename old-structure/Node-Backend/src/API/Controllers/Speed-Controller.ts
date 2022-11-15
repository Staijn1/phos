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
import { SpeedInformation } from '../../Types/SpeedInformation'
import { InformationService } from '../Services/InformationService'

@Route('speed')
@Tags('Speed')
export class SpeedController extends Controller {
  private commandHandler: CommandHandler = commandHandler
  private informationService: InformationService = new InformationService()

  @Post('increase')
  @Deprecated()
  @SuccessResponse(202, 'Accepted')
  public async increaseSpeed(): Promise<void> {
    this.setStatus(202)
    this.commandHandler.increaseSpeed()
  }

  @Post('decrease')
  @Deprecated()
  @SuccessResponse(202, 'Accepted')
  public async decreaseSpeed(): Promise<void> {
    this.setStatus(202)
    this.commandHandler.decreaseSpeed()
  }

  @Post('set')
  @SuccessResponse(200, 'OK')
  public async setSpeed(
    @Body() speed: SpeedInformation
  ): Promise<SpeedInformation> {
    return this.informationService.setSpeed(speed.speed)
  }

  @Get()
  @SuccessResponse(200, 'OK')
  public async getSpeed(): Promise<SpeedInformation> {
    return this.informationService.getSpeed()
  }
}
