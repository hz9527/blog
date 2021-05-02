import { Child, Parent, Item } from './types'
import { ComponentPublicInstance } from 'vue'

export const CHILD_NAME = 'TabItem'
export const PARENT_NAME = 'Tabs'

export function checkParent (parent: ComponentPublicInstance | null): parent is Parent {
  return (parent && parent.$options && parent.$options.name === PARENT_NAME) || false
}

export function checkChild (item: Child): boolean {
  return item && item.$options && item.$options.name === CHILD_NAME
}

interface Data {tabs: Item[]; checked: Item['id'] | null}

export function resolveTabs (list: Child[]): Data {
  const result: Data = { tabs: [], checked: null }
  result.tabs = list.map((child) => {
    const id = child.id || child.title
    if (child.checked && !result.checked) {
      result.checked = id
    }
    return { title: child.title, id }
  })
  return result
}
