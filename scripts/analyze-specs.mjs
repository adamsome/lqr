import { readFileSync } from 'fs'
import { resolve } from 'path'

const specsPath = resolve(process.cwd(), '../json/specs.json')
const specsJson = readFileSync(specsPath, 'utf-8')
const specDict = JSON.parse(specsJson)
const specIDs = Object.keys(specDict)
let specs = specIDs.map((id) => specDict[id])

const counts = {}
const catCounts = {}
specs = specs.forEach((spec) => {
  spec.ingredients.forEach((it) => {
    const { id } = it
    if (!id) return
    if (!counts[id]) counts[id] = 0
    counts[id]++
    const cat = id.split('_')[0]
    if (!cat) return
    if (!catCounts[cat]) catCounts[cat] = 0
    catCounts[cat]++
  })
})

const entries = Object.entries(counts)
entries.sort((a, b) => {
  return b[1] - a[1]
})

const catEntries = Object.entries(catCounts)
catEntries.sort((a, b) => {
  return b[1] - a[1]
})

for (const [id, count] of entries) {
  console.log(id, count)
}

console.log('\nCATEGORIES\n')
for (const [id, count] of catEntries) {
  console.log(id, count)
}

process.exit()
