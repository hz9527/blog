import { ToolConfig } from '../../types/index'
import { EventInfo } from '../../utils/Dragger'

export function getDefaultConf (): ToolConfig {
  return {
    fold: false,
    pin: true,
    float: false,
    aside: 'vertical',
    vertical: 'top',
    horizontal: 'left',
    size: -1,
    verticalValue: 100,
    horizontalValue: 100,
    asideValue: 50,
    resize: (size: number) => size > 500 ? 500 : size < 50 ? 50 : size,
    position: (pos) => pos
  }
}

export interface Styles {
  container: Record<string, string>,
  resizeBar: Record<string, string>,
  asideBar: Record<string, string>,
  panel: Record<string, string>,
}

export function computedStyle (config: ToolConfig): Styles {
  if (config.float) {
    const vertical = config.verticalValue + 'px'
    const horizontal = config.horizontalValue + 'px'
    return {
      container: {
        position: 'fixed',
        [config.vertical]: vertical,
        [config.horizontal]: horizontal
      },
      resizeBar: {},
      asideBar: {},
      panel: {}
    }
  }
  let main, side, pMain, pSide, pAside
  if (config.aside === 'vertical') {
    main = 'height'
    side = 'width'
    pMain = 'top'
    pSide = config.horizontal === 'left' ? 'right' : 'left'
    pAside = config.horizontal
  } else {
    main = 'width'
    side = 'height'
    pMain = 'left'
    pSide = config.vertical === 'top' ? 'bottom' : 'top'
    pAside = config.vertical
  }
  return {
    container: {},
    resizeBar: {
      display: 'block',
      [main]: '100%',
      [side]: '4px',
      [pMain]: '0%',
      [pSide]: '0%'
    },
    asideBar: { [pMain]: config.asideValue + 'px', [pAside]: '100%' },
    panel: config.size === -1 ? {} : { [side]: config.size + 'px' }
  }
}

export interface ClassNames {
  container: string | null;
  content: string | null;
}

export function computedClassName (config: ToolConfig): ClassNames {
  if (config.float) {
    return { container: null, content: null }
  }
  const translate = `content-${config.aside === 'vertical' ? config.horizontal : config.vertical}`
  const container = `container-${config.aside}`
  return { container, content: translate }
}

export function resize (config: ToolConfig, base: number, info: EventInfo): number {
  if (config.aside === 'vertical') {
    const value = info.currentX - info.startX
    const size = base + (config.horizontal === 'left' ? value : -value)
    return config.resize(size)
  }
  const value = info.currentY - info.startY
  const size = base + (config.vertical === 'top' ? value : -value)
  return config.resize(size)
}

export function moveAsideFactory (config: ToolConfig, container: Element, aside: Element): (e: EventInfo) => number {
  const base = config.asideValue
  let max: number
  if (config.aside === 'vertical') {
    console.log(aside.getBoundingClientRect())
    max = container.getBoundingClientRect().height - aside.getBoundingClientRect().height
    return (e) => {
      const value = base + e.currentY - e.startY
      return value < 0 ? 0 : value > max ? max : value
    }
  } else {
    max = container.getBoundingClientRect().width - aside.getBoundingClientRect().width
    return (e) => {
      const value = base + e.currentX - e.startX
      return value < 0 ? 0 : value > max ? max : value
    }
  }
}
