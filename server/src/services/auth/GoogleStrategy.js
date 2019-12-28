const fetch = require('node-fetch');
const MultiOAuthStrategy = require('./MultiOAuthStrategy');

const {
  GOOGLE_API_KEY: googleAPIKey
} = process.env;

class GoogleStrategy extends MultiOAuthStrategy {
  constructor() {
    super('youtube');
  }

  async getProfile(params) {
    const profile = await super.getProfile(params);
    try {
      const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key=${googleAPIKey}`, {
        headers: {
          Authorization: `Bearer ${params.access_token}`
        }
      });
      const channelJSON = await channelResponse.json();
      let channels = {};
      if (channelJSON.items) {
        channels = channelJSON.items.reduce((byId, item) => {
          if (item.kind === 'youtube#channel') {
            byId[item.id] = true;
          }
          return byId;
        }, {});
      }
      profile.channels = channels;
      const memberResponse = await fetch('https://api.coding.garden/youtube/members');
      const memberJSON = await memberResponse.json();
      const tier = memberJSON.users.find(user => channels[user.id]);
      console.log('youtube member login', tier);
      profile.tier = tier ? tier.level : null;
      return profile;
    } catch (error) {
      console.error(error);
      return profile;
    }
  }

  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);

    return {
      id: baseData.googleId,
      provider: this.provider,
      email: profile.email,
      picture: profile.picture,
      name: profile.name,
      channels: profile.channels,
    };
  }
}

module.exports = GoogleStrategy;
