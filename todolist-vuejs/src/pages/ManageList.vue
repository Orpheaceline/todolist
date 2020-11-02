<template>
  <section>
    <Navigation name="ManageList"/>
    <div class="manage-list">
      <h1 class="logo"><span>Ma Todo Liste</span></h1>
      <div class="container text-center p-lg">
        <input type="text" class="input-icon" placeholder="Choisissez une icone" v-model="list.icon" />
        <input type="text" placeholder="Ajouter une liste" v-model="list.name" @keyup.enter="ManageList" />
        <p><a href="https://fontawesome.com/icons?d=gallery&s=regular&m=free" target="_blank">Voir les icones disponibles <i class="fa fa-angle-right"></i></a></p>
        <h2 class="m-md">Mes listes :</h2>
        <ul class="nls list-todo">
          <li class="bloc-violet no-p m-top-sm" v-for="list in getLists" :key="list.id">
            <v-touch @swipeleft="deleteList(list.id)" v-show="isEditing != list.id" class="flex space-sm">
              <span class="icon">
                <i class="font-xl fa" :class="'fa-' + list.icon"></i>
              </span>
              <div class="main p-sm text-left">
                <h2 class="font-xl text-left">{{ list.name }}</h2>
                <span class="grey font-xs">Ajouté par {{ list.user.data.displayName }} le {{ $moment(list.createdAt).format('DD/MM/YYYY') }}</span>
              </div>
              <a href="" v-on:click.stop.prevent="editList(list)" class="edit-list"><i class="fa fa-pencil-alt"></i></a>
            </v-touch>
            <div v-show="isEditing === list.id" class="list-form flex space-xs">
              <span class="icon">
                <input :id="'icon-' + list.id" class="input-icon" :value="list.icon" type="text">
              </span>
              <div class="main flex v-middle space-sm p-sm">
                <input :id="'name-' + list.id" class="main" :value="list.name" type="text">
                <a href="" v-on:click.stop.prevent="saveList(list.id, $event)"><i class="fa fa-check"></i></a>
                <a href="" v-on:click.stop.prevent="cancelEditList"><i class="fa fa-times"></i></a>
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

export default {
  name: 'ManageList',
  components: {
    Navigation
  },
  data () {
    return {
      lists: [],
      list: {
        icon: 'tasks'
      },
      isEditing: false,
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'getLists'
    ])
  },
  beforeCreate: function () {
    this.$store.dispatch('setLists')
  },
  methods: {
    ManageList () {
      db.collection('todolists').add({
        name: this.list.name,
        icon: this.list.icon,
        createdAt: this.$moment().format(),
        user: this.user
      })
    },
    editList (list) {
      this.isEditing = list.id
    },
    saveList (docId) {
      const name = document.getElementById('name-' + docId).value
      const icon = document.getElementById('icon-' + docId).value

      db.collection('todolists')
        .doc(docId)
        .update({
          name: name,
          icon: icon
        })
        .then(_ => {
          this.isEditing = ''
        })
    },
    cancelEditList () {
      this.isEditing = null
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
@import "./assets/sass/manage-list.sass"
</style>
