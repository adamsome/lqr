import { columns } from '@/components/ingredients/columns'
import { DataTable } from '@/components/ingredients/data-table'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { Ingredient, IngredientDef } from '@/lib/ingredient'
import { createIngredientParser } from '@/lib/parse-ingredients'
import baseIngredientsJson from '@/public/data/base-ingredients.json'
import ingredientsJson from '@/public/data/ingredients.json'
import userIngredientsJson from '@/public/data/user-ingredients.json'

async function getData(): Promise<Ingredient[]> {
  const parseIngredient = createIngredientParser(
    baseIngredientsJson as IngredientDef[],
    userIngredientsJson as Record<string, Partial<IngredientDef>>
  )
  const ingredients = ingredientsJson as IngredientDef[]
  // Fetch data from your API here.
  return ingredients.map(parseIngredient)
}

export default async function IndexPage() {
  const data = await getData()
  return (
    <Container className="relative py-8">
      <section className="flex flex-col gap-4">
        <H1>Stock</H1>
        <DataTable columns={columns} data={data} />
      </section>
    </Container>
  )
}
