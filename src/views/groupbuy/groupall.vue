<template>
  <div class="home p-b-50">
    <div class="navbar">
      <scroller lock-y :scrollbar-x=false ref="scroller">
        <div class="box1" :style="{width:navitems.length*120+'px'}">
          <div class="box1-item" v-for="(i,n) in navitems" :class="{active:n==index}" @click="loadnavitem(i.id,n)"><span>{{i.name}}</span></div>
        </div>
      </scroller>
    </div>
    <div class="scrollrows s-t-50" @scroll="scroller($event)">
      <group class="m-b-5"  v-for="(item, index) in productlist" :key="index">
        <div class="grouptitle tt">
          <span class="font-size-14 gcolor">
           <img class="avatar" :src="item.leaderAvatar" alt="" v-if="item.leaderAvatar">
           <img class="avatar" src="../../assets/images/user_avatar.png" alt="" v-else>
            {{item.leaderNickName=='' || item.leaderNickName==undefined ? '团友':item.leaderNickName}}
          </span>
          <p>剩余<clocker :time="item.expiry.replace(/T/,' ')" slot="value" :format="'%D 天 %H : %M : %S'"></clocker>结束</p>
        </div>
        <cell :link="'/goods?id='+item.goodsSpecificationId">
          <div slot="inline-desc">
            <div style="display: flex">
              <span class="font-size-16" style="margin-right: 10px; display:flex">
                <img :src="item.goodsLogoUrl" width="60" height="60" />
              </span>
              <span style="width: 100%;">
                <p ><span class="font-size-14 bcolor twoline">{{item.goodsTitle}}</span></p>
                <p ><span class="font-size-12">订单编号：{{item.orderCode}}</span></p>
                <p class="m-t-5">
                  <span class="gcolor">实付款：¥{{item.groupbuyPrice}}</span>
                </p>
              </span>
            </div>
          </div>
        </cell>
        <div class="linerows" style="border-top: 1px solid #F1F1F1">
          <span class="font-size-14" v-if="Number(item.memberLimit-item.joinedNumber)==0" ><span class="ucolor">{{item.memberLimit}}</span>人团，已组团成功</span>
          <span class="font-size-14" v-else>{{item.memberLimit}}人团，还差<span class="ucolor">{{item.memberLimit-item.joinedNumber}}</span>人成团</span>
          <span class="pull-right">
            <button class="debtn" style="margin-top: -3px;" @click="$router.push('/groupbuy/detail?id='+item.id)">
              <span>去参团</span>
            </button>
          </span>
        </div>
      </group>
      <load-more tip="正在加载" v-if="loading"></load-more>
    </div>
    <login v-show="islogin"></login>
    <footerbar></footerbar>
  </div>
</template>

<script type="text/babel">
  import { Swiper, Grid, GridItem, Marquee, MarqueeItem, Clocker , LoadMore, Cell, Group, Scroller } from 'vux'
  import footerbar from '../../components/footergroup.vue'
  import login from '../../components/login.vue'
  export default {
    name: '',
    data () {
      return {
        pageIndex:'',
        pageSize:10,
        loading:false,
        islogin:false,
        productlist:[],
        navitems:[],
        index:0,
        gid:''
      }
    },
    created(){
      this.getcategory()
    },
    mounted(){

    },
    methods: {
      getcategory(){
        let l = "mall/listgroupcategory.do";
        let d={};
        this.$post(l,d,function(_t,r){
          _t.navitems=r.data;
          _t.gid=_t.navitems[0].id;
          _t.$nextTick(() => {
            _t.$refs.scroller.reset()
          })
          _t.getList(_t.navitems[0].id);
        });
      },
      getList(id){
        this.loading = true;
        let d = {
          categoryid:id,
          lastspecid: this.pageIndex,
        };
        let l = "mall/listallgroupbuy.do";
        this.$post(l,d,function(_t,r){

          _t.loading = false;
          var _list = r.data.group;
          _t.productlist = [..._t.productlist, ..._list];
          if (_list.length==0) {
            return;
          }
          if(_list.length!=0) {
            _t.pageIndex = _list[_list.length - 1].goodsId;
          };

        },function(_t,r){
          _t.islogin = true;
        });
      },
      scroller(event){
        var offsetHeight = event.currentTarget.offsetHeight
        var scrollHeight = event.target.scrollHeight
        var scrollTop = event.target.scrollTop
        var scrollBottom = offsetHeight + scrollTop + 1
        if (scrollHeight === scrollBottom) {
          if(this.pending) {
            return;
          }
          this.getList(this.gid)
        }
      },
      loadnavitem(id,i){
        this.index = i;
        this.productlist=[];
        this.gid = id;
        this.getList(id)
      },
      gogroup(id,gid){
        var objects = {};
        objects[gid] = 1;
        let d = {
          goods: JSON.stringify(objects),
          activityType:340,
          activityTag: id
        };
        let l = "mall/prepareystsettle.do";
        this.$post(l,d,function(_t,r){
          _t.$router.push({path:'/order/submit', query:{ id: r.data }});
        });
      }
    },
    mounted () {
    },
    watch: {
      //'$route':'getList'
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
      Clocker,
      Scroller,
      footerbar
    }
  }
</script>
<style lang="scss" scoped>
  .avatar{
    width: 32px;
    height: 32px;
    background-size: cover;
    border-radius: 50%;
    vertical-align: middle;
    margin-right:5px;
  }
  .btnchange{
    float: right;
    display: inline-block;
    margin:-35px 15px 5px 0;
  }

  .navbar{
    position: fixed;
    z-index: 10;
    top:0;
    left:0;
    width: 100%;
    overflow-x: scroll;
    background: #fff;
    &+div{
      margin-top: 2px;
    }
  }
  .tt{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .box1 {
    height: 50px;
    position: relative;
    min-width: 100%;
  }
  .box1-item {
    height: 50px;
    width:100px;
    font-size:14px;
    padding: 0 10px;
    border-bottom:1px solid #fff;
    background-color: #fff;
    display:inline-block;
    float: left;
    text-align: center;
    line-height: 50px;
    overflow: hidden; /*自动隐藏文字*/
    text-overflow: ellipsis;/*文字隐藏后添加省略号*/
    white-space: nowrap;/*强制不换行*/
    &.active{
      color: #FF7C43;
      border-bottom:2px solid #FF7C43;
    }
  }
  .box2-wrap {
    height: 300px;
    overflow: hidden;
  }
</style>
