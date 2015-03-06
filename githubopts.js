/*jshint node:true*/
'use strict'
module.exports = {
  // githubClient: process.env.GITHUB_CLIENT_ID,
  // githubSecret: process.env.GITHUB_SECRET,
  githubClient: 'CLIENT',
  githubSecret: 'SECRET',
  baseURL: (process.env.NODE_ENV === 'production') ? 'http://starving.co' : 'http://localhost:3000',
  loginURI: '/login',
  callbackURI: '/callback',
  scope: 'user'
}
