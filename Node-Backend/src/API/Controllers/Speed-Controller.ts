import { Controller, Post, Route, SuccessResponse, Tags } from 'tsoa'
import {
  commandHandler,
  CommandHandler,
} from '../../CommandHandler/CommandHandler'

@Route('speed')
@Tags('Speed')
export class SpeedController extends Controller {
  private commandHandler: CommandHandler = commandHandler

  @Post('increase')
  @SuccessResponse(202, 'Accepted')
  public async increaseSpeed(): Promise<void> {
    this.setStatus(202)
    this.commandHandler.increaseSpeed()
  }

  @Post('decrease')
  @SuccessResponse(202, 'Accepted')
  public async decreaseSpeed(): Promise<void> {
    this.setStatus(202)
    this.commandHandler.decreaseSpeed()
  }
}
