import { Body, Controller, Get, Post, Route, SuccessResponse, Tags } from 'tsoa'
import { ModeInformation } from '../../Types/ModeInformation'
import {
  commandHandler,
  CommandHandler,
} from '../../CommandHandler/CommandHandler'
import { InformationService } from '../Services/InformationService'

@Route('mode')
@Tags('Mode')
export class ModeController extends Controller {
  private readonly commandHandler: CommandHandler = commandHandler
  private readonly informationservice: InformationService = new InformationService()

  @Post()
  @SuccessResponse(202, 'Accepted')
  public async setMode(@Body() request: ModeInformation): Promise<void> {
    this.setStatus(202)
    this.commandHandler.changeMode(request.mode)
  }

  @Get()
  @SuccessResponse(200, 'OK')
  public async getModes(): Promise<ModeInformation[]> {
    this.setStatus(200)
    return this.informationservice.getModes()
  }
}
