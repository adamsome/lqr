import { appendFileSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { parseCsvLine } from './parse-csv-line.mjs'
import { slugify } from './slugify.mjs'

const categoryIDMap = {
  gin: 'grain',
  agave: 'agave',
  rum: 'cane',
  whiskey: 'grain',
  amaro: 'liqueur',
}
const ingredientIDMap = {
  gin_plymouthgin: 'grain_gin_plymouth',
  gin_moderngin: 'grain_gin_contemporary',
  gin_londondrygin: 'grain_gin_londondry',
  rum_jamaicanrum: 'cane_rum',
  rum_englishrum: 'cane_rum',
  rum_spanishrum: 'cane_rum',
  rum_frenchrum: 'cane_rum',
  rum_blackrum: 'cane_rum',
  rum_rhumagricole: 'cane_rum',
  grain_bourbonwhiskey: 'grain_whiskey_bourbon',
  grain_ryewhiskey: 'grain_whiskey_rye',
  whiskey_scotchwhisky_blended: 'grain_whiskey_scotch_blended',
  grain_irishwhisky: 'grain_whiskey_irish',
  grain_scotchwhisky: 'grain_whiskey_scotch',
  brandy_americanbrandy: 'brandy_grape_american',
  brandy_applebrandy: 'brandy_apple',
  brandy_americanbrandy: 'brandy_grape_american',
  brandy_cognac: 'brandy_grape_cognac',
  brandy_eaudevie: 'brandy_grape_eaudevie',
  brandy_calvados: 'brandy_apple',
  brandy_armagnac: 'brandy_grape_armagnac',
  brandy_spanishbrandy: 'brandy_grape_spanish',
  brandy_pisco: 'brandy_grape_pisco',
  amaro_mediumamaro_carciofo: 'liqueur_amaro_carciofo',
  amaro_mediumamaro_alpine: 'liqueur_amaro_alpine',
  amaro_denseamaro_fernet: 'liqueur_amaro_fernet',
  amaro_denseamaro_rabarbaro: 'liqueur_amaro_rabarbaro',
  amaro_apertivo: 'liqueur_amaro_aperitivo',
  amaro_lightamaro: 'liqueur_amaro_light',
  amaro_mediumamaro: 'liqueur_amaro_medium',
  amaro_denseamaro: 'liqueur_amaro_dense',
  liqueur_herballiqueur: 'liqueur_herbal',
  liqueur_maraschinoliqueur: 'liqueur_maraschino',
  liqueur_orangeliqueur: 'liqueur_orange',
  liqueur_richliqueur: 'liqueur_rich',
  fortifiedwine_apertifwine: 'fortifiedwine_aperitif',
}

export function parseBottles() {
  const path = fileURLToPath(import.meta.url)
  const dir = dirname(path)

  const categoriesJsonPath = join(dir, '../public/data/categories.json')
  const categoriesJson = readFileSync(categoriesJsonPath, 'utf-8')
  const categories = JSON.parse(categoriesJson)
  const categoryDict = categories.reduce((acc, it) => {
    acc[it.id] = it
    return acc
  }, {})

  const ingredientsJsonPath = join(dir, '../public/data/base-ingredients.json')
  const ingredientsJson = readFileSync(ingredientsJsonPath, 'utf-8')
  const ingredients = JSON.parse(ingredientsJson)
  const ingredientDict = ingredients.reduce((acc, it) => {
    acc[it.id] = it
    return acc
  }, {})

  const bottlesCsvPath = join(dir, './bottles-raw.csv')
  const bottlesCsv = readFileSync(bottlesCsvPath, 'utf-8')

  const productionMethodDict = {}
  const agingDict = {}

  const userIngredients = {}

  const bottles = bottlesCsv
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [
        _,
        ordinal,
        name,
        bottleType,
        material,
        style,
        substyle,
        productionMethod,
        aging,
        origin,
        stock,
        buyPriority,
        references,
      ] = parseCsvLine(line)

      if (!name) return null

      let productionMethodType = slugify(productionMethod)
      productionMethodType = productionMethodType.replace('still', '')
      if (productionMethodType === 'na') productionMethodType = undefined
      if (productionMethodType && !productionMethodDict[productionMethodType]) {
        productionMethodDict[productionMethodType] = {
          type: productionMethodType,
          name: productionMethod,
        }
      }

      let agingType = slugify(aging)
      if (agingType === 'na') agingType = undefined
      else if (agingType === 'unaged') agingType = 'none'
      else if (agingType === 'lightlyaged') agingType = 'light'
      else if (agingType === 'aged') agingType = 'medium'
      else if (agingType === 'longaged') agingType = 'long'
      if (agingType && !agingDict[agingType]) {
        agingDict[agingType] = {
          type: agingType,
          name: aging,
        }
      }

      const id = slugify(name, { replaceWith: '_' })
      const categoryType = slugify(bottleType)
      const category =
        categoryDict[categoryType]?.id ?? categoryIDMap[categoryType]

      if (!category) console.log(`No category '${categoryType}' for '${id}'`)

      const typeStyleKey = `${categoryType}_${slugify(style)}`
      const categoryStyleKey = `${category}_${slugify(style)}`

      let parent
      let typeStyleSubstyleKey
      let typeSubstyleKey
      let categorySubstyleKey
      if (substyle) {
        typeStyleSubstyleKey = `${typeStyleKey}_${slugify(substyle)}`
        typeSubstyleKey = `${categoryType}_${slugify(substyle)}`
        categorySubstyleKey = `${categoryStyleKey}_${slugify(substyle)}`
        parent =
          ingredientDict[typeStyleSubstyleKey]?.id ??
          ingredientDict[typeSubstyleKey]?.id ??
          ingredientDict[categoryStyleKey]?.id ??
          ingredientIDMap[typeStyleSubstyleKey] ??
          ingredientIDMap[typeSubstyleKey] ??
          ingredientIDMap[categoryStyleKey]
      }
      parent =
        parent ??
        ingredientDict[typeStyleKey]?.id ??
        ingredientDict[categoryStyleKey]?.id ??
        ingredientIDMap[typeStyleKey] ??
        ingredientIDMap[categoryStyleKey]

      if (!parent) {
        if (substyle)
          console.log(
            `No parent for '${id}\n\t${typeStyleSubstyleKey}\n\t${typeSubstyleKey}\n\t${categorySubstyleKey}\n\t${typeStyleKey}\n\t${categoryStyleKey}`
          )
        else
          console.log(
            `No parent for '${id}\n\t${typeStyleKey}\n\t${categoryStyleKey}`
          )
      }

      const originParts = origin.split(', ')

      if (stock || buyPriority) {
        userIngredients[id] = {
          stock: stock ? Number(stock) : undefined,
          buyPriority: buyPriority ? Number(buyPriority) : buyPriority,
        }
      }

      return {
        id,
        ordinal: Number(ordinal),
        name: name
          .normalize('NFD')
          .replace(/[\u2018\u2019]/g, "'")
          .replace(/[\u201C\u201D]/g, '"'),
        category,
        parent,
        productionMethod: productionMethodType,
        aging: agingType,
        origin: originParts[1] ?? originParts[0],
        originTerritory: originParts[1] ? originParts[0] : undefined,
        references: references ? references.split(', ') : undefined,
      }
    })
    .filter(Boolean)

  writeFileSync(
    join(dir, '../public/data/user-ingredients.json'),
    JSON.stringify(userIngredients, null, 2),
    { encoding: 'utf8' }
  )
  writeFileSync(
    join(dir, '../public/data/ingredients.json'),
    JSON.stringify(bottles, null, 2),
    { encoding: 'utf8' }
  )

  let consts = []
  consts.push(``)

  const productionMethodList = Object.keys(productionMethodDict).map(
    (type) => productionMethodDict[type]
  )
  const productionMethodDefs = productionMethodList.map(
    (p) => `  ${p.type}: { name: '${p.name}' },`
  )

  consts.push(
    `export type ProductionMethod = ${productionMethodList
      .map((p) => `'${p.type}'`)
      .join(' | ')}`
  )
  // consts.push(...productionMethodList.map((p) => `  | '${p.type}'`))
  consts.push(``)
  consts.push(
    `export const PRODUCTION_METHOD_DICT: Record<ProductionMethod, HasName> = {`
  )
  consts.push(...productionMethodDefs)
  consts.push(`}`)
  consts.push(``)

  const agingList = Object.keys(agingDict).map((type) => agingDict[type])
  const agingDefs = agingList.map((p) => `  ${p.type}: { name: '${p.name}' },`)

  consts.push(
    `export type Aging = ${agingList.map((a) => `'${a.type}'`).join(' | ')}`
  )
  // consts.push(...agingList.map((a) => `  | '${a.type}'`))
  consts.push(``)
  consts.push(`export const AGING_DICT: Record<Aging, HasName> = {`)
  consts.push(...agingDefs)
  consts.push(`}`)
  consts.push(``)

  appendFileSync(join(dir, '../lib/consts.ts'), consts.join('\n'), {
    encoding: 'utf8',
  })
}
