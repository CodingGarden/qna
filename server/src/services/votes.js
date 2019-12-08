const createService = require('../lib/createService');
const hooks = require('../lib/hooks');

const checkVote = async context => {
  if (!context.params.user === 'anonymous') {
    throw new Error('You must be logged in to vote.');
  }

  const existing = await context.service.find({
    query: {
      userId: context.params.user._id,
      questionId: context.data.questionId,
    }
  });
  
  if (existing.length) {
    throw new Error('No duplicate votes.');
  }
  return context;
};

module.exports = createService('votes', {
  userId: {
    type: String,
    required: true,
  },
  questionId: {
    type: String,
    required: true,
  },
}, {
  before: {
    create: [hooks.setUserId, checkVote],
    update: [hooks.notAllowed],
    patch: [hooks.notAllowed],
    delete: [hooks.notAllowed],
  }
});
