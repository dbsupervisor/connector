import {Database} from '../databases'
import {ServerConfig} from '../server/domain'
import {Statement} from '../statements'
import {Table} from '../tables'

export enum BackendType {
  PostgreSQL = 'POSTGRESQL',
}

export interface Backend {
  initialize: (params: {serverConfig: ServerConfig}) => Promise<void>
  getDatabases: (params: {primaryDatabaseName: string}) => Promise<Database[]>
  getTables: (params: {databaseName: string}) => Promise<Table[]>
  getStatements: (params: {databaseName: string}) => Promise<Statement[]>
}

export type BackendConstructor<T> = (config: T) => Promise<Backend>
