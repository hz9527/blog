import { Direction, FactoryRes, State, ScreenState } from './types'

export function resizeFactory (d: Direction, base: {vertical: number; horizontal: number}) {
  const key: FactoryRes['key'] = d === 'left' || d === 'right' ? 'vertical' : 'horizontal'
  const start = base[key]
  let getValue: FactoryRes['getValue']
  if (key === 'vertical') {
    getValue = d === 'left'
      ? (info) => {
          return start + info.currentX - info.startX
        }
      : (info) => {
          return start - info.currentX + info.startX
        }
  } else {
    getValue = d === 'top'
      ? (info) => {
          return start + info.currentY - info.startY
        }
      : (info) => {
          return start - info.currentY + info.startY
        }
  }
  return { getValue, key }
}

export function resolveState (state: State): {
  direction: Direction;
  screenState: ScreenState
} {
  let direction: Direction = 'left'
  let screenState = null
  if (state === 'max' || state === 'min') {
    screenState = state === 'max'
  } else {
    direction = state as Direction
  }
  return { direction, screenState }
}
