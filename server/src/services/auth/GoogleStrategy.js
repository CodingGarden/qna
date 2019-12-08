const MultiOAuthStrategy = require('./MultiOAuthStrategy');

class GoogleStrategy extends MultiOAuthStrategy {
  constructor() {
    super('youtube');
  }

  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);

    return {
      id: baseData.googleId,
      provider: this.provider,
      email: profile.email,
      picture: profile.picture,
      name: profile.name,
    };
  }
}

module.exports = GoogleStrategy;
