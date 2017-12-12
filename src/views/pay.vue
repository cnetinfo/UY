<template>
  <div class="pay">

    <div class="scrollrows">
      <div class="pd-10 font-size-14">
        选择支付方式
      </div>
      <group class="font-size-16 m-b-10" v-for="(item,i) in payMethods" :key="i">
        <cell :title="item.title">
          <img slot="icon" width="30" style="display:block;margin-right:5px;" :src="item.pic">
          <button class="icon_select" :class="{select:index==i}" @click="onselect(item,i)"></button>
        </cell>
        <p style="padding: 10px; font-size: 12px; margin-left:20px; border-top:1px solid #EEEEEE" v-if="item.text">{{item.text}}</p>
      </group>
    </div>
    <div class="cartbottom">
        <span class="carttotal">
          <span class="font-size-14">应付金额:</span>
          <span class="gcolor">¥{{paymoney}}</span>
        </span>
      <span class="pull-right">
          <button class="colortbtn btnw100" @click="gopay">支 付</button>
        </span>
    </div>
  </div>
</template>

<script type="text/babel">
  import { Group, Cell} from 'vux'
  import login from '../components/login.vue'
  import footerCommon from '../components/footer.vue'
  export default {
    name: '',
    data () {
      return {
        index:-1,
        payMethods: [],
        paymoney:'',
        type:''
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.getpay();
      });
    },
    methods: {
      onselect(payItem,i){
        this.index = i;
        this.type = payItem.type;
      },
      gopay(){
        if(this.type==''){
          this.$vux.toast.text('请选择支付方式','middle');
        }
        let l = "mall/redirectpay.do";
        let d = {
          payCode:this.$route.query.id,
          type:this.type
        };
        this.$post(l,d,function(_t,r){
          if(_t.type==9){
            _t.$router.push('/offlinepay?id=' + _t.$route.query.id);
          }else{
            location.href = r.data.redirect;
          }
        });
      },
      getpay(){
        let l = "mall/paymethod.do";
        let d = {
          code :this.$route.query.id,
        };
        this.$post(l,d,function(_t,r){
          _t.paymoney =r.data.payAmount;
          _t.payMethods =r.data.payMethods;
          _t.payMethods.forEach(function (item) {
              if(item.type==4){
                _t.$set(item,'pic','static/Unionpay.png');
              }else if(item.type==20){
                _t.$set(item,'pic','static/COD.png');
                _t.$set(item,'text','收货后完成订单支付');
              }else if(item.type==1){
                _t.$set(item,'pic','static/weixinpay.png');
              }else if(item.type==9){
                _t.$set(item,'pic','static/unlinepay.png');
              }
          });

        });
      }
    },
    mounted () {
    },
    components: {
      Group,
      Cell
    }
  }
</script>
