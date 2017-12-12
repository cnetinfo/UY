<template>
  <div class="dealerdetail">
    <div class="scrollrows" @scroll="scroller($event)">
      <card>
        <div slot="content" class="card-demo-flex card-demo-content01">
          <div class="vux-1px-r">
            <span class="font-size-16 bcolor">{{info.shopName}}</span>
            <p><i class="icon_an_account_small"></i> 授权账户</p>
          </div>
          <div>
            <span class="font-size-16 bcolor">¥{{(info.credit-info.balance).toFixed(2)}}</span>
            <p><i class="icon_unit_price_small"></i> 已用额度</p>
          </div>
        </div>
      </card>

      <group class="m-t-10" v-for="(item , index) in list" :key="item.id">
        <div class="grouptitle">
          <span class="font-size-14">订单编号 {{item.dealNo}}</span>
          <span class="pull-right">{{item.createdDate.replace(/T/,' ')}}</span>
        </div>
        <cell :link="'/order/detail?id='+item.dealObjId">
          <div slot="inline-desc">
            <div style="display: flex">
            <span class="font-size-16" style="margin-right: 10px; display:flex">
              <img :src="item.dealImgUrl" width="60" height="60" />
            </span>
              <span>
              <p ><span class="font-size-14 bcolor twoline">{{item.notes}}</span></p>
              <p class="m-t-5">使用额度：<span class="gcolor">{{item.amount}}元</span></p>
            </span>
            </div>
          </div>
        </cell>
      </group>
      <load-more tip="正在加载" v-if="loading"></load-more>
    </div>
  </div>
</template>

<script>
  import { Group, CellBox, Cell, Card, LoadMore } from 'vux'
  export default {
    name: '',
    data () {
      return {
        pending:false,
        loading:false,
        lastFlowId:'',
        info:'',
        list:[]
      }
    },
    created(){
      this.getList();
      this.getaccountuser();
    },
    methods: {
      getList(){
        this.pending = true;
        this.loading = true;
        let d = {
          creditId:this.$route.query.id,
          lastFlowId:this.lastFlowId
        };
        let l = "mall/morecreditusedetail.do";
        this.$post(l,d,function(_t,r){
          _t.pending = false;
          _t.loading = false;
          var _list = r.data;
          _t.list = [..._t.list, ..._list]; //_t.productlist = r.data.goods;
          if (_list.length==0) {
            return;
          }
          if(_list.length!=0) {
            _t.lastFlowId = _list[_list.length - 1].id
          };
        });
      },
      getaccountuser(){
        let d = {
          id:this.$route.query.id
        };
        let l = "mall/getcreditpermitdetail.do";
        this.$post(l,d,function(_t,r){
          _t.info = r.data;
        });
      },
      scroller(event){
        var offsetHeight = event.currentTarget.offsetHeight
        var scrollHeight = event.target.scrollHeight
        var scrollTop = event.target.scrollTop
        var scrollBottom = offsetHeight + scrollTop
        if (scrollHeight === scrollBottom) {
          if(this.pending) {
            return;
          }
          this.getList()
        }
      }
    },
    components: {
      Group,
      CellBox,
      Cell,
      Card,
      LoadMore
    }
  }
</script>
