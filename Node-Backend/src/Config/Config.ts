import fs from 'fs'
import path from 'path'

export const API_PORT = 5000
export const WEBSOCKET_PORT = 5001
export const ledstripAdresses = ['ws://bed.local:81', 'ws://bureau.local:81']
export const SSLOptions = {
  key: fs.readFileSync(path.join(__dirname, '..', 'Certs', 'raspberry.key')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'Certs', 'raspberry.crt')),
}
