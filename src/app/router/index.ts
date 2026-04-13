import { createRouter, createWebHistory } from 'vue-router'
import GroupBookingCreatePage from '@/pages/GroupBookingCreatePage.vue'
import GroupBookingEditPage from '@/pages/GroupBookingEditPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/groups/new',
      name: 'booking-new',
      component: GroupBookingCreatePage,
    },
    {
      path: '/groups/:id',
      name: 'booking-edit',
      component: GroupBookingEditPage,
    },
  ],
})
