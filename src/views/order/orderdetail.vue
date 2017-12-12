<template>
  <div class="orderdetail" v-show="show">
    <div class="scrollrows s-b-50">
      <p class="text-center m-b-5 m-t-5">
        <span class="gcolor">
          <i class="icon_order_right" style="margin-bottom: 2px;"></i>
          <span>{{data.statusDesc}}</span>
        </span>
      </p>
      <div class="bg-white m-b-10">
        <div class="pd-10">
          <p class="font-size-16">{{data.userName}} {{data.phone}}</p>
          <p class="font-size-12">{{data.address}}</p>
        </div>
      </div>
      <!--<div v-for="(item, index) in datalist" :key="index" v-show="nav == navlist[index]" >-->
      <group style="margin-top:1px;" v-for="(item, index) in data.orderGoodsList" :key="index">
        <cell :link="data.activityType=='602'?'':'/goods?id='+item.goodsSpecificationId">
          <div slot="inline-desc">
            <div style="display: flex">
              <span class="font-size-16" style="margin-right: 10px; display:flex;">
                <img :src="item.url" width="60" height="60" />
              </span>
              <span style="width: 100%">
                <p ><span class="font-size-14 bcolor twoline">{{item.title}}</span></p>
                <p class="m-t-5">
                  <span class="gcolor">{{item.specificationDesc}}</span>
                </p>
                <p class="m-t-5">
                  <span class="gcolor">{{mark}}{{item.barePrice}}</span>
                  <span class="pull-right">x{{item.number}}</span>
                </p>
              </span>
            </div>
          </div>
        </cell>
      </group>
      <div class="linerows font-size-12">
        <p><span>商品价格</span><span class="pull-right ucolor">{{mark}} {{(data.amount-data.totalFreightFee) | formatting}}</span></p>
        <p><span>运费</span><span class="pull-right ucolor">{{mark}} {{data.totalFreightFee | formatting}}</span></p>
        <p><span>订单总额</span><span class="pull-right ucolor">{{mark}} {{data.amount | formatting}}</span></p>
      </div>

      <div class="linerows m-t-10 font-size-12">
        <p><span>订单编号</span><span class="pull-right">{{data.orderCode}}</span></p>
        <p><span>下单时间</span><span class="pull-right">{{settleDate}}</span></p>
        <p class="m-t-10"><span>付款方式</span><span class="pull-right">{{data.paymethodDesc}}</span></p>
        <p v-if="data.activityType!='602'"><span>在线支付</span><span class="pull-right ucolor">{{mark}} {{(data.amount-data.usedPrepayment-data.usedCredit) | formatting}}</span></p>
        <p v-if="data.activityType!='602'"><span>预付款</span><span class="pull-right ucolor">{{mark}} {{data.usedPrepayment | formatting}}</span></p>
        <p v-if="data.activityType!='602'"><span>使用授信</span><span class="pull-right ucolor">{{mark}}{{data.usedCredit | formatting}}</span></p>
      </div>

      <div class="linerows m-t-10 font-size-12" v-if="data.requestAmount">
        <p v-if="data.requestAmount"><span>申请退款金额</span><span class="pull-right ucolor">{{mark}}{{data.requestAmount | formatting}}</span></p>
        <p v-if="data.refundAcount"><span>退款方式</span><span class="pull-right ucolor">{{data.refundAcount}}</span></p>
        <p v-if="data.supplierConfirmedAmount"><span>商家退款金额</span><span class="pull-right ucolor">{{mark}}{{data.supplierConfirmedAmount | formatting}}</span></p>
        <p><span>退款商品</span><span class="pull-right ucolor">共 {{requestNumber}} 件</span></p>
      </div>

    </div>
    <div class="cartbottom">
        <span class="carttotal">
          <span class="font-size-14">订单总价:</span>
          <span class="gcolor">{{mark}} {{data.amount}}</span>
        </span>
        <span class="pull-right">
          <button class="colortbtn btnw100" @click="gopay(data.orderId)" v-if="data.orderStatus==1">去 支 付</button>
          <button class="colortbtn btnw100" @click="receipt(data.orderId)" v-if="data.orderStatus==3">确认收货</button>
          <!--<button class="colortbtn btnw100" v-if="data.orderStatus==5" @click="$router.push('/order/comment?id='+data.orderId)">评 价</button> -->
        </span>
    </div>
  </div>
</template>

<script>
  import {Group, Cell} from 'vux'
  export default {
    components: {
      Group,
      Cell,
    },
    data () {
      return {
        show:false,
        mark:"¥",
        data:'',
        settleDate:'',
        requestNumber:0,
      }
    },
    created(){
      this.getdetail()
    },
    methods: {
      getdetail(){
        let d = {
          orderId:this.$route.query.id,
        };
        let l = "mall/detail.do";
        this.$post(l,d,function(_t,r){
          _t.data = r.data;
          _t.show = true;
          if(r.data.activityType==602){
            _t.mark = "积分"
          }
          _t.settleDate = r.data.settleDate.replace(/T/,' ');

          r.data.orderGoodsList.forEach(function(item){
              _t.requestNumber += Number(item.requestNumber)
          })
        });
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
            _t.$router.push('/pay?id='+r.data)
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
      }
    },
    filters:{
      formatting:function(val){
        var lastval =  Number(val).toFixed(2);
        return lastval;
      },
    }
  }
</script>
