/*jshint node:true*/
'use strict'
var GitHubApi = require('github')

function newGithub(token) {
  var api = new GitHubApi({
    version: '3.0.0'
  })
  api.authenticate({
    type: 'oauth',
    token: token
  })
  return api
}

function authenticate(token) {
  var github = newGithub(token)
  github.user.get({}, function(result) {
    console.log(result)
  })
}

module.exports = function(req, res, next) {
  if (req.session.token) {
    console.log(JSON.stringify(req.session))
  }
  else {
    return next
  }

  if (!req.session.login) {
    // req.session.login =
    console.log('authenticating...')
    authenticate(req.session.token)
  }
  next()
}
