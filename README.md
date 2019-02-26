# keyload
A progress bar NodeJS
<br/>
![keyload demo](https://raw.githubusercontent.com/jman294/keyload/b36601d6cb41d95fbf3788b1ac2a28b9b8e6a24a/imgs/loading_bar.gif "GIF of the loading bar")

## Example
`npm install keyload --save`

```javascript
var KeyLoad = require('keyload')

var bar = new KeyLoad({
  whole: 20, // Total amount for loading bar
  undone: ' ', // Character for the undone section of the loading bar
  done: '=', // Character to be used for the finished sectiond of the loading bar
  middle: '>', // The middle character on the loading bar
  stream: process.stderr // The stream for output
})

// Interval for ticking up the bar
var interval = setInterval(bar.tick, 500)

// Interval for setting a random message on the bar
var interval2 = setInterval(function() {
  bar.message('f'.repeat(Math.round(Math.random() * 100) % 16))
}, 500)

// Listener for the bar being finished
bar.on('end', function() {
  clearInterval(interval)
  clearInterval(interval2)
  console.log('complete')
})

// Increasing the bar by one
bar.tick()
```

## API

### `tick([newPart])`
Increases the bar by one OR if [newPart] is supplied, sets the bar to a certain point.

### `on(eventStr, callback)`
Listen for events on the bar. Currently only `end` is supported.

### `message(string)`
Put a message on the loader bar. It will be truncated or removed if there is not enough space. This is the alternative to `console.log` while using this bar, since it unfortunately breaks it.
