<template>
  <div class="managementdetail">
    <div class="scrollrows">
      <group>
        <cell>
          <div slot="title">
            <p class="font-size-16">{{info.userName}}<span class="font-size-14 greycolor">{{info.phoneNumber}}</span></p>
          </div>
          <div slot="inline-desc">
            <p>授信额度：<span class="gcolor">{{info.credit}}元</span></p>
            <p>可用额度：<span class="gcolor">{{info.balance}}元</span></p>
          </div>
          <div slot="value">
            <p><button class="smallbtn colorborder" @click="quotaAdjustment"><i class="icon_repair_small"></i> 额度调整</button></p>
          </div>
        </cell>
      </group>
    </div>
  </div>
</template>

<script>
  import { Group, Cell} from 'vux'
  export default {
    name: '',
    data () {
      return {
        info:''
      }
    },
    created(){
      this.getdetail();
    },
    methods: {
      getdetail(){
        let d = {
          id:this.$route.params.id
        };
        let l = "mall/getcreditpermitdetail.do";
        this.$post(l,d,function(_t,r){
          _t.info =r.data;
        });
      },
      quotaAdjustment(){
        let l = "mall/adjustcredit.do";
        let that = this;
        this.$vux.confirm.prompt('请输入调整后的额度', {
          title: '请输入总额度',
          confirmText:'完成',
          cancelText:'取消',
          onConfirm (value) {
            if(value>10000000){
              _t.$vux.toast.text('额度调整过大','middle');
              return;
            }
            let d = {
              id:that.$route.params.id,
              credit:value,
            };
            that.$post(l,d,function(_t,r){
              _t.$vux.toast.show({
                text: '额度调整成功',
                type: 'success',
                onHide () {
                  _t.getdetail();
                }
              });
            });
          }
        })
      }
    },
    components: {
      Group,
      Cell,
    }
  }
</script>
