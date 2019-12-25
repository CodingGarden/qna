const createService = require('../lib/createService');
const hooks = require('../lib/hooks');

const protectEmail = hooks.protect('email');

const provider = {
  id: String,
  picture: String,
  name: String,
};

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
  pledge: {
    currently_entitled_amount_cents: Number,
    lifetime_support_cents: Number,
    patron_status: String,
    pledge_relationship_start: Date,
  },
  providers: {
    youtube: provider,
    twitch: provider,
    discord: provider,
    patreon: provider,
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
