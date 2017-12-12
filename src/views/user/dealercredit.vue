<template>
  <div class="dealercredit">
    <div class="scrollrows" v-if="list.length!=0">
      <group>
        <cell v-for="(item , index) in list" :key="item.id">
          <div slot="title">
            <p class="font-size-16">{{item.shopName}}</p>
          </div>
          <div slot="inline-desc">
            <p>授信额度：<span class="gcolor">{{item.credit}}元</span></p>
            <p>可用额度：<span class="gcolor">{{item.balance}}元</span></p>
          </div>
          <div slot="value">
            <p><button class="smallbtn colorborder" @click="$router.push('/user/orderdetail?id='+item.id)"><i class="icon_detail_small"></i> 明细</button></p>
            <p class="m-t-5"><button class="smallbtn colorborder" @click="$router.push('/user/repayment?id='+item.id)"><i class="icon_reimbursement_small"></i> 还款</button></p>
          </div>
        </cell>
      </group>
      <p class="mg-10 m-t-50"><button class="colortbtn" @click="$router.push('/user/applycredit')">申请授信</button></p>
    </div>

    <div class="text-center post-center" v-else>
      <p><img src="../../assets/images/credit-icon.png" width="100"/></p>
      <p><span class="greycolor m-t-10">您当前没有授信账户</span></p><br>
      <button class="defaultbtn colorborder m-t-10" @click="$router.push('/user/applycredit')">申请授信</button>
    </div>
  </div>
</template>

<script>
  import { Group, Cell, XInput } from 'vux'
  export default {
    name: '',
    data () {
      return {
        list:[]
      }
    },
    created(){
      this.getlist()
    },
    methods: {
      getlist(){
        let d = {};
        let l = "mall/getmycreditinfo.do";
        this.$post(l,d,function(_t,r){
          _t.list = r.data.credits;
        });
      }
    },
    components: {
      Group,
      Cell,
      XInput
    }
  }
</script>
