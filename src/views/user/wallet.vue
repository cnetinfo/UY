<template>
  <div class="wallet">
    <group>
      <cell title="账户余额" link="/user/advance">
        <span class="pull-right gcolor">¥{{info.prepayAccountBalance}}</span>
      </cell>
      <cell title="我的银行卡" link="/user/banklist" v-show="false"></cell>
      <cell title="资金流水" :link="'/user/tradedetail?id='+info.moneyAccountId"></cell>
      <cell title="我的积分" link="/user/integral"></cell>
      <cell title="转账记录" link="/user/transferrecord"></cell>
    </group>
  </div>
</template>

<script>
  import { Group, Cell } from 'vux'
  import footerCommon from '../../components/footer.vue'
  export default {
    name: '',
    data () {
      return {
        info:'',
        balance:'',
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
          _t.info = r.data;
        });
      }
    },
    components: {
      footerCommon,
      Group,
      Cell
    }
  }
</script>


