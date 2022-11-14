import store from '../store'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
      path: '*',
      redirect: '/'
  },

  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },

  {
    path: '/forgotPassword/:email/:token',
    name: 'forgotPassword',
    component: () => import('../views/ForgotView.vue')
  },

  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },

  {
    path: '/',
    name: 'home',
    meta: {requireAuth: true},
    component: () => import('../views/HomeView.vue')
  },

  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;


// se verifica el enrutamiento
router.beforeEach(async (to, from, next) => {
    // se actualiza la autenticación
    if (to.name == 'login' || to.name == 'register' 
          || to.name == 'home' || to.name == 'about')
     await store.dispatch("verifyAuth");

    // si se requiere autenticación para la ruta pedida
    if (to.meta.requireAuth){
       if (store.state.isAuth){ // si hay autenticación valida
          next(); // se redirige a la ruta pedida
       }else if (to.name == "home"){ // si la ruta pedida es la principal
          next('/login'); // se redirige al login para iniciar sesión
       }

       return;
    }

    // si la ruta pedida es el registro o el login
    if (to.name == 'login' || to.name == 'register'){
       // se verifica si hay autenticación
       if (store.state.isAuth){
           // si hay autenticación se redirige al home
           next("/");
       }else{ 
         next(); // si no hay autenticación se redirige a la ruta pedida
       }

       return;
    }

    next(); // se redirige a la ruta pedida
});