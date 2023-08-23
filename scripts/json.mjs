import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

function dir() {
  const currPath = fileURLToPath(import.meta.url)
  return dirname(currPath)
}

/**
 * @param {string} path
 * @returns {*}
 */
export function readJson(path) {
  const fullPath = join(dir(), path)
  const json = readFileSync(fullPath, 'utf-8')
  return JSON.parse(json)
}

/**
 * @param {string} path
 * @param {*} data
 */
export function writeJson(path, data) {
  writeFileSync(join(dir(), path), JSON.stringify(data, null, 2), {
    encoding: 'utf8',
  })
}
