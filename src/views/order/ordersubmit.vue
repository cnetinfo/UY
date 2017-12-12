<template>
  <div class="ordersubmit">
    <div class="scrollrows s-b-50">
      <div class="bg-white m-b-10">
        <div class="linerows">
          <span class="font-size-14">收货详情</span>
        </div>
        <div class="pd-10" v-if="info" @click="goaddress(1)">
          <p class="font-size-16">{{info.contactName}} {{info.contactPhone}}</p>
          <p class="font-size-12">{{province}}{{city}}{{county}}{{street}}{{info.address}}</p>
        </div>
        <div class="pd-10" v-else>
          <p class="font-size-16 text-center" @click="goaddress()">+添加地址</p>
        </div>
      </div>
      <div v-for="(item, index) in orderlist" :key="index">
        <div class="linerows" style="border-bottom: none;" v-if="item.supplier">
          <span class="font-size-14">{{item.supplier}}</span>
        </div>
        <group v-for="(childitem, childindex) in item.goodsList" :key="index">
          <cell >
            <div slot="inline-desc">
              <div style="display: flex">
                <span class="font-size-16" style="margin-right: 10px; display:flex">
                  <img :src="childitem.logoUrl" width="60" height="60" />
                </span>
                <span style="width:100%;">
                  <p><span class="font-size-14 bcolor twoline">{{childitem.goodsTitle}}</span></p>
                  <p><span class="greycolor">{{childitem.specDesc}}</span></p>
                  <p class="m-t-5">
                    <span class="gcolor">&yen;{{childitem.price}}</span>
                    <span class="pull-right">x{{childitem.number}}</span>
                  </p>
                </span>
              </div>
            </div>
          </cell>
          <div class="linerows" style="border-top: 1px solid #F1F1F1" v-if="childitem.freightFee">
            <span>运费: &yen; {{childitem.freightFee}}</span>
            <span class="pull-right">小计：&yen; <b class="ucolor">{{childitem.amount}}</b></span>
          </div>
        </group>
      </div>

      <div class="linerows m-t-10" v-if="prepaymentAmount">
        <span class="font-size-14">
          <span style="border:1px solid #FF7C43; padding: 2px 4px; display:inline-block; height: 10px; line-height: 10px;">
            <i class="icon_reimbursement_small" ></i>
          </span>
          预付款 可用余额：
        </span>
        <span class="gcolor">&yen;{{prepaymentAmount}}</span>
        <button class="icon_select pull-right" :class="{select:usePrepayment==1}"  @click="selectPrepay" ></button>
      </div>

      <div class="m-t-10" v-if="creditPermits.length!=0">
        <div class="linerows">
          <span class="font-size-14">授信账户</span>
        </div>
        <div class="linerows" v-for="(item, index) in creditPermits">
          <span class="font-size-14">{{item.supplier}} 可用余额：</span>
          <span class="gcolor">&yen;{{item.balance}}</span>
          <button class="icon_select pull-right" :class="{select:item.usedAmount!=undefined&&item.usedAmount>0}" @click="selectCredit(item,index)"></button>
        </div>
      </div>

      <group class="m-t-10">
        <x-textarea title="买家留言" placeholder="请填写您的反馈内容" v-model="comment" :show-counter="true" :max="50" :rows="3"></x-textarea>
      </group>

    </div>
    <div class="cartbottom">
        <span class="carttotal">
          <span class="font-size-14">应付金额:</span>
          <span class="gcolor">&yen;{{paymoney}}</span>
        </span>
      <span class="pull-right">
          <button class="colortbtn btnw100" @click="settle">提交订单</button>
        </span>
    </div>
  </div>
</template>

<script>
  import { Tab, TabItem , Group, Cell, XTextarea} from 'vux'
  export default {
    components: {
      Tab,
      TabItem,
      Group,
      Cell,
      XTextarea
    },
    data () {
      return {
        info:'',
        province:'',
        city:'',
        county:'',
        street:'',
        addrId:'',
        areaId:'',
        orderlist:[],
        creditPermits:[],
        creditindex:-1,
        paymoney:'',
        comment:'',
        prepaymentAmount:'',
        isSelect:'',
        usePrepayment:'',
        useCredit:'',
        arr:[]
      }
    },
    created(){
      this.getaddress()
    },
    methods: {
      selectAll(){

      },
      goaddress(val){
        if(val!=undefined){
          this.$router.push('/user/address?type='+val)
        }else{
          this.$router.push('/user/address/add')
        }
      },
      settle() {
        var returnUrl =document.location.href.split('#')[0] +'#/order?type=2';
        let d = {
          addrId:this.addrId,
          settleid:this.$route.query.id,
          comment:this.comment,
          usePrepayment:this.usePrepayment,
          useCredit:this.useCredit,
          returnUrl:returnUrl
        };
        if(this.addrId==''){
          this.$vux.toast.text('请填写收货地址','middle');
          return;
        }
        this.$vux.loading.show({
          text: '订单提交中~'
        });
        let l = "mall/minimallsubmit.do";
        this.$post(l,d,function(_t,r){
          if(r.data.payCode!=undefined){
            if(r.data.directpay=='yes'){
              location.href =  _t.$store.state.basePath + "pay/pay.do?code="+r.data.payCode;
            }else{
              _t.$router.push('/pay?id='+r.data.payCode)
            }
          }
        });
      },
      getaddress(){
        let d = {};
        let l = "user/defaultaddress.do"; //let l = "user/queryReceiveAddrDetail.do";
        this.$post(l,d,function(_t,r){
          if(r.addr!=undefined){
            _t.info = r.addr;
            _t.province = r.addr.street.province.name;
            _t.city = r.addr.street.city.name;
            _t.county = r.addr.street.county.name;
            _t.street = r.addr.street.street.name;
            _t.areaId = r.addr.street.street.id;
            _t.addrId = r.addr.id;
          }
          _t.getdetail();
        });
      },
      getdetail(){
        this.$vux.loading.show({
          text: '数据加载中~'
        });
        let d = {
          areaId:this.areaId,
          settleid:this.$route.query.id,
          usePrepayment:this.usePrepayment,
          useCredit:this.useCredit,
        };
        let l = "mall/minimallsettle.do";
        this.$post(l,d,function(_t,r){
          if(r.data.supplierGoodsList){
            _t.orderlist = r.data.supplierGoodsList;
          }else{
            _t.orderlist = r.data.templateGoodsList;
          }
          if(r.data.creditPermits){
            _t.creditPermits = r.data.creditPermits;
          }
          _t.usePrepayment = r.data.usePrepayment;
          _t.paymoney = r.data.amountTobePaid;
          _t.prepaymentAmount = r.data.prepaymentAmount;
          _t.usePrepayment =r.data.usePrepayment;
        });
      },
      selectPrepay(){
        if(this.usePrepayment == 0){
          this.usePrepayment = 1;
        }else{
          this.usePrepayment = 0;
        }
        this.getdetail()
      },
      selectCredit(item,index){
        item.usedAmount = !item.usedAmount;
        var that = this;
        this.arr = [];
        this.creditPermits.forEach(function(item){
          if(item.usedAmount){
            that.arr.push(item.id);
          }
        });
        this.useCredit = this.arr.toString();
        this.getdetail()
      }
    }
  }
</script>
