<template>
  <div class="ticketlist">
    <div class="linerows"><p>兑换中心</p></div>
    <div class="scrollrows s-t-50">
      <div class="linerows">
        <a class="m-b-5" style="display:block" @click="$router.push('ticket/detail?id='+'b8585c5f-31ff-43af-8d54-3b39a6068892')"><img src="../../assets/images/ticket.jpg" width="100%" align="top"  /></a>
        <a class="m-b-5" style="display:block" @click="$router.push('ticket/detail?id='+'b8585c5f-31ff-43af-8d54-3b39a6068892')"><img src="http://fs.51xnb.cn/634d9a79-7cf0-4e49-aff3-54add8bb723c.jpg" width="100%" align="top" /></a>
        <a class="m-b-5" style="display:block" @click="$router.push('ticket/detail?id='+'b8585c5f-31ff-43af-8d54-3b39a6068892')"><img src="http://fs.51xnb.cn/443d99e1-8ccc-4098-a125-186f52d6958d.jpg" width="100%" align="top" /></a>
      </div>
    </div>
  </div>
</template>

<script>
  import { Countup, XButton } from 'vux'
  export default {
    name: '',
    data () {
      return {
        password:'',
      }
    },
    created(){
      this.getList();
    },
    methods:{
      getList(){
        /*let d = {};
        let l = "mall/getticket.do";
        this.$post(l,d,function(_t,r){
        });*/
      },
    },
    components: {
      Countup,
      XButton
    }
  }
</script>

<style lang="scss">
  .noborder :before{ display: none !important;}
</style>

