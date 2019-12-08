const users = require('./users');
const auth = require('./auth');
const questions = require('./questions');
const votes = require('./votes');

module.exports = function registerServices(app) {
  app.configure(users);
  app.configure(auth);
  app.configure(questions);
  app.configure(votes);
};
