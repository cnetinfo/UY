<template>
  <div class="managercredit">
    <div class="scrollrows">
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
            <p><button class="smallbtn colorborder" @click="$router.push('/user/particulars?id='+item.id)"><i class="icon_detail_small"></i> 明细</button></p>
          </div>
        </cell>
      </group>
      <group class="m-t-10">
        <cell title="申请审批" link="/user/applyapproval"></cell>
        <cell title="授信管理" link="/user/management"></cell>
      </group>
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
