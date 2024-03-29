# TODO

- isCurrentUser Back show "Specs", etc.
- Put at `adamso.me/lqr`

## FTUE

- Create modern classics user
- Onboarding bar inventory
- Follow classics on signup

## Suggestions

- Add to Specs page reflecting current filters
- Add combos
- Which bottles/ingredients should I get to add the most specs
  - Shopping Suggestions
  - "If you bought Gin you could make 13 more specs"
  - "If you bought Sweet Vermouth and Campari, you could make..."

## Bar

### Inventory

- Bar drawer add 90 snap point (?)
- Bar grid more items badge
- Bar category selected, fade others
- Search field on `/bar/`
  - Mobile search icon shows list
- Responsive `lg`/`xl` handling
  - Left sidebar w/ category tree
  - Larger text size

### Shopping

- Shopping page (low stock)
  - Shopping icon dropdowns
- Add to wishlist
- Buy priority
- Test signed-out
- Used in `n` specs

### Trigger

- Header Bar icon dropdowns
- Move actions down to page header (not app header)
- Explore Drawer bar/shopping list

## Specs

### Favorites

- Specs, sort, In Stock, incl. favorite
- Specs fetch incl. favorites from non-following

### Users to Follow

- All clear all
  - Add clear badge
  - Store clear in DB and hide in future
- Add counts
- Move down in specs results (?)

### Criteria

- Specs filter as drawer (starting like now) with search/sort
  - Create moves to top
- Facet counts
- User limit, show more
- Bar grid as ingredient filter
  - Link to Bar
  - Link to Shopping
- Category as grid
  - Combine sours
  - Category/Glass/Mix type icons
- Specs sort drives drives description
- Specs grouping by sort
  - Content w/ sticky header (i.e. for group by date)
- Save criteria to local storage
  - If empty params, redirect to saved; else set local storage
  - Clear clears local storage

## Spec

- Color bar representing booze, citrus, lengtheners, etc.
- Spec dialog w/ '#' permalink from Specs page
- Spec Edit is when its yours, Clone when not

## Following

- Add counts
- Add users to follow
- Add back button

## Ingredients

- Add ingredient drawer (for spec edit/add & bar global add)
  - Use custom Command inside Vaul
  - Use bar grid + full search
  - Should not open keyboard by default

## Home

- Bring back home(?)
  - Add feed (movies app for inspiration)
- Include favorites section on home
- Specs has no users to follow
- Include bar on home

## Redesign

- Bricolage font (?)
- Landing page color (?)
- Spec bigger text on desktop
- Colors! BG! Look & feel!
- Add specs loading page
- Add kbd tooltips, command input hints
- Combine Bar & Research

## QoL

- Add ingredient recipes
  - E.g. Improved Gardenia Mix has ingredients & notes
- Empty states
- Add theme changer when signed out
- User avatar popover to follow
- Show app-command skeleton when auth client loading
- Improve specs perf
  - Use fetch w/ cache tags? Client-side filtering?
- Cmd-P to search Specs
  - Include Bar ingredients
  - Include Users
- Improve timestamp formatted (Twitter-like)
  - Spec modified at ([Intl.RelativeTimeFormat](https://stackoverflow.com/questions/61911591/react-intl-with-relativetime-formatting))
- Add Spec source & source link
- Specs search by ingredient too
- Spec alt. versions / basis
- Spec similar bottles & category show stocked bottles
- Improve IngredientCommand search sorting
  - E.g. can't find "Campari" currently
- Show similar specs
- Specs card ingredients, show simple ingredient names

## Content

- Add ingredient:

  - Hot Water

- Explitic ingredients:

  - Lemon
  - Lime

- Implicit ingredients:

  - Ginger
  - Salt
  - Hot Water
  - Check other garnishes (not in in-stock calc)

- Consolidate ingredients:

  - Coffee, Cold Brew

- Add ingredient category:

  - Peaty Scotch

- Add similar categories:

  - Plymouth gin should match all gin

- Fix tree where only blended scotch are in their subtree

- Hamilton Guyana 86 incorrectly listed as Black
- Blackberry Liquery incorrectly listed as Black
- `chareau_california_aloe_liqueur` category: `aloe`
- `bigallet_thyme_liqueur` category: `thyme`
- `fernetvallet` category: `fernet`
- `clear_creek_cranberry_liqueur` category: `cranberry`
- `combier_rose_liqueur` category: `cranberry`
- `st_elizabeth_allspice_dram` category: `allspice`
- Make `lofi_gentian_amaro` custom or add w/ Salers/Suze
- Move `fortifiedwine_mistelle` to `brandy_grape_vindeliqeur`
- Combine `liqueur_{fir,pine}` & `sapins`

  - Alpine liqueur category for `Genepy` & `Alpes`

- Fix `popeye_doyle` `liqueur_cherry` -> `liqueur_cherryheering`
- Fix `harbormaster` `galliano_lautentico` category
- Strange specs:
  - Carousel
  - Beach Goth
  - Outrigger
  - Lust for Life

## Chores

- Add IngredientDef (w/o stock, categoryKeys, etc.)
- Use server actions
  - Bar move state up to use optimistic rendering
- Put hard-coded system users in Clerk
