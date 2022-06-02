/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {createLogger, format, transports} from 'winston'
import util from 'util'

const formatLog = format.printf((info) =>
  info.message
    .trim()
    .split('\n')
    .map((line) => `${info.timestamp} ${info.level}: ${line}`)
    .join('\n'),
)

const logger = createLogger({
  level: 'info',
  format: format.combine(...[format.colorize(), format.timestamp(), formatLog]),
  transports: [new transports.Console()],
})

function formatArgs(args: any[]) {
  // @ts-ignore
  return [util.format.apply(util.format, Array.prototype.slice.call(args))]
}

console.log = function (...args: any[]) {
  // @ts-ignore
  logger.info(...formatArgs(args))
}
console.info = function (...args: any[]) {
  // @ts-ignore
  logger.info(...formatArgs(args))
}
console.warn = function (...args: any[]) {
  // @ts-ignore
  logger.warn(...formatArgs(args))
}
console.error = function (...args: any[]) {
  // @ts-ignore
  logger.error(...formatArgs(args))
}
console.debug = function (...args: any[]) {
  // @ts-ignore
  logger.debug(...formatArgs(args))
}
