import './logger'
import {parse as pgParse} from 'pg-connection-string'
import {makeServer} from './server/server'
import postgresBackend from './backends/postgresql'
import {makeWebSocketServer} from './web-socket'
import {ServerConfig} from './server/domain'

export const run = async ({
  uri,
  backend,
  apiKey,
}: {
  uri: string
  backend: string
  apiKey: string
}) => {
  console.log('Starting connector...')
  const pgDetails = pgParse(uri)

  const pgBackend = await postgresBackend({
    host: pgDetails.host!,
    username: pgDetails.user!,
    password: pgDetails.password!,
    port: parseInt(pgDetails.port!, 10),
  })

  const serverConfig: ServerConfig = {
    primaryDatabaseName: pgDetails.database!,
    additionalDatabaseNames: ['dbsupervisor_test'],
  }

  await pgBackend.initialize({serverConfig})

  const server = makeServer({
    config: serverConfig,
    backend: pgBackend,
  })

  console.log('Connector initialized')

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await makeWebSocketServer({
        url: backend,
        token: apiKey,
        server,
      })
    } catch (error) {
      console.error(error)
      console.error('Connection closed - retrying connection in 10 seconds...')
      await new Promise((resolve) => {
        setTimeout(resolve, 10_000)
      })
    }
  }
}
