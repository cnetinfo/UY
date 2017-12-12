<template>
  <div class="orderlist">
    <div class="post-top">
      <tab :line-width=2 active-color='#ff7c43' v-model="index">
        <tab-item :selected="nav == item" v-for="(item, index) in navlist" @on-item-click="onItemClick" :key="index">{{item}}</tab-item>
      </tab>
    </div>

    <div class="scrollrows s-t-50" @scroll="scroller($event)">
      <group class="m-b-5"  v-for="(item, index) in list" :key="index">
        <div class="grouptitle">
          <span class="font-size-14 gcolor">{{item.stateDesc}}</span>
          <span class="pull-right">{{item.orderPayDate.replace(/T/,' ')}}</span>
        </div>
        <cell :link="'/goods?id='+item.goodsSpecificationId">
          <div slot="inline-desc">
            <div style="display: flex">
              <span class="font-size-16" style="margin-right: 10px; display:flex">
                <img :src="item.goodsLogoUrl" width="60" height="60" />
              </span>
              <span style="width: 100%;">
                <p ><span class="font-size-14 bcolor twoline">{{item.goodsTitle}}</span></p>
                <p ><span class="font-size-12">订单编号：{{item.orderCode}}</span></p>
                <p class="m-t-5">
                  <span class="gcolor">实付款：¥{{item.groupbuyPrice}}</span>
                </p>
              </span>
            </div>
          </div>
        </cell>
        <div class="linerows" style="border-top: 1px solid #F1F1F1">
          <span class="font-size-14" v-if="Number(item.memberLimit-item.joinedNumber)==0" ><span class="ucolor">{{item.memberLimit}}</span>人团，已组团成功</span>
          <span class="font-size-14" v-else>{{item.memberLimit}}人团，还差<span class="ucolor">{{item.memberLimit-item.joinedNumber}}</span>人成团</span>
          <span class="pull-right">
            <button class="debtn" style="margin-top: -3px;" @click="$router.push('/groupbuy/detail?id='+item.groupId)">
              <span v-if="item.groupState==1">喊人参团</span>
              <span v-else>拼团详情</span>
            </button>
          </span>
        </div>
      </group>
      <load-more tip="正在加载" v-if="loading"></load-more>
      <load-more :show-loading="false" tip="暂无数据" background-color="#f6f6f6"  v-if="!loading"></load-more>
    </div>
  </div>
</template>

<script>
  import { Scroller, Tab, TabItem , Group, Cell, LoadMore} from 'vux'
  import login from '../../components/login.vue'
  export default {
    components: {
      Scroller,
      Tab,
      TabItem,
      Group,
      Cell,
      LoadMore,
      login
    },
    data () {
      return {
        list:[],
        navlist:['所有','等待成团','拼团成功','拼团失败'],
        datalist:[],
        nav: '所有',
        index: 0,
        loading:false,
        pending:false,
        state:'',
        lastOrderId:'',
        searchKey:'',
        pagestate:''
      }
    },
    created(){
      this.getlist()
    },
    methods: {
      onItemClick (index) {
        this.lastOrderId='';
        this.list = [];
        this.getlist(index)
      },
      getlist(type){
        if(type==0){
          type='';
        }
        this.pagestate = type;
        this.loading = true;
        this.pending = true;
        let d = {
          state:this.pagestate,
          lastjoinid:this.lastOrderId
        };
        let l = "mall/listmygroupbuy.do";
        this.$post(l,d,function(_t,r){
          _t.loading = false;
          _t.pending = false;
          var _list = r.data;
          _t.list = [..._t.list, ..._list];
          if (_list.length==0) {
            return;
          }
          if(_list.length!=0) {
            _t.lastOrderId = _list[_list.length - 1].id
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
          this.getlist(this.pagestate)
        }
      }
    },
  }
</script>
