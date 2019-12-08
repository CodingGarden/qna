import Vue from 'vue';
import VueRouter from 'vue-router';
import QandA from '../views/QandA.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'qna',
    component: QandA,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
