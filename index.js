// Polyfill for isInteger()
Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value
}

// Options supported:
// stream: stream for output, defaults to stdout
// whole: defaults to ten
// done: done token
// undone: undone token
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
    var done = '#'
    var undone = ' '
    if (settings.done) done = settings.done
    if (settings.undone) undone = settings.undone

    var LOAD_ENDS = 2
    var MESSAGE_PADS = 2
    var PAD1 = ' '
    var PAD2 = PAD1

    var max = process.stdout.columns-2

    if (max <= LOAD_ENDS) {
      LOAD_ENDS = 0
    }

    var loadBarLen = Math.round(2 / 3 * max)
    var loadBar = bar(loadBarLen - LOAD_ENDS, done, undone)
    var loadBarStr = `[${loadBar}]`

    var percent = Math.round(part / whole * 100)
    var fraction = part + '\\' + whole
    var percFrac = `${percent}% - ${fraction}`

    var statusLen = max - loadBarLen
    var status
    if (statusLen > percFrac.length + 2) {
      var newMessage = message
      var msgSpace = statusLen - percFrac.length
      if (msgSpace < 0) msgSpace = 0

      newMessage += ' '.repeat(msgSpace)
      newMessage = newMessage.slice(0, msgSpace <= 2 ? 0 : msgSpace - 2)
      newMessage = PAD1.concat(newMessage).concat(PAD2)
      status = `${newMessage}${percFrac}`
    } else {
      status = ''
      loadBarLen = max
      loadBar = bar(loadBarLen - LOAD_ENDS, done, undone)
      loadBarStr = `[${loadBar}]`
    }

    var result = `[${loadBar}]${status}`

    stream.write('\r')
    stream.write(result)
    stream.clearLine(1)
  }

  function bar(length, token, filler) {
    var loadLen = Math.min(Math.floor((part * length) / whole), length)
    var rest = length - loadLen
    if (rest < 0) {
      rest = 0
    }
    if (loadLen < 0) {
      loadLen = 0
    }

    return token.repeat(loadLen) + filler.repeat(rest)
  }

  function end() {
    clearInterval(interval)
    stream.write('\x1B[?25h')
    onEnd()
  }

  function onEnd() {}

  // Priveleged functions
  this.tick = function() {
    if (part >= whole) {
      end()
    } else {
      part += 1
    }
  }

  this.on = function(message, callback) {
    switch (message) {
      case 'end':
        onEnd = callback
        break
    }
  }

  this.message = function(_message) {
    message = _message
  }

  var interval = setInterval(render, 10)
  process.on('SIGINT', function() {
    end()
  })
}

var bar = new ProgressBar({
  whole: 100,
  undone: '\\',
  done: '/'
})
var interval = setInterval(bar.tick, 500)
var interval2 = setInterval(function() {
  bar.message('f'.repeat(Math.round(Math.random() * 100) % 16))
  //bar.message('#'.repeat(347))
}, 500)
bar.on('end', function() {
  clearInterval(interval)
  clearInterval(interval2)
  console.log('complete')
})

module.exports = ProgressBar
