const createService = require('../lib/createService');
const hooks = require('../lib/hooks');

const protectEmail = hooks.protect('email');

module.exports = createService('users', {
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  activeProvider: {
    type: String,
    required: true,
  },
  providers: {
    youtube: {
      id: String,
      picture: String,
      name: String,
    },
    twitch: {
      id: String,
      picture: String,
      name: String,
    },
    discord: {
      id: String,
      picture: String,
      name: String,
    },
  },
}, {
  before: {
    create: [hooks.notAllowed],
    update: [hooks.notAllowed],
    patch: [hooks.notAllowed],
    delete: [hooks.notAllowed],
  },
  after: {
    get: [protectEmail],
    find: [protectEmail],
  }
});
