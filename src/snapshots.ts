import {Database} from './databases'
import {Table} from './tables'

export interface Snapshot {
  databases: Database[]
  tables: Table[]
}
