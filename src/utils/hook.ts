import { App, ComponentCustomProperties, inject } from 'vue'

export const MODAL_KEY = '$modal'

export function setGlobal (app: App, key: string, value: any): void {
  app.config.globalProperties[key] = value
  const provides = app._context.provides
  if (key in provides) {
    const base = provides[key]
    if (value && typeof base === 'object') {
      Object.assign(base, value)
    }
  } else {
    app.provide(key, value)
  }
}

export function useModal (): ComponentCustomProperties['$modal'] {
  return inject(MODAL_KEY)!
}
