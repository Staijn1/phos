import fs from 'fs'
import path from 'path'

export const API_PORT = 5000
export const WEBSOCKET_PORT = 5001
export const ledstripAdresses = [
  'ws://192.168.2.249:81',
  'ws://192.168.2.248:81',
]
export const SSLOptions = {
  key: fs.readFileSync(path.join(__dirname, '..', 'Certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '..', 'Certs', 'cert.pem')),
}