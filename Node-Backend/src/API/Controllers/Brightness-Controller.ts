import { Controller, Post, Route, SuccessResponse, Tags } from 'tsoa'
import {
  commandHandler,
  CommandHandler,
} from '../../CommandHandler/CommandHandler'

@Route('brightness')
@Tags('Brightness')
export class BrightnessController extends Controller {
  private commandHandler: CommandHandler = commandHandler

  @Post('increase')
  @SuccessResponse(202, 'Accepted')
  public async increaseBrightness(): Promise<void> {
    this.setStatus(202)
    this.commandHandler.increaseBrightness()
  }

  @Post('decrease')
  @SuccessResponse(202, 'Accepted')
  public async decreaseBrightness(): Promise<void> {
    this.setStatus(202)
    this.commandHandler.decreaseBrightness()
  }
}
