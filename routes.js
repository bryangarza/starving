/*jshint node:true*/
'use strict'
module.exports = function(app) {
  var url = require('url')
  var crypto = require('crypto')
  var path = require('path')
  var request = require('request')
  var GithubApi = require('github')
  var gh = new GithubApi({ version: '3.0.0' })
  var opts = require('./githubopts.js')
  var urlObj = url.parse(opts.baseURL)
  urlObj.pathname = path.join(urlObj.pathname, opts.callbackURI)
  var redirectURI = url.format(urlObj)
  var state = crypto.randomBytes(8).toString('hex')

  var checkauth = function(req, res, next) {
    if ((req.session || {}).login) {
      next()
    }
    res.redirect('/')
  }

  app.get('/', function(req, res) {
    res.render('home')
  })

  app.get('/login', function(req, res) {
    var u = 'https://github.com/login/oauth/authorize'
          + '?client_id=' + opts.githubClient
          + (opts.scope ? '&scope=' + opts.scope : '')
          + '&redirect_uri=' + redirectURI
          + '&state=' + state
    res.statusCode = 302
    res.setHeader('location', u)
    res.end()
  })

  app.get('/logout', function(req, res) {
    req.session.destroy()
    res.redirect('/')
  })

  app.get('/:user', checkauth, function(req, res) {
    gh.repos.getStarredFromUser({ user: req.params.user}, function(err, ghres) {
      if (err) console.log(err.stack)
      res.render('starred', { stars: ghres })
    })
  })

  app.get('/callback', function(req, res) {
    var query = url.parse(req.url, true).query
    var code = query.code

    if (!code) throw new Error('missing oauth code....', res)

    var u = 'https://github.com/login/oauth/access_token'
          + '?client_id=' + opts.githubClient
          + '&client_secret=' + opts.githubSecret
          + '&code=' + code
          + '&state=' + state

    request.get({url: u, json: true}, function (err, tokenRes, body) {
      if (err) {
        err.body = body
        err.tokenRes = tokenRes
        throw new Error('There was an error logging in', body, err,
                        res, tokenRes, req)
      }
      console.log('received token ' + tokenRes.access_token)
      req.session.token = tokenRes.access_token
      res.redirect('/')
    })
  })

}
