import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { parseCsvLine } from './parse-csv-line.mjs'
import { slugify } from './slugify.mjs'

const catMapFull = {
  'beer (ginger)': { id: 'soda_gingerbeer' },
  'liqueur (allspice dram)': {
    id: 'liqueur_herbal',
    bottleID: 'st_elizabeth_allspice_dram',
  },
  'pot still lightly aged rum (overproof)': {
    id: 'cane_rum_jamaican',
    bottleID: 'smith_cross_navy_strength',
    productionMethod: 'pot',
    aging: ['light'],
    overproof: true,
  },
  'rum (jamaican) (overproof)': {
    id: 'cane_rum_jamaican',
    bottleID: 'smith_cross_navy_strength',
    productionMethod: 'pot',
    aging: ['light'],
    overproof: true,
  },
  'amaro (aperitivo) (campari)': {
    id: 'liqueur_amaro_aperitivo',
    bottleID: 'campari',
  },
  'rum (r.l. seale 10 year)': {
    id: 'cane_rum',
    bottleID: 'rl_seale_foursquare_9_year_port_cask_finish',
  },
  soda: { id: 'soda_club' },
  vodka: { id: 'grain_vodka' },
  'wine (sparkling) (champagne)': { id: 'wine_sparkling' },
  'blended aged rum (jamaica)': {
    id: 'cane_rum_jamaican',
    productionMethod: 'blended',
    aging: ['light', 'medium', 'long'],
  },
  'black blended rum (jamaica)': {
    id: 'cane_rum_jamaican',
    productionMethod: 'blended',
    black: true,
  },
  'cyril zangs 00 apple cider eau-de-vie': {
    id: 'brandy_applecider',
    bottleID: 'cyril_zangs_00_apple_cide_eaudevie',
  },
  'mix (donn’s mix #1)': [{ id: 'juice_grapefruit' }, { id: 'syrup_cinnamon' }],
  'mix (don’s spices )': [
    { id: 'syrup_vanilla' },
    { id: 'liqueur_herbal', bottleID: 'st_elizabeth_allspice_dram' },
  ],
  'amaro (aperitivo) (cappelletti)': {
    id: 'liqueur_amaro_medium',
    bottleID: 'cappelletti_pasubio_vino_amaro',
  },
  'syrup (strawberry) (basil)': { id: 'syrup_strawberrybasil' },
  'singani 63 eau-de-vie': {
    id: 'brandy_grape_singani',
    bottleID: 'singani_63',
  },
  umeshu: { id: 'liqueur_umeshu' },
  'novo fogo cachaça': {
    id: 'cane_cachaca',
    bottleID: 'novo_fogo_silver',
  },
  'domaine d’espérance blanche armagnac': {
    id: 'brandy_grape_armagnac',
    bottleID: 'domaine_desperance_blanche_armagnac',
  },
  'domaine d’esperance blanche armagnac': {
    id: 'brandy_grape_armagnac',
    bottleID: 'domaine_desperance_blanche_armagnac',
  },
  'aquafaba (egg white substitute)': {
    id: 'egg_aquafaba',
  },
  'cobrafire eau-de-vie de raisin': {
    id: 'brandy_raisin',
    bottleID: 'cobrafire_eaudevie_de_raisin',
  },
  'amaro (carciofo) (cynar)': {
    id: 'liqueur_amaro_carciofo',
    bottleID: 'cynar',
  },
  'amaro (aperitivo) (campari) (infusion : coffee bean)': {
    id: 'liqueur_amaro_aperitivo',
    bottleID: 'campari',
    infusion: 'coffee bean',
  },
  'amaro (citron sauvage)': {
    bottleID: 'bittermens_citron_sauvage',
    id: 'liqueur_grapefruit',
  },
}
const catSkip = [
  'garnish',
  'sparkling lemonade',
  'li hing mui powder',
  'syrup (napa wine)',
  'cabonated chai tea',
  'Extract (spruce Beer Soda)',
  'Hot Buttered Rum Batter',
  'Water Hot',
  'Salted Butter',
  'Water Boiling',
  'Liqueur (ginger)',
  'Syrup (mai Tai Rich Simple)',
  'Syrup (passion Fruit Honey)',
  'Cordial (Alpenglow)',
  'Lactart',
  'Syrup (Cucumber Magnesium)',
  'Tepache',
  'Pineapple (Frond)',
  'Fennel fronds',
  'Salt (Aleppo)',
  'Water (Flavored)',
  'Syrup (Demerara) (Tamarind)',
  'Tea (Genmaicha)',
  'Vodka (Green chile)',
  'Hot sauce',
  'Bitters (Hopped grapefruit)',
  'Parasol',
  'Whey (Kefir)',
  'Syrup (Lime Leaf, Lemongrass & Shiso)',
  'Mix (Gardenia)',
  'Mix (Papaya)',
  'Syrup (White Chocolate) (Wasabi)',
  'Vermouth (Absinthe)',
  'Tea (Summer Royal)',
  'Calpico',
  'Syrup (Strawberry) (Aloe)',
  'Lecithin',
  'Liqueur (Noyaux)',
  'Syrup (Pineapple) (Hopped)',
  'Pickle (Tomato)',
  'Powder (Raspberry)',
  'Whiskey (Malt) (American)',
  'Rum (Spanish) (Oloroso)',
  'Rum (Pineapple)',
  'Vodka (Hop)',
  'Bitters (Yuzu)',
  'Tincture (Habanero)',
  'Bitters (Chocolate chile)',
  'Whiskey (Blend)',
  'Water (Boiling)',
  'Tincture (Sarsaparilla)',
  'Liqueur (Grapefruit and Rosemary)',
  'Liqueur (Pomegranate)',
  'Vodka (Buddha’s Hand)',
  'Syrup (Aperitif)',
  'Spirit (Escubac)',
  'Bitters (Pecan)',
  'Fruit (Umeboshi plum)',
  'Spirit (Träkal)',
  'Amaro (Elisir Novasalu)',
  'Brine (Japanese pickle)',
  'Pickle (Cucumber)',
  'Liqueur (Élixir combier)',
  'Cream (Grand Marnier)',
  'Sorbet (Oat milk)',
  'Yogurt (Greek)',
  'Syrup (Hibiscus Honey)',
]
const skipPreSplit = [
  'Pajarote Toronja Arandense & Romero Licor',
  'Miracle Mile cucumber/orris root bitters',
  '1 mint sprig, 1 orange wheel, blackberries, raspberries, and powdered sugar',
  '2 pineapple fronds and 1 small dried chile',
  '1 small cube of bread soaked in 151-proof rum, 1 empty lime shell, and ground cinnamon',
  '1 lemon wheel, 1 raspberry, and 1 mint bouquet',
  '1 mint bouquet and dried banana slices',
  '1 orange wheel, 1 mint bouquet, and powdered sugar',
  '1 dehydrated pineapple slice, 1 mint bouquet, and 1 coffee bean',
  '1 mint bouquet, 1 orange half wheel, 1 apple slice, powdered sugar, and 1 cinnamon stick',
  '1 lemon twist and 1 orange twist',
  '1 lemon wheel, 1 apple slice, and 1 mint bouquet',
  '1 orange twist and 1 lemon twist',
  '1 mint bouquet, 2 raspberries, 2 blackberries, and powdered sugar',
  '1 orange half wheel and 2 raspberries and/or blackberries on a skewer, 1 cinnamon stick',
  '1 coriander flower',
  '1 lemon twist and 1 rosemary sprig',
  'dashi Kombu–Infused Pear Brandy in an atomizer',
  '1 pickled carrot or 1 pickled radish slice',
  'Toasted coconut flakes and grapefruit zest',
  'Campari-Infused Toasted Coconut',
  'Toasted Oat Cream  and nutmeg',
  'Spent Coffee Grounds Syrup',
  '1 mint bouquet and toasted coconut',
]
const ingSkip = [
  'Peruvian Pisco',
  'Absinthe Blanc',
  'Pot Still Aged Cachaça',
  'Blended Aged Rum (guyana)',
  'Blended Aged Rum (barbados)',
  'white port',
  'Absinthe, to rinse',
]
const catMap = {
  'Whisky (Malt) (Indian)': 'grain_whiskey_indian',
}
const c1Map = {
  citrus: 'fruit',
  coconutmilk: 'milk_coconut',
  coconutwater: 'water_coconut',
  cucumber: 'fruit_cucumber',
  eggmedium: 'egg_whole',
  leaves: 'spice',
  leaf: 'spice',
  mint: 'spice_mint',
  molasses: 'syrup_molasses',
  olive: 'fruit_olive',
  packedgoldenbrownsugar: 'sugar_brown',
  pineapplefronds: 'leaf_pineapple',
  rhubarb: 'vegetable_rhubarb',
  salt: 'spice_salt',
  sweetenedcondensedmilk: 'milk_condensed',
  tonic: 'soda_tonic',
  aperitif: 'fortifiedwine_aperitif',
  absinthe: 'liqueur_absinthe',
  amaro: 'liqueur_amaro',
  aquavit: 'grain_aquavit',
  bananaliqueur: 'liqueur_banana',
  bataviaarrack: 'cane_bataviaarrack',
  cachaca: 'cane_cachaca',
  gin: 'grain_gin',
  hellfiretincture: 'bitters_spicy',
  madeira: 'fortifiedwine_madeira',
  pineaudescharentes: 'brandy_grape_pineaudescharentes',
  pommeaudenormandie: 'brandy_grape_pommeau',
  port: 'fortifiedwine_port',
  rum: 'cane_rum',
  sake: 'wine_sake',
  sherry: 'fortifiedwine_sherry',
  tequila: 'agave_tequila',
  whiskey: 'grain_whiskey',
  whisky: 'grain_whiskey',
}
const c2Map = {
  diangostura: 'medium',
  licor43: 'herbal',
  drambuie: 'herbal',
  chartreusegreen: 'herbal',
  chartreuseyellow: 'herbal',
  yellowchartreuse: 'herbal',
  benedictine: 'herbal',
  orangeblue: 'orange_bluecuracao',
  bananaliqueur: 'banana',
  martiniquesugarcane: 'cane',
  pisco: 'grape_pisco',
  bittermensburlesque: 'floral',
  coffee: 'coffeebean',
  heavywhipping: 'heavy',
  blackpepercorns: 'blackpeppercorn',
  blackpepper: 'blackpeppercorn',
  richsimple: 'simple',
  brokers: 'londondry',
  cassis: 'cremedecassis',
  redeye: 'coffey',
  suze: 'amaro_aperitivo',
  cocchiamericano: '',
  maraschinocherry: 'maraschino',
  salers: '',
  lilletrose: '',
  quiquina: '',
  riesling: 'white_riesling',
  bonalgentianequina: '',
  thym: 'thyme',
  peychauds: 'creole',
  lilletblanc: '',
  cacao: 'cremedecacao',
  solution: '',
  unagedoat: '',
  lambrusco: 'red_lambrusco',
  genepy: 'herbal',
  sauternes: 'sweet_sauternes',
  pineapplepulp: 'pineapple',
  strega: 'herbal',
  byrrh: '',
  nocino: 'walnut',
  rancio: 'red_rancio',
  maurinquina: '',
  pasubio: 'medium',
}
const c3Map = {
  brutoamericano: '',
  montenegro: '',
  meletti: '',
  ramazzotti: '',
  marseille: '',
  nonino: '',
  zucca: '',
  lofi: '',
  amburana: '',
  aperol: '',
  chinachina: '',
  abano: '',
  diangostura: '',
  ciociaro: '',
  rabarbaro: '',
  braulio: '',
  nardini: '',
  granclassicobitter: '',
  bitterbianco: '',
}
const c4Map = {
  sfumato: '',
}
const csMap = {
  vermouth_dry: ['fortifiedwine', 'dryvermouth'],
  vermouth_sweet: ['fortifiedwine', 'sweetvermouth'],
  vermouth_blanc: ['fortifiedwine', 'blancvermouth'],
  vermouth_ambre: ['fortifiedwine', 'ambrevermouth'],
  grain_aquavit: ['grain', 'aquavit'],
  water_sparkling: ['soda', 'club'],
  wine_madeira: ['fortifiedwine', 'madeira'],
  wine_syrah: ['wine', 'red', 'syrah'],
  wine_moscatel: ['wine', 'sweet', 'moscatel'],
  wine_malbec: ['wine', 'red', 'malbec'],
  brandy_garammasala: ['brandy', 'garammasala'],
  eaudevie_apple: ['brandy', 'apple'],
  eaudevie_applecider: ['brandy', 'applecider'],
  eaudevie_apricot: ['brandy', 'apricot'],
  eaudevie_basil: ['brandy', 'basil'],
  eaudevie_carrot: ['brandy', 'carrot'],
  eaudevie_cherry: ['brandy', 'cherry'],
  eaudevie_douglasfir: ['brandy', 'douglasfir'],
  eaudevie_grape_grappa: ['brandy', 'grape', 'grappa'],
  eaudevie_grape_singani: ['brandy', 'grape', 'singani'],
  eaudevie_hazelnut: ['brandy', 'hazelnut'],
  eaudevie_mango: ['brandy', 'mango'],
  eaudevie_peach: ['brandy', 'peach'],
  eaudevie_pear: ['brandy', 'pear'],
  eaudevie_plum: ['brandy', 'plum'],
  eaudevie_plum_aged: ['brandy', 'plum', ''],
  eaudevie_raspberry: ['brandy', 'raspberry'],
  eaudevie_raisin: ['brandy', 'raisin'],
  eaudevie_shiso: ['brandy', 'shiso'],
  eaudevie_tomato: ['brandy', 'tomato'],
  eaudevie_vanilla: ['brandy', 'vanilla'],
  water: ['water', 'flat'],
  spirit_habanero: ['liqueur', 'habanero'],
  wine_port: ['fortifiedwine', 'port', 'white'],
  liqueur_mint: ['liqueur', 'cremedementhe'],
  liqueur_violette: ['liqueur', 'cremedeviolette'],
  verjus_blanc: ['juice', 'verjus'],
  chartreuse_yellow: ['liqueur', 'herbal'],
  chartreuse_yellowvep: ['liqueur', 'herbal'],
  ginger: ['spice', 'ginger'],
  shochu_rice: ['grain_shochu'],
  shochu_barley: ['grain', 'shochu'],
  shochu_sesame: ['grain', 'shochu'],
  shochu_lemongrass: ['grain', 'shochu'],
  fruit_berry: ['fruit', 'raspberry'],
  cane_rum_clairin: ['cane', 'clairin'],
  spice_banana: ['leaf', 'banana'],
  chartreuse_green: ['liqueur', 'herbal'],
  liqueur_punsch: ['cane_swedishpunsch'],
  wine_mistelle: ['fortifiedwine', 'mistelle'],
  sugar: ['sugar', 'white'],
  milk: ['milk', 'whole'],
  egg: ['egg', 'whole'],
}
const special = {
  grain_aquavit: {
    aged: {
      id: 'grain_aquavit',
      aging: ['medium', 'long'],
    },
  },
  grain_gin: {
    contemporary_aged: {
      id: 'grain_gin_contemporary',
      aging: ['medium', 'long'],
    },
    londondry_navystrength: {
      id: 'grain_gin_londondry',
      overproof: true,
    },
    plymouth_navystrength: {
      id: 'grain_gin_plymouth',
      overproof: true,
    },
    oldtom_aged: {
      id: 'grain_gin_oldtom',
      aging: ['light', 'medium', 'long'],
    },
  },
  cane_cachaca: {
    aged: {
      id: 'cane_cachaca',
      aging: ['medium', 'long'],
    },
  },
  cane_rum: {
    blackblended: {
      id: 'cane_rum',
      productionMethod: 'blended',
      black: true,
    },
    blackblendedoverproof: {
      id: 'cane_rum',
      productionMethod: 'blended',
      black: true,
      overproof: true,
    },
    blend_overproof: {
      id: 'cane_rum',
      productionMethod: 'blended',
      black: true,
      overproof: true,
    },
    blackpotstill: {
      id: 'cane_rum',
      productionMethod: 'pot',
      black: true,
    },
    blackpotstillrum: {
      id: 'cane_rum',
      productionMethod: 'pot',
      black: true,
    },
    blackpotstillunaged: {
      id: 'cane_rum',
      productionMethod: 'pot',
      aging: ['none'],
      black: true,
    },
    blackstrap: {
      id: 'cane_rum',
      productionMethod: 'blended',
      aging: ['light'],
      black: true,
    },
    blend: {
      id: 'cane_rum',
      productionMethod: 'blended',
      aging: ['medium', 'long'],
    },
    blendedaged: {
      id: 'cane_rum',
      productionMethod: 'blended',
      aging: ['medium', 'long'],
    },
    blendedlightlyaged: {
      id: 'cane_rum',
      productionMethod: 'blended',
      aging: ['light'],
    },
    blend_unaged: {
      id: 'cane_rum',
      productionMethod: 'blended',
      aging: ['light'],
    },
    agricole_unaged: {
      id: 'cane_rum_agricole',
      aging: ['none'],
    },
    caneaocmartiniquerhumagricole: {
      id: 'cane_rum_agricole',
      aging: ['none'],
    },
    caneaocmartiniquerhumagricoleblanc: {
      id: 'cane_rum_agricole',
      aging: ['none'],
    },
    caneaocmartiniquerhumagricolevieux: {
      id: 'cane_rum_agricole',
      aging: ['medium', 'long'],
    },
    canecoffeystillaged: {
      id: 'cane_rum_agricole',
      productionMethod: 'coffey',
      aging: ['medium', 'long'],
    },
    columnstillaged: {
      id: 'cane_rum',
      productionMethod: 'column',
      aging: ['medium', 'long'],
    },
    columnstilllightlyaged: {
      id: 'cane_rum',
      productionMethod: 'column',
      aging: ['light'],
    },
    demerara_overproof: {
      id: 'cane_rum',
      productionMethod: 'blended',
      black: true,
      overproof: true,
    },
    english: {
      id: 'cane_rum',
    },
    english_aged: {
      id: 'cane_rum',
      aging: ['medium', 'long'],
    },
    english_unaged: {
      id: 'cane_rum',
      aging: ['light', 'medium'],
    },
    haiti: {
      id: 'cane_rum_agricole',
      productionMethod: 'coffey',
      aging: ['medium', 'long'],
    },
    haiti_unaged: {
      id: 'cane_rum_agricole',
      productionMethod: 'coffey',
      aging: ['none'],
    },
    spanish: {
      id: 'cane_rum',
      productionMethod: 'blended',
      aging: ['light'],
    },
    spanish_unaged: {
      id: 'cane_rum',
      productionMethod: 'blended',
      aging: ['light'],
    },
    potstillunaged: {
      id: 'cane_rum',
      productionMethod: 'pot',
      aging: ['none'],
    },
    wraynephewwhiteoverproof: {
      id: 'cane_rum_jamaican',
      productionMethod: 'pot',
      aging: ['none'],
      overproof: true,
    },
    jamaican_unaged_overproof: {
      id: 'cane_rum_jamaican',
      productionMethod: 'pot',
      aging: ['none'],
      overproof: true,
    },
  },
}

