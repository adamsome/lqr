type Props = {
  children: React.ReactNode
}

export function H1({ children }: Props) {
  return (
    <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h1>
  )
}
