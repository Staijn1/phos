import { WebsocketServer } from '../WebsocketServer/WebsocketServer'
import { ExpressServer } from '../API/ExpressServer'

/**
 * The main class in this program. It all starts from here
 */
class Main {
  private readonly websocketServer: WebsocketServer = new WebsocketServer()
  private readonly apiServer: ExpressServer = new ExpressServer()

  /**
   * Start the program
   */
  start(): void {
    this.websocketServer.setup()
    this.apiServer.setup().then()
  }
}

const run = () => {
  const program = new Main()
  program.start()
}

run()
