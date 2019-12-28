const createService = require('../lib/createService');
const hooks = require('../lib/hooks');

const protectEmail = hooks.protect('email');

const provider = {
  id: String,
  picture: String,
  name: String,
  channels: Object,
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
    amount_cents: Number,
    patron_status: String,
    created_at: Date,
  },
  tier: {
    amount_cents: Number,
    created_at: Date,
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
