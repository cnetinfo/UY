<template>
  <footer class="bottom-wrap bottom-bar-fixed footerbg">
    <nav class="bottom-bar-tab">
      <router-link :to="{path: menu.url}" class="cant-tab-item" v-for="(menu , index) in lists" :key="menu.name">
        <span class="icons" v-bind:class="menu.iconclass" ><span class="mui-badge" style="display:none;"></span></span>
        <span class="bottom-tab-label">{{menu.name}}</span>
      </router-link>
    </nav>
  </footer>
</template>

<script>
  import { Tabbar, TabbarItem } from 'vux'
  export default {
    data(){
      return{
        lists:[
          {
            iconclass : "icon_nav_home",
            url:'/',
            name:'首页'
          },
          {
            iconclass : "icon_nav_message",
            url:'/groupbuy',
            name:'今日拼团'
          },
          {
            iconclass : "icon_nav_cart",
            url:'/groupbuy/groupall',
            name:'所有拼团'
          },
          {
            iconclass : "icon_nav_user",
            url:'/groupbuy/spellorder',
            name:'我的拼团'
          }
        ],
        show:true,
        badge:""
      }
    },
    created(){
        this.getShopcartCount();
    },
    methods:{
      getShopcartCount(){
        this.badge = '2';
      },
    },
    components: {
      Tabbar,
      TabbarItem,
    }
  }
</script>
<style lang="scss" scoped>
  .footerbg{
    .icons{ background:url(../assets/images/group-nav-icon1.png) no-repeat; background-size:100px 50px; width: 25px; height: 25px; display: inline-block; vertical-align: middle;}
    .icon_nav_home{ background-position: 0px 0px;}
    .icon_nav_message{ background-position:-23px 0px;}
    .icon_nav_cart{ background-position:-45px 0px;}
    .icon_nav_user{ background-position:-70px 0px;}
    .router-link-exact-active .icon_nav_home{ background-position:0px -25px;}
    .router-link-exact-active .icon_nav_message{ background-position:-23px -25px;}
    .router-link-exact-active .icon_nav_cart{ background-position:-45px -25px;}
    .router-link-exact-active .icon_nav_user{ background-position:-70px -25px;}
    .router-link-exact-active .bottom-tab-label{color: #e02e24}
  }
</style>
