<template>
  <div id="app" :class="skin" >
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data(){
      return{
        skin:'custom-skin'
      }
    },
  }
</script>

<style lang="scss">
  @import 'assets/css/style.scss';
</style>
