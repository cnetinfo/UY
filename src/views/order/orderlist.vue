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
          <span class="font-size-14">订单编号 {{item.code}}</span>
          <span class="pull-right gcolor">
            <button class="smallbtn" style="padding:0px 5px;" @click="deleteOrder(index,item.id)" v-if="item.state==1||item.state==5">
              <i class="icon-delete"></i>
            </button>
            <button class="smallbtn" style="padding:0px 5px;" v-else></button>
          </span>
        </div>
        <cell :link="'/order/detail?id='+item.id">
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
          <span v-if="item.activityType==602">共 {{item.goodsNumber}} 件商品  合计： <b class="ucolor">{{item.amount}}积分</b></span>
          <span v-else>共 {{item.goodsNumber}} 件商品  合计：<b class="ucolor">&yen;{{item.amount}}</b></span>
          <span class="pull-right" style="margin:-4px 0px 0px 10px;">
            <button class="debtn" v-if="item.state==1" @click="gopay(item.id)">付 款</button>
            <button class="debtn" v-if="item.showRefund" @click="refund(item.id)">退 款</button>
            <button class="debtn" v-if="item.state==3" @click="receipt(item.id)">确认收货</button>
         </span>
        </div>
      </group>
      <load-more tip="正在加载" v-if="loading"></load-more>
      <load-more :show-loading="false" tip="暂无数据" background-color="#f6f6f6"  v-if="!loading"></load-more>
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
        navlist:['所有','待支付','待发货','待签收','已完成'],
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
          this.nav = "待支付"
        }else if(ids ==2){
          this.nav = "待发货"
        }else if(ids ==3){
          this.nav = "待签收"
        }else if(ids ==4){
          this.nav = "已完成"
        }
      },
      onItemClick (index) {
        this.lastOrderId='';
        this.list = [];
        this.getlist(index)
      },
      getlist(type){
        if(type==0){
          var state ='';
        }else if(type==1){
          var state = 2;
        }else if(type==2){
          var state = 3;
        }else if(type==3){
          var state = 4;
        }else if(type==4){
          var state = 5;
        }else if(type==5){
          var state = 6;
        }
        this.pagestate = type;
        this.loading = true;
        this.pending = true;
        let d = {
          state:state,
          lastOrderId:this.lastOrderId,
          keywords:this.searchKey
        };
        let l = "mall/myordersinsuppliermall.do";
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
      deleteOrder(index,id){
        let d = {
          orderId:id
        };
        let l = "mall/delete.do";
        var that = this;
        this.$vux.confirm.show({
          title: '',
          content: '是否删除该订单？',
          confirmText:'是',
          cancelText:'否',
          onConfirm () {
            that.$post(l,d,function(_t,r){
              _t.$vux.toast.text('删除成功','middle');
              _t.list.splice(index,1);
            });
          }
        });
      },
      refund(id){
        this.$router.push("/order/refund?id="+id);
      },
      gopay(id){
        var returnUrl =document.location.href.split('#')[0] +'#/order?type=2';
        let d = {
          orderId:id,
          returnUrl:returnUrl
        };
        let l = "mall/pay4web.do";
        this.$post(l,d,function(_t,r){
          if(r.data!=undefined){
            if(r.directpay=='yes'){
              location.href =  _t.$store.state.basePath + "pay/pay.do?code="+r.data;
            }else{
              _t.$router.push('/pay?id='+r.data)
            }
          }
        });
      },
      receipt(id){
        let returnUrl =document.location.href.split('#')[0] +'#/order?type=3';
        let d = {
          orderId:id,
          returnUrl:returnUrl
        };
        let l = "mall/receiveAndPay.do";
        var that = this;
        this.$vux.confirm.show({
          title: '',
          content: '确认收到货物？',
          confirmText:'确认',
          cancelText:'取消',
          onConfirm () {
            that.$post(l,d,function(_t,r){
              if(r.data!=undefined){
                location.href =  _t.$store.state.basePath + "pay/pay.do?code="+r.data;
              }else{
                _t.$vux.toast.show({
                  text: '确认成功',
                  type: 'success',
                  onHide () {
                    location.reload();
                  }
                });
              }
            });
          }
        });
      },
      scroller(event){
        var offsetHeight = event.currentTarget.offsetHeight
        var scrollHeight = event.target.scrollHeight
        var scrollTop = event.target.scrollTop
        var scrollBottom = offsetHeight + scrollTop;
        if (scrollHeight === scrollBottom+1) {

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
