'use strict'
var path = require('path')
var express = require('express')
var app = express()
var port = process.env.PORT || 3000
// var gh = require('./mock/githubmock.js')
var GithubApi = require('github')
var gh = new GithubApi({
  version: '3.0.0'
})

var morgan = require('morgan')
var pub = path.join(__dirname, '/public')

app.use(express.static(pub))
app.use(morgan('dev'))

app.set('view engine', 'jade')
if (app.get('env') === 'development') {
  app.locals.pretty = true
}

app.get('/:user', function(req, res) {
  gh.repos.getStarredFromUser({ user: req.params.user}, function(err, ghres) {
    if (err) console.log(err.stack)
    res.render('starred', { stars: ghres })
  })
})


// app.get('/:user/following', function(req, res) {
//   gh.user.getFollowingFromUser({ user: req.params.user}, function(err, ghres) {
//     if (err) console.log(err.stack)
//     res.render('following', { users: ghres })
//   })
// })

// app.get('/:user/followers', function(req, res) {
//   gh.user.getFollowers({ user: req.params.user}, function(err, ghres) {
//     if (err) console.log(err.stack)
//     res.render('followers', { users: ghres })
//   })
// })

app.listen(port, function() {
  console.log('Listening...')
})
