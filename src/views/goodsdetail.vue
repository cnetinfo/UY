<template>
  <div class="goodsdetail">
    <div class="scrollrows s-b-50">
      <swiper loop auto :list="bannerList" :index="bannerIndex" @click.native="previewimg(bannerIndex,bannerList)" dots-position="center" class="bottomborder" :show-desc-mask="false" :aspect-ratio="1/1" ></swiper>
      <div class="linerows">
        <p>{{goodsinfo.title}}</p>
        <p class="greycolor font-size-12">{{goodsinfo.subTitle}}</p>
        <p class="font-size-12">
          <span class="ucolor" v-if="goodsinfo.groupbuy&&goodsinfo.rushbuy!=1">
            <span>团购价:&yen;</span><span class="font-size-16">{{goodsinfo.groupbuy.groupbuyPrice}}元{{units}}</span>
            ( {{goodsinfo.groupbuy.memberNumber}}人团 )
            <span style="text-decoration: line-through; color:#999;">原价:{{goodsPrice}}{{units}}</span>
          </span>
          <span class="ucolor" v-else>
            <span></span><span class="font-size-16">{{goodsPrice}}{{units}}</span>
          </span>
          <span class="pull-right">已售：{{goodsinfo.saleNumber}}</span>
        </p>
      </div>
      <div class="rushbuy" v-if="goodsinfo.rushbuy==1">
        <div class="left">
          <p>&yen;<span id="rushbuyPrice" style="font-size:24px;">{{goodsinfo.rushbuyPrice}}</span> 元</p>
          <p>第<span id="rushbuylimit">{{goodsinfo.rushbuyLimit}}</span>份后恢复原价</p>
        </div>
        <div class="right">
          <p class="m-t-10">{{startorend}}</p>
          <p><clocker :time="getTimes" slot="value" :format="'%D 天 %H : %M : %S'"></clocker></p>
        </div>
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
      <div class="linerows" >
        <span>购买数量</span>
        <span class="pull-right" style="margin-top:-3px">
          <x-number v-model="goodsNumber" :min="goodsinfo.ioq" :step="goodsinfo.moq" :max="100000" :fillable="true" style="padding:0 !important;"></x-number>
        </span>
        <p class="greycolor m-t-10" v-if="goodsinfo.mixBuy==true">
          <span>&nbsp;</span>
          <span class="pull-right font-size-12">起订<span class="ucolor">{{goodsinfo.moqDesc}}</span>，增订<span class="ucolor">{{goodsinfo.ioqDesc}}</span></span>
        </p>
      </div>

      <div v-if="othergroupbuylist.length!=0">
        <p class="pd-10 font-size-14">已有用户正在发起团购，可直接参团</p>
        <group>
          <cell v-for="(item,index) in othergroupbuylist" :key="index" style="height:40px;">
            <div slot="inline-desc">
              <div style="display: flex">
                <span class="font-size-16 m-r-10">
                  <img :src="item.leaderAvatar" width="40" height="40" style="width:40px; height: 40px; border-radius: 50%; vertical-align: bottom" v-if="item.leaderAvatar" />
                  <img src="../assets/images/user_avatar.png" width="40" height="40" style="width:40px; height: 40px; border-radius: 50%; vertical-align: bottom" v-else />
                </span>
                <span style="line-height:40px;">{{item.leaderNickName}}</span>
              </div>
            </div>
            <div slot="value">
              <div class="pull-left font-size-12 m-r-10">
                <p class="ucolor">差{{item.remainSeats}}人可成团</p>
                <p>剩余<clocker :time="item.expiry.replace(/T/,' ')" slot="value" :format="'%D 天 %H : %M : %S'"></clocker>结束</p>
              </div>
              <a @click="$router.push('/groupbuy/detail?id='+item.id)" class="redbtn font-size-14" style="display: inline-block; margin-top: 3px;">去参团</a>
            </div>
          </cell>
        </group>
      </div>

      <div class="m-t-10">
        <tab :line-width=2 active-color='#ff7c43' v-model="index">
          <tab-item :selected="nav == item" v-for="(item, index) in navlist" @on-item-click="onItemClick" :key="index">{{item}}</tab-item>
        </tab>
        <div v-for="(item, index) in navlist" :key="index" v-show="nav == navlist[index]"   style="overflow:hidden; word-break: break-all;">
          <div v-if="navlist[index]=='商品详情'">
            <div v-html="goodsinfo.detailsMobile" class="goodsdetail" @click="previewimgs"></div>
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
        <a class="cant-tab-item" style="position: relative" @click='$router.push("/shopcart")'>
          <span class="icons icon_nav_cart"></span> 购物车 <span class="carnum" v-show="showcartNum">{{cartNum}}</span>
        </a>
        <a class="cant-tab-item" style="background-color: #FF7C43; color:#FFF;" @click="addTocart">加入购物车</a>
        <a class="cant-tab-item" style="background-color: #ff4141; color:#FFF;" @click="buyNow">立即购买</a>
        <a class="cant-tab-item" style="background-color:#EA4B42; color:#FFF;" @click="groupbuyNow" v-if="goodsinfo.groupbuy&&goodsinfo.rushbuy!=1">组团购买</a>
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
        units:'',
        goodsPrice:'',
        goodsNumber:1,
        specid:'',
        childindex:-1,
        cartNum:'',
        showcartNum:false,
        startorend:'',
        groupbuyid:'',
        othergroupbuylist:[],
        getTimes:''
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getgoodsinfo();
        vm.getCartcount();
      });
    },
    methods:{
      sharegoods(){
        this.$store.dispatch('getJssdk');
        var wx = this.$wechat;
        let d = {
          goodsSpecId:this.specid
        };
        let l = "mall/shareGood.do";
        this.$post(l,d,function(_t,r){
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
      previewimgs(e){
        var list = [];
        var str = this.goodsinfo.detailsMobile;
        var imgReg = /<img.*?(?:>|\/>)/gi;
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        var arr = str.match(imgReg);
        for (var i = 0; i < arr.length; i++) {
          var src = arr[i].match(srcReg);
          //获取图片地址
          if (src[1]) {
            list.push(src[1]);
          }
          //当然你也可以替换src属性
          if (src[0]) {
            var t = src[0].replace(/src/i, "href");
          }
        }
        let vm = this;
        let wx = this.$wechat;
        wx.ready(()=> {
          wx.previewImage({
            current: e.target.src,
            urls: list
          });
        })
      },
      getgoodsinfo(){
        if(this.specid == ''){
          this.specid = this.$route.query.id;
        }
        let l = "mall/miniMallSpec.do";
        let d = {
          goodsSpecId:this.specid,
        };
        this.$post(l,d,function(_t,r){
          _t.goodsinfo = r.data;

          if(r.data.goodsPrice.costPrice){
            _t.goodsPrice = "¥"+ r.data.goodsPrice.costPrice+'元';
            if(r.data.units==undefined){
              _t.units = '';
            }else{
              _t.units = '/'+r.data.units;
            }
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

          if(r.data.groupbuy){  //获取组团ID
            _t.groupbuyid = r.data.groupbuy.id;
            _t.othergroupbuylist =r.data.groupbuy.groups;
          }
          if(r.data.rushbuy==1){  //抢购
            var startTime = r.data.rushbuyStartTime.replace(/T/, ' '); //开始
            var endTime = r.data.rushbuyEndTime.replace(/T/, ' '); //结束
            if(r.data.rushbuyStock == 0){
              _t.startorend ="抢光啦!";
            } else if(new Date().getTime() < new Date(startTime.replace(/-/g,'/')).getTime()) {
              _t.startorend ="距开始还剩";
              _t.getTimes = startTime;
              //_t.countDownTimer(startTime, 'datetime');
            } else if(new Date().getTime() > new Date(endTime.replace(/-/g,'/')).getTime()) {
              _t.startorend ="活动已结束";
            } else {
              _t.startorend ="距结束还剩";
              _t.getTimes = endTime;
              //_t.countDownTimer(endTime, 'datetime');
            }
          }
          _t.sharegoods();

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
            this.specid= keys;
            this.getgoodsinfo();
            //this.$router.push({path:'/goods', query:{ id: keys }});
            this.childindex = -1;
          };
        }
      },
      addTocart(){
        let d = {
          specId: this.specid,
          number: parseInt(this.goodsNumber),
        };
        let l = "mall/addcartitem.do";
        this.$post(l,d,function(_t,r){
            _t.getCartcount();
        });
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
      buyNow(){
        var objects = {};
        objects[this.specid] = parseInt(this.goodsNumber);
        let d = {
          goods: JSON.stringify(objects),
          activityType:1501,
        };
        let l = "mall/prepareystsettle.do";
        this.$post(l,d,function(_t,r){
          _t.$router.push({path:'/order/submit', query:{ id: r.data }});
        });
      },
      groupbuyNow(){
        var objects = {};
        objects[this.specid] = parseInt(this.goodsNumber);
        let d = {
          goods: JSON.stringify(objects),
          activityType:340,
          activityTag: this.groupbuyid
        };
        let l = "mall/prepareystsettle.do";
        this.$post(l,d,function(_t,r){
          _t.$router.push({path:'/order/submit', query:{ id: r.data }});
        });
      }
    },
    watch: {
      '$route':'getgoodsinfo'
    },
    filters:{
      Currency:function(date){
        date = date.replace(/:|T/g, "-");
        var year = date.split('-')[0];
        var month = date.split('-')[1];
        var day = date.split('-')[2];
        var h = date.split('-')[3];
        var m = date.split('-')[4];
        var s = date.split('-')[5];
        var now = new Date();
        var endDate = new Date(year, month - 1, day, h, m, s);
        var leftTime = endDate.getTime() - now.getTime();
        var leftsecond = parseInt(leftTime / 1000);
        var day1 = Math.floor(leftsecond / (60 * 60 * 24));
        var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
        var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
        var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
        var gettime ='';
        if(day1==0){
          gettime = hour+'小时'
        }else{
          gettime = day1+'天'+hour +'小时'
        }
        return gettime;
      },
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

<style lang="scss">
  .rushbuy{background-color:#F33966; position: relative; font-size: 14px; height: 60px;}
  .rushbuy .left{margin-right:120px; color:#FFFFFF; padding-left:10px;}
  .rushbuy .right{position: absolute; top:0px; right:0px; background: #ffeae9; min-width: 120px; height: 60px; text-align: center; color:#F33966;}
</style>
