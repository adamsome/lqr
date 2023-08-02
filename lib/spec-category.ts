export const SPEC_CATEGORIES = [
  'highball',
  'daiquiri',
  'sidecar',
  'oldfashioned',
  'martini',
  'flip',
  'tiki',
] as const

export type SpecCategory = (typeof SPEC_CATEGORIES)[number]

const LABEL_DICT: Record<SpecCategory, string> = {
  highball: 'Highball',
  daiquiri: 'Daiquiri',
  sidecar: 'Sidecar',
  oldfashioned: 'Old-Fashioned',
  martini: 'Martini',
  flip: 'Flip',
  tiki: 'Tiki',
}

export function getSpecCategoryLabel(value: SpecCategory): string {
  return LABEL_DICT[value]
}

export function getSpecCategoryItems() {
  return SPEC_CATEGORIES.map((value) => ({ value, label: LABEL_DICT[value] }))
}
