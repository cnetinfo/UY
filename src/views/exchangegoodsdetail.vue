<template>
  <div class="goodsdetail">
    <div class="scrollrows s-b-50">
      <swiper loop auto :list="bannerList" :index="bannerIndex" @click.native="previewimg(bannerIndex,bannerList)" dots-position="center" class="bottomborder" :show-desc-mask="false" :aspect-ratio="1/1" ></swiper>
      <div class="linerows">
        <p>{{goodsinfo.title}}</p>
        <p class="greycolor font-size-12">{{goodsinfo.subTitle}}</p>
        <p class="font-size-12">
          <span class="ucolor">
            <span></span><span class="font-size-16">{{goodsPrice}} </span>
          </span>
          <span class="pull-right">已售：{{goodsinfo.saleNumber}}</span>
        </p>
      </div>
      <div class="linerows m-t-10">
        <p>本商品由 <span class="ucolor">{{goodsinfo.shopName}}</span> 销售并提供服务</p>
        <p class="greycolor font-size-12">
          <span>预计发货时间：{{goodsinfo.deliveryTime}}</span>
          <span class="pull-right">发货地：{{goodsinfo.shipAddress}}</span>
        </p>
      </div>
      <div class="linerows m-t-10" v-if="goodsinfo.specTypeMap">
        <p>选择商品规格型号</p>
        <div class="m-t-10" v-for="(value, key, index)  in goodsinfo.specTypeMap" :key="key">
          <p><span>{{key}}</span></p>
          <p v-if="childindex!=-1">
            <button  v-for="(item,i) in value" @click="changespec(key,item,index+'-'+i)" class="debtn-outline m-r-5" :class="{'debtn':index+'-'+i == childindex}">{{item}}</button>
          </p>
          <p v-else>
            <button  v-for="(item,i) in value" @click="changespec(key,item,index+'-'+i)" class="debtn-outline m-r-5" :class="{'debtn':selectgoods[key]==item}" >{{item}}</button>
          </p>
        </div>
      </div>

      <div class="m-t-10">
        <tab :line-width=2 active-color='#ff7c43' v-model="index">
          <tab-item :selected="nav == item" v-for="(item, index) in navlist" @on-item-click="onItemClick" :key="index">{{item}}</tab-item>
        </tab>
        <div v-for="(item, index) in navlist" :key="index" v-show="nav == navlist[index]" >
          <div v-if="navlist[index]=='商品详情'">
            <div v-html="goodsinfo.detailsMobile" class="goodsdetail"></div>
          </div>
          <div v-else-if="navlist[index]=='规格参数'">
            <div v-html="goodsinfo.specParams" class="goodsdetail"></div>
          </div>
          <div v-else="navlist[index]=='包装售后'">
            <div v-html="goodsinfo.salesService" class="goodsdetail"></div>
          </div>
        </div>
      </div>
    </div>

    <footer class="bottom-wrap bottom-bar-fixed">
      <nav class="bottom-bar-tab">
        <a class="cant-tab-item" style="background-color: #ff4141; color:#FFF;" @click="exchangeGoods">立即兑换</a>
      </nav>
    </footer>

  </div>
</template>

<script type="text/babel">
  import { Swiper, Group, Cell, XNumber,Tab, TabItem, Clocker } from 'vux'
  export default {
    name: '',
    data () {
      return {
        bannerList: [],
        navlist:['商品详情','规格参数','包装售后'],
        nav: '商品详情',
        index: 0,
        bannerIndex: 0,
        selectgoods:'',
        changegoods:[],
        goodsinfo:'',
        goodsPrice:'',
        goodsNumber:1,
        specid:'',
        childindex:-1,
        cartNum:'',
        showcartNum:false,
        startorend:'',
        groupbuyid:'',
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getgoodsinfo();
        vm.getCartcount();
      });
    },
    methods:{
      previewimg(i,el){
        var list = [];
        list.push(el[i].img);
        let vm = this;
        let wx = this.$wechat;
        wx.ready(()=> {
          wx.previewImage({
            current: el[i].img,
            urls: list
          });
        })
      },
      getgoodsinfo(){
        this.specid = this.$route.query.id;
        let l = "mall/miniMallSpec.do";
        let d = {
          goodsSpecId:this.specid,
        };
        this.$post(l,d,function(_t,r){
          _t.goodsinfo = r.data;
          if(r.data.goodsPrice.costPrice){
            _t.goodsPrice = "¥"+ r.data.goodsPrice.costPrice;
          }else{
            _t.goodsPrice = "暂无货~";
          }
          var j = [];
          if(r.data.photoListImg!=undefined){
            for(var i=0; i<r.data.photoListImg.length; i++){
              var lists = r.data.photoListImg[i];
              j[i] = {
                url: 'javascript:',
                img: lists,
                title: ''
              }
            }
          }
          _t.bannerList = j;
          var goodsSpecId = r.data.goodsSpecId; //规格ID
          var spec = [];
          for(var key in r.data.specDescMap){
            if(key == goodsSpecId) {
              spec = r.data.specDescMap[key];
            }
          }
          _t.selectgoods = spec;

        });

      },
      onItemClick (index) {
        if(index ==0){
          this.nav = "商品详情"
        }else if(index ==1){
          this.nav = "规格参数"
        }else if(index ==2){
          this.nav = "包装售后"
        }
      },
      changespec(k,el,i){
        this.childindex = i
        for(var key in this.selectgoods){
          this.changegoods[key]=this.selectgoods[key];
        }
        var specs =[];
        this.changegoods[k]=el
        for(var key in this.changegoods){
          specs.push(this.changegoods[key]);
        }
        for(var keys in this.goodsinfo.specDescMap){
          var item = [];
          for(var childkey in this.goodsinfo.specDescMap[keys]){
            if(item.length > 0) {
              item += ",";
            }
            item += this.goodsinfo.specDescMap[keys][childkey];
          }
          if(specs.join()==item) {
            this.$router.push({path:'/goods', query:{ id: keys }});
            this.childindex = -1;
          };
        }
      },
      getCartcount(){
        let d = {};
        let l = "mall/cartcount.do";
        this.$post(l,d,function(_t,r){
          if(r.data>0){
              _t.showcartNum = true;
          }
          _t.cartNum = r.data;
        });
      },
      exchangeGoods(){
        let l = "ticket/startexchange.do";
        let d = {
          specificationid:this.$route.query.id
        };
        this.$post(l,d,function(_t,r){
          _t.$router.push({path:'/order/submit', query:{ id: r.data.settleid }});
        });
      }
    },
    watch: {
      '$route':'getgoodsinfo'
    },
    components: {
      Swiper,
      Group,
      Cell,
      XNumber,
      Tab,
      TabItem,
      Clocker
    }
  }
</script>
