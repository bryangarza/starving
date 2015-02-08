'use strict'
var path = require('path')
var express = require('express')
var app = express()
var port = process.env.PORT || 8080

var morgan = require('morgan')
var pub = path.join(__dirname, '/public')

app.use(express.static(pub))
app.use(morgan('dev'))

app.get('/', function(req, res) {
  res.json({ user: 'bryangarza' })
})

var server = app.listen(port, function() {
  console.log('Listening at http://%s:%s',
              server.address().address,
              server.address().port)
})
