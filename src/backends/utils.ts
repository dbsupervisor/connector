import fs from 'fs'
import path from 'path'
import util from 'util'
import {BackendType} from '.'

const readFileAsync = util.promisify(fs.readFile)

export const readQueryFile = async (
  backendType: BackendType,
  fileName: string,
) =>
  (
    await readFileAsync(
      path.join(__dirname, `./${backendType.toLowerCase()}/queries`, fileName),
    )
  ).toString()
