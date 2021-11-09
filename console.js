let catchLogs = []

module.exports = {
  log (str) {
    catchLogs.push(str)
    console.log(str)
  },
  getLogs () {
    return catchLogs.join('\n')
  },
  clear () {
    catchLogs = []
  }
}