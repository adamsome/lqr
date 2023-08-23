import { extract, full_process, token_set_ratio, unique_tokens } from 'fuzzball'

import { readJson, writeJson } from './json.mjs'
import { partition } from './partition.mjs'
import { slugify } from './slugify.mjs'

let printIdx = 0

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

/**
 * @typedef {{
 *   id?: string,
 *   bottleID?: string,
 *   note?: string,
 *   quantity?: number,
 *   unit?: string,
 *   usage?: string,
 *   raw?: string,
 *   btl?: string
 * }} SpecIngredient
 */

/**
 * @typedef {{
 *   id: string,
 *   ordinal?: number,
 *   name: string,
 *   category: string,
 *   parent?: string,
 *   productionMethod?: string,
 *   aging?: string
 *   black?: boolean
 *   overproof?: boolean
 *   origin?: string
 *   originTerritory?: string
 *   stock?: number
 *   buyPriority?: number
 *   references?: string[]
 * }} Ingredient
 */

const RE_NUM_FRAC = /(?:[1-9][0-9]*|0)(?:\/[1-9][0-9]*)?/g

const FUZZ_OPTIONS = {
  scorer: token_set_ratio,
  limit: 5,
  cutoff: 50,
  full_process: false,
}

/** @returns {Card[]} */
const readTrelloCards = () => readJson('./trello-cards.json')

/** @returns {Ingredient[]} */
const readBottles = () => readJson('../json/ingredients.json')

/** @returns {Ingredient[]} */
const readIngredients = () => readJson('../json/base-ingredients.json')

const bottles = readBottles()
const findBottle = createBottleFinder(bottles)

for (const it of bottles) {
  it.tokens = unique_tokens(full_process(it.name))
}
/**
 * @param {string} term
 * @returns {[Ingredient, number, number][]}
 */
function fuzzBottles(term) {
  return extract(term, bottles, FUZZ_OPTIONS)
}

const ingredients = readIngredients()
const findIngredient = createIngredientFinder(ingredients)

for (const it of ingredients) {
  it.tokens = unique_tokens(full_process(it.id))
}
/**
 * @param {string} term
 * @returns {[Ingredient, number, number][]}
 */
function fuzzIngredient(term) {
  return extract(term, ingredients, FUZZ_OPTIONS)
}

// TODO: Handle glass type
// TODO: Handle shaken/stirred
export function parseTrelloCards() {
  const trelloCards = readTrelloCards()

  const specs = trelloCards.map((card) => {
    const its = parseCard(card)
    const [notes, ingredients] = partition((it) => it.note, its)

    const { lines, ...rest } = card
    const spec = { ...rest }
    if (notes.length) spec.notes = notes.map((x) => x.note)
    if (ingredients.length) spec.ingredients = ingredients
    return spec
  })

  writeJson('../json/specs-trello.json', specs)
  console.log(`${specs.length} Trello specs parsed successfully.`)
}

parseTrelloCards()

/**
 * @param {Card} card
 * @returns {SpecIngredient[]}
 */
function parseCard(card) {
  return card.lines.map((line) => parseCardLine(line)).filter(Boolean)
}

/**
 * @param {string} rawLine
 * @returns {SpecIngredient}
 */
