import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { slugify } from './slugify.mjs'

export function parseCategories() {
  const path = fileURLToPath(import.meta.url)
  const dir = dirname(path)

  const categoriesCsvPath = join(dir, './categories-raw.csv')

  const categoriesCsv = readFileSync(categoriesCsvPath, 'utf-8')
  const categories = categoriesCsv
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.split(','))

  const categoryDict = {}
  const ingredientDict = {}

  categories.forEach((i) => {
    const [supertype, category, name1, name2, name3] = i
    if (!category || !name1) return
    const categoryType = slugify(category)
    if (!categoryDict[categoryType]) {
      categoryDict[categoryType] = { type: categoryType, name: category }
    }
    const id1 = `${categoryType}_${slugify(name1)}`
    if (!ingredientDict[id1]) {
      ingredientDict[id1] = {
        id: id1,
        name: name1,
        category: categoryType,
      }
    }
    if (name2) {
      const id2 = `${id1}_${slugify(name2)}`
      if (!ingredientDict[id2]) {
        ingredientDict[id2] = {
          id: id2,
          name: name2,
          category: categoryType,
          parent: id1,
        }
        ingredientDict[id1].hasChildren = true
      }
      if (name3) {
        const id3 = `${id2}_${slugify(name3)}`
        if (!ingredientDict[id3]) {
          ingredientDict[id3] = {
            id: id3,
            name: name3,
            category: categoryType,
            parent: id2,
          }
          ingredientDict[id2].hasChildren = true
        }
      }
    }
  })

  const categoryList = Object.keys(categoryDict).map(
    (type) => categoryDict[type]
  )
  const ingredientList = Object.keys(ingredientDict).map(
    (id) => ingredientDict[id]
  )

  writeFileSync(
    join(dir, '../public/data/categories.json'),
    JSON.stringify(categoryList, null, 2),
    { encoding: 'utf8' }
  )
  writeFileSync(
    join(dir, '../public/data/base-ingredients.json'),
    JSON.stringify(ingredientList, null, 2),
    { encoding: 'utf8' }
  )

  const ingredientCategories = categoryList.map((c) => `  | '${c.type}'`)
  const ingredientCategoryDefs = categoryList.map(
    (c) => `  ${c.type}: { name: '${c.name}' },`
  )
  let consts = []
  consts.push(`// Auto-generated: Do not modify.`)
  consts.push(``)
  consts.push(`import { HasName } from '@/lib/types'`)
  consts.push(``)
  consts.push(`export type IngredientCategory =`)
  consts.push(...ingredientCategories)
  consts.push(``)
  consts.push(
    `export const IngredientCategoryDefs: Record<IngredientCategory, HasName> = {`
  )
  consts.push(...ingredientCategoryDefs)
  consts.push(`}`)
  consts.push(``)
  writeFileSync(join(dir, '../lib/consts.ts'), consts.join('\n'), {
    encoding: 'utf8',
  })
}
