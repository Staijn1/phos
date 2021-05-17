import { Body, Controller, Post, Route, SuccessResponse, Tags } from 'tsoa'
import {
  commandHandler,
  CommandHandler,
} from '../../CommandHandler/CommandHandler'
import { ColorInformation } from '../../Types/ColorInformation'

@Route('color')
@Tags('Color')
export class ColorController extends Controller {
  private commandHandler: CommandHandler = commandHandler

  @Post()
  @SuccessResponse(202, 'Accepted')
  public async setColor(@Body() request: ColorInformation): Promise<void> {
    this.setStatus(202)
    this.commandHandler.setColor(request.color)
  }
}
