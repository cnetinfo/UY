<template>
  <div class="home p-b-50">

    <div class="scrollrows s-b-50" @scroll="scroller($event)">

      <div  class="searchBar">
        <input type="text" v-model="searchtext" placeholder="请输入商品名称">
        <button @click="searchGoods">搜 索</button>
      </div>

      <div class="scrollbar-wrap">
        <div class="scrollbar-cell"><a @click="allgoods">全部商品</a></div>
        <div class="scrollbar-cell"><a @click="allorder">查看订单</a></div>
        <div class="scrollbar-cell" style="display:none;"><a @click="groupbuy">团购</a></div>
        <div class="scrollbar-cell" v-if="islottery"><a :href="lotterylink">大转盘</a></div>
      </div>

      <swiper loop auto :list="bannerList" height="150px" dots-position="center" :show-desc-mask="false" :index="bannerIndex" @on-index-change="onIndexChange"></swiper>

      <div class="bg-white p-b-10 bottomborder">
        <grid :rows="4" class="noborder bottomborder">
          <grid-item  v-for="(item,index) in navList" :key="index" :link="item.navigationObjId?'category?id='+item.navigationObjId+'&name='+item.navigationName:item.toUrl" >
            <img slot="icon" :src="item.navigationLogoUrl" v-if="navigationShape==1">
            <img slot="icon" :src="item.navigationLogoUrl" style="border-radius:15px;" v-else-if="navigationShape==2">
            <img slot="icon" :src="item.navigationLogoUrl" style="border-radius:50%;" v-else>
            <p class="text-center font-size-12">{{item.navigationName}}</p>
          </grid-item>
        </grid>
        <div class="notice">
          <i class="icon_notice"></i>
          <marquee>
            <marquee-item v-for="(item,index) in advlist" :key="index" @click.native="onTurn(item.link)">
              <div>
                <p style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{item.content}}</p>
              </div>
            </marquee-item>
            <marquee-item v-for="(item,index) in orderlist" :key="index" @click.native="onTurn(item.link)">
              <div>
                <p style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{item.content}}</p>
              </div>
            </marquee-item>
            <marquee-item v-if="weathelist!=''">
              <div>
                <p style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  {{weathelist.area}} {{weathelist.txt_d}} {{weathelist.tmpmax}}/{{weathelist.tmpmin}}℃
                  {{weathelist.windDir}} {{weathelist.wind}}
                </p>
              </div>
            </marquee-item>
          </marquee>
        </div>
      </div>

      <div class="list m-t-10">
        <div class="list-rows" style="min-height: 250px" v-for="(category,i) in  categorylist">
          <div class="linerows linerowsbg">
            <a class="navtitle" @click="$router.push('category?id='+category.cid+'&name='+category.cname)">{{category.cname}}</a>
          </div>
          <div class="list-cell">
            <ul>
              <li v-for="(item,index) in productlist" v-if="category.id == item.categoryId">
                <a @click='$router.push("goods?id="+item.goodsSpecId)'>
                  <span class="icon_very" v-if="item.rushbuy==1" style="background: #F33966; color: #FFFFFF;">抢购</span>
                  <span class="icon_very" v-if="item.groupbuyPrice!=undefined" style="background: #FF7C43; color: #FFFFFF;">团购</span>
                  <img :src="item.thumbnailUrl" width="100%"/>
                  <div class="info">
                    <p class="twoline">{{item.title}}</p>

                    <p v-if="item.rushbuy==1" >
                      <span class="gcolor">{{'¥'+item.rushbuyPrice}}</span>
                      <span class="greycolor pull-right" style="text-decoration:line-through;">{{item.goodsPrice.costPrice?'¥'+item.goodsPrice.costPrice:'暂无货'}}</span>
                    </p>
                    <p class="gcolor"  v-else-if="item.groupbuyPrice!=undefined">
                      <span class="gcolor">{{'¥'+item.groupbuyPrice}}</span>
                      <span class="greycolor pull-right" style="text-decoration:line-through;">{{item.goodsPrice.costPrice?'¥'+item.goodsPrice.costPrice:'暂无货'}}</span>
                    </p>
                    <p class="gcolor" v-else>{{item.goodsPrice.costPrice?'¥'+item.goodsPrice.costPrice:'暂无货'}}</p>
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
    <footer-common></footer-common>
  </div>
</template>

