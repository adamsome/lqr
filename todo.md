# TODO

- Fix spec update/create submit on cancel
- Fix zoom on mobile safari input focus

FTUE
----

- Responsive landing page
- Onboarding bar inventory
- Follow classics on signup

Bar
---

### Inventory

- Bar drawer add 90 snap point (?)
- Bar grid more items badge
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

Specs
-----

### Favorites

- Specs, sort, In Stock, incl. favorite
- Specs fetch incl. favorites from non-following

### Users to Follow

- Add counts
- Move down in specs results (?)

### Criteria

- Bar grid as ingredient filter
  - Link to Bar
  - Link to Shopping
- Category as grid
  - Category/Glass/Mix type icons
- Specs sort drives drives description
- Specs grouping by sort
  - Content w/ sticky header (i.e. for group by date)
- Save criteria to local storage
  - If empty params, redirect to saved; else set local storage
  - Clear clears local storage

Spec
----

- Spec Edit is when its yours, Clone when not

Following
---------

- Add counts
- Add users to follow
- Add back button

Ingredients
-----------

- Add ingredient drawer (for spec edit/add & bar global add)
  - Use custom Command inside Vaul
  - Use bar grid + full search
  - Should not open keyboard by default

Home
----

- Bring back home(?)
- Include favorites section on home
- Specs has no users to follow
- Include bar on home

Redesign
--------

- Bricolage font (?)
- Landing page color (?)
- Spec bigger text on desktop
- Colors! BG! Look & feel!
- Add specs loading page
- Add kbd tooltips, command input hints
- Combine Bar & Research

QoL
---

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

Content
-------

- Add ingredient:
  - Hot Water

- Implicit ingredients:
  - Ginger
  - Salt
  - Hot Water
  - Check other garnishes (not in in-stock calc)

- Consolidate ingredients:
  - Coffee, Cold Brew

- Add ingredient category:
  - Peaty Scotch

- Fix tree where only blended scotch are in their subtree

- Hamilton Guyana 86 incorrectly listed as Black
- Blackberry Liquery incorrectly listed as Black
- Singani, fix category type
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

Chores
------

- Use server actions
  - Bar move state up to use optimistic rendering
- Put hard-coded system users in Clerk
