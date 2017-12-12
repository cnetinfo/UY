<template>
  <div class="orderlist">
    <div class="post-top">
      <div  class="searchBar">
        <input type="text" v-model="searchKey" placeholder="请输入关键词">
        <button @click="searchOrder">搜 索</button>
      </div>
      <tab :line-width=2 active-color='#ff7c43' v-model="index">
        <tab-item :selected="nav == item" v-for="(item, index) in navlist" @on-item-click="onItemClick" :key="index">{{item}}</tab-item>
      </tab>
    </div>

    <div class="scrollrows s-t-100" @scroll="scroller($event)">
      <group class="m-b-5"  v-for="(item, index) in list" :key="index">
        <div class="grouptitle">
          <span class="font-size-14">订单编号 {{item.code}}</span>
          <span class="pull-right gcolor">{{item.stateDesc}}</span>
        </div>
        <cell :link="'/order/managerdetail?id='+item.id">
          <div slot="inline-desc">
            <div style="display: flex">
              <span class="font-size-16" style="margin-right: 10px; display:flex">
                <img :src="item.firstGoodsUrl" width="60" height="60" />
              </span>
              <span style="width: 100%;">
                <p ><span class="font-size-14 bcolor twoline">{{item.goodsTitles}}</span></p>
              </span>
            </div>
          </div>
        </cell>
        <div class="linerows" style="border-top: 1px solid #F1F1F1">
          <button class="smallbtn" style="padding:0px 5px;"></button>
          <span class="pull-right">共 {{item.goodsNumber}} 件商品  合计：¥ <b class="ucolor">{{item.amount}}</b></span>
        </div>
        <span class="pull-right" style="margin:8px; margin-right:10px; display: none;">
          <button class="debtn" v-if="item.state==2" @click="deliver(item.id)">确认发货</button>
         </span>
      </group>
      <load-more tip="正在加载" v-if="loading"></load-more>
      <p v-if="!loading" class="text-center font-size-12 greycolor">没有相关订单~</p>
    </div>
  </div>
</template>

<script>
  import { Tab, TabItem , Group, Cell, LoadMore} from 'vux'
  import login from '../../components/login.vue'
  export default {
    components: {
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
        navlist:['所有','已付款','已发货','已收货'],
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
      this.init();
      this.getlist(this.$route.query.type)
    },
    methods: {
      init(){
        var ids = this.$route.query.type;
        if(ids ==0 || ids==undefined){
          this.nav = "所有"
        }else if(ids ==1){
          this.nav = "已付款"
        }else if(ids ==2){
          this.nav = "货到付款"
        }else if(ids ==3){
          this.nav = "已发货"
        }else{
          this.nav = "已收货"
        }
      },
      onItemClick (index) {
        this.lastOrderId='';
        this.list = [];
        this.getlist(index)
      },
      searchOrder(){
        this.lastOrderId='';
        this.list = [];
        this.getlist(this.pagestate)
      },
      getlist(type){
        if(type==0){
          var state ='';
        }else if(type==1){
          var state = 2;
        }else if(type==3){
          var state = 3;
        }else if(type==4){
          var state = 5;
        }
        this.pagestate = type;
        this.loading = true;
        this.pending = true;
        let d = {
          state:state,
          lastOrderId:this.lastOrderId,
          keywords:this.searchKey
        };
        let l = "mall/listmydealerorders.do";
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
      deliver(id){
        let d = {
          orderId:id
        };
        let l = "mall/deliverymydealerorder.do";
        var that = this;
        this.$vux.confirm.show({
          title: '',
          content: '是否已经对该订单进行发货处理？',
          confirmText:'确认',
          cancelText:'取消',
          onConfirm () {
            that.$post(l,d,function(_t,r){
              _t.$vux.toast.show({
                text: '确认成功',
                type: 'success',
                onHide () {
                  location.reload();
                }
              });
            });
          }
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
    watch: {
      '$route':'getlist'
    },
  }
</script>
