import { request, server as WebSocketServer } from 'websocket'
import { SSLOptions, WEBSOCKET_PORT } from '../Config/Config'
import {
  commandHandler,
  CommandHandler,
} from '../CommandHandler/CommandHandler'
import { logger } from '../Config/Logger'
import * as https from 'https'

/**
 * Class that holds information about the websocket server
 */
export class WebsocketServer {
  httpsserver: https.Server
  wssServer: WebSocketServer
  private readonly commandHandler: CommandHandler = commandHandler

  /**
   * Set the server up
   */
  setup(): void {
    this.httpsserver = https.createServer(SSLOptions, (req, res) => {
      res.writeHead(200)
      res.end('Hello')
    })
    this.httpsserver.listen(WEBSOCKET_PORT, () =>
      logger.info(`Websocket server running on port ${WEBSOCKET_PORT}`)
    )

    this.wssServer = new WebSocketServer({
      httpServer: this.httpsserver,
    })

    this.wssServer.on('request', (req: request) => {
      const connection = req.accept(null, req.origin)

      connection.on('message', this.handleMessage.bind(this))
    })
  }

  /**
   * This function will forward all messages to the command handler
   * @param {IMessage} message
   * @private
   */
  private handleMessage(message: any): void {
    // message is of type IMessage, the type chrashes the dockerfile
    this.commandHandler.handleMessage(message)
  }
}
