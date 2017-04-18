// Polyfill for isInteger()
Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value
}

function KeyLoad(settings) {
  var time = 0
  var part = 0
  var whole = 10
  var stream = process.stdout
  var message = ''

  if (settings.stream) stream = settings.stream
  if (settings.whole && Number.isInteger(settings.whole)) whole = settings.whole

  console.log()

  stream.write('\x1B[?25l')

  // Private functions
  function render() {
    var done = '#'
    var undone = ' '
    var middle = ''
    if (settings.done) done = settings.done
    if (settings.undone) undone = settings.undone
    if (settings.middle) middle = settings.middle

    var LOAD_ENDS = 2
    var MESSAGE_PADS = 2
    var END1 = '['
    var END2 = ']'
    var PAD1 = ' '
    var PAD2 = PAD1

    var max = process.stdout.columns

    if (max <= LOAD_ENDS) {
      LOAD_ENDS = 0
    }

    var loadBarLen = Math.round(2 / 3 * max)
    var loadBar
    var loadBarStr

    var percent = Math.round(part / whole * 100)
    var fraction = part + '\\' + whole
    var stats = `${round(time/1000, 2)}s ${percent}% - ${fraction}`

    var statusLen = max - loadBarLen
    var status
    if (statusLen > stats.length + MESSAGE_PADS) {
      var newMessage = message
      var msgSpace = statusLen - stats.length
      if (msgSpace < 0) msgSpace = 0

      newMessage += ' '.repeat(msgSpace)
      newMessage = newMessage.slice(0, msgSpace <= MESSAGE_PADS ? 0 : msgSpace - MESSAGE_PADS)
      newMessage = PAD1.concat(newMessage).concat(PAD2)
      status = `${newMessage}${stats}`
    } else {
      status = ''
      loadBarLen = max
    }

    loadBar = bar(loadBarLen - LOAD_ENDS, done, undone, middle)
    loadBarStr = `${END1}${loadBar}${END2}`

    var result = `${loadBarStr}${status}`

    stream.write('\r')
    stream.write(result)
    stream.clearLine(1)
  }

  function round(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }

  function bar(length, token, filler, middle) {
    var loadLen = Math.min(Math.floor((part * length) / whole), length)
    var rest = length - loadLen

    if (middle === undefined) {
      middle = ''
    }
    var cut = middle.length

    loadLen = loadLen-cut < 0 ? 0:loadLen-cut
    rest = loadLen <= 0 ? rest-1:rest
    return token.repeat(loadLen) + middle + filler.repeat(rest)
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

  var interval = setInterval(function () {
    time += 10
    render()
  }, 15)
  process.on('SIGINT', function() {
    end()
  })
}

module.exports = KeyLoad
