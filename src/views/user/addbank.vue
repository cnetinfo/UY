<template>
  <div class="addbank">
    <group>
      <x-input title="银行卡号" type="tel" placeholder="请填写您的银行卡号" v-model="bankno"></x-input>
      <x-input title="开户行"  placeholder="请填写您的开户行" v-model="bankname"></x-input>
      <x-input title="开户人姓名" placeholder="请填写您的开户人姓名" v-model="username"></x-input>
      <x-input title="身份证号" placeholder="请填写您的身份证号" v-model="idcard"></x-input>
      <x-input title="确认身份证号" placeholder="请确认您的身份证号" v-model="idcard"></x-input>
    </group>
    <p class="mg-10 m-t-50">
      <button class="colortbtn">确 定</button>
    </p>
  </div>
</template>

<script>
  import { Group, XInput } from 'vux'
  export default {
    name: '',
    data () {
      return {
        bankno: '',
        bankname: '',
        username: '',
        idcard: ''
      }
    },
    created(){

    },
    components: {
      Group,
      XInput
    }
  }
</script>