function createCatID(c1, c2, c3, c4) {
  let res = c1
  if (c2) res += '_' + c2
  if (c3) res += '_' + c3
  if (c4) res += '_' + c4
  return res
}

export function parseSpecs() {
  const path = fileURLToPath(import.meta.url)
  const dir = dirname(path)

  const categoriesJsonPath = join(dir, '../json/categories.json')
  const categoriesJson = readFileSync(categoriesJsonPath, 'utf-8')
  const categories = JSON.parse(categoriesJson)
  const categoryDict = categories.reduce((acc, it) => {
    acc[it.id] = it
    return acc
  }, {})

  const baseJsonPath = join(dir, '../json/base-ingredients.json')
  const baseJson = readFileSync(baseJsonPath, 'utf-8')
  const base = JSON.parse(baseJson)
  const baseDict = base.reduce((acc, it) => {
    acc[it.id] = it
    return acc
  }, {})

  const ingredientsJsonPath = join(dir, '../json/ingredients.json')
  const ingredientsJson = readFileSync(ingredientsJsonPath, 'utf-8')
  const ingredients = JSON.parse(ingredientsJson)

  const specsCsvPath = join(dir, './specs-books.csv')
  const specsCsv = readFileSync(specsCsvPath, 'utf-8')

  const specs = {}
  let specCategory = 'tiki'
  let count = 1
  let stop = false

  specsCsv
    .split(/\r?\n/)
    .slice(1)
    .forEach((line, i) => {
      if (stop) return

      const [
        source,
        ordinal,
        name,
        ingName,
        styleCode,
        rawCat,
        infusion,
        sourcePage,
        stock,
      ] = parseCsvLine(line)

      if (!name) return

      if (!ingName) {
        if (name === 'Fresh & Lively (Highball)') specCategory = 'highball'
        if (name === 'Light & Playful (Daiquiri)') specCategory = 'daiquiri'
        if (name === 'Bright & Confident (Sidecar)') specCategory = 'sidecar'
        if (name === 'Boozy & Honest (Old-Fashioned)')
          specCategory = 'oldfashioned'
        if (name === 'Elegant & Timeless (Martini)') specCategory = 'martini'
        if (name === 'Rich & Comforting (Flip)') specCategory = 'flip'
        console.log(`\n\x1b[95m${specCategory}\x1b[0m\n`)
        return
      }

      const id = slugify(name, { replaceWith: '_' })
      if (!specs[id]) {
        console.log(String(count).padStart(4) + '.', name)
        count++
        const now = new Date().toISOString()
        let year
        let bar
        let username = 'adamsome'
        let userID = 'user_2QaSdLhpL7dMcmD999SKB2teEIM'
        let userDisplayName = undefined
        if (source === "Smuggler's Cove") {
          year = 2016
          bar = "Smuggler's Cove"
          username = 'smugglers_cove'
          userID = 'user_smugglerscove'
          userDisplayName = "Smuggler's Cove"
        }
        if (source === 'Welcome Home') {
          year = 2021
          bar = 'Death & Co'
          username = 'deathco_welcome_home'
          userID = 'user_deathcowelcomehome'
          userDisplayName = 'Death & Co Welcome Home'
        }
        specs[id] = {
          id,
          name,
          userID,
          username,
          userDisplayName,
          updatedAt: now,
          createdAt: now,
          year,
          category: specCategory,
          ingredients: [],
          bar,
          source: source ? source : undefined,
          sourcePage: sourcePage ? Number(sourcePage) : undefined,
        }
      }

      const ingredientID = slugify(ingName, { replaceWith: '_' })

      let categoryStr = String(rawCat).toLowerCase()
      if (catMap[rawCat]) {
        categoryStr = catMap[rawCat]
      }

      if (
        skipPreSplit.some(
          (c) =>
            categoryStr === c.toLowerCase() ||
            ingName.toLowerCase() === c.toLowerCase(),
        )
      )
        return specs[id].ingredients.push({ name: ingName })

      let categoryParts = categoryStr.split(' and ')
      categoryParts.forEach((_cat) => {
        let category = _cat

        let fullMatch =
          catMapFull[category] ?? catMapFull[ingName.toLowerCase()]
        if (fullMatch) {
          fullMatch = Array.isArray(fullMatch) ? fullMatch : [fullMatch]
          return fullMatch.forEach((fm) =>
            specs[id].ingredients.push({ ...fm }),
          )
        }

        let ing = { name: ingName }

        if (catSkip.some((c) => category.startsWith(c.toLowerCase())))
          return specs[id].ingredients.push(ing)

        let c1
        let c2
        let c3
        let c4
        const nbParens = category.match(/\(/g || [])?.length ?? 0
        if (nbParens === 1) {
          const parenIdx = category.indexOf('(')
          c1 = slugify(category.slice(0, parenIdx - 1))
          c2 = slugify(category.slice(parenIdx + 1, category.length - 1))
          if (c2.startsWith('infusion')) {
            const [_, infusion] = category
              .slice(parenIdx + 1, category.length - 1)
              .split(' : ')
            ing.infusion = infusion
            c2 = undefined
          }
        } else if (nbParens === 2) {
          const paren1Idx = category.indexOf('(')
          const paren2Idx = category.indexOf('(', paren1Idx + 1)
          c1 = slugify(category.slice(0, paren1Idx - 1))
          c2 = slugify(category.slice(paren1Idx + 1, paren2Idx - 1))
          c3 = slugify(category.slice(paren2Idx + 1, category.length - 1))
          if (c3.startsWith('infusion')) {
            const [_, infusion] = category
              .slice(paren2Idx + 1, category.length - 1)
              .split(' : ')
            ing.infusion = infusion
            c3 = undefined
          }
        } else if (nbParens === 3) {
          const paren1Idx = category.indexOf('(')
          const paren2Idx = category.indexOf('(', paren1Idx + 1)
          const paren3Idx = category.indexOf('(', paren2Idx + 1)
          c1 = slugify(category.slice(0, paren1Idx - 1))
          c2 = slugify(category.slice(paren1Idx + 1, paren2Idx - 1))
          c3 = slugify(category.slice(paren2Idx + 1, paren3Idx - 1))
          c4 = slugify(category.slice(paren3Idx + 1, category.length - 1))
          if (c4.startsWith('infusion')) {
            const [_, infusion] = category
              .slice(paren3Idx + 1, category.length - 1)
              .split(' : ')
            ing.infusion = infusion
            c4 = undefined
          }
        } else {
          c1 = slugify(category)
        }

        const ingMatch = ingredients.find(
          (it) =>
            ingredientID.startsWith(it.id) ||
            (it.id.length > 7 &&
              ingredientID.length > 7 &&
              (it.id.startsWith(ingredientID) ||
                ingredientID.endsWith(it.id) ||
                it.id.endsWith(ingredientID))),
        )
        if (ingMatch) {
          ing.bottleID = ingMatch.id
          console.log(`\x1b[34m${ingredientID}\x1b[0m`)
        }

        let catID = createCatID(c1, c2, c3, c4)
        if (c1Map[c1] !== undefined) {
          c1 = c1Map[c1]
          catID = createCatID(c1, c2, c3, c4)
        }
        if (c2Map[c2] !== undefined) {
          c2 = c2Map[c2]
          catID = createCatID(c1, c2, c3, c4)
        }
        if (c3Map[c3] !== undefined) {
          c3 = c3Map[c3]
          catID = createCatID(c1, c2, c3, c4)
        }
        if (c4Map[c4] !== undefined) {
          c4 = c4Map[c4]
          catID = createCatID(c1, c2, c3, c4)
        }
        if (csMap[catID]) {
          c1 = csMap[catID][0]
          c2 = csMap[catID][1]
          c3 = csMap[catID][2]
          c4 = csMap[catID][3]
          catID = createCatID(c1, c2, c3, c4)
        }

        if (special[c1]) {
          const key = `${c2}${c3 ? `_${c3}` : ''}${c4 ? `_${c4}` : ''}`
          if (special[c1][key]) {
            const si = baseDict[c1]
            validateSpirit(si, ingMatch, ingName, rawCat, c1, c2, c3, c4)
            return specs[id].ingredients.push({
              bottleID: ing.bottleID,
              infusion: ing.infusion,
              ...special[c1][key],
            })
          }
        }

        const baseItem = baseDict[catID]

        if (!baseItem) {
          let _c = `${rawCat}`
          _c += `; "${c1}:${c2 ?? ''}:${c3 ?? ''}:${c4 ?? ''}"`
          console.log(`\x1b[91m[XXX] ${name}; ${ingName}; ${_c}\x1b[0m`)
          ing.XXX = true
          stop = true
          return
        }

        ing.id = baseItem.id
        ing.name = undefined

        validateSpirit(baseItem, ingMatch, ingName, rawCat, c1, c2, c3, c4)

        return specs[id].ingredients.push(ing)
      })
    })

  writeFileSync(
    join(dir, '../json/specs.json'),
    JSON.stringify(specs, null, 2),
    { encoding: 'utf8' },
  )

  function validateSpirit(item, match, name, cat, c1, c2, c3, c4) {
    const catType = categoryDict[item.category].type
    const baseNames = getBaseNames(item)
    const rumless = slugify(name).replace('rum', '')
    const specialKeys = Object.keys(special[c1] ?? {})
    if (
      !match &&
      catType === 'spirit' &&
      baseNames.every((n) => n !== sanitize(name)) &&
      ingSkip.every((n) => sanitize(n) !== sanitize(name)) &&
      (specialKeys.length === 0 || specialKeys.every((n) => n !== rumless)) &&
      !sanitize(cat).includes('infusion')
    ) {
      let _c = `${cat}`
      _c += `; "${c1}:${c2 ?? ''}:${c3 ?? ''}:${c4 ?? ''}"`
      console.log(`\x1b[91m[ING] ${name}; ${_c}\x1b[0m`)
      console.log(`      [${baseNames.join(', ')}]`)
      if (item.id === 'cane_rum') {
        console.log('      rumless', rumless)
      }
    }
  }

  function sanitize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  function getBaseNames(item) {
    const result = []
    const cat = sanitize(categoryDict[item.category].name)
    while (item) {
      const curr = sanitize(item.name)
      if (result.length === 0) {
        result.push(curr)
      } else {
        const prev = result[result.length - 1]
        result.push(`${curr} ${prev}`)
        result.push(`${prev} ${curr}`)
      }
      item = baseDict[item.parent]
    }
    const prev2 = result[result.length - 1]
    result.push(`${cat} ${prev2}`)
    result.push(`${prev2} ${cat}`)
    result.push(cat)
    return result
  }
}
