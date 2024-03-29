import { IngredientKind } from '@/app/lib/ingredient/kind'
import { SpecIngredient } from '@/app/lib/types'
import { ImmerReducer, useImmerReducer } from 'use-immer'

export type Special = 'allSpirits' | 'rum'

export type State = {
  open: boolean
  custom: boolean
  search: string
  kind?: IngredientKind
  ingredient?: SpecIngredient
  special?: Special
}

export type Action =
  | { type: 'open'; value?: boolean }
  | { type: 'toggleOpen' }
  | { type: 'openCustom' }
  | { type: 'back' }
  | { type: 'backTo'; value: 'kind' | 'ingredient' }
  | { type: 'reset' }
  | { type: 'setKind'; kind: IngredientKind }
  | { type: 'setIngredient'; ingredient: SpecIngredient }
  | { type: 'setAllSpirits' }
  | { type: 'setRum' }
  | { type: 'setSearch'; value: string }

const initState = (): State => ({
  open: false,
  custom: false,
  search: '',
})

const reducer: ImmerReducer<State, Action> = (state, action) => {
  const { open, search, kind, ingredient, special } = state
  switch (action.type) {
    case 'open': {
      state.search = ''
      state.open = action.value ?? true
      state.custom = false
      return
    }
    case 'toggleOpen': {
      state.open = !open
      return
    }
    case 'openCustom': {
      state.search = ''
      state.open = false
      state.custom = true
      return
    }
    case 'back': {
      if (search) {
        state.search = ''
      } else if (ingredient) {
        state.ingredient = undefined
      } else if (kind) {
        if (special) {
          state.special = undefined
        } else {
          state.kind = undefined
        }
      } else {
        state.search = ''
        state.open = false
        state.custom = false
        state.kind = undefined
        state.special = undefined
        state.ingredient = undefined
      }
      return
    }
    case 'backTo':
      state.search = ''
      state.ingredient = undefined
      if (action.value === 'kind') {
        state.special = undefined
        state.kind = undefined
      }
      return
    case 'reset': {
      state.search = ''
      state.open = false
      state.custom = false
      state.kind = undefined
      state.special = undefined
      state.ingredient = undefined
      return
    }
    case 'setKind': {
      state.search = ''
      state.kind = action.kind
      return
    }
    case 'setIngredient': {
      state.search = ''
      if (!kind) state.kind = 'spirit'
      state.ingredient = action.ingredient
      return
    }
    case 'setRum': {
      state.search = ''
      state.special = 'rum'
      return
    }
    case 'setAllSpirits': {
      state.search = ''
      state.special = 'allSpirits'
      return
    }
    case 'setSearch': {
      state.search = action.value
      return
    }
    default: {
      throw Error(`Unknown action: ${(action as any).type}`)
    }
  }
}

export function useIngredientCommandReducer(initialState: Partial<State> = {}) {
  return useImmerReducer(reducer, { ...initState(), ...initialState })
}
