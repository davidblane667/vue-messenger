import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ChatListView from '@/views/ChatListView.vue'
import ChatView from '@/views/ChatView.vue'
import { MOBILE_BREAKPOINT } from '@/constants'

const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      // На мобильном desktop-layout не нужен — редирект на список чатов
      beforeEnter: (_to, _from, next) => {
        if (isMobile()) {
          next('/chats')
        } else {
          next()
        }
      },
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
