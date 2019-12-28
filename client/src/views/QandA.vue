<template>
  <div class="mt2 container event">
    <b-notification type="is-info" v-if="!user" :closable="false">
      Hello there Anonymous Rose! 🌹 You are not logged in. You can submit a question, but you will not be able to vote.
    </b-notification>
    <transition name="fade">
      <b-notification
        class="mt2"
        v-if="submitSuccess"
        type="is-success"
        aria-close-label="Close notification"
      >Question submitted!</b-notification>
    </transition>
    <nav class="level">
      <div class="level-item has-text-centered">
        <button
          v-if="!showForm && !loading"
          @click="showForm = !showForm; submitSuccess = false;"
          class="mt2 button is-success"
        >Submit a Question</button>
      </div>
    </nav>
    <transition name="fade">
      <form class="mt2" @submit.prevent="askQuestion" v-if="showForm && !loading">
        <b-field label="Name" v-if="!user">
          <b-input v-model="name" size="is-large" required></b-input>
        </b-field>
        <b-field label="Question">
          <b-input v-model="question" maxlength="300" type="textarea" size="is-large" required></b-input>
        </b-field>
        <div class="level">
          <div class="level-left">

          </div>
          <div class="level-right">
            <div class="level-item">
              <p class="control">
                <button @click="showForm = false" type="button" class="button is-danger">Cancel</button>
              </p>
            </div>
            <div class="level-item">
              <p class="control">
                <button type="submit" class="button is-success">Ask Question</button>
              </p>
            </div>
          </div>
        </div>
      </form>
    </transition>
    <b-button v-if="loading" type="is-danger" disabled loading>Asking question...</b-button>
    <transition-group tag="div" name="highlighted-questions" class="questions mt2">
      <Question
        v-for="question in highlightedQuestions"
        :key="question._id"
        :question="question"
        :user="user"
        :vote="vote"
        :archive="archive"
        :highlight="highlight"
      />
    </transition-group>
    <transition-group tag="div" name="asked-questions" class="questions mt2">
      <Question
        v-for="question in questionsByNumVotes"
        :key="question._id"
        :question="question"
        :user="user"
        :vote="vote"
        :archive="archive"
        :highlight="highlight"
      />
    </transition-group>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Question from '../components/Question.vue';
import client from '../client';
import apiClient from '../apiClient';

