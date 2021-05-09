
class Node {
  constructor (tag, attrs = {}) {
    this.tag = tag
    this.attrs = attrs
    this.children = []
  }

  setAttr (key, value) {
    this.attrs[key] = value
  }

  appendChild (node) {
    this.children.push(node)
  }

  getAttrString () {
    const keys = Object.keys(this.attrs)
    if (keys.length) {
      return ' ' + keys.map(k => `${k}=${this.attrs[k]}`).join(' ')
    }
    return ''
  }

  toString () {
    return `<${this.tag}${this.getAttrString()}>${this.children.map(n => n.toString()).join('')}</${this.tag}>`
  }
}

class XMLNode extends Node {
  toString () {
    return `<${this.tag}${this.getAttrString()}?>`
  }
}

function nodeFactory (tag) {
  if (tag === '?xml') {
    return new XMLNode(tag)
  }
  return new Node(tag)
}

class Parser {
  constructor (state = 0) {
    this.value = ''
    this.state = state
    this.handlerMap = new Map()
    this.handler = () => {}
  }

  use (state, handler) {
    this.handlerMap.set(state, handler)
  }

  changeState (state) {
    this.state = state
    this.handler = this.handlerMap.get(state)
    this.value = ''
  }

  parse (str) {
    const chars = Array.from(str)
    let i = 0
    const l = chars.length
    const jump = (j) => {
      i = j
    }
    for (; i < l; i++) {
      this.handler(chars[i], this, i, chars, jump)
    }
  }
}

const parser = new Parser()

const isEmpty = (code) => code === ' ' || code === '\n'
const isClose = (code) => code === '>'
const isEnd = (code, next) => (code === '/' || code === '?') && next === '>'

function XMLParser (xml) {
  const result = []
  const stack = []
  let node
  let attr = ''
  const reset = () => {
    parser.changeState(0)
    const top = stack.pop()
    !stack.length && top && result.push(top)
    node = null
  }
  const setAttr = () => {
    if (attr === 'inkscape:version') {
      console.log(parser.value)
    }
    node.setAttr(attr, parser.value)
    attr = ''
  }
  /**
   * 0 normal
   * 1 tag open
   * 2 tag opened
   * 3 attr open
   * 4 attr named
   * 5 tag close
  **/
  parser.use(0, (code, parser, i, chars) => {
    if (code === '<') {
      if (chars[i + 1] === '/') {
        parser.changeState(5)
      } else {
        parser.changeState(1)
      }
    }
  })
  parser.use(1, (code, parser) => {
    if (isEmpty(code) || isClose(code)) {
      node = nodeFactory(parser.value)
      stack[stack.length - 1] && stack[stack.length - 1].appendChild(node)
      stack.push(node)
      if (isClose(code)) {
        parser.changeState(0)
      } else {
        parser.changeState(3)
      }
    } else {
      parser.value += code
    }
  })
  parser.use(2, (code, parser, i, chars, jump) => {
    if (isClose(code)) {
      parser.changeState(0)
    } else if (isEnd(code, chars[i + 1])) {
      reset()
    } else if (!isEmpty(code)) {
      parser.changeState(3)
      jump(i - 1)
    }
  })
  parser.use(3, (code, parser) => {
    if (code === '=') {
      parser.changeState(4)
    } else if (!isEmpty(code)) {
      attr += code
    }
  })
  parser.use(4, (code, parser, i, chars) => {
    if (isEmpty(code) && chars[i - 1] === '"') {
      setAttr()
      parser.changeState(2)
    } else if (isClose(code)) {
      setAttr()
      parser.changeState(0)
    } else if (isEnd(code, chars[i + 1])) {
      setAttr()
      reset()
    } else {
      parser.value += code
    }
  })
  parser.use(5, (code) => {
    if (isClose(code)) {
      reset()
    }
  })
  parser.changeState(0)
  parser.parse(xml)
  return result
}
module.exports = XMLParser
