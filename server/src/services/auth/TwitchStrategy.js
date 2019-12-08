const fetch = require('node-fetch');

const MultiOAuthStrategy = require('./MultiOAuthStrategy');

class TwitchStrategy extends MultiOAuthStrategy {
  constructor() {
    super('twitch');
  }

  async getProfile(data) {
    const response = await fetch('https://api.twitch.tv/kraken/user', {
      headers: {
        accept: 'application/vnd.twitchtv.v5+json',
        authorization: `OAuth ${data.access_token}`,
      },
    });
    const profile = await response.json();
    profile.id = profile._id;
    this.profile = profile;
    return profile;
  }

  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    return {
      id: baseData.twitchId,
      provider: this.provider,
      picture: profile.logo,
      email: profile.email,
      name: profile.display_name,
    };
  }
}

module.exports = TwitchStrategy;
