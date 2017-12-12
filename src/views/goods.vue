<template>
  <router-view></router-view>
</template>
<script type="text/babel">
  export default {
    created(){
      var wx = this.$wechat;
      wx.ready(()=>{
        wx.showOptionMenu();
      });
    }
  }
</script>
