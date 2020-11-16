<template>
  <li class="todo flex space-sm" :class="{completed: todo.isCompleted}">
    <div class="input-checkbox">
      <input type="checkbox" class="fake-check" :checked="todo.isCompleted" @change="updateTodoItem(todo.id, $event)">
    </div>
    <div class="todo-infos main">
      <div class="line-todo" :class="{'is-editing': todo.isEditing}">
        <label class="cursor-pointer" @click="editTodo(todo.id)">{{ todo.name }}</label>
        <div class="todo-info flex inline flex-wrap v-middle space-xxs">
          <span>Ajouté par</span>
          <strong>{{ todo.user.data.displayName }}</strong>
          <span>le <strong>{{ moment(todo.createdAt) }}</strong></span>
          <div class="flex inline v-middle" v-show="todo.dueDate">
            <span>et à finir avant le <strong>{{ moment(todo.dueDate) }}</strong></span>
            <span class="label-red m-left-xs" v-if="itsToaday(todo)">FAIS LE !!</span>
            <span class="label-blue m-left-xs" v-else>{{ getCountLeft(todo) }}</span>
          </div>
        </div>
      </div>
      <div v-if="todo.isEditing" class="editing-form flex space-xxs v-middle">
        <input ref="newText" :value="todo.name" @keyup.enter="saveTodo(todo.id, $event)" type="text">
        <a href="#" v-on:click.stop.prevent="saveTodo(todo.id, $event)" class="btn-violet btn-rounded"><i class="fa fa-check"></i></a>
        <a href="#" v-on:click.stop.prevent="cancelEditTodo(todo.id)" class="btn-grey btn-rounded"><i class="fa fa-times"></i></a>
        <a href="#" v-on:click.stop.prevent="deleteToDo(todo.id)" class="btn-red btn-rounded"><i class="fa fa-trash"></i></a>
      </div>
    </div>
  </li>
</template>

<script>
import {db} from "../index";
import {mapGetters} from "vuex";

export default {
  name: "TodoTask",
  props: {
    todo: Object
  },
  data () {
    return {
      type: null
    }
  },
  computed: {
    ...mapGetters([
      'getTodos'
    ])
  },
  created: function () {
    this.getTodos.forEach(todo => {
      db.collection('todos')
        .doc(todo.id)
        .update({
          isEditing: false
        })
    })
  },
  methods: {
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
      const newText = this.$refs.newText.value
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
    }
  }
}
</script>
