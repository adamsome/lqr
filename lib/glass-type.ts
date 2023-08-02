export const GLASS_TYPES = ['coupe', 'rocks', 'highball', 'tiki'] as const

export type GlassType = (typeof GLASS_TYPES)[number]

const LABEL_DICT: Record<GlassType, string> = {
  coupe: 'Coupe',
  rocks: 'Rocks',
  highball: 'Highball',
  tiki: 'Tiki',
}

export function getGlassTypeLabel(value: GlassType): string {
  return LABEL_DICT[value]
}

export function getGlassTypeItems() {
  return GLASS_TYPES.map((value) => ({ value, label: LABEL_DICT[value] }))
}
