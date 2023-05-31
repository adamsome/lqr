# TODO

- Recipes data structure
- Vercel
- Clerk
- Stock filter
- Buy priority
- Rum categorization
- Recipes
- Select mode

## Spirit naming

- Tequila, Anejo vs. Anejo Tequila vs. Tequila (Anejo)
- Rum naming:

```js
const special = {
  agave_tequila: {
    // Spirit first
    blanco: 'Tequila Blanco'
  }
  grain_aquavit: {
    aged: 'Aged',
  },
  grain_gin: {
    contemporary_aged: 'Contemporary',
    londondry_navystrength: 'London Dry Navy Strength',
    plymouth_navystrength: 'Plymouth Navy Strength',
  },
  cane_cachaca: {
    aged: 'Aged',
  },
  cane_rum: {
    // {black} {productionMethod} {}
    blackblended: 'Black Blended',
    blackblendedoverproof: 'Black Blended Overproof',
    blackpotstill: 'Black Pot Still',
    blackpotstillrum: 'Black Pot Still',
    blackpotstillrumunaged: 'Black Pot Still Unaged',
    blackstrap: 'Blackstrap'
    agricole_unaged: {
      id: 'cane_rum_agricole',
      aging: ['none'],
    },
    caneaocmartiniquerhumagricole: {
      id: 'cane_rum_agricole',
      aging: ['none'],
    },
    caneaocmartiniquerhumagricoleblanc: 'Rhum Agricole Blanc',
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
    english: {
      id: 'cane_rum',
    },
    english_aged: {
      id: 'cane_rum',
      aging: ['medium', 'long'],
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
    jamaican_unaged_overproof: 'Pot Still Lightly Aged (overproof)',
  },
}
```
