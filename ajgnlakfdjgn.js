var GitHubApi = require('github');

function newGithub(token) {
  var api = new GitHubApi({
    version: '3.0.0'
  });
  api.authenticate({
    type: 'oauth',
    token: token
  });
  return api;
};

/**
 * Makes a (possibly new) user object from their token.
 */
function fromToken(token, ref) {
  var github = newGithub(token);
  var get = P.promisify(github.user.get, github.user);
  return get({}).then(function(result) {
    return [result, users.findOneAsync({
      login: result.login
    })];
  }).spread(function(gh, model) {
    if (model) {
      return [model.login, users.updateByIdAsync(model._id, {
        $set: {
          token: token
        }
      })];
    }

    var insert = {
      login: gh.login,
      token: token,
      avatar: gh.avatar_url
    };
    if (ref) {
      insert.ref = ref;
    }
    return [gh.login, users.insertAsync(insert)];
  }).spread(function(login) {
    return users.findOneAsync({
      login: login
    });
  }).then(function(model) {
    return fromModel(model);
  });
}
