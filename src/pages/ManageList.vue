<template>
  <section>
    <Navigation name="ManageList"/>
    <div class="manage-list">
      <show-at breakpoint="mediumAndAbove">
        <h1 class="logo m-top-md"><span>Ma Todo Liste</span></h1>
      </show-at>
      <div class="container text-center m-top-sm">
        <div class="flex space-xs">
          <div><input type="text" class="input-icon" placeholder="Choisissez une icone" v-model="list.icon" @keyup.enter="ManageList" /></div>
          <div class="main"><input type="text" placeholder="Ajouter une liste" v-model="list.name" @keyup.enter="ManageList" class="full-width"/></div>
        </div>
        <p><a href="https://fontawesome.com/icons?d=gallery&m=free" target="_blank">Voir les icones disponibles <i class="fa fa-angle-right"></i></a></p>
        <ul class="nls list-todo m-top-lg">
          <li class="m-top-sm list-line flex v-center" :class="{'is-editing': list.isEditing}" v-for="list in getLists" :key="list.id" draggable="true" @dragstart="dragStart(list, $event)" @dragover.prevent @dragenter="dragEnter" @dragleave="dragLeave" @dragend="dragEnd" @drop="dragFinish(list, $event)">
            <div>
              <span class="icon big">
                <i class="font-xl fa" :class="'fa-' + list.icon"></i>
              </span>
            </div>
            <div class="main flex v-center space-sm p-md text-left">
              <label class="font-xl cursor-pointer font-bold" @click="editList(list.id)">{{ list.name }}</label>
              <Tooltip class="align-right" :direction="'right'" :linkClass="'align-right'">
                <slot>
                  <span>Ajouté par</span>
                  <strong>{{ list.user.data.displayName }}</strong>
                  <span>le <strong>{{ moment(list.createdAt) }}</strong></span>
                </slot>
              </Tooltip>
            </div>
            <div v-if="list.isEditing" class="editing-form">
              <div class="flex space-xxs">
                <div><input :id="'icon-' + list.id" class="input-icon" :value="list.icon" type="text" @keyup.enter="saveList(list.id)" style="width:85px"></div>
                <div class="main flex space-xxs">
                  <div class="main"><input :id="'name-' + list.id" class="full-width" :value="list.name" type="text" @keyup.enter="saveList(list.id)"></div>
                  <div><a href="" v-on:click.stop.prevent="saveList(list.id)" class="btn-violet btn-rounded"><i class="fa fa-check"></i></a></div>
                  <div><a href="" v-on:click.stop.prevent="cancelEditList(list.id, $event)" class="btn-grey btn-rounded"><i class="fa fa-times"></i></a></div>
                  <div><a href="" v-on:click.stop.prevent="deleteList(list.id, $event)" class="btn-red btn-rounded"><i class="fa fa-trash"></i></a></div>
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
import {hideAt, showAt} from "vue-breakpoints"
import Tooltip from 'components/Tooltip'

export default {
  name: 'ManageList',
  components: {
    Navigation,
    hideAt,
    showAt,
    Tooltip
  },
  data () {
    return {
      lists: [],
      list: {
        order: 0,
        icon: 'tasks'
      },
      dragging: -1
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'getLists'
    ])
  },
  created: function () {
    this.$store.dispatch('setLists').then(() => {
      this.setEditingToFalse()
    })
  },
  methods: {
    setEditingToFalse () {
      this.getLists.forEach(list => {
        db.collection('todolists')
          .doc(list.id)
          .update({
            isEditing: false
          })
      })
    },
    moment (date) {
      return this.$moment(date).format('DD/MM/YYYY')
    },
    ManageList () {
      const order = this.getLists.length
      db.collection('todolists').add({
        order: order + 1,
        name: this.list.name,
        icon: this.list.icon,
        createdAt: this.$moment().format(),
        isEditing: false,
        user: this.user
      })
      this.list.name = ''
      this.list.icon = ''
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
    },
    dragStart(which, event) {
      event.dataTransfer.dropEffect = 'move'
      this.dragging = which;
    },
    dragEnter(event) {
      event.target.classList.add('is-target')
    },
    dragLeave(event) {
      event.target.classList.remove('is-target')
    },
    dragEnd() {
      this.dragging = -1
    },
    dragFinish(to, event) {
      this.moveItem(this.dragging, to);
      event.target.classList.remove('is-target')
    },
    moveItem(from, to) {
      if (from.id !== to.id) {
        db.collection('todolists')
            .doc(from.id)
            .update({
              order: to.order
            })
        if (from.order < to.order) {
          db.collection('todolists')
              .doc(to.id)
              .update({
                order: to.order - 1
              })
          this.getLists.forEach(list => {
            if (list.order !== to.order && list.order !== from.order && from.order + 1 !== to.order) {
              if (list.order < to.order) {
                db.collection('todolists')
                    .doc(list.id)
                    .update({
                      order: list.order - 1
                    })
              }
            }
          })
        } else {
          db.collection('todolists')
              .doc(to.id)
              .update({
                order: to.order + 1
              })
          this.getLists.forEach(list => {
            if (list.order !== to.order && list.order !== from.order && from.order - 1 !== to.order) {
              if (list.order > to.order) {
                db.collection('todolists')
                    .doc(list.id)
                    .update({
                      order: list.order + 1
                    })
              }
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="sass">
@import "../../assets/sass/manage-list"
</style>

