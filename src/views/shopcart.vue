<template>
  <div class="shopcart">
    <div v-if="listdata.length!=0">
      <div class="scrollrows s-b-100">
        <group v-for="(items,i) in listdata" :key="i" class="m-b-10">
          <p class="linerows" v-if="items.minBuy">{{items.templateDescription}}
            <span v-if="leftnum!=0" class="pull-right">还差<span class="ucolor">{{leftnum}}</span>{{items.unit}}可下单</span>
          </p>
          <p class="linerows" v-else>不支持混批</p>
          <swipeout v-for="(item,index) in items.cartGoodsList" :key="item.goodsId" class="bottomborder">
            <swipeout-item transition-mode="follow">
              <div slot="right-menu">
                <swipeout-button @click.native="removeGood(item,index)" type="warn">删除</swipeout-button>
              </div>
              <div slot="content" class="demo-content vux-1px-t">
                <cell>
                  <div slot="inline-desc" >
                    <div class="cart-rows">
                      <span class="cart-select">
                        <button class="icon_select" :class="{select:item.isChecked}" @click="selectGood(item)"></button>
                      </span>
                      <span class="font-size-16 cart-img" @click='$router.push("goods?id="+item.goodsSpecificationId)'>
                        <img :src="item.url" width="60" height="60" style="border:1px solid #dcdcdc" />
                      </span>
                      <span style="width:100%">
                        <p @click='$router.push("goods?id="+item.goodsSpecificationId)'>
                          <span class="font-size-14 bcolor twoline">{{item.goodsTitle}}</span>
                        </p>
                        <p class="m-t-5"><span class="gcolor">{{item.goodsSpecificationDesc}}</span></p>
                        <p class="m-t-5">
                          <span class="gcolor">¥{{item.price}}</span>
                          <span class="pull-right">
                            <x-number v-model="item.number"  :min="1" :max="1000000" :fillable="true" @on-change="changecart(item.cartId,item.number)" style="padding:0 !important; margin-top:-5px;"></x-number>
                          </span>
                        </p>
                      </span>
                    </div>
                  </div>
                </cell>
              </div>
            </swipeout-item>
          </swipeout>
        </group>
      </div>
      <div class="cartbottom">
        <span class="carttotal">
          <button class="icon_select" :class="{select:isSelectAll}"  @click="selectAll" ></button>
          <span class="font-size-14">全选 合计:</span>
          <span class="gcolor">{{totalPrice | Currency}}</span>
        </span>
        <span class="pull-right">
          <button class="colortbtn btnw100" style="width:60px; float: left; background-color:#E64340" @click="deletecart">删 除</button>
          <button class="colortbtn btnw100" style="width:60px; float: left;" @click="settle">结 算</button>
        </span>
      </div>
    </div>
    <div class="text-center post-center" v-else>
      <p><img src="../assets/images/shopcart-null.png" width="100"/></p>
      <p><span class="greycolor m-t-10">购物车空空如也~</span></p>
    </div>
    <login v-show="islogin"></login>
    <footer-common></footer-common>
  </div>
</template>

