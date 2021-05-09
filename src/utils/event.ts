interface EventMap {
  bodyClick: [UIEvent]
}
type H = (...args: EventMap[keyof EventMap]) => void

class EventBus {
  private listenerMap: Map<keyof EventMap, H[]> = new Map()

  on <K extends keyof EventMap> (
    name: K,
    handler: (...args: EventMap[K]) => void
  ) {
    let list = this.listenerMap.get(name)
    if (!list) {
      list = []
      this.listenerMap.set(name, list)
    }
    list.push(handler)
  }

  off <K extends keyof EventMap> (
    name: K,
    handler: (...args: EventMap[K]) => void
  ) {
    const list = this.listenerMap.get(name)
    if (list) {
      const ind = list.indexOf(handler)
      ~ind && list.splice(ind, 1)
    }
  }

  emit<K extends keyof EventMap> (
    name: K,
    ...args: EventMap[K]
  ) {
    const list = this.listenerMap.get(name)
    if (list) {
      list.forEach((fn: (...args: EventMap[K]) => void) => fn(...args))
    }
  }
}

export default new EventBus()
