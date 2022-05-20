export interface Gateway {
  id?: string
  name?: string
  ip?: string
  port?: number
  ws_port?: number
  apiKey?: string
  secured?: boolean
  isValid?: boolean
}

