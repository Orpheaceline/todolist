import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import store from './store'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

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

firebase.auth().onAuthStateChanged(user => {
  store.dispatch('fetchUser', user)
})

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
