import winston, { format } from 'winston'
import path from 'path'

export const logger = winston.createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.colorize(), format.json()),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //

    new winston.transports.Console({
      format: format.combine(
        format.timestamp(),
        format.align(),
        format.simple()
      ),
    }),
   /* new winston.transports.File({
      filename: path.join(__dirname, '..', 'logs', 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '..', 'logs', 'combined.log'),
    }),*/
  ],
})
