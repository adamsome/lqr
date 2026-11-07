import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier'

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'scripts/**', 'next-env.d.ts'] },
  ...nextVitals,
  prettier,
  {
    // New React Compiler rules flag existing setState-in-effect patterns.
    // Warn for now; see "Chores" in todo.md.
    rules: { 'react-hooks/set-state-in-effect': 'warn' },
  },
]

export default config
