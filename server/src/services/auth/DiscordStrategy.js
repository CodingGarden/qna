const MultiOAuthStrategy = require('./MultiOAuthStrategy');

class DiscordStrategy extends MultiOAuthStrategy {
  constructor() {
    super('discord');
  }

  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    return {
      id: baseData.discordId,
      picture: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=128`,
      email: profile.email,
      name: profile.username,
    };
  }
}

module.exports = DiscordStrategy;
