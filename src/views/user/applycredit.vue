<template>
  <div class="applycredit">
    <div class="scrollrows" v-if="show">
      <group>
        <popup-picker title="授信单位" placeholder="请选择授信单位"  v-model="cate" :data="list" show-name :columns="1" value-text-align="right" @on-change="onChange" ></popup-picker>
        <x-input title="申请金额" placeholder="请输入金额" text-align="right" v-model="money" :max="8"></x-input>
      </group>
      <div class="linerows m-t-10 bg-white">
        <p style="margin-left:5px;">相关证件（身份证正反面、营业执照）</p>
        <uploadImages ref="pigphoto" :postindex="0"></uploadImages>
      </div>
      <div class="linerows font-size-14" v-show="showrule">
        <check-icon :value.sync="readed" type="plain">我已阅读并同意</check-icon>
        <a @click="agreement" class="dcolor" style="vertical-align: middle;">《 授信协议 》</a>
      </div>
      <p class="mg-10 m-t-50">
        <button class="colortbtn" @click="submitapply">提 交</button>
      </p>
    </div>
    <div v-else>
      <msg title="提交成功" description="您的申请已提交，请耐心等待" :buttons="buttons" icon="success"></msg>
    </div>
    <popup v-model="popup" position="bottom">
      <div style="padding:10px 10px 60px 10px; font-size: 14px; background-color:#FFF;" v-html="content">
      </div>
      <div style="padding:15px 15px 10px 15px; position: fixed; width: 100%; bottom: 0px; box-sizing: border-box;">
        <button class="colortbtn" @click="popup = false">关闭</button>
      </div>
    </popup>
  </div>
</template>

<script>
  import { Group, Popup, XAddress, PopupPicker, XInput, CheckIcon ,Msg } from 'vux'
  import uploadImages from '../../components/UploadImages.vue'
  export default {
    name: '',
    data () {
      return {
        showrule:false,
        show:true,
        cate:[],
        list: [],
        money:'',
        icon: '',
        buttons: [{
          mini: true,
          type: 'default',
          text: '返回',
          onClick: this.goback.bind()
        }],
        photolist:[
          {key:'',value:''}
        ],
        readed: false,
        popup:false,
        content:''
      }
    },
    created(){
      this.getallcreditshops();
    },
    methods: {
      onChange(val){
        let d = {
          shopId:val[0]
        };
        let l = "mall/getsuppliercreditlicense.do";
        this.$post(l,d,function(_t,r){
          _t.content = r.data;
          if(r.data){
            _t.showrule = true;
            _t.readed = false;
          }else{
            _t.showrule = false;
            _t.readed = true;
          }
        });
      },
      goback(){
        this.$router.go(-1)
      },
      agreement(){
        this.popup = true;
      },
      getallcreditshops(){
        let d = {
        };
        let l = "mall/supportcreditshops.do";
        this.$post(l,d,function(_t,r){
          _t.list=r.data
          _t.list.forEach(function (item) {
            _t.$set(item,'value',item.id);
          });
        });
      },
      submitapply(){

        if(this.cate == ''){
          this.$vux.toast.text('请选择授信单位','middle');
          return
        }
        if(this.money == ''){
          this.$vux.toast.text('请输入申请金额','middle');
          return
        }
        var verifyNum = /^[0-9]*[1-9][0-9]*$/ ;
        if(!verifyNum.test(this.money)){
          this.$vux.toast.text('输入申请金额有误','middle');
          return;
        }
        if(this.photolist[0].key == ''){
          this.$vux.toast.text('请上传相关证件','middle');
          return
        }
        if(!this.readed){
          this.$vux.toast.show({
            type:'text',
            text: '您还没同意授信协议!',
            position: 'middle',
            width: '15em'
          });
          return
        }

        let d = {
          shopId:this.cate.join(),
          credit:this.money,
          photoIds:this.photolist[0].key
        };
        let l = "mall/applycredit.do";
        this.$post(l,d,function(_t,r){
          _t.show = false
        });
      }
    },
    components: {
      Group,
      Popup,
      XAddress,
      PopupPicker,
      XInput,
      uploadImages,
      CheckIcon,
      Msg
    }
  }
</script>
