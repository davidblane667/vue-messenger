import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ChatListView from '@/views/ChatListView.vue'
import ChatView from '@/views/ChatView.vue'

// Мобильный guard (redirect /→/chats) добавляется в F14
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
    },
    {
      path: '/chats',
      component: ChatListView,
    },
    {
      path: '/chat/:id',
      component: ChatView,
      props: (route) => ({ chatId: Number(route.params['id']) }),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
