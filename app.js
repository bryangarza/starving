'use strict'
var path = require('path')
var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var gh = require('./mock/githubmock.js')
// var GithubApi = require('github')
// var gh = new GithubApi({
//   version: '3.0.0'
// })

var morgan = require('morgan')
var pub = path.join(__dirname, '/public')

app.use(express.static(pub))
app.use(morgan('dev'))

app.set('view engine', 'jade')
if (app.get('env') === 'development') {
  app.locals.pretty = true
}

// REMINDER: change this route back to /:user
app.get('/', function(req, res) {
  // Remember that the actual call includes `repos`
  // TODO: other routes also need JSON.stringify() wrapping ghres
  // gh.repos.getStarredFromUser({ user: req.params.user}, function(err, ghres) {
  gh.getStarredFromUser({ user: req.params.user}, function(err, ghres) {
    if (err) console.log(err.stack)
    res.render('starred', { stars: ghres })
  })
})


// This is how I saved the API responses to mock them later

// app.get('/:user/following', function(req, res) {
//   gh.user.getFollowingFromUser({ user: req.params.user}, function(err, ghres) {
//     if (err) {
//       console.log(err.stack)
//     }
//     fs.writeFile('./getFollowingFromUser', JSON.stringify(ghres), function(err) {
//       if (err) throw err
//       console.log('wrote res to file, following')
//     })
//     // res.render('following', { user: ghres })
//   })
// })

// app.get('/:user/followers', function(req, res) {
//   gh.user.getFollowers({ user: req.params.user}, function(err, ghres) {
//     if (err) {
//       console.log(err.stack)
//     }
//     fs.writeFile('./getFollowers', JSON.stringify(ghres), function(err) {
//       if (err) throw err
//       console.log('wrote res to file, followers')
//     })
//     // res.render('followers', { user: ghres })
//   })
// })

var server = app.listen(port, function() {
  console.log('Listening at port', port)
})
