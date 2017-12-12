<template>
  <div class="ticketdetail">
    <div class="scrollrows">
      <div class="linerows"><p>兑换中心</p></div>
      <div class="linerows" style="margin-top: 6px;">
        <a style="display:block"><img :src="ticketphoto" width="100%" align="top" /></a>
      </div>
      <div class="linerows m-t-10">
        商品兑换
      </div>
      <div style="display: flex; border-bottom: 1px solid #EEEEEE;">
        <input type="text" v-model="password" placeholder="请输入兑换密码" maxlength="20" style="display: flex; border: none; width: 100%; padding:15px 10px;"/>
        <button style="display: flex; width:80px; justify-content: center; background: #FF7C43; border: none; color:#FFFFFF; " @click="pay">确定</button>
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
        ticketphoto:'',
        password:'',
      }
    },
    created(){
      this.getInfo();
    },
    methods:{
      getInfo(){
        this.ticketphoto = this.$store.state.basePath+"ticket/promotionimg.do?id=" + this.$route.query.id;
      },
      pay(){
        if(this.password == ''){
          this.$vux.toast.text('请输入兑换密码','middle');
          return
        }
        let d = {
          promotionid:this.$route.query.id,
          password:this.password
        };
        let l = "ticket/verifyticket.do";
        this.$post(l,d,function(_t,r){
          _t.$router.push('/goods/exchange?id='+r.data.id);
        });
      }

    },
    components: {
      Countup,
      XButton
    }
  }
</script>

