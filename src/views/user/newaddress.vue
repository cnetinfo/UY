<template>
  <div class="newaddress">
    <group label-width="4.5em">
      <x-input title="收货人"  placeholder="请输入您的姓名" v-model="consignee" text-align="right"></x-input>
      <x-input title="手机号" type="tel" placeholder="请输入您的手机号" v-model="phone" :max="11"  text-align="right"></x-input>
      <x-address title="所在区域" @on-hide="logHide" placeholder="请选择您的所在地区" v-model="addressValue" raw-value :list="addressData"  value-text-align="right" ></x-address>
      <popup-picker title="街道" placeholder="请选择您的所在的街道" v-model="street" :data="streetlist" :columns="1" value-text-align="right" show-name></popup-picker>
      <x-input title="详细地址" placeholder="请输入您的详细地址" v-model="address" text-align="right"></x-input>
    </group>

    <p class="mg-10 m-t-50">
      <button class="colortbtn" @click="addfn">添 加</button>
    </p>
  </div>
</template>

<script>
  import areadata from '../../assets/data.json'
  import { Group, PopupPicker, XAddress, XInput } from 'vux'
  export default {
    name: '',
    data () {
      return {
        consignee: '',
        phone: '',
        addressData:areadata,
        addressValue: [],
        address: '',
        street:[],
        streetlist:[]
      }
    },
    created(){
      //area/street.do
      //this.getStreet()
    },
    methods:{
      logHide (str) {
        if(str){
          this.getStreet()
        }
      },
      getStreet(){
        let d = {
          countyId:this.addressValue[2]
        };
        let l = "area/street.do";
        this.$post(l,d,function(_t,r){
          _t.streetlist = r.data;
          _t.streetlist.forEach(function (item) {
            _t.$set(item,'value',item.id);
          });
        });
      },
      addfn(){
        var isDefault;
        if(this.$route.query.type){
          isDefault = this.$route.query.type
        }else{
          isDefault=0;
        }
        let l = 'user/addaddress.do';
        if(this.consignee == ''){
          this.$vux.toast.text('请输入收货人姓名','middle');
          return
        }
        if(this.phone == ''){
          this.$vux.toast.text('请输入手机号码','middle');
          return
        }
        var verifiphone = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
        if(!verifiphone.test(this.phone)){
          this.$vux.toast.text('输入手机号码格式错误','middle');
          return;
        }
        if(this.addressValue == ''){
          this.$vux.toast.text('请选择您的所在的区域','middle');
          return
        }
        if(this.street == ''){
          this.$vux.toast.text('请选择您的所在的街道','middle');
          return
        }
        if(this.address == ''){
          this.$vux.toast.text('请输入您的详细地址','middle');
          return
        }
        let d = {
          contactName:this.consignee,
          contactPhone:this.phone,
          areaId:this.street.join(''),
          address:this.address,
          isDefault:isDefault,
        };
        this.$post(l,d,function(_t,r){
          _t.$vux.toast.show({
            text: '添加成功',
            type: 'success',
            onHide () {
              _t.$router.go(-1)
              //_t.$router.push('/user/address');
              //_t.$router.push({path:'/user/address', query:{ id: r.data }});
            }
          });
        });
      },
      setdefault(index){
        console.log(index)
      }
    },
    components: {
      Group,
      PopupPicker,
      XAddress,
      XInput
    }
  }
</script>
