const Base = import.meta.env.VITE_ROUTER_PATH || ''

const path = location.pathname

// check path
if (path.indexOf(Base) === 0) {
  localStorage.setItem(import.meta.env.VITE_REDIRECT_KEY, JSON.stringify({
    path: path.replace(Base, ''),
    hash: location.hash,
    search: location.search
  }))
}

location.replace(location.origin + Base)
