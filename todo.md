# TODO

Specs
-----

### Favorites

- Specs, sort, In Stock, incl. favorite
- Specs fetch incl. favorites from non-following

### Criteria

- Specs sort drives drives description
- Specs grouping by sort
  - Content w/ sticky header (i.e. for group by date)
- Save criteria to local storage
  - If empty params, redirect to saved; else set local storage
  - Clear clears local storage

Bar
---

- Header Bar icon dropdowns
- Move actions down to page header (not app header)
- Explore Drawer bar/shopping list

### Shopping

- Improve states, [[Full] [Out]] [[Buy] [Ignore]]
  - I.e. Stocked, Low/Replace, Out/Replace, Out/Ignore, None
  - Bar: Keep empty bottles
- Shopping page (low stock)
  - Shopping icon dropdowns
- Add to wishlist
- Buy priority

Home
----

- Bring back home
- Include favorites section on home
- Specs has no users to follow
- Include bar on home

Spec
----

- Spec Edit is when its yours, Clone when not

Redesign
--------

- Spec bigger text on desktop
- Colors! BG! Look & feel!
- Add specs loading page
- Add kbd tooltips, command input hints
- Combine Bar & Research

QoL
---

- Hide Salt from Bar (should be implicit)
- User avatar popover to follow
- Show app-command skeleton when auth client loading
- Empty states
- Improve specs perf
  - Use fetch w/ cache tags? Client-side filtering?
- Cmd-P to search Specs
  - Include Bar ingredients
  - Include Users
- Improve timestamp formatted (Twitter-like)
  - Spec modified at ([Intl.RelativeTimeFormat](https://stackoverflow.com/questions/61911591/react-intl-with-relativetime-formatting))
- Category/Glass/Mix type icons
- Add Spec source & source link
- Specs search by ingredient too
- Spec alt. versions / basis
- Spec similar bottles & category show stocked bottles
- Improve IngredientCommand search sorting
  - E.g. can't find "Campari" currently
- Show similar specs

Chores
------

- Put hard-coded system users in Clerk
- Strange specs:
  - Carousel
  - Beach Goth
  - Outrigger
  - Lust for Life
