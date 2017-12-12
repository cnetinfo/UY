<template>
  <div class="groupbuy">
    <div class="scrollrows s-b-50" @scroll="scroller($event)">
      <div class="list">
        <div class="list-rows">
          <div class="list-cell group">
            <div class="navbar">
              <scroller lock-y :scrollbar-x=false ref="scroller">
                <div class="box1" :style="{width:navitems.length*120+'px'}">
                  <div class="box1-item" v-for="(i,n) in navitems" :class="{active:n==index}" @click="loadnavitem(i.id,n)"><span>{{i.name}}</span></div>
                </div>
              </scroller>
            </div>
            <ul>
              <li v-for="(item,index) in productlist">
                <a @click='$router.push("/goods?id="+item.goodsSpecificationId)'>
                  <img :src="item.goodsLogoUrl" width="100%"/>
                  <div class="info">
                    <p class="twoline">{{item.goodsTitle}}</p>
                    <p class="">
                      <span class="ucolor">¥{{item.groupbuyPrice}}</span>
                      <s class="font-size-12 greycolor">单买价¥{{item.retailPrice}}</s>
                      <span class="pull-right">
                        <label class="ucolor m-r-5">{{item.memberNumber}}人团</label>
                        <button class="debtn-outline m-r-5 redbtn" @click.stop="gogroup(item.id,item.goodsSpecificationId)">去开团</button>
                      </span>
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
    <footerbar></footerbar>
  </div>
</template>
<script type="text/babel">
  import { Swiper, Grid, GridItem, Marquee, MarqueeItem, LoadMore, Cell, Group, Scroller } from 'vux'
  import footerbar from '../../components/footergroup.vue'
  import login from '../../components/login.vue'
  export default {
    name: '',
    data () {
      return {
        categoryid:'',
        pageIndex:'',
        pageSize:10,
        loading:false,
        islogin:false,
        productlist:[],
        navitems:[],
        index:0
      }
    },
    created(){
      this.$store.dispatch('getJssdk');
      this.getcategory();
    },
    mounted(){
      this.$nextTick(() => {
        this.$refs.scroller.reset()
      })
    },
    methods: {
      getcategory(){
        let l = "/mall/listhomecategory.do";
        let d ={};
        this.$post(l,d,function(_t,r){
          _t.navitems=r.data;
          _t.$nextTick(() => {
            _t.$refs.scroller.reset()
          });
          _t.getList(_t.navitems[0].id);
        });
      },
      getList(id){
        this.categoryid = id;
        this.loading = true;
        let d = {
          categoryid:id,
          lastgoodsid: this.pageIndex,
        };
        let l = "mall/listhomegoods.do";
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
        if (scrollHeight === scrollBottom) {
          if(this.pending) {
            return;
          }
          this.getList(this.categoryid)
        }
      },
      loadnavitem(id,i){
        this.index = i;
        this.productlist=[];
        this.pageIndex ='';
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
      Scroller,
      footerbar
    }
  }
</script>
<style lang="scss" scoped>
  .group{
    ul li{
      width:100%;
      box-sizing: border-box;
      a{
        position: relative;
        margin: 5px 0;
        img{
          display: block;
        }
        .info{
          position: absolute;
          bottom: 0;
          left:0;
          right:0;
          margin: auto;
          background: rgba(255,255,255,0.8);
          padding: 10px;
        }
      }
    }
  }
  .btnchange{
    float: right;
    display: inline-block;
    margin:-35px 15px 5px 0;
  }

  .navbar{
    position: fixed;
    z-index: 3;
    top:0;
    left:0;
    width: 100%;
    overflow-x: scroll;
    background: #fff;
    &~ul{
      margin-top: 50px;
    }
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
