<template>
  <div class="advance">
      <div class="linerows">当前账户余额(元) <span class="pull-right"><a @click="$router.push('/user/advancedetail?id='+yid)">明细</a></span></div>
      <div class="bg-white" style="padding:10px;">
        <span class="gcolor" style="font-size:36px;">
          <countup :start-val="0" :end-val="money" :decimals="2" :duration="2"></countup>
        </span>
      </div>
      <div class="linerows m-t-10">充值(元)</div>
      <div style="display: flex; ">
        <input type="text" v-model="amount" placeholder="请输入金额" maxlength="8" style="display: flex; border: none; width: 100%; padding:10px 10px;"/>
        <button style="display: flex; width:80px; justify-content: center; background: #FFFFFF; border: none; color:#FF7C43; " @click="pay">充值</button>
      </div>
  </div>
</template>

<script>
  import { Countup, XButton } from 'vux'
  export default {
    name: '',
    data () {
      return {
        yid:'',
        amount:'',
        money:0,
      }
    },
    created(){
      this.getInfo();
    },
    methods:{
      getInfo(){
        let d = {};
        let l = "mall/getmywallet.do";
        this.$post(l,d,function(_t,r){
          _t.yid =r.data.prepayAccountId;
          _t.money = r.data.prepayAccountBalance
        });
      },
      pay(){
        if(this.amount == ''){
          this.$vux.toast.text('请输入充值金额','middle');
          return
        }
        if(this.amount < 0){
          this.$vux.toast.text('请输入正常的充值金额','middle');
          return
        }
        var returnUrl =document.location.href.split('#')[0] +'#/user/advance';
        let d = {
          amount:this.amount,
          returnUrl:returnUrl
        };
        let l = "mall/rechargeprepayment.do";
        this.$post(l,d,function(_t,r){
          _t.$router.push('/pay?id='+r.data.payCode)
          //location.href =  _t.$store.state.basePath + "pay/pay.do?code="+r.data.payCode;
        });
      }

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

