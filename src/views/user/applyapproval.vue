<template>
  <div class="applyapproval">
    <tab  custom-bar-width="100px">
      <tab-item selected @on-item-click="onItemClick">待审批</tab-item>
      <tab-item @on-item-click="onItemClick">已通过</tab-item>
      <tab-item @on-item-click="onItemClick">未通过</tab-item>
    </tab>
    <div class="scrollrows s-t-50" @scroll="scroller($event)">
      <group>
        <cell :link="'/user/applyapproval/'+item.id" v-for="(item , index) in list" :key="index">
          <div slot="title">
            <p class="font-size-16">{{item.userName}}<span class="font-size-14">{{item.phoneNumber}}</span></p>
          </div>
          <div slot="inline-desc">
            <p>{{item.locationAreaName}}</p>
            <p><span>{{item.supplierName}}</span> 总额度：<span class="gcolor">{{item.credit}}元</span></p>
            <p>{{item.createdDate.replace(/T/,' ')}}</p>
          </div>
        </cell>
      </group>
      <load-more tip="加载更多" v-show="loading"></load-more>
    </div>
  </div>
</template>

<script>
  import { Tab, TabItem, Group, Cell, LoadMore } from 'vux'
  export default {
    name: '',
    data () {
      return {
        state:0,
        loading:false,
        list:[],
        lastApplyId:''
      }
    },
    created(){
      this.getlist(this.state)
    },
    methods: {
      onItemClick (index) {
        this.state =index;
        this.list=[];
        this.lastApplyId='';
        this.getlist(index)
      },
      getlist(id){
        this.loading = true;
        let d = {
          state:id,
          lastApplyId:this.lastApplyId
        };
        let l = "mall/morecreditapply.do";
        this.$post(l,d,function(_t,r){
          _t.loading = false;
          var _list = r.data;
          _t.list = [..._t.list, ..._list];
          if (_list.length==0) {
            return;
          }
          if(_list.length!=0) {
            _t.lastApplyId = _list[_list.length - 1].id
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
          this.getlist(this.state)
        }
      },
    },
    components: {
      Tab,
      TabItem,
      Group,
      Cell,
      LoadMore
    }
  }
</script>
