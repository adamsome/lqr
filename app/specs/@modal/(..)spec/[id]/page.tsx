type Props = {
  params: {
    id: string
  }
}

export default function SpecModal({ params }: Props) {
  return <div>Modal Specs {params.id}</div>
}
