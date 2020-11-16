<template>
  <section>
    <Navigation name="ManageList"/>
    <div class="manage-list">
      <show-at breakpoint="mediumAndAbove">
        <h1 class="logo m-top-md"><span>Ma Todo Liste</span></h1>
      </show-at>
      <div class="container text-center m-top-sm">
        <div class="flex space-xs">
          <div><input type="text" class="input-icon" placeholder="Choisissez une icone" v-model="list.icon" /></div>
          <div class="main"><input type="text" placeholder="Ajouter une liste" v-model="list.name" @keyup.enter="ManageList" class="full-width"/></div>
        </div>
        <p><a href="https://fontawesome.com/icons?d=gallery&s=regular&m=free" target="_blank">Voir les icones disponibles <i class="fa fa-angle-right"></i></a></p>
        <ul class="nls list-todo m-top-lg">
          <li class="m-top-sm" v-for="list in getLists" :key="list.id">
            <div class="list-line" :class="{'is-editing': list.isEditing}">
              <div class="list-info flex space-md">
                <span class="icon big">
                  <i class="font-xl fa" :class="'fa-' + list.icon"></i>
                </span>
                <div class="main text-left">
                  <h2 class="font-xl text-left cursor-pointer" @click="editList(list.id)">{{ list.name }}</h2>
                  <span class="violet-light font-xs">Ajouté par {{ list.user.data.displayName }} le {{ $moment(list.createdAt).format('DD/MM/YYYY') }}</span>
                </div>
              </div>
              <div v-if="list.isEditing" class="editing-form">
                <div class="flex space-xxs">
                  <div><input :id="'icon-' + list.id" class="input-icon" :value="list.icon" type="text" style="width:85px"></div>
                  <div class="main flex space-xxs">
                    <div class="main"><input :id="'name-' + list.id" class="full-width" :value="list.name" type="text"></div>
                    <a href="" v-on:click.stop.prevent="saveList(list.id, $event)" class="btn-violet btn-rounded"><i class="fa fa-check"></i></a>
                    <a href="" v-on:click.stop.prevent="cancelEditList(list.id, $event)" class="btn-grey btn-rounded"><i class="fa fa-times"></i></a>
                    <a href="" v-on:click.stop.prevent="deleteList(list.id, $event)" class="btn-red btn-rounded"><i class="fa fa-trash"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import Navigation from 'components/Navbar'
import { mapGetters } from 'vuex'
import { db } from '../index'
import {hideAt, showAt} from "vue-breakpoints";

export default {
  name: 'ManageList',
  components: {
    Navigation,
    hideAt,
    showAt,
  },
  data () {
    return {
      lists: [],
      list: {
        icon: 'tasks'
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'getLists'
    ])
  },
  created: function () {
    this.$store.dispatch('setLists')
    this.getLists.forEach(list => {
      db.collection('todolists')
          .doc(list.id)
          .update({
            isEditing: false
          })
    })
  },
  methods: {
    ManageList () {
      db.collection('todolists').add({
        name: this.list.name,
        icon: this.list.icon,
        createdAt: this.$moment().format(),
        isEditing: false,
        user: this.user
      })
    },
    editList (docId) {
      this.getLists.forEach(list => {
        if (list.id === docId) {
          db.collection('todolists')
            .doc(docId)
            .update({
              isEditing: true
            })
        } else {
          db.collection('todolists')
            .doc(list.id)
            .update({
              isEditing: false
            })
        }
      })
    },
    saveList (docId) {
      const name = document.getElementById('name-' + docId).value
      const icon = document.getElementById('icon-' + docId).value
      db.collection('todolists')
        .doc(docId)
        .update({
          name: name,
          icon: icon,
          isEditing: false
        })
    },
    cancelEditList (docId) {
      db.collection('todolists')
        .doc(docId)
        .update({
          isEditing: false
        })
    },
    deleteList (docId) {
      db.collection('todolists')
        .doc(docId)
        .delete()
    }
  }
}
</script>

<style lang="sass">
@import "../../assets/sass/manage-list"
</style>
