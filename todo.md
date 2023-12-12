# TODO

- Move actions from app header to page header
- Move sort by to '888 items {caret-down}'
- Fix Edit Spec infusion not showing
- Omit certain garnishes from in-stock % (flowers, pineapple leaf)
- Fix Bar Add Rum category showing as Rum (Add Blackstrap)
- Fix getSpecData multiple (Queen's Park Swizzle)
  - Mary Pickford

- Edit/Add spec, reference

## Redesign

- Specs compact cards
- Spec bigger text on desktop
- Colors! BG! Look & feel!
- Add specs loading page
- Add kbd tooltips, command input hints
- Revamp bar style (buttons smaller, tabs, colored bg?, grid areas?)
- Combine Bar & Research

## Home & following

- Prepend `/u/` user segment in front of all routes
- Allow signed-out to view pages
- App command sign-in
- Hide Actions when signed-out
- Spec Edit is when its yours, Clone when not?
- Avatar & name (use Clerk pictureUrl)
- My Bar: Count of bottles, Low stocked
- Favorite specs (In Stock sort incl. favorite)
- Recent specs
- Following

## Shop

- Shopping page (low stock)
- Add to wishlist
- Buy priority

## QoL

- Show app-command skeleton when auth client loading
- Hide Salt from Bar (should be implicit)
- Add specs filters search params to local storage so Specs restores: if empty params, redirect to saved. else set local storage. clear clears local storage
- Improve specs perf. (use fetch w/ cache tags? Client-side filtering)
- Cmd-P to search specs
- Spec modified at ([Intl.RelativeTimeFormat](https://stackoverflow.com/questions/61911591/react-intl-with-relativetime-formatting))
- Category/Glass/Mix type icons
- Add source & source link
- Spec favorite/stars
- Specs search by ingredient too
- Spec alt. versions
- Spec similar bottles & category show stocked bottles
- Improve IngredientCommand search sorting (can't find e.g. "Campari")
- Search all ingredients from root command page
- Similar specs

## Chores

- Strange specs:

  - Carousel
  - Beach Goth
  - Outrigger
  - Lust for Life