<script type="text/babel">
  import { Swiper, Grid, GridItem, Clocker, Marquee, MarqueeItem, LoadMore } from 'vux'
  import login from '../components/login.vue'
  import footerCommon from '../components/footer.vue'
  export default {
    name: '',
    data () {
      return {
        navigationShape:'',
        searchtext:'',
        islottery:false,
        lotterylink:'',
        loading:false,
        pending:false,
        islogin:false,
        show:false,
        bannerList: [],
        bannerIndex: 0,
        advlist:[],
        orderlist:[],
        weathelist:'',
        navList: [],
        categorylist:[],
        productlist:[],
        pageIndex:'',
        seq:0,
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.getbBase();
        vm.getList();
        vm.$store.dispatch('getJssdk');
        //vm.getPost();
        vm.shareshop();
      });
    },
    methods: {
      getPost(){
        const vm = this;
        //默认获取地址
        this.$store.dispatch('getJssdk');
        var wx = this.$wechat;
        wx.ready(()=>{
          wx.getLocation({
            success: function (res) {
              let l = "mall/getPosition.do";
              let d = {
                lon:res.longitude,
                lat:res.latitude
              };
              vm.$post(l,d,function(_t,r){});
            },
            cancel: function (res) {
              vm.$vux.toast.text('用户拒绝授权获取地理位置','middle');
            }
          });
        });
      },
      shareshop(){
        var wx = this.$wechat;
        let l = "mall/shareShop.do";
        this.$post(l,{},function(_t,r){
          var title = r.data.shareTitle;
          var subTitle = r.data.shareSubTitle;
          var linkurl = r.link;
          var themeImageUrl = r.data.photoUrl;
          _t.$store.dispatch('wxshare',{
            title:title,
            subTitle:subTitle,
            linkurl:linkurl,
            themeImageUrl:themeImageUrl
          });
        });
      },
      allgoods(){
        this.$router.push('/category')
      },
      allorder(){
        this.$router.push('/order')
      },
      integralbuy(){
        this.$router.push('/goods/integralmall')
        //location.href = this.$store.state.basePath + 'integral/integralmall.do?partnerid=' + this.$store.state.partnerid;
      },
      rushbuy(){
        this.$router.push('/goods/rushbuy')
        //location.href = this.$store.state.basePath + 'mall/rushbuyindex.do?partnerid=' + this.$store.state.partnerid;
      },
      groupbuy(){
        this.$router.push('/groupbuy')
        //location.href = this.$store.state.basePath + 'mall/groupbuy.do?partnerid=' + this.$store.state.partnerid;
      },
      searchGoods(){
        if(this.searchtext!=''){
          this.$router.push('/goods/search?key='+this.searchtext);
        }else{
          this.$vux.toast.text('请输入商品名称','middle');
        }
      },
      getbBase(){
        let d = {};
        let l = "mall/shopbanners.do";
        this.$post(l,d,function(_t,r){
          _t.bannerList=r.data
          if(r.data.length!=0){
            _t.bannerList.forEach(function (item) {
              _t.$set(item,'img',item.bannerImageUrl);
              if(item.goodsSpecificationId){
                _t.$set(item,'url','goods?id='+item.goodsSpecificationId);
              }else if(item.categoryId){
                _t.$set(item,'url','category?id='+item.categoryId+'&name='+item.categoryName);
              }else{
                _t.$set(item,'url',item.link);
              }
            });
          }
        },function(_t,r){
          _t.islogin = true;
        });
        let advlink = "mall/listMarqueeInfo.do";
        this.$post(advlink,d,function(_t,r){
          if(r.data.length){
            r.data.forEach(function(item){
              if(item.type==1) {
                item.contentList.forEach(function(child){
                  _t.advlist.push(child);
                });
              }else if(item.type==2){
                _t.orderlist = item.contentList;
              }else if(item.type==3){
                _t.weathelist = item.weatherInfo;
              }
            });
          }
        },'','',1);
        let navlink = "mall/queryShopIndexNavigations.do";
        this.$post(navlink,d,function(_t,r){
            if(r.data){
              _t.navList =r.data.customNavigationDetailsVOs;
              _t.navigationShape =r.data.navigationShape;
            }
        });
        let lotterylink = "lottery/showIndexLotteryActivity.do";
        this.$post(lotterylink,d,function(_t,r){
          _t.islottery = r.data.show
          if(_t.islottery){
            _t.lotterylink = _t.$store.state.basePath+'/lottery/lottery.do?activityId='+r.data.activityId ; //链接大转盘页面
          }
        });
      },
      getList(){
        this.loading = true;
        this.pending = true;
        let d = {
          lastCategoryId: this.pageIndex,
        };
        let l = "mall/homeitems.do";
        this.$post(l,d,function(_t,r){
          var gpsLocate = r.data.gpsLocate;
          if(gpsLocate==1){
            _t.getPost();
          }
          _t.loading = false;
          _t.pending = false;
          if(r.data.goods!=undefined){
            var _list = r.data.goods;
            _t.productlist = [..._t.productlist, ..._list]; //_t.productlist = r.data.goods;
            if (_list.length==0) {
              return;
            }
            if(_list.length!=0) {
              _t.pageIndex = _list[_list.length - 1].categoryId
            };
            _t.categorylist.push({
              id: r.data.categoryId,
              cid: r.data.goodsCategoryId,
              cname: r.data.categoryName
            });
          }
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
      onIndexChange (index) {
        //this.demo06_index = index
      },
      onTurn(link){
        if(link!=undefined){
          location.href = link;
        }else{
            return false
        }
      }
    },
    mounted () {

    },
    components: {
      Swiper,
      Grid,
      GridItem,
      Clocker,
      Marquee,
      MarqueeItem,
      LoadMore,
      login,
      footerCommon,
    }
  }
</script>
