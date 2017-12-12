<template>
  <div class="addbank">
    <group>
      <x-input title="手机号码" type="tel" placeholder="请填写您的手机号码" :max="11" v-model="phone"></x-input>
      <x-textarea title="反馈内容" placeholder="请填写您的反馈内容" v-model="content" :show-counter="true" :max="200" :rows="3"></x-textarea>
    </group>
    <p class="mg-10 m-t-50">
      <button class="colortbtn" @click="feed">提 交</button>
    </p>
  </div>
</template>

<script>
  import { Group, XInput, XTextarea } from 'vux'
  export default {
    name: '',
    data () {
      return {
        phone: '',
        content: ''
      }
    },
    created(){

    },
    methods:{
      feed(){
        if(this.phone == ''){
          this.$vux.toast.text('请填写手机号码','middle');
          return
        }
        var verifiphone = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
        if(!verifiphone.test(this.phone)){
          this.$vux.toast.text('填写手机号码格式错误','middle');
          return;
        }
        if(this.content == ''){
          this.$vux.toast.text('请填写您的反馈内容','middle');
          return
        }
        let d = {
          phone:this.phone,
          content:this.content
        };
        let l = "mall/feedback.do";
        this.$post(l,d,function(_t,r){
          _t.$vux.toast.show({
            text: '提交成功',
            type: 'success',
            onHide () {
              _t.$router.go(-1);
            }
          });
        });
      }
    },
    components: {
      Group,
      XInput,
      XTextarea
    }
  }
</script>
