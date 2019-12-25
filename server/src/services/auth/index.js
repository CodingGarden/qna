const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { expressOauth } = require('@feathersjs/authentication-oauth');

const GoogleStrategy = require('./GoogleStrategy');
const TwitchStrategy = require('./TwitchStrategy');
const DiscordStrategy = require('./DiscordStrategy');
const PatreonStrategy = require('./PatreonStrategy');

module.exports = function auth(app) {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('google', new GoogleStrategy());
  authentication.register('twitch', new TwitchStrategy());
  authentication.register('discord', new DiscordStrategy());
  authentication.register('patreon', new PatreonStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
