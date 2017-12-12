<template>
  <div class="home p-b-50">

    <div class="scrollrows" @scroll="scroller($event)">

      <div  class="searchBar">
        <input type="text" v-model="searchtext" placeholder="请输入商品名称">
        <button @click="searchGoods">搜 索</button>
      </div>

      <div class="list">
        <div class="list-rows">
          <div class="list-cell">
            <ul>
              <li v-for="(item,index) in productlist">
                <a @click='$router.push("/goods?id="+item.goodsSpecId)'>
                  <img :src="item.thumbnailUrl" width="100%"/>
                  <div class="info">
                    <p class="twoline">{{item.title}}</p>
                    <p class="gcolor"><span class="font-size-12">¥</span>{{item.goodsPrice.costPrice}}</p>
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
  import { Swiper, Grid, GridItem, Marquee, MarqueeItem, LoadMore } from 'vux'
  import login from '../components/login.vue'
  export default {
    name: '',
    data () {
      return {
        searchtext:'',
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
      searchGoods(){
        this.pageIndex='';
        this.productlist=[];
        this.$router.push('/goods/search?key='+this.searchtext);
      },
      getList(){
        this.searchtext = this.$route.query.key;
        this.loading = true;
        let d = {
          keywords: this.$route.query.key,
          lastGoodsId: this.pageIndex,
        };
        let l = "mall/searchitems.do";
        this.$post(l,d,function(_t,r){
          _t.loading = false;
          var _list = r.data;
          _t.productlist = [..._t.productlist, ..._list]; //_t.productlist = r.data.list;
          if (_list.length==0) {
            return;
          }
          if(_list.length!=0) {
            _t.pageIndex = _list[_list.length - 1].goodsId;
          };
          this.searchtext=''
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
      login

    }
  }
</script>
