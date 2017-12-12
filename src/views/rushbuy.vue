<template>
  <div class="">

    <div class="scrollrows">
      <div class="list-cell" v-for="(item,index) in productlist">
        <div class="linerows linerowsbg">
          <a class="navtitle" @click='$router.push("/goods/rushbuy/"+item.id)'>
            {{item.name}}
            <span class="ucolor font-size-12">
              ( 剩下
              <clocker :time="item.endTime.replace(/T/,' ')" slot="value" :format="'%D 天 %H : %M : %S'"></clocker>
              结束 )
            </span>
          </a>
        </div>
        <ul>
          <li  v-for="(child,index) in item.goodsList">
            <a @click='$router.push("/goods?id="+child.goodsSpecificationId)'>
              <span class="rushi">限时特惠</span>
              <img :src="child.goodsLogoUrl" width="100%"/>
              <div class="info">
                <p class="twoline">{{child.goodsTitle}}</p>
                <p class="gcolor"><span class="font-size-12">¥</span>{{child.rushbuyPrice}}</p>
                <span class="rushbtn">抢</span>
                <s class="greycolor" v-if="child.retailPrice"><span class="font-size-12">¥</span>{{child.retailPrice}}</s>
                <p ><span class="font-size-12">已售</span> {{child.salesNumber}}</p>
              </div>
            </a>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script type="text/babel">
  import { Swiper, Grid, GridItem, Marquee, MarqueeItem, Clocker, LoadMore } from 'vux'
  import login from '../components/login.vue'
  export default {
    name: '',
    data () {
      return {
        pageIndex:'',
        pageSize:10,
        loading:false,
        islogin:false,
        productlist:[]
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.getList();
      });
    },
    methods: {
      getList(){
        this.loading = true;
        let d = {
          lastspecid: this.pageIndex,
        };
        let l = "mall/rushbuypromotions.do";
        this.$post(l,d,function(_t,r){
          _t.loading = false;
          _t.productlist = r.data;
          /*_t.productlist = [..._t.productlist, ..._list];
          if (_list.length==0) {
            return;
          }
          if(_list.length!=0) {
            _t.pageIndex = _list[_list.length - 1].id;
          };*/
        },function(_t,r){
          _t.islogin = true;
        });
      }
    },
    components: {
      Swiper,
      Grid,
      GridItem,
      Marquee,
      MarqueeItem,
      Clocker,
      LoadMore,
      login

    }
  }
</script>
<style lang="scss">
  .rushi{
    background: #dd363a;
    color: #fff;
    padding: 2px;
    width: 26px;
    border-radius: 0 0 10px 0;
    display: block;
    line-height: 14px;
    font-size: 12px;
    position: absolute;
  }
  .rushbtn{
    background: #e96f6a;
    border: 1px solid #dc3e35;
    border-radius:5px;
    line-height:14px;
    color: #fff;
    padding:10px;
    float:right;
    margin-right:5px;
    margin-bottom:5px;
    position: relative;
    display: block;
  }
</style>
