// export function getPosition (): Record<string, string> {

// }

export function getStyle (root: HTMLElement): Record<string, string> {
  const rect = root.getBoundingClientRect()
  const viewport = window.visualViewport
  const left = viewport.width - rect.x
  const top = viewport.height - rect.y - rect.height
  return {
    display: 'block',
    left: rect.x + 'px',
    top: rect.y + rect.height + 10 + 'px',
    maxWidth: left * 0.8 + 'px',
    maxHeight: top * 0.8 + 'px'
  }
}
