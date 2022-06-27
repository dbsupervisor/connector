import {Snapshot} from '../snapshots'

export interface ServerConfig {
  primaryDatabaseName: string
  additionalDatabaseNames: string[]
}

export interface Server {
  getSnapshot: () => Promise<Snapshot>
}
