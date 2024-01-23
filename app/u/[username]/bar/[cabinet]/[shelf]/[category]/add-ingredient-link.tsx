import { Ingredient } from '@/app/u/[username]/bar/[cabinet]/[shelf]/[category]/ingredient'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'
import { toBarCategory } from '@/app/lib/routes'
import Link from 'next/link'

type Props = CategoryKeys & {
  username?: string
  name?: string
}

export function AddIngredientLink({ name, ...keys }: Props) {
  return (
    <Link
      className="text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
      href={toBarCategory(keys)}
    >
      <Ingredient
        name={`Add ${name ?? 'Unknown Ingredient'}...`}
        border={false}
      />
    </Link>
  )
}
