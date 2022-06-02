export interface Database {
  externalId: string
  name: string
  size?: number
  connectionCount?: number
  cacheHitRatio?: number
}
