<template>
  <div class="applyapproval">
    <tab  custom-bar-width="100px">
      <tab-item selected @on-item-click="onItemClick">待审核</tab-item>
      <tab-item  @on-item-click="onItemClick">已审核</tab-item>
    </tab>
    <div class="scrollrows s-t-50" @scroll="scroller($event)">
      <group>
        <cell :link="'/user/transfer/'+item.id" v-for="(item , index) in list" :key="item.id">
          <div slot="title">
            <p class="font-size-16"><span>{{item.supplierName}}</span> <span class="gcolor">{{item.amount}}元</span> {{item.nickName?'至'+item.nickName:''}}</p>
          </div>
          <div slot="inline-desc">
            <p >{{item.name}} <span class="font-size-14">{{item.phoneNumber}}</span> <span></span></p>
            <p>{{item.createDate.replace(/T/,' ')}}</p>
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
        loading:false,
        state:'',
        list:[],
        lastApplyId:''
      }
    },
    created(){
      this.state = 1
      this.getlist(this.state)
    },
    methods: {
      onItemClick (index) {
        this.list = [];
        this.lastApplyId='';
        if(index == 0){
          this.state = 1;
          this.getlist(1)
        }else{
          this.state = 0;
          this.getlist(0)
        }
      },
      getlist(id){
        this.loading = true;
        let d = {
          state:id,
          last:this.lastApplyId
        };
        let l = "mall/queryTransferPage.do";
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
    watch: {
      '$route':'getlist'
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
