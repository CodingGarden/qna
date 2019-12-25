const createService = require('../lib/createService');
const hooks = require('../lib/hooks');

module.exports = createService('questions', {
  text: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  archived: {
    type: Boolean,
    required: true,
    default: false,
  },
  highlighted: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  before: {
    create: [(context) => {
      if (!context.data.text.trim()) throw new Error('Question text is required.');
      return context;
    }, hooks.setUserId],
    update: [hooks.notAllowed],
    patch: [hooks.notAllowed],
    delete: [hooks.notAllowed],
  }
});
