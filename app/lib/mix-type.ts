export const MIX_TYPES = ['stirred', 'shaken', 'build'] as const

export type MixType = (typeof MIX_TYPES)[number]

const LABEL_DICT: Record<MixType, string> = {
  stirred: 'Stirred',
  shaken: 'Shaken',
  build: 'Build in glass',
}

export function getMixTypeLabel(value: MixType): string {
  return LABEL_DICT[value]
}

export function getMixTypeItems() {
  return MIX_TYPES.map((value) => ({ value, label: LABEL_DICT[value] }))
}
