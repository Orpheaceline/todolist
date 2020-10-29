<template>
  <section>
    <Navigation name="Home" />
    <div class="main">
      <h1 class="logo"><span>Ma Todo Liste</span></h1>
      <Todolist id="MyTodoListApp" name="Home" />
    </div>
  </section>
</template>

<script>
import Navigation from 'components/Navbar'
import Todolist from 'components/Todolist'

export default {
  name: 'Home',
  components: {
    Navigation,
    Todolist
  }
}
</script>
