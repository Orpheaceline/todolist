<template>
  <div>
    <section v-if="user.loggedIn" class="todoapp">
      <div ref="alertRed" class="alert-red flex space-sm v-center h-center hide">
        <i class="fa fa-exclamation fa-circle-red extra-small m-right-sm"></i>
        Veuillez compléter le champ ci dessous.
      </div>
      <header class="header flex-form">
        <input ref="todoName" :id="'add-todo-' + list.id" v-model="todo.name" type="text" placeholder="Ajouter une tache" @keyup.enter="addTodo()">
        <Datepicker ref="datePicker" v-model="todo.dueDate" :language="fr" format="dd/MM/yyyy" :class="{empty: !todo.dueDate}" @closed="addTodo"/>
      </header>
      <div class="content">
        <div class="flex space-xs v-center m-top-sm m-bottom-sm">
          <div class="main">
            <div class="bloc-violet-light bloc-radius bloc-xs flex space-xs v-center">
              <span><i class="fa fa-info fa-circle-violet extra-small"></i></span>
              <div class="violet-light text-left">
                <template v-if="activeTodos.length">
                  <span v-show="list.name === 'Todo List'">{{ activeTodos.length | pluralize('fr', ['Il y a une tâche à faire.', 'Il y a ' + activeTodos.length + ' tâches à faire.']) }}</span>
                  <span v-show="list.name === 'Travel List'">{{ activeTodos.length | pluralize('fr', ['Il y a un endroit à visiter.', 'Il y a ' + activeTodos.length + ' endroits à visiter.']) }}</span>
                  <span v-show="list.name === 'Watch List'">{{ activeTodos.length | pluralize('fr', ['Il y a un film ou une série à regarder.', 'Il y a ' + activeTodos.length + ' films / séries à regarder.']) }}</span>
                  <span v-show="list.name === 'Shopping List'">{{ activeTodos.length | pluralize('fr', ['Il y a une chose à acheter en course.', 'Il y a ' + activeTodos.length + ' choses à acheter en course.']) }}</span>
                  <span v-show="list.name === 'Vrac List'">{{ activeTodos.length | pluralize('fr', ['Il y a une chose à acheter en vrac.', 'Il y a ' + activeTodos.length + ' choses à acheter en vrac.']) }}</span>
                </template>
                <template v-else>
                  <span>Cette liste est vide.</span>
                </template>
              </div>
            </div>
          </div>
          <Dropdown id="menu-toggle" name="Dropdown">
            <slot>
              <li><a href="#" :class="{'active': type === ''}" @click="setFilterType('')">Afficher les tâches à faire ({{ activeTodos.length }})</a></li>
              <li><a href="#" :class="{'active': type === 'completed'}" @click="setFilterType('completed')">Afficher les tâches finies ({{ completedTodos.length }})</a></li>
              <li><a href="#" :class="{'active': type === 'all'}" @click="setFilterType('all')">Afficher toutes les tâches ({{ AllTodos.length }})</a></li>
              <li class="border-top-grey m-top-sm">
                <a href="" v-on:click.stop.prevent="clearCompleted">
                  Supprimer les taches finies ({{ completedTodos.length }})
                </a>
              </li>
            </slot>
          </Dropdown>
        </div>
        <draggable @end="updateOrder" handle=".handle">
          <transition-group tag="ul" type="transition" :name="'task-list'" class="nls task-list">
            <li class="todo"
                :class="{completed: todo.isCompleted}"
                v-for="todo in filteredTodos"
                :key="todo.id"
                :list="todo.listId"
                :id="todo.id"
                :order="todo.order"
                v-if="todo.listId === list.id"
            >
              <div class="flex space-sm v-center">
                <div class="input-checkbox">
                  <input type="checkbox" class="fake-check" :checked="todo.isCompleted" @change="updateTodoItem(todo.id, $event)">
                </div>
                <div class="todo-infos main">
                  <div class="line-todo flex space-sm v-center" :class="{'is-editing': todo.isEditing}" @dragenter.prevent @dragleave.prevent @dragover.prevent>
                    <label class="cursor-pointer" @click="editTodo(todo.id)">{{ todo.name }}</label>
                    <div class="flex inline v-center" v-show="todo.dueDate">
                      <span>et à finir avant le <strong>{{ moment(todo.dueDate) }}</strong></span>
                      <span class="label-red m-left-xs" v-if="itsToaday(todo)">FAIS LE !!</span>
                      <span class="label-blue m-left-xs" v-else>{{ getCountLeft(todo) }}</span>
                    </div>
                    <div class="align-right flex space-sm v-center">
                      <Tooltip :direction="'right'" :linkClass="'align-right'">
                        <slot>
                          <span>Ajouté par</span>
                          <strong>{{ todo.user.data.displayName }}</strong>
                          <span>le <strong>{{ moment(todo.createdAt) }}</strong></span>
                        </slot>
                      </Tooltip>
                      <i class="fa fa-align-justify font-sm violet-lighter handle"></i>
                    </div>
                  </div>
                  <div v-if="todo.isEditing" class="editing-form flex space-xxs v-center">
                    <div class="main"><input :id="'name-' + todo.id" :value="todo.name" @keyup.enter="saveTodo(todo.id)" type="text"></div>
                    <div><a href="#" v-on:click.stop.prevent="saveTodo(todo.id)" class="btn-violet btn-rounded"><i class="fa fa-check"></i></a></div>
                    <div><a href="#" v-on:click.stop.prevent="cancelEditTodo(todo.id)" class="btn-grey btn-rounded"><i class="fa fa-times"></i></a></div>
                    <div><a href="#" v-on:click.stop.prevent="deleteToDo(todo.id)" class="btn-red btn-rounded"><i class="fa fa-trash"></i></a></div>
                  </div>
                </div>
              </div>
            </li>
          </transition-group>
        </draggable>
      </div>
    </section>
  </div>
