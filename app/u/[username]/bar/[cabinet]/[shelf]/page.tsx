import { CategoryList } from '@/app/u/[username]/bar/[cabinet]/[shelf]/category-list'
import { Heading } from '@/app/u/[username]/bar/[cabinet]/[shelf]/heading'
import { BackButton } from '@/app/u/[username]/bar/components/back-button'
import { CategoryKeys } from '@/app/u/[username]/bar/lib/types'
import { PageProps } from '@/lib/types'

export const revalidate = 0

type Props = PageProps<
  CategoryKeys & {
    username?: string
  }
>

export default async function Page({ params = {} }: Props) {
  return (
    <Heading
      {...params}
      backButton={
        <BackButton className="hidden md:block" to={params} backSteps={2} />
      }
    >
      <CategoryList {...params} />
    </Heading>
  )
}
