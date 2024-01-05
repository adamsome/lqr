import { BarCategoryDef } from '@/app/u/[username]/bar/types'

export const spirits: BarCategoryDef[] = [
  { include: [{ id: 'grain_whiskey_rye' }] },
  { include: [{ id: 'grain_gin' }] },
  { include: [{ id: 'fortifiedwine_dryvermouth' }] },
  { kind: 'bitters', rowSpan: 2 },
  { include: [{ id: 'brandy_grape_cognac' }] },
  { include: [{ id: 'agave_tequila' }] },
  { include: [{ id: 'fortifiedwine_sweetvermouth' }] },
  { include: [{ id: 'grain_whiskey_scotch' }] },
  { include: [{ id: 'agave_mezcal' }] },
  { include: [{ id: 'liqueur_amaro_aperitivo' }] },
  { include: [{ id: 'liqueur_absinthe' }] },
  { include: [{ id: 'grain_whiskey_bourbon' }] },
  { include: [{ id: 'brandy_apple' }] },
  { include: [{ id: 'liqueur_orange' }] },
  { include: [{ id: 'liqueur_maraschino' }] },
  { include: [{ id: 'grain_whiskey_irish' }] },
  {
    name: 'Other Whisky',
    include: [{ id: 'grain_whiskey_irish' }],
    exclude: [
      { id: 'grain_whiskey_rye' },
      { id: 'grain_whiskey_scotch' },
      { id: 'grain_whiskey_bourbon' },
      { id: 'grain_whiskey_irish' },
    ],
  },
  {
    name: 'Chartreuse',
    ids: ['green_chartreuse', 'yellow_chartreuse'],
  },
  { name: 'Benedictine', ids: ['benedictine'] },
  { include: [{ id: 'cane_rum_jamaican', black: false }] },
  { include: [{ id: 'cane_rum_demerara', overproof: false, black: false }] },
  {
    name: 'Other Rum',
    include: [{ id: 'cane_rum' }],
    exclude: [
      { id: 'cane_rum', black: true },
      { id: 'cane_rum', overproof: true },
      { id: 'cane_rum_jamaican', black: false },
      { id: 'cane_rum_demerara', overproof: false, black: false },
      { id: 'cane_rum_agricole' },
    ],
    rowSpan: 2,
  },
  {
    name: 'Falernum',
    ids: ['john_d_taylors_velvet_falernum'],
  },
  { include: [{ id: 'cane_rum_agricole' }] },
  {
    name: 'Black & Overproof Rum',
    include: [
      { id: 'cane_rum', black: true },
      { id: 'cane_rum', overproof: true },
    ],
    exclude: [
      { id: 'cane_rum_jamaican', black: false },
      { id: 'cane_rum_demerara', overproof: false, black: false },
      { id: 'cane_rum_agricole' },
    ],
  },
  {
    name: 'Allspice Dram',
    ids: ['st_elizabeth_allspice_dram'],
  },
  {
    name: 'Amari',
    include: [{ id: 'liqueur_amaro' }],
    exclude: [{ id: 'liqueur_amaro_aperitivo' }],
  },
  {
    name: 'Fortified Wine',
    include: [{ id: 'fortifiedwine' }],
    exclude: [
      { id: 'fortifiedwine_dryvermouth' },
      { id: 'fortifiedwine_sweetvermouth' },
    ],
  },
  {
    include: [{ id: 'liqueur' }],
    exclude: [
      { id: 'liqueur_amaro' },
      { id: 'liqueur_absinthe' },
      { id: 'liqueur_orange' },
      { id: 'liqueur_maraschino' },
    ],
    excludeIDs: [
      'green_chartreuse',
      'yellow_chartreuse',
      'benedictine',
      'john_d_taylors_velvet_falernum',
      'st_elizabeth_allspice_dram',
    ],
  },
]

export const ingredients: BarCategoryDef[] = [
  { kind: 'juice', rowSpan: 2 },
  { kind: 'syrup', rowSpan: 2 },
  { kind: 'soda', rowSpan: 2 },
  { kind: 'dairy' },
  { kind: 'garnish' },
]
