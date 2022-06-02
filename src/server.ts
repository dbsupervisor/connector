import {Backend} from './backends'
import {Snapshot} from './snapshots'
import {Table} from './tables'

export interface ServerConfig {
  primaryDatabaseName: string
  additionalDatabaseNames: string[]
}

export interface Server {
  getSnapshot: () => Promise<Snapshot>
}

export const makeServer = ({
  backend,
  config,
}: {
  backend: Backend
  config: ServerConfig
}): Server => {
  const {primaryDatabaseName, additionalDatabaseNames} = config

  const getSnapshot = async (): Promise<Snapshot> => {
    console.log('Retrieving snapshot')

    const databases = await backend.getDatabases({primaryDatabaseName})
    const databasesToMonitor = [...additionalDatabaseNames, primaryDatabaseName]

    const tables = await databasesToMonitor.reduce(
      (promise, databaseName) =>
        promise.then(async (output) => {
          const databaseTables = await backend.getTables({databaseName})

          output.push(...databaseTables)

          return output
        }),
      Promise.resolve<Table[]>([]),
    )

    return {databases, tables}
  }

  return {
    getSnapshot,
  }
}
