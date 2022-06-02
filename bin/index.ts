#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {program} from 'commander'
import {run} from '../src'

const pkg = require(`../package.json`)

program.version(pkg.version)

program
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
  const opts = program.opts()

  const uri = opts.uri || process.env.URI
  const apiKey = opts.apiKey || process.env.API_KEY
  const backend = opts.backend || process.env.BACKEND

  await run({
    uri,
    apiKey,
    backend,
  })
})()
