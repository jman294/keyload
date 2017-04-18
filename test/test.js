var KeyLoad = require('../index')

var bar = new KeyLoad({
  whole: 40,
  undone: ' ',
  done: '=',
  middle: '>',
  stream: process.stderr // The stream for output
})
var interval = setInterval(bar.tick, 100)
var interval2 = setInterval(function() {
  bar.message('f'.repeat(Math.round(Math.random() * 100) % 16))
  //bar.message('#'.repeat(347))
}, 500)
bar.on('end', function() {
  clearInterval(interval)
  clearInterval(interval2)
  console.log('complete')
})
