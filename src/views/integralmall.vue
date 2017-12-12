<template>
  <div class="home p-b-50">

    <div class="scrollrows" @scroll="scroller($event)">

      <div class="list">
        <div class="list-rows">
          <div class="list-cell">
            <group>
              <cell title="我的积分">
                <div slot="value">
                  <span style="color: red">{{integral}}</span>
                  <span style="color: #000">分</span>
                </div>
              </cell>
            </group>
            <ul>
              <li v-for="(item,index) in productlist">
                <a @click=''><!--//$router.push("/goods?id="+item.goodsLogoId)-->
                  <img :src="item.logoUrl" width="100%"/>
                  <div class="info">
                    <p class="twoline">{{item.goodsTitle}}</p>
                    <p class="greycolor">
                      <span class="font-size-12">需要{{item.integral}}分</span>
                      <button class="smallbtn colorborder font-size-12 btnchange" @click="change(item.integral,item.id)">兑换</button>
                    </p>
                  </div>
                </a>

              </li>
            </ul>
          </div>
        </div>
        <load-more tip="正在加载" v-if="loading"></load-more>
      </div>

    </div>
    <login v-show="islogin"></login>
  </div>
</template>

<script type="text/babel">
  import { Swiper, Grid, GridItem, Marquee, MarqueeItem, LoadMore, Cell, Group, ToastPlugin } from 'vux'
  import login from '../components/login.vue'
  export default {
    name: '',
    data () {
      return {
        integral:'',
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
          lastgoodsid: this.pageIndex,
        };
        let l = "integral/listexchangedgoods.do";
        this.$post(l,d,function(_t,r){
          _t.loading = false;
          _t.integral = r.data.integral;
          var _list = r.data.goods;
          _t.productlist = [..._t.productlist, ..._list]; //_t.productlist = r.data.list;
          if (_list.length==0) {
            return;
          }
          if(_list.length!=0) {
            _t.pageIndex = _list[_list.length - 1].id;
          };
        },function(_t,r){
          _t.islogin = true;
        });
      },
      scroller(event){
        var offsetHeight = event.currentTarget.offsetHeight
        var scrollHeight = event.target.scrollHeight
        var scrollTop = event.target.scrollTop
        var scrollBottom = offsetHeight + scrollTop
        if (scrollHeight === scrollBottom) {
          if(this.pending) {
            return;
          }
          this.getList()
        }
      },
      change(i,id){
        if (this.integral < i) {
          this.$vux.toast.text('积分不足~', 'middle')
          return
        }
        this.$router.push('/goods/integralmall/'+ id );
      }
    },
    mounted () {
    },
    watch: {
      '$route':'getList'
    },
    components: {
      Swiper,
      Grid,
      GridItem,
      Marquee,
      MarqueeItem,
      LoadMore,
      login,
      Cell,
      Group,
      ToastPlugin
    }
  }
</script>
<style lang="scss" scoped>
  .btnchange{
    float: right;
  }
</style>
