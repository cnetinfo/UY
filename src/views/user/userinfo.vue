<template>
  <div class="userinfo">
    <div class="scrollrows s-b-50">
      <div class="user-bg">
        <span class="user-set" style="display:none;">
          <a class="icon_set"></a>
        </span>
        <span class="userimg">
          <img :src="info.logoUrl" width="70" height="70">
        </span>
        <p>{{info.networkName}}</p>
        <p>{{info.phoneNumber}}<a class="icon_setphone" @click="setnewphone"></a></p>
      </div>

      <div class="noborder bg-white">
        <div class="linerows linerowsbg">我的订单</div>
        <grid :rows="4">
          <grid-item label="待付款" link="/order?type=1">
            <img slot="icon" src="../../assets/images/order-1.png">
            <badge :text="orderstate.waitForPayOrderCount" v-show="waitForPayOrder"  style="position:absolute; right:20px; top:10px;"></badge>
          </grid-item>
          <grid-item label="待发货" link="/order?type=2">
            <img slot="icon" src="../../assets/images/order-2.png">
            <badge :text="orderstate.waitForShippingOrderCount" v-show="waitForShipping" style="position:absolute; right:20px; top:10px;"></badge>
          </grid-item>
          <grid-item label="待签收" link="/order?type=3">
            <img slot="icon" src="../../assets/images/order-3.png">
            <badge :text="orderstate.deliveringOrderCount" v-show="delivering" style="position:absolute; right:20px; top:10px;"></badge>
          </grid-item>
          <grid-item label="已完成" link="/order?type=4">
            <img slot="icon" src="../../assets/images/order-4.png">
          </grid-item>
        </grid>
      </div>

      <group class="font-size-14 m-t-10">
        <cell title="我的钱包" link="/user/wallet">
          <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/images/user-wallet.png">
        </cell>
        <cell title="区域订单" link="/order/manager" v-if="info.userType==2">
          <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/images/user-order.png">
        </cell>
        <cell title="我的授信" link="/user/dealercredit" v-if="info.userType==1"> <!--(经销商)-->
          <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/images/user-credit.png">
        </cell>
        <cell title="我的授信" link="/user/managercredit" v-if="info.userType==2"> <!--(区域经理)-->
          <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/images/user-credit.png">
        </cell>
        <cell title="转账审核" link="/user/transfer" v-if="role==true">
          <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/images/user-transfer.png">
        </cell>
        <cell title="收货地址" link="/user/address">
          <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/images/user-address.png">
        </cell>
        <cell title="问题反馈" link="/user/faq">
          <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/images/user-feek.png">
        </cell>
        <cell title="报表查看" link="/user/reportforms" v-if="info.reportView==1">
          <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/images/user-statement.png">
        </cell>
      </group>

    </div>
    <modifyphone v-show="isupdatephone"></modifyphone>
    <login v-show="islogin"></login>
    <footer-common></footer-common>
  </div>
</template>

<script>
  import { Group, Cell, Grid, GridItem, Badge } from 'vux'
  import login from '../../components/login.vue'
  import modifyphone from '../../components/modifyphone.vue'
  import footerCommon from '../../components/footer.vue'
  export default {
    name: '',
    data () {
      return {
        info:'',
        waitForPayOrder:false,
        waitForShipping:false,
        delivering:false,
        backing:false,
        isupdatephone:false,
        islogin:false,
        orderstate:'',
        role:false,

      }
    },
    created(){
      this.getInfo();
      this.getisFinicalRole();
      this.getOrdercount();
    },
    methods:{
      getInfo(){
        let d = {};
        let l = "mall/getuserinfo.do";
        this.$post(l,d,function(_t,r){
          _t.info = r.data
        },function(_t,r){
          _t.islogin = true;
        });
      },
      getisFinicalRole(){
        let d = {};
        let l = "mall/isFinicalRole.do";
        this.$post(l,d,function(_t,r){
          _t.role = r.data
        });
      },
      getOrdercount(){
        let d = {};
        let l = "mall/mallordercount.do";
        this.$post(l,d,function(_t,r){
          _t.orderstate=r.data;
          if(r.data.waitForPayOrderCount>0){
            _t.waitForPayOrder = true;
          }
          if(r.data.waitForShippingOrderCount>0){
            _t.waitForShipping = true;
          }
          if(r.data.deliveringOrderCount>0){
            _t.delivering = true;
          }
          if(r.data.refundOrderCount>0){
            _t.backing = true;
          }
        },function(_t,r){
          _t.islogin = true;
        });
      },
      setnewphone(){
        this.isupdatephone = true;
      }
    },
    components: {
      login,
      modifyphone,
      footerCommon,
      Group,
      Cell,
      Grid,
      GridItem,
      Badge
    }
  }
</script>

<style lang="scss">
  .noborder :before{ display: none !important;}
</style>

