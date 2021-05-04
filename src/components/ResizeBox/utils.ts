import { getTargetChild } from '../../utils/utils'
import { Direction, FactoryRes, State, ScreenState, OperationConf, BaseInfo } from './types'

const MaxPercent = 0.8
const MinHeight = 10

export function getWidth (w: number, c?: number): number {
  return typeof c === 'number' ? Math.min(w, c * MaxPercent) : w
}
export function resizeFactory (d: Direction, base: BaseInfo, containerWidth: number) {
  const key: FactoryRes['key'] = d === 'bottom' ? 'mainHorizontal' : d === 'top' ? 'horizontal' : 'vertical'
  const start = base[key]
  let getValue: FactoryRes['getValue']
  if (key === 'vertical') {
    const max = containerWidth * MaxPercent
    const min = containerWidth * (1 - MaxPercent)
    getValue = d === 'left'
      ? (info) => {
          const res = start + info.currentX - info.startX
          return res < min ? min : res > max ? max : res
        }
      : (info) => {
          const res = start - info.currentX + info.startX
          return res < min ? min : res > max ? max : res
        }
  } else {
    getValue = (info) => {
      return Math.max(start + info.currentY - info.startY, MinHeight)
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

const CONFIG: OperationConf = {
  left: ['min', 'max'],
  right: ['left', 'top', 'right', 'bottom']
}
export function resolveIgnores (ignores: State[]): OperationConf {
  return ignores.reduce((res, item) => {
    let ind
    if ((ind = res.left.indexOf(item as any)) > -1) {
      res.left.splice(ind, 1)
    } else {
      ind = res.right.indexOf(item as any)
      ~ind && res.right.splice(ind, 1)
    }
    return res
  }, { left: CONFIG.left.slice(), right: CONFIG.right.slice() })
}
export function getTargetIcon (e: UIEvent): string | null {
  const target = getTargetChild(e) as HTMLElement | null
  if (target && target.dataset.icon) {
    return target.dataset.icon
  }
  return null
}
