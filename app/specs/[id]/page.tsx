import { SpecContainer } from '@/app/specs/[id]/spec-container'

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const { id } = params
  return (
    <div className="py-8">
      <SpecContainer id={id} />
    </div>
  )
}
