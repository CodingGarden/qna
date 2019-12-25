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

  async updateEntityProvider(profile, entity) {
    const data = await this.getEntityData(profile);
    entity.name = data.name;
    entity.picture = data.picture;
    entity.email = data.email;
    entity.activeProvider = this.provider;
    if ('pledge' in profile) {
      entity.pledge = profile.pledge;
    } else {
      entity.pledge = entity.pledge || null;
    }
    entity.providers = entity.providers || {};
    entity.providers[this.provider] = {
      id: data.id,
      name: data.name,
      picture: data.picture,
    };
  }

  async createEntity(profile, params) {
    const entity = {};
    await this.updateEntityProvider(profile, entity);
    return this.entityService.create(entity, params);
  }

  async updateEntity(entity, profile, params) {
    await this.updateEntityProvider(profile, entity);
    return this.entityService.update(entity._id, entity, params);
  }
}

module.exports = MultiOAuthStrategy;
