import {Client} from 'pg'
import {BackendConstructor, BackendType} from '..'
import {Database} from '../../databases'
import {Table} from '../../tables'
import {readQueryFile} from '../utils'

export interface PostgresConfig {
  host: string
  username: string
  password: string
  port: number
}

const construct: BackendConstructor<PostgresConfig> = async (config) => {
  const GET_DATABASES_SQL = await readQueryFile(
    BackendType.PostgreSQL,
    'get-databases.sql',
  )
  const GET_TABLES_SQL = await readQueryFile(
    BackendType.PostgreSQL,
    'get-tables.sql',
  )

  const {host, port, username, password} = config

  const useConnection = async <TResult>(
    databaseName: string,
    callback: (client: Client) => Promise<TResult>,
  ): Promise<TResult> => {
    const client = new Client({
      host,
      port,
      user: username,
      password,
      database: databaseName,
    })

    await client.connect()

    const result = await callback(client)

    await client.end()

    return result
  }

  const getDatabases = async ({
    primaryDatabaseName,
  }: {
    primaryDatabaseName: string
  }): Promise<Database[]> => {
    const {rows} = await useConnection(primaryDatabaseName, (client) =>
      client.query<{
        identifier: number
        name: string
        size: string
        connection_count: number
        cache_hit_ratio?: string
      }>(GET_DATABASES_SQL),
    )

    return rows.map((row) => ({
      externalId: row.identifier.toString(10),
      name: row.name,
      size: parseInt(row.size, 10),
      connectionCount: row.connection_count,
      cacheHitRatio: row.cache_hit_ratio
        ? parseInt(row.cache_hit_ratio, 10)
        : undefined,
    }))
  }

  const getTables = async ({
    databaseName,
  }: {
    databaseName: string
  }): Promise<Table[]> => {
    const {rows} = await useConnection(databaseName, (client) =>
      client.query<{
        identifier: number
        database_identifier: number
        schema_name: string
        table_name: string
        size?: string
        bloat_size?: number
        estimated_rows?: string
      }>(GET_TABLES_SQL),
    )

    return rows.map((row) => ({
      externalId: row.identifier.toString(10),
      databaseExternalId: row.database_identifier.toString(10),
      schemaName: row.schema_name,
      name: row.table_name,
      size: row.size ? parseInt(row.size, 10) : undefined,
      bloatSize: row.bloat_size,
      estimatedRows: row.estimated_rows
        ? parseInt(row.estimated_rows, 10)
        : undefined,
    }))
  }

  return {
    getDatabases,
    getTables,
  }
}

export default construct