</template>

<style lang="sass">
@import "./assets/sass/todo.sass"
</style>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import draggable from 'vuedraggable'
import Datepicker from 'vuejs-datepicker'
import Tooltip from 'components/Tooltip'
import Dropdown from 'components/Dropdown'
import { fr } from 'vuejs-datepicker/dist/locale'
import { db } from '../index'

export default {
  name: 'Todolist',
  components: {
    Datepicker,
    draggable,
    Dropdown,
    Tooltip
  },
  props: {
    list: Object
  },
  data () {
    return {
      todos: [],
      todo: {
        order: 0,
        name: null
      },
      type: null,
      showTopMenu: false,
      today: this.$moment().format(),
      fr: fr
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'getTodos'
    ]),
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    },
    AllTodos () {
      return this.getTodos.filter(todo => todo.listId === this.list.id)
    },
    activeTodos () {
      return this.getTodos.filter(todo => todo.isCompleted === false && todo.listId === this.list.id)
    },
    completedTodos () {
      return this.getTodos.filter(todo => todo.isCompleted === true && todo.listId === this.list.id)
    },
    filteredTodos () {
      return _.orderBy(this.getTodos.filter(todo => {
        switch (this.type) {
          case 'all':
            return true
          case 'completed':
            return todo.isCompleted
          default:
            return !todo.isCompleted
        }
      }), ['isCompleted'])
    }
  },
  created: function () {
    this.$store.dispatch('setTodos', this.todo.id).then(() => {
      this.setEditingToFalse()
    })
  },
  methods: {
    addTodo () {
      if (this.todo.name) {
        const order = this.getTodos.length
        db.collection('todos').add({
          listId: this.list.id,
          listName: this.list.name,
          name: this.todo.name,
          order: order + 1,
          createdAt: this.$moment().format(),
          isCompleted: false,
          isEditing: false,
          dueDate: this.todo.dueDate ? this.$moment(this.todo.dueDate).format() : null,
          user: this.user
        })
        this.todo.name = ''
        this.$refs.datePicker.clearDate()
      } else {
        this.$refs.todoName.classList.add('red')
        this.$refs.alertRed.classList.remove('hide')
      }

    },
    updateTodoItem (docId, e) {
      e.target.closest('.todo').classList.toggle('completed')
      const isChecked = e.target.checked
      setTimeout(() =>
          db.collection('todos')
            .doc(docId)
            .update({
              isCompleted: isChecked
            }), 3000)
    },
    editTodo: function (docId) {
      this.getTodos.forEach(todo => {
        if (todo.id === docId) {
          db.collection('todos')
            .doc(docId)
            .update({
              isEditing: true
            })
        } else {
          db.collection('todos')
              .doc(todo.id)
              .update({
                isEditing: false
              })
        }
      })
    },
    saveTodo (docId) {
      const newText = document.getElementById('name-' + docId).value
      db.collection('todos')
          .doc(docId)
          .update({
            name: newText,
            isEditing: false
          })
    },
    cancelEditTodo (docId) {
      db.collection('todos')
        .doc(docId)
        .update({
          isEditing: false
        })
    },
    deleteToDo (docId) {
      db.collection('todos')
        .doc(docId)
        .delete()
    },
    setFilterType (type) {
      this.type = type
    },
    clearCompleted () {
      this.getTodos.forEach(todo => {
        if (todo.isCompleted) {
          db.collection('todos')
              .doc(todo.id)
              .delete()
        }
      })
    },
    moment (date) {
      return this.$moment(date).format('DD/MM/YYYY')
    },
    itsToaday (todo) {
      if (this.$moment(todo.dueDate).format('DD/MM/YYYY') === this.$moment(this.today).format('DD/MM/YYYY')) {
        return true
      }
    },
    getCountLeft (todo) {
      if (todo.dueDate) {
        const dueDate = this.$moment(todo.dueDate)
        return dueDate.from(this.today)
      }
    },
    setEditingToFalse () {
      this.getTodos.forEach(todo => {
        db.collection('todos')
            .doc(todo.id)
            .update({
              isEditing: false
            })
      })
    },
    updateOrder: function(e) {
      e.to.children.forEach((todo, index) => {
        const docId = todo.getAttribute('id')
        const newOrder = index + 1
        db.collection('todos')
          .doc(docId)
          .update({
            order: newOrder
          })
      })
    },
  }
}
</script>
