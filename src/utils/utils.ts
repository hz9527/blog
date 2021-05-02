export const noop = () => {}

export function getTargetChild (e: UIEvent): EventTarget {
  const list = e.composedPath()
  const ind = list.indexOf(e.currentTarget as EventTarget)
  return list[ind - 1]
}
