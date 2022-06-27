import fs from 'fs'
import path from 'path'
import {BackendType} from './domain'

export const readQueryFile = (backendType: BackendType, fileName: string) =>
  fs
    .readFileSync(
      path.join(
        __dirname,
        `../../queries/${backendType.toLowerCase()}`,
        fileName,
      ),
    )
    .toString()
