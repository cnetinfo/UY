<template>
  <div class="repayment">
    <group>
      <x-input title="还款人" text-align="right" :readonly="true" v-model="info.userName"></x-input>
      <x-input title="手机号" text-align="right" :readonly="true" v-model="info.phoneNumber"></x-input>
      <x-input title="所在区域" text-align="right" :readonly="true" v-model="info.locationAreaName"></x-input>
      <x-input title="授信账户" text-align="right" :readonly="true" v-model="info.shopName"></x-input>
      <x-input title="还款金额" placeholder="请输入还款金额" v-model="amount" text-align="right"></x-input>
    </group>
    <p class="m-t-10"><a @click="record" class="m-r-5 font-size-14 gcolor pull-right">还款记录>></a></p>
    <p class="mg-10 m-t-50">
      <button class="colortbtn" @click="pay">确 定</button>
    </p>
  </div>
</template>

<script>
  import { Group, XInput } from 'vux'
  export default {
    name: '',
    data () {
      return {
        info:'',
        amount:''
      }
    },
    created(){
      this.getaccountuser();
    },
    methods:{
      getaccountuser(){
        let d = {
          id:this.$route.query.id
        };
        let l = "mall/getcreditpermitdetail.do";
        this.$post(l,d,function(_t,r){
          _t.info = r.data;
          _t.amount = (r.data.credit - r.data.balance).toFixed(2);
        });
      },
      pay(){
        if(this.amount == ''){
          this.$vux.toast.text('请输入还款金额','middle');
          return
        }
        if(this.amount < 0){
          this.$vux.toast.text('请输入正常的还款金额','middle');
          return
        }
        var urlid = this.$route.query.id;
        var returnUrl = document.location.href.split('#')[0] +'#/user/repayment?id='+ urlid;
        let d = {
          creditId:this.$route.query.id,
          amount:this.amount,
          returnUrl:returnUrl
        };
        let l = "mall/repaycredit.do";
        this.$post(l,d,function(_t,r){
          _t.$router.push('/pay?id='+r.data.payCode);
          //location.href =  _t.$store.state.basePath + "pay/pay.do?code="+r.data.payCode;
        });
      },
      record(){
        this.$router.push('/user/repaymentdetail?id='+this.$route.query.id)
      },
    },
    components: {
      Group,
      XInput
    }
  }
</script>
