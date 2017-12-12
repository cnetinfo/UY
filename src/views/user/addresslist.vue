<template>
  <div class="addresslist">
    <div class="scrollrows">
      <div class="bg-white m-b-10" v-for="(item,index) in list" :key="item.id">
        <div class="pd-10">
          <p class="font-size-16">{{item.contactName}} {{item.contactPhone}}</p>
          <p class="font-size-12">{{item.street.province.name}}{{item.street.city.name}}{{item.street.county.name}}{{item.street.street.name}}{{item.address}}</p>
        </div>
        <p class="linerows topborder">
          <span v-if="item.isDefault==1" class="gcolor font-size-14">
            默认地址
          </span>
          <span v-else class="smallminbtn" @click="setdefault(item.id)">
            <i class="icon_repair_small"></i> 设为默认
          </span>
          <span class="pull-right">
            <span style="color:#666;" @click="$router.push('/user/address/'+item.id)"><i class="icon-write"></i> 修改</span>
            <span style="color:#666;" @click="deleteaddress(item.id,index)"><i class="icon-delete"></i> 删除</span>
          </span>
        </p>
      </div>

      <p class="mg-10 m-t-50">
        <button class="defaultbtn colorborder" @click="$router.push('/user/address/add')">+ 新增地址</button>
      </p>
    </div>

  </div>
</template>

<script>
  import { CheckIcon  } from 'vux'
  export default {
    name: '',
    data () {
      return {
        list: []
      }
    },
    created(){
      this.getList();
    },
    methods:{
      getList(){
        let d = {
        };
        let l = "user/myaddress.do";
        this.$post(l,d,function(_t,r){
          _t.list=r.addrs;
        },function(_t,r){

        });
      },
      setdefault(id){
        let l = 'user/setdefaultaddress.do';
        let d = {
          rid:id,
        };
        this.$post(l,d,function(_t,r){
          _t.$vux.toast.show({
            text: '设置成功',
            type: 'success',
            onHide () {
                if(_t.$route.query.type ==1){
                  _t.$router.go(-1);
                }else{
                  _t.getList();
                }
            }
          });
        });
      },
      deleteaddress(id,index){
        let l = 'user/deleteaddress.do';
        let d = {
          rid:id,
        };
        var that = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定删除该地址？',
          confirmText:'确定',
          cancelText:'取消',
          onConfirm () {
            that.$post(l,d,function(_t,r){
              _t.list.splice(index,1);
              _t.$vux.toast.show({
                text: '删除成功',
                type: 'success'
              });
            });
          }
        });
      }
    },
    components: {
      CheckIcon
    }
  }
</script>

