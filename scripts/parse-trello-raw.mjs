import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { slugify } from './slugify.mjs'
import { partition } from 'ramda'

/**
 * @typedef {{
 * id: string,
 * name: string,
 * year?: number,
 * lines: string[],
 * reference?: string
 * basis?: string
 * modifiedAt: string
 * error?: string
 * list: string
 * }} Card
 */

const omitByList = {
  Essentials: true,
  Buy: true,
  Stock: true,
}

export function parseTrelloRaw() {
  const path = fileURLToPath(import.meta.url)
  const dir = dirname(path)

  const trelloJsonPath = join(dir, './trello-raw.json')
  const trelloJson = readFileSync(trelloJsonPath, 'utf-8')
  const trello = JSON.parse(trelloJson)

  const lists = parseLists(trello.lists)

  const { cards } = trello.cards
    .filter((c) => !c.closed && lists[c.idList])
    .reduce(
      (outerAcc, c) =>
        parseCard(c).reduce((acc, it) => {
          if (acc.ids.has(it.id)) it.error = 'exists'
          it.list = lists[c.idList]
          acc.ids.add(it.id)
          acc.cards.push(it)
          return acc
        }, outerAcc),
      { cards: [], ids: new Set() },
    )

  const [errors, oks] = partition((c) => c.error, cards)

  writeFileSync(
    join(dir, './trello-cards-ok.json'),
    JSON.stringify(oks, null, 2),
    { encoding: 'utf8' },
  )
  writeFileSync(
    join(dir, './trello-cards-errors.json'),
    JSON.stringify(errors, null, 2),
    { encoding: 'utf8' },
  )
  console.log(
    `${oks.length} Trello cards parsed successfully. ${errors.length} errors`,
  )
}

parseTrelloRaw()

/**
 * @param {{id: string, name: string, closed: boolean}[]} lists
 * @returns {Record<string, string>}
 */
function parseLists(lists) {
  return lists.reduce((acc, it) => {
    if (it.closed || omitByList[it.name]) return acc
    acc[it.id] = it.name
    return acc
  }, {})
}

/**
 * @param {*} c
 * @returns {Card}
 */
function parseCard(c) {
  const origName = String(c.name)
  const modifiedAt = String(c.dateLastActivity)
  const desc = String(c.desc)

  const nameYears = origName
    .split(', ')
    .filter((n) => !n.includes('etc.'))
    .map(parseNameYear)

  const its = []
  const rawLines = desc.split('\n')

  let basis
  let name = nameYears[0].name
  let year = nameYears[0].year
  let currLines = []

  function addIt() {
    const id = slugify(name, { replaceWith: '_' })
    let lines = trimLines(currLines)
    let reference
    const lastLine = lines[lines.length - 1]
    if (lastLine.startsWith('—') || lastLine.startsWith('–')) {
      reference = lastLine.substring(1)
      lines = lines.slice(0, lines.length - 1)
      lines = trimLines(lines)
      if (!year) {
        const yearHit = reference.match(/\(\d\d\d\d\)/i)
        if (yearHit) {
          year = Number(yearHit[0].substring(1, 5))
        }
      }
    }
    its.push({ id, name, year, lines, reference, basis })
    if (!basis) basis = id
  }

  function setBound(boundLine) {
    const ny = parseNameYear(boundLine)
    name = ny.name
    year = ny.year ?? nameYears.find((_ny) => _ny.name === name)?.year
    currLines = []
  }

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i]
    const next = rawLines[i + 1]

    if (next?.startsWith('---') || next?.startsWith('===')) {
      if (currLines.length) addIt()
      setBound(line)
      i++
      continue
    }
    if (line.startsWith('#')) {
      if (currLines.length) addIt()
      const spaceIdx = line.indexOf(' ')
      const nameLine = line.substring(spaceIdx + 1)
      setBound(nameLine)
      continue
    }
    if (
      line.startsWith('*') &&
      line.endsWith('*') &&
      !line.startsWith('*Note')
    ) {
      if (currLines.length) addIt()
      const nameLine = line.replace(/^\**/i, '').replace(/\**$/i, '').trim()
      setBound(nameLine)
      continue
    }

    if (currLines.length || line) currLines.push(line)
  }

  if (currLines.length) addIt()

  return its.map((it) => ({ ...it, modifiedAt }))
}

/**
 *
 * @param {string} line
 * @returns {{name: string, year?: number}}
 */
function parseNameYear(line) {
  const [rawName, rawYear] = line.split('(')
  const name = rawYear ? rawName.substring(0, rawName.length - 1) : rawName
  const result = { name }
  if (rawYear) {
    const yearStr = rawYear.substring(0, rawYear.length - 1).replace('s', '')
    result.year = Number(yearStr)
  }
  return result
}

/**
 * @param {string[]} lines
 * @returns {string[]}
 */
function trimLines(lines) {
  let start = 0
  while (!lines[start]) start++
  let end = lines.length - 1
  while (!lines[end]) end--
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(lines[i])
  }
  return result
}
