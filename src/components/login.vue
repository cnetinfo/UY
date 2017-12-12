<template>
  <div>
    <x-dialog v-model="showNoScroll" class="dialog-demo" :scroll="false">
      <div style="padding:10px;">
        <h3 style="font-size: 16px; font-weight: normal;">用户绑定</h3>
        <group class="m-t-10">
          <x-input title="手机号" placeholder="请输入手机号码"  :max="11" v-model="phone"></x-input>
          <x-input title="验证码" class="weui-vcode" v-model="verifycode" type="number" >
            <button slot="right" class="smallminbtn" @click="sendCode" style="padding-left:5px; padding-right:5px; ">
            <span v-show="start">
              <countdown slot="countvalue" v-model="time" :start="start" @on-finish="finish"></countdown>秒后重新获取
            </span>
              <span v-show="!start">获得验证码</span>
            </button>
          </x-input>
        </group>
      </div>
      <div  style="display: flex;">
        <button class="colortbtn wp50" style="border-radius:0px;" @click="bindphone">绑 定</button>
        <button class="defaultbtn colorborder wp50" style="border-radius:0px;" @click="showNoScroll=false">取 消</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
  import { Group, XDialog, XInput , Countdown } from 'vux'
  export default {
    data () {
      return {
        showNoScroll: true,
        phone:'',
        verifycode:'',
        countvalue:'',
        time: 60,
        start: false,
        readed: false
      }
    },
    methods:{
      bindphone(){
        if(this.phone == ''){
          this.$vux.toast.text('请输入手机号码','middle');
          return
        }
        var verifiphone = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
        if(!verifiphone.test(this.phone)){
          this.$vux.toast.text('输入手机号码格式错误','middle');
          return;
        }
        if(this.verifycode == ''){
          this.$vux.toast.text('请输入手机验证码','middle');
          return
        }

        let l = 'login/bindmobile.do';
        let d = {
          mobile:this.phone,
          verifycode:this.verifycode
        };
        this.$post(l,d,function(_t,r){
          _t.$vux.toast.text('绑定成功','middle');
          _t.showNoScroll = false;
          location.reload();
        });
      },
      finish (index) {
        this.time = 60;
        this.start = false;
      },
      sendCode(){
        if(!this.start){
          var verifiphone = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
          if(!verifiphone.test(this.phone) || this.phone == ''){
            this.$vux.toast.text('请输入正确的手机号码','middle');
            return
          }
          this.$vux.loading.show({
            text: '发送中...'
          });
          let d = {
            phone:this.phone,
            verifyCodeType:0
          };
          let l = "login/getverifycode.do";
          this.$post(l,d,function(_t,r){
            setTimeout(() => {
              _t.start = true;
              _t.$vux.loading.hide();
              _t.$vux.toast.show({
                text: '已发送'
              })
            }, 1000);
          });
        }
      }
    },
    components: {
      Group,
      XDialog,
      XInput,
      Countdown,
    }
  }
</script>
