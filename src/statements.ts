export interface Statement {
  externalId: string
  databaseExternalId: string
  query: string
  calls: bigint
  totalExecutionTime: number
}
