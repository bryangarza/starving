'use strict'
var fs = require('fs')
var path = require('path')

var filePath = path.join(__dirname, 'getStarredFromUser.json')

module.exports = {
  getStarredFromUser: function(user, callback) {
    fs.readFile(filePath, {encoding: 'utf8'}, function(err, data) {
      if (err) return callback(err)
      callback(null, JSON.parse(data))
    })
  }
}