export default {
  components: {
    Question,
  },
  data: () => ({
    showForm: false,
    loading: false,
    submitSuccess: false,
    name: '',
    question: '',
    questions: [],
    questionsById: {},
    usersById: {},
    votesById: {},
  }),
  computed: {
    ...mapState(['user']),
    highlightedQuestions() {
      return this.questions
        .filter(q => !q.archived && q.highlighted)
        .sort((a, b) => {
          const voteDiff = b.numVotes - a.numVotes;
          if (voteDiff !== 0) return voteDiff;
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
    },
    questionsByNumVotes() {
      return this.questions
        .filter(q => !q.archived && !q.highlighted)
        .sort((a, b) => {
          if (this.getLevelAmount(a.user) > this.getLevelAmount(b.user)) return -1;
          if (this.getLevelAmount(b.user) > this.getLevelAmount(a.user)) return 1;
          const voteDiff = b.numVotes - a.numVotes;
          if (voteDiff !== 0) return voteDiff;
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
    },
  },
  async mounted() {
    this.loading = true;
    this.usersById = (await client.service('users').find()).reduce(
      (byId, user) => {
        byId[user._id] = user;
        return byId;
      },
      {
        anonymous: {
          _id: 'anonymous',
          picture: 'https://i.imgur.com/Uj3a1at.jpg',
          name: 'Anonymous Rose',
          activeProvider: 'incognito',
        },
      },
    );
    this.votesById = (await client.service('votes').find()).reduce(
      (byId, vote) => {
        vote.user = this.usersById[vote.userId];
        byId[vote.questionId] = byId[vote.questionId] || {};
        byId[vote.questionId][vote.userId] = vote;
        return byId;
      },
      {},
    );
    const questionsById = {};
    this.questions = (await client.service('questions').find()).map(
      (question) => {
        question.user = this.usersById[question.userId];
        question.votes = this.votesById[question._id] || {};
        question.numVotes = Object.keys(this.votesById[question._id] || {}).length;
        question.showUsers = false;
        questionsById[question._id] = question;
        return question;
      },
    );
    this.questionsById = questionsById;
    this.loading = false;
    client.service('questions').on('created', async (question) => {
      if (!this.usersById[question.userId]) {
        const user = await client.service('users').get(question.userId);
        this.$set(this.usersById, user._id, user);
      }
      question.user = this.usersById[question.userId];
      question.votes = {};
      question.numVotes = 0;
      question.showUsers = false;
      this.$set(this.questionsById, question._id, question);
      this.questions.push(question);
    });
    client.service('questions').on('patched', async (question) => {
      this.questionsById[question._id].archived = question.archived;
      this.questionsById[question._id].highlighted = question.highlighted;
    });
    client.service('users').on('updated', async (user) => {
      if (this.usersById[user._id]) {
        Object.assign(this.usersById[user._id], user);
      } else {
        this.$set(this.usersById, user._id, user);
      }
    });
    client.service('votes').on('created', async (vote) => {
      if (!this.usersById[vote.userId]) {
        const user = await client.service('users').get(vote.userId);
        this.$set(this.usersById, user._id, user);
      }
      vote.user = this.usersById[vote.userId];
      this.$set(
        this.votesById,
        vote.questionId,
        this.votesById[vote.questionId] || {},
      );
      this.$set(this.votesById[vote.questionId], vote.userId, vote);
      this.questionsById[vote.questionId].votes = this.votesById[
        vote.questionId
      ];
      this.questionsById[vote.questionId].numVotes = Object.keys(
        this.votesById[vote.questionId] || {},
      ).length;
    });
    apiClient.service('youtube/members').on('created', (users) => {
      if (Array.isArray(users)) {
        const levelsById = users.reduce((byId, user) => {
          byId[user.id] = user.level;
          return byId;
        }, {});
        Object.values(this.usersById).forEach((user) => {
          if (user.providers && user.providers.youtube && user.providers.youtube.channels) {
            Object.keys(user.providers.youtube.channels).forEach((channelId) => {
              if (levelsById[channelId]) {
                this.$set(user, 'tier', levelsById[channelId]);
              }
            });
          }
        });
      }
    });
  },
  methods: {
    getLevelAmount(user) {
      if (user.pledge && user.pledge.patron_status === 'active_patron') {
        return user.pledge.amount_cents;
      }
      if (user.tier) {
        return user.tier.amount_cents;
      }
      return 0;
    },
    async askQuestion() {
      if (!this.question.trim()) return;
      this.loading = true;
      const question = await client.service('questions').create({
        text: `${this.name ? `🌹 ${this.name} 🌹 asks: ` : ''}${this.question}`,
      });
      if (this.user) {
        await client.service('votes').create({
          questionId: question._id,
        });
      }
      this.question = '';
      this.loading = false;
      this.showForm = false;
      this.submitSuccess = true;
      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
    },
    async vote(questionId) {
      if (!this.user) return;
      if (
        this.votesById[questionId]
        && this.votesById[questionId][this.user._id]
      ) {
        return;
      }
      await client.service('votes').create({
        questionId,
      });
    },
    async archive(questionId) {
      await client.service('questions').patch(questionId, {
        archived: true,
      });
    },
    async highlight(questionId) {
      await client.service('questions').patch(questionId, {
        highlighted: true,
      });
    },
  },
};
</script>

<style>
.mt2 {
  margin-top: 2rem;
}

.questions {
  margin-bottom: 5rem;
  transition: all 0.5s;
}

.control button {
  margin-right: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
  opacity: 1;
  transform: scale(1);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0);
  height: 0px;
}

.asked-questions-enter-active,
.asked-questions-leave-active,
.highlighted-questions-enter-active,
.highlighted-questions-leave-active {
  transition: all 0.5s;
}

.asked-questions-enter,
.asked-questions-leave-to,
.highlighted-questions-enter,
.highlighted-questions-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
