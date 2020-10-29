<template>
  <div class="view">
    <div class="flex space-sm">
      <div class="input-checkbox">
        <input type="checkbox" class="fake-check" :checked="todo.isCompleted" @change="updateTodoItem(todo.id, $event)">
      </div>
      <div class="todo-infos">
        <label>{{ todo.title }}</label>
        <input v-model="todo.title" type="text" class="hide">
        <div class="todo-info">
          <strong>{{ todo.user.data.displayName }}</strong> -
          <span>{{ todo.createdAt }}</span>
        </div>
      </div>
      <button class="no-btn-style destroy align-right" title="Supprimer cette tache" @click="deleteToDo(todo.id)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodoLine.vue'
}
</script>
