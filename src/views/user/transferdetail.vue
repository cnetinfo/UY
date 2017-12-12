<template>
  <div class="applyapprovaldetail">
    <div class="scrollrows">
      <group >
        <x-input title="当前状态" class="font-size-14" text-align="right" :readonly="true" v-model="statetext"></x-input>
        <cell style="padding: 5px 15px !important; font-size: 14px;">
          <span slot="title">
            <span style="vertical-align:bottom; display: inline-block; margin-top: 12px; ">头像</span>
            <span style="vertical-align:middle; float: right">
              <img :src="info.headUrl"  width="40" height="40" style="border-radius: 50%;"/>
            </span>
          </span>
        </cell>
        <x-input title="姓名昵称" class="font-size-14" text-align="right" :readonly="true" v-model="info.name"></x-input>
        <x-input title="用户类型" class="font-size-14" text-align="right" :readonly="true" v-model="info.userType"></x-input>
        <x-input title="手机号" class="font-size-14" text-align="right" :readonly="true" v-model="info.phoneNumber"></x-input>
        <x-input title="金额" class="font-size-14" text-align="right" :readonly="true" v-model="info.amount"></x-input>
        <x-input title="开户名称" class="font-size-14" text-align="right" :readonly="true" v-model="info.bankAccountName"></x-input>
        <x-input title="开户银行" class="font-size-14" text-align="right" :readonly="true" v-model="info.bankName"></x-input>
        <x-input title="银行帐号" class="font-size-14" text-align="right" :readonly="true" v-model="info.bankAccountCode"></x-input>
        <x-input title="提交时间" class="font-size-14" text-align="right" :readonly="true" v-model="createDate"></x-input>
        <x-textarea title="转账说明" class="font-size-14" :readonly="true" v-model="info.note" :show-counter="true" :max="200" :rows="3"></x-textarea>
      </group>
      <div class="linerows m-t-10 bg-white">
        <p style="margin-left:5px;">转账凭证</p>
        <div class="photocelllist">
          <span class="photocell" v-for="(el,i) in photoUrl"  @click="previewimg(i,photoUrl)">
            <figure v-bind:style="{ backgroundImage:'url('+ el + ')'}">
            </figure>
          </span>
        </div>
      </div>
      <group class="m-t-10">
        <x-input title="审核金额" class="font-size-14" text-align="right" placeholder="请输入审核金额" v-model="checkAmount"></x-input>
        <x-textarea title="备注" class="font-size-14" placeholder="请输入备注"  v-model="content" :show-counter="true" :max="200" :rows="3"></x-textarea>
      </group>
      <p class="mg-10 m-t-50" style="display:flex;"  v-if="info.state==1">
        <!--<button class="defaultbtn colorborder wp50" style="margin-right:5px;" @click="reject">拒 绝</button>-->
        <button class="colortbtn" @click="passed">审核确认</button>
      </p>
    </div>
  </div>
</template>

<script>
  import { Group, Cell, XInput, XTextarea } from 'vux'
  export default {
    name: '',
    data () {
      return {
        photoUrl:'',
        statetext:'',
        pass:false,
        lose:false,
        info: '',
        createDate:'',
        checkAmount:'',
        content:''
      }
    },
    created(){
      this.getdetail();
    },
    methods: {
      getdetail(){
        this.$store.dispatch('getJssdk'); //获取微信鉴权
        let d = {
          id:this.$route.params.id
        };
        let l = "mall/queryTransferDetailById.do";
        this.$post(l,d,function(_t,r){
          _t.info = r.data;
          _t.checkAmount = r.data.checkAmount;
          _t.content = r.data.checkNotes;
          if(r.data.state==0){
            _t.statetext = '已审核';
          }else{
            _t.statetext = '待审核';
          }
          if(r.data.photoUrl !=undefined){
            _t.photoUrl = r.data.photoUrl.split(',')
          }
          _t.createDate = r.data.createDate.replace(/T/,' ');

        });
      },
      reject(){
        let d = {
          id:this.$route.params.id,
          result:0,
          notes:this.content
        };
        let l = "mall/reviewcreditapply.do";
        let that = this;
        this.$vux.confirm.show({
          title: '',
          content: '是否拒绝该笔授信申请？',
          confirmText:'拒绝',
          cancelText:'取消',
          onConfirm () {
            that.$post(l,d,function(_t,r){
              _t.$vux.toast.text('已拒绝','middle');
            });
          }
        })
      },
      passed() {
        let d = {
          id:this.$route.params.id,
          checkAmount:this.checkAmount,
          checkNotes:this.content
        };
        let l = "mall/checkTransfer.do";
        let that = this;
        if(this.checkAmount == ''){
          this.$vux.toast.text('请输入审核金额','middle');
          return;
        }
        this.$vux.confirm.show({
          title: '',
          content: '您确定收款账户已收到客户线下汇款？',
          confirmText:'确定',
          cancelText:'取消',
          onConfirm () {
            that.$post(l,d,function(_t,r){
              _t.$vux.toast.show({
                text: '已确认',
                onHide () {
                  _t.$router.go(-1)
                }
              })
            });
          }
        })
      },
      previewimg(i,el){
        let vm = this;
        let qs = vm.qs;
        let wx = this.$wechat;
        wx.ready(()=> {
          wx.previewImage({
            current: el[i],
            urls: el
          });
        })
      }
    },
    components: {
      Group,
      Cell,
      XInput,
      XTextarea
    }
  }
</script>