function parseCardLine(origLine) {
  if (!origLine) return null
  let rawLine = origLine.toLowerCase()

  if (rawLine.startsWith('build ')) return { note: origLine }
  if (rawLine.startsWith('*note: '))
    return { note: origLine.substring(7).replace(/\**$/, '') }

  rawLine = rawLine.replace('½', '1/2')
  rawLine = rawLine.replace('1⁄2', '1/2')
  rawLine = rawLine.replace('1⁄4', '1/4')
  rawLine = rawLine.replace('3⁄4', '3/4')

  let [, line, btl] = rawLine.match(/(.*) \((.*)\)$/i) ?? []
  if (!line) line = rawLine
  line = line

  let bottle = findBottle(slugify(btl, { replaceWith: '_' }))
  let _btlMatches
  if (btl && !bottle) {
    const bottleMatches = fuzzBottles(btl)
    bottle = bottleMatches[0]?.[0]
    _btlMatches = bottleMatches.map(([{ id }, score]) => `${score}: ${id}`)
  }
  let usage

  line = line.replace(' or rinse', '')
  line = line.replace(', discard', '')
  line = line.replace(', flamed', '')
  line = line.replace(' (discard)', '')
  line = line.replace('(optional) ', '')
  line = line.replace(' (not optional)', '')
  line = line.replace(/\s\(.*ml\)\s/i, '')
  if (['cherry', 'cherry, brandied'].some((s) => s === line)) line = '1 cherry'
  if (['mint sprig'].some((s) => s === line)) line = '1 spice_mint'

  /**
   * @param {SpecIngredient} it
   * @returns {SpecIngredient}
   */
  function buildIt(it) {
    const _ = {}
    _.line = rawLine
    _.raw = it.raw
    delete it.raw

    if (usage) it.usage = usage
    if (btl) _.btl = btl
    if (_btlMatches) _.btlMatches = _btlMatches

    if (bottle) {
      it.bottleID = bottle.id
      it.id = bottle.parent
    } else if (_.raw) {
      const [id, bottleID] = findIngredient(_.raw) ?? []
      if (bottleID) {
        it.bottleID = bottleID
        it.id = id
      } else if (id) {
        it.id = id
      } else {
        let term = _.raw
        if (term.includes('vermouth')) term = 'fortifiedwine_' + term
        const matches = fuzzIngredient(term)
        if (matches.length) {
          it.id = matches[0][0].id
        } else {
          it.id = 'XXX'
        }
        _.idMatches = matches.map(([{ id }, score]) => `${score}: ${id}`)
      }
    }

    if (it.bottleID && it.id) {
      it = { ...it, ...addRumCategories(it.bottleID) }
    }

    if (!it.unit && it.quantity) {
      if (
        it.id &&
        (it.id.startsWith('sugar') ||
          it.id.startsWith('fruit') ||
          it.id.startsWith('egg') ||
          it.id.startsWith('spice'))
      ) {
        it.unit = 'whole'
      } else {
        it.unit = 'oz'
      }
    }

    if (btl && !it.bottleID) it.bottleID = 'XXX'
    return it
  }

  if (line === 'twist') {
    return buildIt({ quantity: 1, usage: 'twist', raw: 'fruit_lemon' })
  }
  if (line.endsWith(' twist')) {
    const raw = 'fruit_' + line.substring(0, rawLine.length - 6)
    return buildIt({ quantity: 1, usage: 'twist', raw })
  }
  if (line.endsWith(' peel')) {
    const raw = 'fruit_' + line.substring(0, rawLine.length - 5)
    return buildIt({ quantity: 1, usage: 'twist', raw })
  }
  if (line.startsWith('twist, ')) {
    let raw = 'fruit_' + line.substring(7)
    raw = raw.replace(' peel', '')
    return buildIt({ quantity: 1, usage: 'twist', raw })
  }
  if (line.endsWith(' rinse')) {
    const raw = line.substring(0, rawLine.length - 6)
    return buildIt({ usage: 'rinse', raw })
  }
  if (line.endsWith(' wheel')) {
    const raw = 'fruit_' + line.substring(0, rawLine.length - 6)
    return buildIt({ quantity: 1, usage: 'wheel', raw })
  }
  if (line.endsWith(' wedges')) {
    const raw = 'fruit_' + line.substring(0, rawLine.length - 7)
    return buildIt({ quantity: 1, usage: 'wedge', raw })
  }
  if (line.endsWith(' wedge')) {
    const raw = 'fruit_' + line.substring(0, rawLine.length - 6)
    return buildIt({ quantity: 1, usage: 'wedge', raw })
  }
  if (line.startsWith('dash bitter, ')) {
    let raw = line.substring(13)
    return buildIt({ quantity: 1, unit: 'dash', raw })
  }
  if (line.startsWith('dash of ')) {
    let raw = line.substring(8)
    return buildIt({ quantity: 1, unit: 'dash', raw })
  }
  if (line.startsWith('dash ')) {
    let raw = line.substring(5)
    return buildIt({ quantity: 1, unit: 'dash', raw })
  }
  if (line.endsWith(', grated')) {
    line = line.substring(0, rawLine.length - 8)
    usage = 'grated'
  }
  if (line.endsWith(', muddled')) {
    line = line.substring(0, rawLine.length - 9)
    usage = 'muddled'
  }
  if (line.endsWith(' muddled')) {
    line = line.substring(0, rawLine.length - 8)
    usage = 'muddled'
  }
  if (line.startsWith('top w/ ')) {
    line = line.substring(7)
    usage = 'top'
  }

  const words = line.split(' ')
  let amtEndIdx = 0
  while (words[amtEndIdx]?.match(RE_NUM_FRAC)) amtEndIdx++

  if (amtEndIdx === 0) {
    if (!usage) return buildIt({ note: origLine })
    return buildIt({ raw: line })
  }

  let unit
  const unitStr = words[amtEndIdx]
  let numEndInx = amtEndIdx
  if (unitStr === 'dash' || unitStr === 'dashes') {
    unit = 'dash'
  } else if (unitStr === 'tsp' || unitStr === 'barspoon') {
    unit = 'tsp'
  } else if (unitStr === 'oz') {
    unit = 'oz'
  } else {
    amtEndIdx--
  }

  const quantity = parseAmount(words.slice(0, numEndInx))

  const raw = words.slice(amtEndIdx + 1).join(' ')

  return buildIt({ quantity, unit, raw })
  // TODO: Set 'glass' if in note line or default by list name
}

