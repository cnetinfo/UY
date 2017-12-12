<template>
  <div class="pay" v-if="show">
    <div class="scrollrows s-b-50">
      <div class="pd-10 font-size-14" v-if="banklistdata.length>0">
        选择银行账户
      </div>
      <group class="font-size-16">
        <cell  v-for="(item,i) in banklistdata" :key="i">
          <div slot="inline-desc">
            <div style="display: flex">
              <span style="width: 100%;">
                <p>开户名称：{{item.bankAccountName}}</p>
                <p>开户银行：{{item.bankName}}</p>
                <p>银行账号：{{item.bankAccountCode}}</p>
              </span>
            </div>
          </div>
          <button class="icon_select" :class="{select:item.isDefault==1}" @click="onselect(item)"></button>
        </cell>
      </group>
      <div class="pd-10 font-size-14 ucolor">
        为便于核对到帐信息，请您备注汇出账号或者上传相关的汇款凭证
      </div>
      <group class="font-size-16">
        <x-textarea placeholder="请填写转帐说明" v-model="content" style="font-size:14px;" :show-counter="true" :max="200" :rows="3"></x-textarea>
      </group>
      <div class="pd-10 font-size-14">
        上传凭证
      </div>
      <div class="linerows">
        <uploadImages ref="pigphoto" :postindex="0" :count="1" ></uploadImages>
      </div>
    </div>
    <div class="cartbottom">
        <span class="carttotal">
          <span class="font-size-14">应付金额:</span>
          <span class="gcolor">¥{{paymoney}}</span>
        </span>
      <span class="pull-right">
          <button class="colortbtn btnw100" @click="submitpay">提 交</button>
        </span>
    </div>
  </div>
  <div v-else>
    <msg title="提交成功" description="您的申请已在处理，请耐心等待" :buttons="buttons" icon="success"></msg>
  </div>
</template>

<script type="text/babel">
  import { Group, Cell, XTextarea, Msg} from 'vux'
  import uploadImages from '../components/UploadImages.vue'
  export default {
    name: '',
    data () {
      return {
        show:true,
        index:-1,
        buttons: [{
          mini: true,
          type: 'default',
          text: '返回',
          onClick: this.goback.bind()
        }],
        banklistdata:[],
        content:'',
        paymoney:'',
        selectedbank:'',
        photolist:[
          {key:'',value:''}
        ],
        backurl:''
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.getbank();
        vm.getpaymoney();
      });
    },
    methods: {
      onselect(payItem,i){
        this.selectedbank = payItem.id;
        this.banklistdata.forEach((item)=>{
          this.$set(item,"isDefault",0);
          this.$set(payItem,"isDefault",1)
        });
      },
      goback(){
        location.href = this.backurl;
        //this.$router.push('/order?type=2');
      },
      submitpay(){
        let l = "mall/startPayTransfer.do";
        this.banklistdata.forEach((item)=>{
          if(item.isDefault==1){
            this.selectedbank = item.id
          }
        });
        let d = {
          code:this.$route.query.id,
          bankAccountId:this.selectedbank,
          notes:this.content,
          photoId:this.photolist[0].key
        };
        if(this.photolist[0].key.split(',').length > 1){
          this.$vux.toast.text('最多只能上传一张','middle');
          return
        }
        this.$post(l,d,function(_t,r){
          _t.backurl = r.data;
          _t.show = false;
        });
      },
      getbank(){
        let l = "mall/payTransferBankAccountList.do";
        let d = {};
        this.$post(l,d,function(_t,r){
          _t.banklistdata =r.data;
        });
      },
      getpaymoney(){
        let l = "mall/paymethod.do";
        let d = {
          code :this.$route.query.id,
        };
        this.$post(l,d,function(_t,r){
          _t.paymoney =r.data.payAmount;
        });
      }
    },
    mounted () {
    },
    components: {
      Group,
      Cell,
      XTextarea,
      Msg,
      uploadImages
    }
  }
</script>
