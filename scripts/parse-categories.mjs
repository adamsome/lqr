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
  const tree = {
    id: 'all',
    checked: false,
    childIDs: [],
    children: {},
  }

  categories.forEach((i) => {
    const [supertype, category, name1, name2, name3] = i
    if (!category || !name1) return
    const categoryType = slugify(category)
    let type = supertype
    if (category === 'Beer' || category === 'Wine') type = 'beerWine'
    else if (category === 'Bitters') type = 'bitters'
    else if (type === 'Spirit') type = 'spirit'
    else type = undefined
    if (!categoryDict[categoryType]) {
      categoryDict[categoryType] = {
        id: categoryType,
        name: category,
        type,
      }
      tree.childIDs.push(categoryType)
      tree.children[categoryType] = {
        id: categoryType,
        checked: false,
        childIDs: [],
        children: {},
      }
    }
    const id1 = `${categoryType}_${slugify(name1)}`
    if (!ingredientDict[id1]) {
      ingredientDict[id1] = {
        id: id1,
        name: name1,
        category: categoryType,
      }
      tree.children[categoryType].childIDs.push(id1)
      tree.children[categoryType].children[id1] = {
        id: id1,
        checked: false,
        childIDs: [],
        children: {},
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
        const tree1 = tree.children[categoryType].children[id1]
        tree1.childIDs.push(id2)
        tree1.children[id2] = {
          id: id2,
          checked: false,
          childIDs: [],
          children: {},
        }
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
          const tree1 = tree.children[categoryType].children[id1]
          const tree2 = tree1.children[id2]
          tree2.childIDs.push(id3)
          tree2.children[id3] = {
            id: id3,
            checked: false,
            childIDs: [],
            children: {},
          }
        }
      }
    }
  })

  const categoryList = Object.keys(categoryDict).map((id) => categoryDict[id])
  const ingredientList = Object.keys(ingredientDict).map(
    (id) => ingredientDict[id]
  )

  writeFileSync(
    join(dir, '../json/categories.json'),
    JSON.stringify(categoryList, null, 2),
    { encoding: 'utf8' }
  )
  writeFileSync(
    join(dir, '../json/base-ingredients.json'),
    JSON.stringify(ingredientList, null, 2),
    { encoding: 'utf8' }
  )
  writeFileSync(
    join(dir, '../json/category-filter.json'),
    JSON.stringify(tree, null, 2),
    { encoding: 'utf8' }
  )

  const ingredientCategories = categoryList.map((c) => `  | '${c.id}'`)
  const ingredientCategoryDefs = categoryList.map((c) =>
    c.type
      ? `  ${c.id}: { id: '${c.id}', name: '${c.name}', type: '${c.type}' },`
      : `  ${c.id}: { id: '${c.id}', name: '${c.name}' },`
  )
  let consts = []
  consts.push(`// Auto-generated: Do not modify.`)
  consts.push(``)
  consts.push(`type HasName = {`)
  consts.push(`  name: string`)
  consts.push(`}`)
  consts.push(``)
  consts.push(`export type Category =`)
  consts.push(...ingredientCategories)
  consts.push(``)
  consts.push(`export type CategoryDef = HasName & {`)
  consts.push(`  id: Category`)
  consts.push(`  type?: 'spirit' | 'beerWine' | 'bitters'`)
  consts.push(`}`)
  consts.push(``)
  consts.push(`export const CATEGORY_DICT: Record<Category, CategoryDef> = {`)
  consts.push(...ingredientCategoryDefs)
  consts.push(`}`)
  consts.push(``)
  writeFileSync(join(dir, '../lib/generated-consts.ts'), consts.join('\n'), {
    encoding: 'utf8',
  })
}
