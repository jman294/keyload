var ProgressBar = require('progress');

var bar = new ProgressBar(':bar', {
  total: 10
});
var timer = setInterval(function() {
  bar.tick();
  if (bar.complete) {
    console.log('\ncomplete\n');
    clearInterval(timer);
  }
}, 1000);
//setInterval(function() {
  //console.log('THis is an interesting fart')
//}, 10)
