<template>
  <div id="app" class="content">
    <b-navbar type="is-primary">
      <template slot="brand">
        <b-navbar-item tag="div">
          <img src="logo.png" alt="Coding Garden" />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item href="#">Coding Garden</b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div v-if="user && !loading" class="user">
            <section>
              <img :src="user.picture" />
            </section>
            <p class="name">{{user.name}}</p>
          </div>
          <div v-if="!user && !loading" class="buttons">
            <b-button type="is-danger" @click="loginWith('google')" icon-left="youtube">Login with Google</b-button>
            <b-button type="is-info" @click="loginWith('twitch')" icon-left="twitch">Login with Twitch</b-button>
            <b-button type="is-warning" @click="loginWith('discord')" icon-left="discord">Login with Discord</b-button>
            <b-button type="is-danger" @click="loginWith('patreon')" icon-left="patreon">Login with Patreon</b-button>
          </div>
          <div v-if="loading" class="buttons">
            <b-button v-if="loading" type="is-danger" disabled loading>Loading...</b-button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <section>
      <b-tabs size="is-large" class="block">
        <b-tab-item label="Q & A" icon="comment-question"></b-tab-item>
        <!-- <b-tab-item label="Live Chat" icon="forum"></b-tab-item> -->
        <!-- <b-tab-item label="FAQ" icon="frequently-asked-questions"></b-tab-item> -->
        <!-- <b-tab-item label="Poll" icon="poll-box"></b-tab-item> -->
      </b-tabs>
    </section>
    <router-view v-if="!loading" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import API_URL from './API_URL';
import client from './client';

export default {
  data: () => ({
    loading: true,
  }),
  async mounted() {
    this.login();
  },
  computed: mapState(['user']),
  methods: {
    async login() {
      try {
        const user = await client.reAuthenticate();
        this.$store.commit('setUser', user.user);
      } catch (error) {
        console.error('Not logged in.');
        if (localStorage['feathers-jwt']) {
          console.log('FOOOOO');
        }
      }
      this.loading = false;
    },
    loginWith(provider) {
      window.location.href = `${API_URL}/oauth/${provider}`;
    },
  },
};
</script>

<style lang="scss">
@import "./styles/index.scss";

body {
  width: 100vw;
  height: 100vh;
  position: relative;
}

#app {
  width: 100%;
  height: 100%;
  position: relative;
}

.center-container {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
}

.user {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-right: 2rem;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
}

.buttons button {
  margin-right: 2rem;
}

.user img {
  width: auto;
  border-radius: 50%;
}

.notices.is-top {
  position: absolute;
  top: 30px;
  left: 50%;
  z-index: 100;
  transform: translateX(-50%);
  padding: 1rem;
  background-color: #ffdd57;
  border-color: transparent;
  color: rgba(0, 0, 0, 0.7);
}
</style>
