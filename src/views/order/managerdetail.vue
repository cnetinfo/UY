<template>
  <div class="orderdetail">
    <div class="scrollrows s-b-50">
      <p class="text-center m-b-5 m-t-5"><span class="gcolor"><i class="icon_order_right" style="margin-bottom: 2px;"></i> {{data.stateDesc}}</span></p>
      <div class="bg-white m-b-10">
        <div class="pd-10">
          <p class="font-size-16">{{data.consigneeName}} {{data.consigneePhone}}</p>
          <p class="font-size-12">{{data.deliveryAddress}}</p>
        </div>
      </div>
      <group style="margin-top:1px;" v-for="(item, index) in data.goodsList" :key="index">
        <cell :link="'/goods?id='+item.goodsSpecificationId">
          <div slot="inline-desc">
            <div style="display: flex">
              <span class="font-size-16" style="margin-right: 10px; display:flex;">
                <img :src="item.goodsLogoUrl" width="60" height="60" />
              </span>
              <span style="width: 100%">
                <p ><span class="font-size-14 bcolor twoline">{{item.goodsTitle}}</span></p>
                <p class="m-t-5">
                  <span class="gcolor">¥{{item.barePrice}}</span>
                  <span class="pull-right">x{{item.number}}</span>
                </p>
              </span>
            </div>
          </div>
        </cell>
      </group>
      <div class="linerows font-size-12">
        <p><span>商品价格</span><span class="pull-right ucolor">¥ {{(data.amount-data.totalFreightFee).toFixed(2)}}</span></p>
        <p><span>运费</span><span class="pull-right ucolor">¥ {{data.totalFreightFee.toFixed(2)}}</span></p>
        <p><span>订单总额</span><span class="pull-right ucolor">¥ {{data.amount.toFixed(2)}}</span></p>
      </div>

      <div class="linerows m-t-10 font-size-12">
        <p><span>订单编号</span><span class="pull-right">{{data.code}}</span></p>
        <p><span>下单时间</span><span class="pull-right">{{settleDate}}</span></p>
        <p class="m-t-10"><span>付款方式</span><span class="pull-right">{{data.paymethodDesc}}</span></p>
        <p><span>在线支付</span><span class="pull-right ucolor">¥ {{(data.amount-data.usedPrepayment-data.usedCredit).toFixed(2)}}</span></p>
        <p><span>预付款</span><span class="pull-right ucolor">¥ {{data.usedPrepayment.toFixed(2)}}</span></p>
        <p><span>使用授信</span><span class="pull-right ucolor">¥ {{data.usedCredit.toFixed(2)}}</span></p>
      </div>

      <div class="linerows m-t-10 font-size-12" v-if="data.requestAmount">
        <p v-if="data.requestAmount"><span>申请退款金额</span><span class="pull-right ucolor">¥{{data.requestAmount | formatting}}</span></p>
        <p v-if="data.refundAcount"><span>退款方式</span><span class="pull-right ucolor">{{data.refundAcount}}</span></p>
        <p v-if="data.supplierConfirmedAmount"><span>商家退款金额</span><span class="pull-right ucolor">¥{{data.supplierConfirmedAmount | formatting}}</span></p>
        <p><span>退款商品</span><span class="pull-right ucolor">共 {{requestNumber}} 件</span></p>
      </div>

    </div>
    <div class="cartbottom">
        <span class="carttotal">
          <span class="font-size-14">订单总价:</span>
          <span class="gcolor">¥{{data.amount}}</span>
        </span>
        <span class="pull-right">
          <button class="colortbtn btnw100" @click="reminddeliver(data.orderId)" v-if="data.urgingDelivery ==1">发货提醒</button>
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
        data:'',
        settleDate:''
      }
    },
    created(){
      this.getdetail()
    },
    methods: {
      getdetail(){
        let d = {
          id:this.$route.query.id,
        };
        let l = "mall/getmydealerorderdetail.do";
        this.$post(l,d,function(_t,r){
          _t.data = r.data;
          _t.settleDate = r.data.settleDate.replace(/T/,' ');
        });
      },
      reminddeliver(id){
        let d = {
          orderId:id
        };
        let l = "mall/urgedelivery.do";
        this.$post(l,d,function(_t,r){
          _t.$vux.toast.text('提醒成功','middle');
          _t.getdetail();
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
              _t.$vux.toast.text('确认成功','middle');
              _t.getdetail();
            });
          }
        });
      }
    }
  }
</script>
