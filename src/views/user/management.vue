<template>
  <div class="management">
    <div class="scrollrows" @scroll="scroller($event)">
      <group>
        <cell :link="'/user/management/'+item.id" v-for="(item , index) in list" :key="item.id">
          <div slot="title">
            <p class="font-size-16">{{item.userName}} <span class="font-size-14">{{item.phoneNumber}}</span></p>
          </div>
          <div slot="inline-desc">
            <p>{{item.locationAreaName}}</p>
            <p><span>{{item.shopName}}</span> 总额度：<span class="gcolor">{{item.credit}}元</span></p>
          </div>
        </cell>
      </group>
      <load-more tip="加载更多" v-show="loading"></load-more>
    </div>
  </div>
</template>

<script>
  import { Group, Cell, LoadMore } from 'vux'
  export default {
    name: '',
    data () {
      return {
        loading:false,
        list:[],
        lastAccountId:''
      }
    },
    created(){
      this.getlist()
    },
    methods: {
      getlist(){
        this.loading = true;
        let d = {
          lastAccountId:this.lastAccountId
        };
        let l = "mall/morecreditaccount.do";
        this.$post(l,d,function(_t,r){
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
      Cell,
      LoadMore
    }
  }
</script>
