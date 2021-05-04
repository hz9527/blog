export const noop = () => {}

export function getTargetChild (e: UIEvent, getKidsInd = (n: number) => n - 1): EventTarget {
  const list = e.composedPath()
  const ind = list.indexOf(e.currentTarget as EventTarget)
  return list[getKidsInd(ind)]
}

export function prefixStr (value: number, l = 2, prefix = '0'): string {
  return value.toString().padStart(l, prefix)
}

const BaseTime = new Date()
const Days = ['今', '昨', '前']

export function timeFormat (time: number): string { // todo
  if (typeof time !== 'number') {
    return ''
  }
  const date = new Date(time)
  if (date.getFullYear() !== BaseTime.getFullYear()) {
    return `${date.getFullYear()}-${
      prefixStr(date.getMonth() + 1)
    }-${prefixStr(date.getDate())}`
  } else if (date.getMonth() !== BaseTime.getMonth()) {
    return `${
      prefixStr(date.getMonth() + 1)
    }月${prefixStr(date.getDate())}日`
  }
  const days = BaseTime.getDate() - date.getDate()
  const v = Days[days]
  return `${v || days}天${v ? '' : '前'}(${
    prefixStr(date.getHours())
  }:${prefixStr(date.getMinutes())})`
}
