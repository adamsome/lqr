import { SPECS } from '../routes'
import { Ingredient } from '../types'

export const SAMPLE_BAR_CATEGORIES = [
  'rye-whiskey',
  'dry-vermouth',
  'maraschino',
  'angostura',
  'campari',
  'fernet',
  'simple-syrup',
  'demerara-syrup',
]

export const SAMPLE_INGREDIENT_DATA: Record<string, Partial<Ingredient>> = {
  rittenhouse: { stock: 1 },
  pikesville: { stock: 1 },
  dolin_dry: { stock: 1 },
  liqueur_maraschino: { stock: 1 },
  angostura: { stock: 1 },
  campari: { stock: 1 },
  fernetbranca: { stock: 1 },
  syrup_simple: { stock: 1 },
  syrup_demerara: { stock: 1 },
}

export const SAMPLE_SPECS_PATH = `${SPECS}?${SAMPLE_BAR_CATEGORIES.map((d) => `c=${d}`).join('&')}`
