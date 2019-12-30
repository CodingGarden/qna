<template>
  <article class="media question" :class="{ highlighted: question.highlighted }">
    <figure class="media-left">
      <p class="image is-64x64">
        <img :src="question.user.picture" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <div>
          <b-icon class="provider-icon" :icon="question.user.activeProvider"></b-icon>
          <strong class="question-user">{{question.user.name}}</strong>
          <span v-if="question.user.pledge && question.user.pledge.patron_status === 'active_patron'" class="level-icon">
            {{getPledgeBadge(question.user)}}
            <b-icon class="provider-icon" icon="patreon"></b-icon>
          </span>
          <span v-if="question.user.tier" class="level-icon">
            {{getMemberBadge(question.user)}}
            <b-icon class="provider-icon" icon="youtube"></b-icon>
          </span>
          <br />
          <small class="date">{{new Date(question.createdAt).toLocaleString()}}</small>
          <br />
          <section class="question-text">{{question.text}}</section>
        </div>
      </div>
      <nav class="level">
        <div class="level-left">
          <a :class="{ 'cannot-vote': !user, voted: user && question.votes[user._id], 'not-voted': user && !question.votes[user._id] }">
            <svg
              @click="vote(question._id)"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="css-i6dzq1"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </a>
          <a class="level-item num-votes" :class="{ 'cannot-vote': !user }">{{question.numVotes}}</a>
          <a class="level-item" v-if="user && user.isAdmin"></a>
          <a v-if="user && user.isAdmin">
            <svg
              @click="highlight(question._id)"
              class="admin-button"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              />
            </svg>
          </a>
          <a v-if="user && user.isAdmin">
            <svg
              @click="question.showUsers = !question.showUsers"
              class="admin-button"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </a>
          <a v-if="user && user.isAdmin">
            <svg
              @click="archive(question._id)"
              class="admin-button"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="21 8 21 21 3 21 3 8" />
              <rect x="1" y="3" width="22" height="5" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
          </a>
        </div>
      </nav>
      <div v-if="question.showUsers">
        <div v-for="vote in question.votes" :key="vote._id">{{vote.user.name}}</div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  props: ['user', 'question', 'vote', 'archive', 'highlight'],
  methods: {
    isPatron(user) {
      return user.pledge && user.pledge.patron_status === 'active_patron';
    },
    isMember(user) {
      return user.tier;
    },
    getPledgeBadge(user) {
      if (!('amount_cents' in user.pledge)) return '⁉️';
      const amount = user.pledge.amount_cents;
      if (amount < 255) {
        return '💧';
      }

      if (amount <= 255) {
        return '🌻';
      }

      if (amount <= 500) {
        return '💩';
      }

      if (amount <= 2500) {
        return '🥑';
      }

      return '🚜';
    },
    getMemberBadge(user) {
      const amount = user.tier.amount_cents;
      if (amount <= 199) {
        return '💧';
      }

      if (amount <= 399) {
        return '🌻';
      }

      if (amount <= 599) {
        return '💩';
      }

      if (amount <= 2999) {
        return '🥑';
      }

      return '🚜';
    },
  },
};
</script>

<style scoped lang="scss">
@import "~bulmaswatch/nuclear/_variables";

.level-icon {
  margin-left: 0.5rem;
}

.provider-icon {
  margin-right: 0.5rem;
}

.question {
  transition: all 0.5s;
}

.highlighted {
  border: 2px solid $primary;
  padding: 1rem;
}

.question-user {
  font-size: 1.5rem;
}

.question-text {
  font-size: 2rem;
}

.image.is-64x64 img {
  border-radius: 50%;
}

.date {
  margin-left: 1rem;
}

.voted:hover {
  color: $primary;
}

.voted svg {
  stroke: $primary;
  fill: $primary;
  cursor: not-allowed;
}

.not-voted svg {
  stroke: $primary;
  fill: none;
  cursor: pointer;
}

.cannot-vote svg {
  stroke: $primary;
  fill: none;
  cursor: not-allowed;
}

.num-votes {
  color: $primary;
  margin-left: 0.5rem;
}

.num-votes.cannot-vote {
  cursor: not-allowed;
}

.admin-button {
  margin-right: 1rem;
}
</style>
