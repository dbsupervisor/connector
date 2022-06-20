import WebSocket from 'ws'
import {BackendType} from './backends/domain'
import {IncomingMessage, MessageType, OutgoingMessage} from './messages'
import {Server} from './server'

export const makeWebSocketServer = ({
  url,
  token,
  server,
}: {
  url: string
  token: string
  server: Server
}) =>
  new Promise((_, reject) => {
    const ws = new WebSocket(`${url}?AUTH_TOKEN=${token}`)

    const sendMessage = (message: OutgoingMessage) => {
      ws.send(JSON.stringify(message))
    }

    const handleMessage = async (message: IncomingMessage) => {
      switch (message.type) {
        case MessageType.GetSnapshot: {
          const snapshot = await server.getSnapshot()

          sendMessage({type: MessageType.GetSnapshotResponse, data: {snapshot}})

          break
        }
        default:
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          throw new Error(`Unknown incoming message type '${message.type}'`)
      }
    }

    ws.on('open', () => {
      sendMessage({
        type: MessageType.InitializeConnector,
        data: {
          backendType: BackendType.PostgreSQL,
        },
      })
    })

    ws.on('message', (data) => {
      const message: IncomingMessage = JSON.parse(data.toString())

      handleMessage(message).catch((error) => {
        console.error('Error handling message: ', message)
        console.error(error)
      })
    })

    ws.on('error', console.error)
    ws.on('close', reject)
  })
