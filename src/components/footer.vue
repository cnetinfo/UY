<template>
  <footer class="bottom-wrap bottom-bar-fixed footerbg">
    <nav class="bottom-bar-tab">
      <router-link :to="{path: menu.url}" class="cant-tab-item" v-for="(menu , index) in lists" :key="menu.name">
        <span class="icons" v-bind:class="menu.iconclass" style="position: relative;" ><span class="mui-badge" style="border-radius:50%; background-color: #FF7C43; width:6px; height: 6px; display: inline-block; position: absolute; right: 0px;" v-show="menu.hasmessage"></span></span>
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
            name:'首页',
            hasmessage:false,
          },
          {
            iconclass : "icon_nav_message",
            url:'/message',
            name:'消息',
            hasmessage:false,
          },
          {
            iconclass : "icon_nav_cart",
            url:'/shopcart',
            name:'购物车',
            hasmessage:false,
          },
          {
            iconclass : "icon_nav_user",
            url:'/user',
            name:'我的',
            hasmessage:false
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
        let d={};
        let link = "mall/checkunread.do";
        this.$post(link,d,function(_t,r){
           _t.$set(_t.lists[1],"hasmessage",r.data);
        });

        let link2 = "mall/cartcount.do";
        this.$post(link2,d,function(_t,r){
          if(r.data > 0){
            _t.$set(_t.lists[2],"hasmessage",true);
          }
        });
        this.badge = '2';
      },
    },
    components: {
      Tabbar,
      TabbarItem,
    }
  }
</script>

