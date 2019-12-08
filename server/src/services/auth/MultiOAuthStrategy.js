const { OAuthStrategy } = require('@feathersjs/authentication-oauth');

class MultiOAuthStrategy extends OAuthStrategy {
  constructor(provider) {
    super();
    this.provider = provider;
  }

  getEntityQuery(profile) {
    return {
      email: profile.email,
    };
  }

  async createEntity(profile, params) {
    const data = await this.getEntityData(profile);
    const entity = {};
    entity.name = data.name;
    entity.picture = data.picture;
    entity.email = data.email;
    entity.activeProvider = this.provider;
    entity.providers = entity.providers || {};
    entity.providers[this.provider] = {
      id: data.id,
      name: data.name,
      picture: data.picture,
    };
    return this.entityService.create(entity, params);
  }

  async updateEntity(entity, profile, params) {
    const data = await this.getEntityData(profile);
    entity.name = data.name;
    entity.picture = data.picture;
    entity.email = data.email;
    entity.activeProvider = this.provider;
    entity.providers = entity.providers || {};
    entity.providers[this.provider] = {
      id: data.id,
      name: data.name,
      picture: data.picture,
    };
    return this.entityService.update(entity._id, entity, params);
  }
}

module.exports = MultiOAuthStrategy;
