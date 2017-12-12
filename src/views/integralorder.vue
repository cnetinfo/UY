<template>
  <div class="ordersubmit">
    <div class="scrollrows s-b-50">
      <div class="bg-white m-b-10">
        <div class="linerows">
          <span class="font-size-14">收货详情</span>
        </div>
        <div class="pd-10" v-if="info" @click="goaddress(1)">
          <p class="font-size-16">{{info.contactName}} {{info.contactPhone}}</p>
          <p class="font-size-12">{{info.address}}</p>
        </div>
        <div class="pd-10" v-else>
          <p class="font-size-16 text-center" @click="goaddress()">+添加地址</p>
        </div>
      </div>
      <!--<div v-for="(item, index) in datalist" :key="index" v-show="nav == navlist[index]" >-->
        <group v-if="orderlist">
          <cell >
            <div slot="inline-desc">
              <div style="display: flex">
                <span class="font-size-16" style="margin-right: 10px; display:flex">
                  <img :src="orderlist.logoUrl" width="60" height="60" />
                </span>
                <span style="width:100%;">
                  <p ><span class="font-size-14 bcolor twoline">{{orderlist.title}}</span></p>
                  <p class="m-t-5">
                    <span class="gcolor">{{orderlist.integral}}分</span>
                  </p>
                </span>
              </div>
            </div>
          </cell>
        </group>

      <group class="m-t-10">
        <x-textarea title="买家留言" placeholder="请填写您的反馈内容" v-model="comment" :show-counter="true" :max="50" :rows="3"></x-textarea>
      </group>

    </div>
    <div class="cartbottom">
        <span class="carttotal">
          <span class="font-size-14">应付积分:</span>
          <span class="gcolor">{{orderlist.integral}}</span>
          <span class="font-size-14">分</span>
        </span>
      <span class="pull-right">
          <button class="colortbtn btnw100" @click="settle">提交订单</button>
        </span>
    </div>
  </div>
</template>

<script>
  import { Tab, TabItem , Group, Cell, XTextarea, Toast } from 'vux'
  export default {
    components: {
      Tab,
      TabItem,
      Group,
      Cell,
      Toast,
      XTextarea
    },
    data () {
      return {
        info:'',
        gid:'',
        addrId:'',
        orderlist:[],
        comment:'',
        arr:[]
      }
    },
    created(){
      this.getdetail()
    },
    methods: {
      selectAll(){

      },
      goaddress(val){
        if(val!=undefined){
          this.$router.push('/user/address?type='+val)
        }else{
          this.$router.push('/user/address/add')
        }
      },
      settle() {
        var returnUrl =document.location.href.split('#')[0] +'#/order?type=2';
        let d = {
          goodsid:this.gid,
          addressid:this.addrId,
          comments:this.comment
        };
        let l = "integral/submitintegralexchanged.do";
        this.$post(l,d,function(_t,r){
          _t.$vux.toast.show({
            text: '提交成功!',
            type: 'success',
            onHide () {
              _t.$router.push('/order')
            }
          });

        });
      },
      getdetail(){
        this.gid = this.$route.params.id;
        let d = {
          goodsid:this.gid	//是	string	商品清单对象id
        };
        let l = "integral/initintegralexchanged.do";
        this.$post(l,d,function(_t,r){
         let addr = r.data.address;
         let goods = r.data.goods;
          if(addr!=undefined){
            _t.info = addr;
            _t.addrId = addr.id;
          }
          if(goods){
            _t.orderlist = goods;
          }
        });
      }
    }
  }
</script>
