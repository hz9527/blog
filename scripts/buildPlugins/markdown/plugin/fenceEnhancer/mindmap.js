function resolveLine (line) {
  const str = line.trimLeft()
  const match = str.match(/^(\*+)\s/)
  if (match) {
    const level = match[1].length
    return { level, content: str.slice(level).trimLeft(), children: [] }
  }
  return false
}

function resolveItem (item) {
  return { data: { text: item.content }, children: item.children }
}

function resolve (content) {
  const lines = content.split('\n')
  const result = []
  const stack = [] // {level, content, children}
  let cur
  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i]
    const item = resolveLine(line)
    if (!item) {
      cur && line.trim() && (cur.content += line)
      continue
    }
    const data = resolveItem(item) //! children 引用不能变
    if (cur) {
      let tem = cur
      while (tem && tem.level >= item.level) {
        tem = stack.pop()
      }
      if (tem) {
        tem.children.push(data)
      } else {
        result.push(data)
      }
    } else {
      result.push(data)
    }
    stack.push(item)
    cur = item
  }
  if (result.length > 1) {
    return {
      data: { test: 'root' },
      children: result
    }
  }
  return result[0]
}

function getResult (data) {
  return JSON.stringify({ root: data }, (key, value) => {
    if (key === 'children' && value.length === 0) {
      return
    }
    return value
  })
}

exports.mindMapEnhancer = {
  match (info) {
    return info.toLowerCase() === 'mindmap'
  },
  handler (content) {
    const data = resolve(content)
    return `<MindMap
      data=${getResult(data)}
    />`
  }
}
