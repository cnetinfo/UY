<template>
  <div class="applyapprovaldetail">
    <div class="scrollrows">
      <div class="linerows" style="background-color:#FF7C43; color:#FFFFFF;" v-show="pass"><i class="icon_hook_white"></i> 该申请审批已通过</div>
      <div class="linerows" style="background-color:#FF7B73; color:#FFFFFF;" v-show="lose" ><i class="icon_fork_white"></i> 该申请审批未通过</div>
      <group>
        <x-input title="申请人" text-align="right" :readonly="true" v-model="info.userName"></x-input>
        <x-input title="手机号" text-align="right" :readonly="true" v-model="info.phoneNumber"></x-input>
        <x-input title="所在区域" text-align="right" :readonly="true" v-model="info.locationAreaName"></x-input>
        <x-input title="授信单位" text-align="right" :readonly="true" v-model="info.supplierName"></x-input>
        <x-input title="申请金额" text-align="right" :readonly="true" v-model="info.credit"></x-input>
        <x-input title="申请时间" text-align="right" :readonly="true" v-model="createdDate"></x-input>
        <x-textarea title="备注" placeholder="请输入备注" v-model="content" :show-counter="true" :max="50" :rows="3"></x-textarea>
      </group>
      <div class="linerows m-t-10 bg-white">
        <p style="margin-left:5px;">相关证件（身份证正反面、营业执照）</p>
        <div class="photocelllist">
          <span class="photocell" v-for="(el,i) in photoUrl"  @click="previewimg(i,photoUrl)">
            <figure v-bind:style="{ backgroundImage:'url('+ el + ')'}">
            </figure>
          </span>
        </div>
      </div>
      <p class="mg-10 m-t-50" style="display:flex;" v-if="info.state==0">
        <button class="defaultbtn colorborder wp50" style="margin-right:5px;" @click="reject">拒 绝</button>
        <button class="colortbtn wp50" @click="passed">通 过</button>
      </p>
    </div>
  </div>
</template>

<script>
  import { Group, XInput, XTextarea } from 'vux'
  export default {
    name: '',
    data () {
      return {
        photoUrl:'',
        pass:false,
        lose:false,
        info:'',
        createdDate: '',
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
        let l = "mall/getcreditapplydetail.do";
        this.$post(l,d,function(_t,r){
          _t.info = r.data;
          _t.photoUrl =r.data.photoUrls;
          _t.content =r.data.reviewNotes;
          _t.createdDate = r.data.createdDate.replace(/T/,' ')
          if(r.data.state==1){
            _t.pass=true
          }else if(r.data.state==2){
            _t.lose=true
          }
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
          result:1,
          notes:this.content
        };
        let l = "mall/reviewcreditapply.do";
        let that = this;
        this.$vux.confirm.show({
          title: '',
          content: '是否同意该笔授信申请？',
          confirmText:'同意',
          cancelText:'取消',
          onConfirm () {
            that.$post(l,d,function(_t,r){
              _t.$vux.toast.text('已同意','middle');
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
      XInput,
      XTextarea
    }
  }
</script>