/** * @param {Ingredient[]} ingredients */
function createBottleFinder(bottles) {
  /**
   * @param {string} id
   * @returns {Ingredient?}
   */
  function findBottle(id) {
    if (!id) return
    const slug = slugify(id, { replaceWith: '_' })
    return bottles.find(
      (it) =>
        slug.startsWith(it.id) ||
        (it.id.length > 7 &&
          slug.length > 7 &&
          (it.id.startsWith(slug) ||
            slug.endsWith(it.id) ||
            it.id.endsWith(slug))),
    )
  }
  return findBottle
}

function createIngredientFinder(ingredients) {
  const dict = ingredients.reduce((acc, it) => ({ ...acc, [it.id]: it }), {})
  /**
   * @param {string} str
   * @returns {[string, string?]}
   */
  function findIngredient(str) {
    if (!str) return null

    if (str === 'gin') return ['grain_gin']
    if (str === 'sugar cube') return ['sugar_demerara']
    if (str === 'sherry, fino') return ['fortifiedwine_sherry_fino']
    if (str === 'creme de menthe') return ['liqueur_cremedementhe']
    if (str === 'amaretto') return ['liqueur_amaretto']
    if (str === 'crème de violette') return ['liqueur_cremedeviolette']
    if (['bitters, orange', 'orange bitters'].some((s) => s === str)) {
      return ['bitters_orange']
    }
    if (['dry vermouth', 'vermouth, dry'].some((s) => s === str)) {
      return ['fortifiedwine_dryvermouth']
    }
    if (['water, chilled', 'water'].some((s) => s === str)) {
      return ['water_flat']
    }
    if (
      ['cherry, maraschino', 'cherries, brandied', 'cherries'].some(
        (s) => s === str,
      )
    ) {
      return ['fruit_cherry']
    }
    if (str.includes('angostura')) return ['bitters_aromatic', 'angostura']
    if (str.includes('chartreuse')) {
      return str.includes('yellow')
        ? ['liqueur_herbal', 'yellow_chartreuse']
        : ['liqueur_herbal', 'green_chartreuse']
    }
    if (str === 'sweet vermouth' || str === 'vermouth, sweet') {
      return ['fortifiedwine_sweetvermouth']
    }

    str = str.replace(/,/g, '')
    const parts = str
      .split(', ')
      .flatMap((p) => p.split(' '))
      .map(slugify)
    const [slug, revSlug] = [parts.join('_'), parts.reverse().join('_')]
    // Check if matches a bottle
    if (!str.startsWith('whiskey') && !str.startsWith('whisky')) {
      let bottle = findBottle(slug) ?? findBottle(revSlug)
      if (bottle) {
        return [bottle.parent, bottle.id]
        // } else {
        //   const [match] = fuzzBottles(slug)
        //   if (match && match[1] > 90) {
        //     return [match[0].parent, match[0].id]
        //   }
      }
    }
    return [(dict[slug] ?? dict[revSlug])?.id]
  }
  return findIngredient
}

/**
 *
 * @param {string} words
 * @returns {number}
 */
function parseAmount(words) {
  let amt = 0
  for (const word of words) {
    const w = word.replace(/\s/g, '')
    const [rawNum, den] = w.split('/')
    const num = Number(rawNum)
    amt += den ? num / Number(den) : num
  }
  return amt
}

function addRumCategories(id) {
  switch (id) {
    case 'smith_cross_navy_strength':
      return { productionMethod: 'pot', aging: ['light'] }
    case 'denizen':
      return { productionMethod: 'pot', aging: ['light', 'medium', 'long'] }
    case 'el_dorado_8_year':
    case 'appleton_estate_signature_blend':
    case 'mount_gay_eclipse':
    case 'plantation_xaymaca':
    case 'clement_vsop':
    case 'rhum_barbancourt_5_star':
    case 'neisson_eleve_sous_bois':
    case 'neisson_le_rhum':
      return { aging: ['light', 'medium', 'long'] }
    case 'pampero_anniversario':
    case 'bacardi_8':
      return { aging: ['medium', 'long'] }
    case 'plantation_3_stars':
    case 'flor_de_cana_extra_dry_4_year':
    case 'banks_5_island':
      return { aging: ['light'] }
    case 'ron_del_barrilito_3_star':
      return { aging: ['light', 'medium'] }
    case 'coruba':
    case 'cruzan_blackstrap':
    case 'goslings_black_seal':
      return { black: true }
    default:
      return {}
  }
}
