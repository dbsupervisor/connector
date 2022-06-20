import {Database} from './databases'
import {Statement} from './statements'
import {Table} from './tables'

export interface Snapshot {
  databases: Database[]
  tables: Table[]
  statements: Statement[]
}
