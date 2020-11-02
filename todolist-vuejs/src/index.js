import Vue from 'vue'
import VueTouch from 'vue-touch'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'
import 'firebase/firestore'
import store from './store'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import moment from 'moment'
Object.defineProperty(Vue.prototype, '$moment', { value: moment })
moment.locale('fr')

Vue.use(VueTouch)
Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: 'AIzaSyB2AviDch6GfmKnCuU3AWuWuznBBLaL20o',
  authDomain: 'todolist-vuejs-57c33.firebaseapp.com',
  databaseURL: 'https://todolist-vuejs-57c33.firebaseio.com',
  projectId: 'todolist-vuejs-57c33',
  storageBucket: 'todolist-vuejs-57c33.appspot.com',
  messagingSenderId: '217132079331',
  appId: '1:217132079331:web:bea7411d86a158801f8dd6',
  measurementId: 'G-5MEV54EHYC'
}

firebase.initializeApp(firebaseConfig)
export const db = firebase.firestore()

firebase.auth().onAuthStateChanged(user => {
  store.dispatch('fetchUser', user)
})

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
