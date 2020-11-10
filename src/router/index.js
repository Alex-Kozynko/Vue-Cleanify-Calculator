import Vue from 'vue'
import VueRouter from 'vue-router'
import Extra from '@/views/Extra.vue'
import Booking from "@/views/Booking";
import Booking2 from "@/views/Booking-2";
import Checkout from "@/views/Checkout";

Vue.use(VueRouter)

const routes = [
  {
    path: '/calc',
    name: 'Extra',
    component: Extra
  },
  {
    path: '/calc-booking',
    name: 'Booking',
    component: Booking
  },
  {
    path: '/calc-booking-2',
    name: 'Booking-2',
    component: Booking2
  },
  {
    path: '/calc-checkout',
    name: 'Checkout',
    component: Checkout
  },
  /*{
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/!* webpackChunkName: "about" *!/ '../views/About.vue')
  }*/
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
