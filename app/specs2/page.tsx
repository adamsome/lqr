import { CardGrid } from '@/components/ui/card-grid'
import { Container } from '@/components/ui/container'
import { H1 } from '@/components/ui/h1'
import { getData } from '@/lib/model/data'

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: Props) {
  let { specs } = await getData()

  const search = searchParams.search?.toString().toLowerCase()
  if (search) {
    const terms = search.split(' ')

    specs = specs.filter((s) => {
      const name = s.name.toLowerCase()
      return terms.some((term) => name.includes(term))
    })
  }

  return (
    <Container className="relative py-8">
      <section className="flex flex-col gap-4">
        <H1>Specs {search}</H1>
        <div className="flex flex-col gap-8">
          <form className="flex w-full" action={`/specs2`}>
            <div className="relative flex w-full">
              <input
                type="text"
                autoComplete="off"
                tabIndex={0}
                defaultValue={search?.toString()}
                name="search"
                placeholder="Search..."
                className="z-10 h-12 grow-[4] rounded-l-lg border-0 bg-gray-900 px-4 text-gray-100 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-400"
              />
              <div className="animate-tilt absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-r from-cyan-300 to-sky-600 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
              <button
                type="submit"
                tabIndex={0}
                className="w-30 grow-[1] rounded-r-lg bg-gray-950 px-4 py-2 text-white hover:bg-gray-900"
              >
                Search
              </button>
            </div>
          </form>
          <div className="flex gap-6">
            <div className="w-60 bg-slate-700">Sidebar</div>
            <div className="flex flex-1 flex-col gap-4">
              <CardGrid>
                {specs.slice(0, 12).map((spec) => (
                  <div key={spec.id}>{spec.name}</div>
                ))}
              </CardGrid>
            </div>
          </div>
        </div>
      </section>
    </Container>
  )
}
