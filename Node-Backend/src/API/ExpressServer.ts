import express, { Express, NextFunction, Request, Response } from 'express'
import { RegisterRoutes } from './Controllers/generated/routes'
import { prettyPrint } from '../Utils/functions'
import { logger } from '../Config/Logger'
import { ValidateError } from '@tsoa/runtime'
import swaggerUI from 'swagger-ui-express'
import cors from 'cors'
import { API_PORT, SSLOptions } from '../Config/Config'
import https, { Server } from 'https'

/**
 * Create the express expressServer with it's routes
 */
export class ExpressServer {
  private expressServer: Express
  private httpsServer: Server

  /**
   * Zet de expressServer op
   * @return {Promise<void>}
   */
  public async setup(): Promise<void> {
    this.expressServer = express()
    this.setupStandardMiddlewares()
    this.configureApiEndpoints()
    this.setupErrorHandler()
    this.startHTTPSServer()
    this.start()
  }

  /**
   * Zet de middlewares op die worden gebruikt.
   * @private
   */
  private setupStandardMiddlewares() {
    // JSON
    this.expressServer.use(express.json())
    // CORS
    this.expressServer.use(cors())

    // Log every request
    this.expressServer.use((req, res, next) => {
      if (!req.originalUrl.startsWith('/docs/')) {
        logger.info(prettyPrint({ method: req.method, url: req.originalUrl }))
      }
      next()
    })

    // Swagger
    this.expressServer.use(
      '/docs',
      swaggerUI.serve,
      async (_req: Request, res: Response) => {
        return res.send(
          swaggerUI.generateHTML(await import('../../swagger.json'))
        )
      }
    )
  }

  /**
   * Registreer de endpoints.
   * @private
   */
  private configureApiEndpoints() {
    RegisterRoutes(this.expressServer)

    this.expressServer.use((req: Request, res: Response) => {
      const response = {
        message: 'Route not found',
        method: `${req.method}`,
        route: req.protocol + '://' + req.get('Host') + req.url,
      }
      logger.warn(`Route not found. ${prettyPrint(response)}`)
      res.status(404).json(response)
    })
  }

  /**
   * Start de expressServer
   * @private
   */
  private start() {
    this.httpsServer.listen(API_PORT, () => {
      logger.info(`Running on port ${API_PORT}`)
    })
  }

  /**
   * Custom error handler moet altijd als laatste worden aangeroepen. Dus eerst middleware, routes en dan error handling.
   * @private
   */
  private setupErrorHandler(): void {
    this.expressServer.use(
      (
        err: Error | ValidateError,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        if (err instanceof ValidateError) {
          logger.warn(
            `Caught Validation Error for ${req.route}: ${prettyPrint(
              err.fields
            )}`
          )
          return res.status(422).json({
            message: 'Validation Failed',
            details: err?.fields,
          })
        } else {
          logger.error(`Error ${err} stack ${err.stack}`)
          return res.status(500).json({ message: { err } })
        }
      }
    )
  }

  /**
   * Start the https server with the SSL options from config
   * @private
   */
  private startHTTPSServer() {
    this.httpsServer = https.createServer(SSLOptions, this.expressServer)
  }
}
