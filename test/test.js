var stdout = require("test-console").stdout;
var assert = require('assert')
var ProgressBar = require('../index.js')

describe('ProgressBar', function () {
  describe('#print', function () {
    it('should print no bars', function () {
      var bar = new ProgressBar()
      var output = stdout.inspectSync(function () {
        bar.print()
      })
      assert.deepEqual(output, ['\033[1G', '', '\033[0K'])
    })
    it('should print one bar', function () {
      var bar = new ProgressBar()
      var output = stdout.inspectSync(function () {
        bar.increase(1)
        bar.print()
      })
      assert.deepEqual(output, ['\033[1G', '#', '\033[0K'])
    })
    it('should print correct number of bars', function () {
      var bar = new ProgressBar()
      var output = stdout.inspectSync(function () {
        bar.increase(2)
        bar.print()
      })
      assert.deepEqual(output, ['\033[1G', '##', '\033[0K'])
    })
  })
})
