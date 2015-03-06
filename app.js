/*jshint node:true*/
'use strict'
var path = require('path')
var express = require('express')
var app = express()
var pub = path.join(__dirname, '/public')
app.use(express.static(pub))
app.set('view engine', 'jade')
if (process.env.NODE_ENV !== 'production') {
  app.locals.pretty = true
  app.use(require('morgan')('dev'))
}

require('./session.js')(app)
// Middleware to add GH user to request object
app.use(require('./ghmiddleware.js'))
require('./routes.js')(app)

var port = process.env.PORT || 3000
app.listen(port, function() {
  console.log('Listening on port ' + port)
})
