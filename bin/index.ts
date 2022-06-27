#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-floating-promises */

import {program} from 'commander'
import {run} from '../src'
import pkg from '../package.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import {handleError} from '../src/errors'
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

program
  .version(pkg.version)
  .requiredOption('-i, --uri [uri]', 'Database URI.')
  .requiredOption(
    '-a, --api-key <api-key>',
    'DBSupervisor.com organization API key. Get this from https://dashboard.dbsupervisor.com',
  )
  .option(
    '-b, --backend <backend>',
    'DBSupervisor backend',
    'wss://api.dbsupervisor.com',
  )
  .parse(process.argv)
;(async () => {
  try {
    const opts = program.opts()

    const uri = opts.uri || process.env.URI
    const apiKey = opts.apiKey || process.env.API_KEY
    const backend = opts.backend || process.env.BACKEND

    await run({
      uri,
      apiKey,
      backend,
    })
  } catch (error) {
    handleError(error)
  }
})()
