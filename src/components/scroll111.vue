<template lang="html">
  <div class="yo-scroll" @scroll="(onInfinite || infiniteLoading) ? onScroll($event) : undefined">
    <section class="inner" >
      <slot></slot>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    offset: {
      type: Number,
      default: 40
    },
    enableInfinite: {
      type: Boolean,
      default: true
    },
    enableRefresh: {
      type: Boolean,
      default: true
    },
    onRefresh: {
      type: Function,
      default: undefined,
      required: false
    },
    onInfinite: {
      type: Function,
      default: undefined,
      require: false
    }
  },
  data() {
    return {
      top: 0,
      state: 0,
      startY: 0,
      touching: false,
      infiniteLoading: false
    }
  },
  methods: {
    infinite() {
      this.infiniteLoading = true
      this.onInfinite(this.infiniteDone)
    },
    infiniteDone() {
      this.infiniteLoading = false
    },
    onScroll(e) {
      console.log(e)
      if (!this.enableInfinite || this.infiniteLoading) {
        return
      }
      let outerHeight = this.$el.clientHeight
      let innerHeight = this.$el.querySelector('.inner').clientHeight
      let scrollTop = this.$el.scrollTop
      let ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-refresh').clientHeight : 0
      let infiniteHeight = this.$el.querySelector('.load-more').clientHeight
      let bottom = innerHeight - outerHeight - scrollTop - ptrHeight
      if (bottom < infiniteHeight) {
          this.infinite()
      }
    }
  }
}
</script>
<style>

</style>
