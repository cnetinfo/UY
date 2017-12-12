<template>
  <div class="orderdetail">
    <div class="scrollrows">
      <group style="margin-top:1px;" v-for="(item, index) in data.orderGoodsList" :key="index">
        <cell>
          <div slot="inline-desc">
            <div style="display: flex">
              <span class="font-size-16" style="margin-right: 10px; display:flex">
                <img :src="item.url" width="60" height="60" />
              </span>
              <span>
                <p ><span class="font-size-14 bcolor twoline">{{item.title}}</span></p>
                <p class="m-t-5">
                  <span class="gcolor">¥{{item.price}}</span>
                  <span class="pull-right">x{{item.number}}</span>
                </p>
              </span>
            </div>
          </div>
        </cell>
      </group>
      <div class="linerows font-size-12">
        <p class="text-center">
          <rater v-model="star" slot="value"  active-color="#FF7C43"></rater>
        </p>
        <p class="text-center m-t-10 m-b-10 font-size-14" v-if="star>3">您满意的地方？</p>
        <p class="text-center m-t-10 m-b-10 font-size-14" v-else>您不满意的地方？</p>

        <checker v-model="good" type="checkbox" default-item-class="select-item" selected-item-class="select-item-selected" v-if="star>3">
          <checker-item :value="item" v-for="(item, index) in gooditems" :key="index">{{item.value}}</checker-item>
        </checker>
        <checker v-model="bad" type="checkbox" default-item-class="select-item" selected-item-class="select-item-selected" v-else>
          <checker-item :value="item" v-for="(item, index) in baditems" :key="index">{{item.value}}</checker-item>
        </checker>

        <textarea style="width: 100%; box-sizing:border-box; padding: 5px 10px; border-radius: 5px; border: 1px solid #dcdcdc; resize: none; height: 100px; margin-top: 10px;" v-model="commenttext"></textarea>

      </div>

      <p class="mg-10 m-t-50"><button class="colortbtn" @click="submitcomment">提交</button></p>




    </div>
  </div>
</template>

<script>
  import { Rater, Group, Cell, Checker, CheckerItem } from 'vux'
  export default {
    components: {
      Group,
      Cell,
      Rater,
      Checker,
      CheckerItem
    },
    data () {
      return {
        star:5,
        data:'',
        good:[],
        gooditems: [{
          key: '1',
          value: '质量不错'
        }, {
          key: '2',
          value: '价格实惠'
        }, {
          key: '3',
          value: '物流快'
        }, {
          key: '4',
          value: '服务态度好'
        }, {
          key: '5',
          value: '包装好'
        }],
        bad:[],
        baditems: [{
          key: '1',
          value: '质量不好'
        }, {
          key: '2',
          value: '价格不合理'
        }, {
          key: '3',
          value: '物流太慢'
        }, {
          key: '4',
          value: '服务态度不好'
        }, {
          key: '5',
          value: '包装破损'
        }],
        commenttext:''
      }
    },
    created(){
      this.getdetail()
    },
    methods: {
      getdetail(){
        let d = {
          orderId:this.$route.query.id,
        };
        let l = "mall/detail.do";
        this.$post(l,d,function(_t,r){
          _t.data = r.data;
        });
      },
      submitcomment(){
        var itemlist;
        if(this.star>3){
          itemlist = this.good;
        }else{
          itemlist = this.bad;
        }
        let d = {
          score:this.star,                    //星
          itemlist:JSON.stringify(itemlist),  //选择
          comment:this.commenttext,
        };
        console.log(d)
        /*let l = "mall/vvvvv.do";
        this.$post(l,d,function(_t,r){
         _t.$vux.toast.text('提交成功','middle');
         _t.$router.go(-1);
        });*/
      }
    }
  }
</script>

<style scoped>
  .select-item { border: 1px solid #ececec; padding: 5px 12px; margin:5px 2px; border-radius: 5px;}
  .select-item-selected {background-color: #FF7C43; color: #FFFFFF; }
</style>
