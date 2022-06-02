import {Database} from '../databases'
import {Table} from '../tables'

export enum BackendType {
  PostgreSQL = 'POSTGRESQL',
}

export interface Backend {
  getDatabases: (params: {primaryDatabaseName: string}) => Promise<Database[]>
  getTables: (params: {databaseName: string}) => Promise<Table[]>
}

export type BackendConstructor<T> = (config: T) => Promise<Backend>
