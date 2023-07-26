export const SPEC_CATEGORIES = [
  { label: 'Highball', value: 'highball' },
  { label: 'Daiquiri', value: 'daiquiri' },
  { label: 'Sidecar', value: 'sidecar' },
  { label: 'Old-Fashioned', value: 'oldfashioned' },
  { label: 'Martini', value: 'martini' },
  { label: 'Flip', value: 'flip' },
  { label: 'Tiki', value: 'tiki' },
] as const

export type SpecCategory = (typeof SPEC_CATEGORIES)[number]['value']
