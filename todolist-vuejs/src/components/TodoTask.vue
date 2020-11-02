<template>
  <li class="todo flex space-sm" :class="{completed: todo.isCompleted}">
    <div class="input-checkbox">
      <input type="checkbox" class="fake-check" :checked="todo.isCompleted" @change="updateTodoItem(todo.id, $event)">
    </div>
    <div class="todo-infos main">
      <v-touch @press="editTodo(todo, $event)" @swipeleft="deleteToDo(todo.id)">
        <div v-show="isEditing != todo.id">
          <label>{{ todo.name }}</label>
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
      </v-touch>
      <input :value="todo.name" v-show="isEditing === todo.id" @blur="cancelEditTodo" @keyup.enter="saveTodo(todo.id, $event)" type="text">
    </div>
  </li>
</template>

<script>
import {db} from "../index";

export default {
  name: "TodoTask",
  props: {
    todo: Object
  },
  data () {
    return {
      type: null,
      isEditing: false,
    }
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
    updateTodoItem  (docId, e) {
      e.target.closest('.todo').classList.toggle('completed')
      const isChecked = e.target.checked
      setTimeout(() =>
        db.collection('todos')
          .doc(docId)
          .update({
            isCompleted: isChecked
          }), 3000)
    },
    editTodo (todo, e) {
      this.isEditing = todo.id
    },
    saveTodo (docId, e) {
      db.collection('todos')
        .doc(docId)
        .update({
          name: e.target.value
        })
        .then(_ => {
          this.isEditing = ''
        })
    },
    cancelEditTodo () {
      this.isEditing = null
    },
    deleteToDo (docId) {
      db.collection('todos')
        .doc(docId)
        .delete()
    }
  }
}
</script>
