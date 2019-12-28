const fetch = require('node-fetch');

const MultiOAuthStrategy = require('./MultiOAuthStrategy');

const {
  PATREON_CAMPAIGN_ID
} = process.env;

class PatreonStrategy extends MultiOAuthStrategy {
  constructor() {
    super('patreon');
  }

  async getProfile(params) {
    try {
      const response = await fetch(`https://www.patreon.com/api/oauth2/v2/identity?include=memberships.campaign&fields${encodeURIComponent('[user]')}=email,first_name,image_url&fields${encodeURIComponent('[member]')}=patron_status,currently_entitled_amount_cents,pledge_relationship_start,lifetime_support_cents`, {
        headers: {
          authorization: `Bearer ${params.access_token}`,
        },
      });
      const { data, included = [] } = await response.json();
      const pledge = included.find(item =>
          item.type === 'member'
          && item.relationships.campaign.data.id === PATREON_CAMPAIGN_ID);
      return {
        id: data.id,
        email: data.attributes.email,
        picture: data.attributes.image_url,
        name: data.attributes.first_name,
        pledge: pledge ? {
          amount_cents: pledge.attributes.currently_entitled_amount_cents,
          created_at: pledge.attributes.pledge_relationship_start,
          patron_status: pledge.attributes.patron_status
        } : null
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    return {
      id: baseData.patreonId,
      picture: profile.picture,
      email: profile.email,
      name: profile.name,
      pledge: profile.pledge,
    };
  }
}

module.exports = PatreonStrategy;
