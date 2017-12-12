<template>
  <div class="refundorder" v-show="show">
    <div class="scrollrows">
      <group v-for="(item, index) in data.orderGoodsList" :key="index">
        <cell>
          <div slot="inline-desc">
            <div style="display: flex">
              <span class="font-size-16" style="margin-right: 10px; display:flex;">
                <img :src="item.url" width="60" height="60" @click='$router.push("/goods?id="+item.goodsSpecificationId)' />
              </span>
              <span style="width: 100%">
                <p @click='$router.push("/goods?id="+item.goodsSpecificationId)'><span class="font-size-14 bcolor twoline">{{item.title}}</span></p>
                <p><span class="gcolor">{{item.specificationDesc}}</span></p>
                <p>
                  <span class="gcolor">{{mark}}{{item.barePrice}}</span>
                  <span class="pull-right">
                    <x-number v-model="item.number" :min="0" :max="refundmax[index]" :fillable="true" style="padding:0 !important; margin-top:-10px;"></x-number>
                  </span>
                </p>
              </span>
            </div>
          </div>
        </cell>
      </group>
      <div class="linerows font-size-12" style="margin-top: 1px;">
        <p><span>预计退款金额</span><span class="pull-right ucolor">{{totalPrice | formatting}}</span></p>
        <p><span>最终退款金额以实际退款为准</span></p>
        <p class="m-t-10"><span>退款原因（必填）</span></p>
        <group>
          <x-textarea placeholder="请输入退款申请理由（200字内）" style="padding: 0px !important; font-size: 12px;" v-model="reason" :show-counter="true" :max="200" :rows="3"></x-textarea>
        </group>
      </div>
      <p class="mg-10 m-t-50"><button class="colortbtn" @click="subapply">提 交</button></p>
    </div>
  </div>
</template>

<script>
  import {Group, Cell , XTextarea, XNumber} from 'vux'
  export default {
    components: {
      Group,
      Cell,
      XTextarea,
      XNumber
    },
    data () {
      return {
        show:false,
        mark:"¥",
        data:'',
        settleDate:'',
        reason:'',
        refundmax:[]
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
          r.data.orderGoodsList.forEach(function(item){
            _t.refundmax.push(item.number)
          });
          _t.show = true;
          if(r.data.activityType==602){
            _t.mark = "积分"
          }
          _t.settleDate = r.data.settleDate.replace(/T/,' ');
        });
      },
      subapply(){
        let l = "mall/submitMallRefund.do";
        if(this.reason == ''){
            this.$vux.toast.show({
            text: '请输入您的退款原因~',
            type:'cancel',
            width:'12em'
          });
            return
        };
        var orderGoodsIds ='';
        var goodCount ='';
        this.data.orderGoodsList.forEach(function(item){
          if(orderGoodsIds.length > 0){
            orderGoodsIds += ',';
          }
          orderGoodsIds += item.goodsId;
          if(goodCount.length>0){
            goodCount += ',';
          }
          goodCount += item.number;
        });
        let d = {
          orderId:this.$route.query.id,
          orderGoodsIds:orderGoodsIds,
          goodCount:goodCount,
          amount:this.totalPrice,
          reason:this.reason,
        };
        this.$post(l,d,function(_t,r){
          _t.$vux.toast.show({
            text: '申请成功~',
            onHide () {
              _t.$router.go(-1);
            }
          });
        });
      },
    },
    computed:{
      totalPrice:function(){
        var total = 0;
        if(this.data!=''){
          this.data.orderGoodsList.forEach(function(item){
            total += item.barePrice * (item.erpUnitsConversion?item.erpUnitsConversion:1) * item.number;
          });
        }
        return total;
      },
    },
    filters:{
      formatting:function(val){
        var lastval =  Number(val).toFixed(2) + '元';
        return lastval;
      },
    }
  }
</script>
