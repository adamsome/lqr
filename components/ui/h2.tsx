type Props = {
  children: React.ReactNode
}

export function H2({ children }: Props) {
  return (
    <h2 className="scroll-m-16 text-xl font-semibold tracking-tight">
      {children}
    </h2>
  )
}
