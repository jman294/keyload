// Polyfill for isInteger()
Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value
}

// Options supported:
// stream: stream for output, defaults to stdout
// whole: defaults to ten
function ProgressBar(settings) {
  var part = 0
  var whole = 10
  var stream = process.stdout
  var message = ''
  if (settings.stream) {
    stream = settings.sttream
  }
  if (settings.whole && Number.isInteger(settings.whole)) {
    whole = settings.whole
  }

  var self = this
  console.log()

  stream.write('\x1B[?25l')

  // Private functions
  function render() {
    var done = '='
    var undone = '-'

    var max = process.stdout.columns

    var loadBarLen = (2/3 * max)-2
    var loadBar = bar(loadBarLen, done, undone)

    var percent = Math.round(part/whole*100)
    var fraction =  part + '\\' + whole

    var remainder = `${percent}% - ${fraction}`
    if (message) {
      remainder = `${message.slice(0, Math.round(1/3*max) - remainder.length)} ${percent}% - ${fraction}`
    }

    var result = `[${loadBar}] ${' '.repeat(Math.round(1/3*max) - remainder.length)}${remainder}`

    stream.cursorTo(0)
    stream.write(result)
    stream.clearLine(1)
  }

  function bar (length, token, filler) {
    var loadLen = Math.min(Math.floor((part*length)/whole), length)
    var rest = length - loadLen

    return token.repeat(loadLen) + filler.repeat(rest)
  }

  function end () {
    clearInterval(interval)
    stream.write('\x1B[?25h')
    onEnd()
  }

  function onEnd () {
  }

  // Priveleged functions
  this.tick = function () {
    if (part >= whole) {
      end()
    } else {
      part += 1
    }
  }

  this.on = function (message, callback) {
    switch (message) {
      case 'end':
        onEnd = callback
        break
    }
  }

  this.message = function (_message) {
    message = _message
  }

  var interval = setInterval(render, 10)
}

var bar  = new ProgressBar({whole: 100})
var interval = setInterval(bar.tick, 500)
var interval2 = setInterval(function () {
  bar.message('f'.repeat(Math.round(Math.random()*100)%16))
}, 500)
bar.on('end', function () {
  clearInterval(interval)
  clearInterval(interval2)
  console.log('complete')
})

module.exports = ProgressBar
