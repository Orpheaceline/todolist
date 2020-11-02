<template>
  <span class="dropdown" :class="{shown: state}">
    <a href="#" class="menu-link-icon" @click.prevent="toggleDropdown"><i class="fa fa-ellipsis-h"></i></a>
    <ul v-show="state" class="menu nls">
      <slot />
    </ul>
    <transition />
  </span>
</template>

<script>
export default {
  name: 'Dropdown',
  data () {
    return {
      state: false
    }
  },
  mounted () {
    document.addEventListener('click', this.close)
  },
  beforeDestroy () {
    document.removeEventListener('click',this.close)
  },
  methods: {
    toggleDropdown (e) {
      this.state = !this.state
    },
    close (e) {
      if (!this.$el.contains(e.target)) {
        this.state = false
      }
    }
  }
}
</script>

<style lang="sass">
    @import "./assets/sass/dropdown.sass"
</style>
