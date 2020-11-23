<template>
  <div class="tooltip" :class="direction">
    <span :class="linkClass" @click="showTooltip()"><i class="fa fa-info fa-circle-violet-light medium"></i></span>
    <div class="tooltip-content" :class="{'hide': !show}">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tooltip',
  props: {
    direction: '',
    linkClass: '',
  },
  data () {
    return {
      show: false
    }
  },
  created() {
    window.addEventListener('click', this.hideTooltip)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hideTooltip)
  },
  methods: {
    showTooltip () {
      this.show = ! this.show
    },
    hideTooltip(e) {
      if (!this.$el.contains(e.target)) {
        this.show = false
      }
    }
  }
}
</script>

<style lang="sass">
    @import "./assets/sass/tooltip.sass"
</style>
