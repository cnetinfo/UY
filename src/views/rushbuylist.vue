<template>
  <div class="">

    <div class="scrollrows" @scroll="scroller($event)">
      <div class="list-cell">
        <ul>
          <li v-for="(item,index) in productlist">
            <a @click='$router.push("/goods?id="+item.goodsSpecificationId)'>
              <span class="rushi">限时特惠</span>
              <img :src="item.goodsLogoUrl" width="100%"/>
              <div class="info">
                <p class="twoline">{{item.goodsTitle}}</p>
                <p class="gcolor"><span class="font-size-12">¥</span>{{item.rushbuyPrice}}</p>
                <span class="rushbtn">抢</span>
                <s class="greycolor" v-if="item.retailPrice"><span class="font-size-12">¥</span>{{item.retailPrice}}</s>
                <p ><span class="font-size-12">已售</span> {{item.salesNumber}}</p>
              </div>
            </a>
          </li>
        </ul>
      </div>
      <load-more tip="正在加载" v-if="loading"></load-more>


    </div>
  </div>
</template>

<script type="text/babel">
  import { Swiper, Grid, GridItem, Marquee, MarqueeItem, LoadMore } from 'vux'
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
          id:this.$route.params.id,
          lastspecid: this.pageIndex,
        };
        let l = "mall/rushbuygoods.do";
        this.$post(l,d,function(_t,r){
          _t.loading = false;
          var _list = r.data;
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
        console.log(scrollHeight)
        console.log(scrollBottom)
        if (scrollHeight === scrollBottom) {
          if(this.pending) {
            return;
          }
          this.getList()
        }
      }
    },
    components: {
      Swiper,
      Grid,
      GridItem,
      Marquee,
      MarqueeItem,
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