<script type="text/babel">
  import { Group, Cell, XNumber,Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
  import login from '../components/login.vue'
  import footerCommon from '../components/footer.vue'
  export default {
    name: '',
    data () {
      return {
        islogin:false,
        isSelectAll:false,
        totalMoney:0,
        listdata:[],
        leftnum:0,
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.getlist();
      });
    },
    methods:{
      settle(){
        var isSelectedGood = false;
        this.listdata.forEach(function(items){
          items.cartGoodsList.forEach((item)=>{
            if(item.isChecked){
              isSelectedGood = true
            }
          })
        });
        if(!isSelectedGood){
          this.$vux.toast.text('请至少选择一件商品!')
          return;
        } else {
          if(this.leftnum!=0){
            this.$vux.toast.text('还差'+this.leftnum+'件才可下单~');
            return
          };
          var goods = {};
          this.listdata.forEach(function(items,index,_list){
            items.cartGoodsList.forEach((item)=>{
              if(item.isChecked){
                goods[item.goodsSpecificationId] = parseInt(item.number)
              }
            })
          });
          console.log(JSON.stringify(goods));
        }
        let d = {
          goods: JSON.stringify(goods)
        };
        let l = "mall/prepareystsettle.do";
        this.$post(l,d,function(_t,r){
          _t.$router.push({path:'/order/submit', query:{ id: r.data }});
        });

      },
      selectGood(goodObj,index){
        if(goodObj.isChecked == void 0){
          this.$set(goodObj,"isChecked",true)
        } else {
          goodObj.isChecked = !goodObj.isChecked;
        }
       this.isCheckAll();
      },
      selectAll(){
        if(!this.isSelectAll){
          this.isSelectAll = true;
          this.listdata.forEach((good)=>{
            good.cartGoodsList.forEach((item)=>{
              this.$set(item,"isChecked",true)
            })
          });
        }else{
          this.isSelectAll = false;
          this.listdata.forEach((good)=>{
            good.cartGoodsList.forEach((item)=>{
              this.$set(item,"isChecked",false)
            });
          })
        }
      },
      isCheckAll:function(){
        var flag = true;
        this.listdata.forEach(function(good){
          good.cartGoodsList.forEach((item)=>{
            if(!item.isChecked){
              flag = false;
            }
          })
        });
        if(!flag){
          this.isSelectAll = false;
        } else {
          this.isSelectAll = true;
        }
      },
      removeGood(item,index) {
        let d = {
          cartId:item.cartId
        };
        let l = "mall/removecartitems.do";
        this.$post(l,d,function(_t,r){
          location.reload()
        },function(_t,r){
          _t.islogin = true;
        });
      },
      deletecart(){
        var isSelectedGood = false;
        this.listdata.forEach(function(items){
          items.cartGoodsList.forEach((item)=>{
            if(item.isChecked){
              isSelectedGood = true
            }
          })
        });
        if(!isSelectedGood){
          this.$vux.toast.text('请选择要删除的商品!')
          return;
        } else {
          var goods = '';
          this.listdata.forEach(function(items,index,_list){
            items.cartGoodsList.forEach((item)=>{
              if(item.isChecked){
                if(goods.length>0){
                  goods += ','
                }
                goods += item.cartId
              }
            })
          });
        }
        let d = {
          cartId:goods
        };
        let l = "mall/removecartitems.do";
        this.$post(l,d,function(_t,r){
          location.reload()
        },function(_t,r){
          _t.islogin = true;
        });
      },
      changecart(id,val){
        if(val == ''){
            return
        }
        let d = {
          cartId:id,
          number:val
        };
        let l = "mall/updatecartitemnum.do";
        this.$post(l,d,function(_t,r){
          _t.isSelectAll = false;
          _t.getlist();
        },function(_t,r){
          _t.islogin = true;
        });
      },
      getlist(){
        let d = {};
        let l = "mall/cart.do";
        this.$post(l,d,function(_t,r){
          _t.listdata = r.data;
          _t.listdata.forEach(function(items){
            if(items.minBuy){
              if(items.total < items.templateMOQ) {
                _t.leftnum = parseInt(items.templateMOQ - items.total);
              } else {
                _t.leftnum = items.templateIOQ - (parseInt(items.total - items.templateMOQ) % items.templateIOQ);
                if(_t.leftnum == items.templateIOQ) {
                  _t.leftnum = 0;
                }
              }
            }
          });
        });
      }
    },
    mounted () {
    },
    computed:{
      totalPrice:function(){
        var total = 0;
        this.listdata.forEach(function(good){
          good.cartGoodsList.forEach((item)=>{
            if(item.isChecked){
              if(item.price!=undefined){
                total += item.price * item.erpUnitsConversion * item.number;
              }else{
                total += 0;
              }
            }
          });
        });
        return total;
      },
    },
    filters:{
      Currency:function(val){
        return '¥' + val.toFixed(2) + " 元";
      },
    },
    components: {
      login,
      Group,
      Cell,
      XNumber,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      footerCommon,
    }
  }
</script>
