const { execSync } = require('child_process')
function exec (cmd) {
  return execSync(cmd).toString()
}

function checker (result, msg) {
  if (!result) {
    console.warn(msg)
    console.log('release fail')
    process.exit(1)
  }
}

const Version = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease']
const Args = {
  version: Version.find(key => !!process.env[`npm_config_${key}`]) || 'minor'
}
// check status
// check branch
// add tag
// delete branch
// checkout branch
// build
// resolve file
// commit
const value = () => true
const Flows = [
  {
    cmd: 'git branch',
    value (d) {
      const item = d.split('\n').find(line => line.indexOf('* ') === 0)
      if (!item) {
        return false
      }
      return item.replace('* ', '').trim() === 'dev'
    },
    msg: 'branch invalid'
  },
  {
    cmd: `npm version ${Args.version}`,
    value,
    msg: ''
  },
  {
    cmd: 'git branch -f gh-pages && git checkout gh-pages',
    value
  },
  {
    cmd () {
      const data = exec('npm run build')
      console.log(data)
    },
    value
  },
  {
    cmd: 'rm -rf `ls | grep -v "dist"`',
    value,
    msg: 'delete files fail'
  },
  {
    cmd: 'cp -r dist/* . && rm -rf dist',
    value,
    msg: 'delete files fail'
  },
  {
    cmd: 'git push -f',
    value
  },
  {
    cmd: 'git checkout dev && npm install',
    value
  }
]

Flows.forEach(({ cmd, value = '', msg = `${cmd} exec fail` }) => {
  const data = typeof cmd === 'function' ? cmd() : exec(cmd)
  const result = typeof value === 'function' ? value(data) : data === value
  checker(result, msg)
})

console.log('release success')
