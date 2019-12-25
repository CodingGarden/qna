const { hooks: { authenticate } } = require('@feathersjs/authentication');

const notAllowed = (context) => {
  if (!context.params.provider) return context;
  const adminId = context.app.get('adminId');
  const adminProvider = context.app.get('adminProvider');
  if (context.params.user
      && context.params.user.providers
      && context.params.user.providers[adminProvider]
      && context.params.user.providers[adminProvider].id === adminId) return context;
  throw new Error('Un-Authorized.');
};

const setUserId = (context) => {
  context.data.userId = context.params.user ? context.params.user._id : 'anonymous';
  return context;
};

const protect = prop => context => {
  if (context.method === 'find') {
    context.result.forEach(item => {
      delete item[prop];
    });
  } else {
    delete context.result[prop];
  }

  return context;
};

module.exports = {
  protect,
  notAllowed,
  setUserId,
  jwt: authenticate('jwt')
};
