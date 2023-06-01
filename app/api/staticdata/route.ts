import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

export async function GET() {
  const dir = path.join(process.cwd(), 'json')
  const data = await Promise.all([
    await fs.readFile(`${dir}/base-ingredients.json`, 'utf8'),
    await fs.readFile(`${dir}/ingredients.json`, 'utf8'),
    await fs.readFile(`${dir}/category-filter.json`, 'utf8'),
    await fs.readFile(`${dir}/specs.json`, 'utf8'),
  ])
  return NextResponse.json(`{
    "baseIngredients": ${data[0].toString()},
    "ingredients": ${data[1].toString()},
    "categoryFilter": ${data[2].toString()},
    "specs": ${data[3].toString()}
  }`)
}
