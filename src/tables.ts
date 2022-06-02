export interface Table {
  externalId: string
  databaseExternalId: string
  schemaName: string
  name: string
  size?: number
  bloatSize?: number
  estimatedRows?: number
}
