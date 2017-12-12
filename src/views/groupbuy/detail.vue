<template>
  <div class="groupbuy">
    <div class="scrollrows">
      <group>
        <cell :link="'/goods?id='+detail.goodsSpecificationId">
          <div slot="inline-desc">
            <div style="display: flex">
            <span class="font-size-16" style="margin-right: 10px; display:flex; border:1px solid #EEEEEE;">
              <img :src="detail.goodsLogoUrl" width="60" height="60" />
            </span>
              <span>
              <p ><span class="font-size-14 bcolor twoline">{{detail.goodsTitle}}</span></p>
              <p class="m-t-5">
                团购价:&yen; <span class="gcolor m-r-10">{{detail.groupbuyPrice}}</span>
                <span style="text-decoration: line-through;" >原价：&yen; {{detail.retailPrice}}</span>
              </p>
              <p class="m-t-5">{{detail.memberLimit}}人团</p>
            </span>
            </div>
          </div>
        </cell>
      </group>

      <div v-if="detail.joined==0">
        <div class="linerows m-t-10">
          <div v-if="detail.state==1">
            <p class="text-center"><i class="icon_times"></i> 等待成团，剩<span>{{detail.memberLimit-detail.joinedNumber}}</span>个名额</p>
            <p class="text-center">剩余 <clocker :time="detail.expiry.replace(/T/,' ')" slot="value" :format="'%D 天 %H : %M : %S'"></clocker> 结束</p>
            <div class="groupbuyman">
              <div class="itemman" v-for="(item,i) in detail.members" >
                <img :src="item.headImgurl" width="100%" v-if="item.headImgurl">
                <img src="../../assets/images/user_avatar.png"  width="100%" v-else>
                <span class="master" v-if="item.isLeader==1">团长</span>
              </div>
            </div>
            <p class="mg-10 m-t-10"><button class="colortbtn" @click="offered(detail.id,detail.goodsSpecificationId)">一键参团</button></p>
          </div>
          <div v-else-if="detail.state==2">
            <p class="text-center">该团已满</p>
            <div class="groupbuyman">
              <div class="itemman" v-for="(item,i) in detail.members" >
                <img :src="item.headImgurl" width="100%" v-if="item.headImgurl">
                <img src="../../assets/images/user_avatar.png"  width="100%" v-else>
                <span class="master" v-if="item.isLeader==1">团长</span>
              </div>
            </div>
            <p class="mg-10 m-t-10" v-if="detail.promotionState==1"><button class="colortbtn" @click="$router.push('/goods?id='+detail.goodsSpecificationId)">我来开个团</button></p>
            <p class="text-center">或参加其他用户的团</p>
          </div>
          <div v-else-if="detail.state==3&&detail.failedReason==3">
            <p class="text-center">该团已拼团失败</p>
            <div class="groupbuyman">
              <div class="itemman" v-for="(item,i) in detail.members" >
                <img :src="item.headImgurl" width="100%" v-if="item.headImgurl">
                <img src="../../assets/images/user_avatar.png"  width="100%" v-else>
                <span class="master" v-if="item.isLeader==1">团长</span>
              </div>
            </div>
            <p class="mg-10 m-t-10" v-if="detail.promotionState==1"><button class="colortbtn" @click="$router.push('/goods?id='+detail.goodsSpecificationId)">我来开个团</button></p>
            <p class="text-center">或参加其他用户的团</p>
          </div>
          <div v-else>
            <p class="text-center">抱歉拼团活动已结束</p>
            <div class="groupbuyman">
              <div class="itemman" v-for="(item,i) in detail.members" >
                <img :src="item.headImgurl" width="100%" v-if="item.headImgurl">
                <img src="../../assets/images/user_avatar.png"  width="100%" v-else>
                <span class="master" v-if="item.isLeader==1">团长</span>
              </div>
            </div>
            <p class="mg-10 m-t-10"><button class="colortbtn" @click="$router.push('/groupbuy')">逛逛拼团首页</button></p>
          </div>
        </div>
        <div v-if="detail.state==2||detail.state==3&&detail.failedReason==3">
          <p class="pd-10 font-size-14">已有用户正在发起团购，可直接参团</p>
          <group>
            <cell v-for="(item,index) in othergroupbuylist" :key="index" style="height:40px;">
              <div slot="inline-desc">
                <div style="display: flex">
                  <span class="font-size-16 m-r-10">
                    <img :src="item.leaderAvatar" width="40" height="40" style="width:40px; height: 40px; border-radius: 50%; vertical-align: bottom" v-if="item.leaderAvatar" />
                    <img src="../../assets/images/user_avatar.png" width="40" height="40" style="width:40px; height: 40px; border-radius: 50%; vertical-align: bottom" v-else />
                  </span>
                  <span style="line-height:40px;">{{item.leaderNickName}}</span>
                </div>
              </div>
              <div slot="value">
                <div class="pull-left font-size-12 m-r-10">
                  <p class="ucolor">差{{item.remainSeats}}人可成团</p>
                  <p>剩余<clocker :time="item.expiry.replace(/T/,' ')" slot="value" :format="'%D 天 %H : %M : %S'"></clocker>结束</p>
                </div>
                <a @click="$router.push('/groupbuy/detail?id='+item.id)" class="redbtn font-size-14">去参团</a>
              </div>
            </cell>
          </group>
        </div>
        <div class="linerows m-t-10">
          <a @click="agreement" style="color:#333;">拼团玩法？</a>
          <span class="pull-right font-size-12">支付开团&gt;邀请参团&gt;人满成团</span>
        </div>
      </div>

      <div v-else>
        <div class="linerows m-t-10">
          <div v-if="detail.state==1">
            <p class="text-center"><i class="icon_times"></i> 等待成团，剩<span>{{detail.memberLimit-detail.joinedNumber}}</span>个名额</p>
            <p class="text-center"><span class="ucolor">倒计时结束后人不满将拼团失败</span></p>
            <p class="text-center">剩余 <clocker :time="detail.expiry.replace(/T/,' ')" slot="value" :format="'%D 天 %H : %M : %S'"></clocker> 结束</p>
          </div>
          <div v-else-if="detail.state==2">
            <p class="text-center">恭喜你，拼团成功</p>
          </div>
          <div v-else-if="detail.state==3&&detail.failedReason==3">
            <p class="text-center">拼团失败，未在规定时间内成团</p>
          </div>
          <div v-else>
            <p class="text-center">拼团失败，活动已失效</p>
          </div>
          <div class="groupbuyman">
            <div class="itemman" v-for="(item,i) in detail.members" >
              <img :src="item.headImgurl" width="100%" v-if="item.headImgurl">
              <img src="../../assets/images/user_avatar.png"  width="100%" v-else>
              <span class="master" v-if="item.isLeader==1">团长</span>
            </div>
          </div>
        </div>
        <div class="linerows">
          <a style="color:#333;">参团时间：</a>
          <span class="pull-right font-size-14">{{myJoinedTime}}</span>
        </div>
      </div>

    </div>
    <popup v-model="popup" position="bottom" height="100%">
      <div style="padding:10px 10px 60px 10px; font-size: 14px;">
          <p><b>拼团规则说明：</b></p><br>
          <p>1、拼团有效期</p>
          <p>每个团都有时间限制，自开团时刻起计算有效期，如果距离拼团活动失效时间小于拼团有效期，则以拼团活动的失效时间为准。</p><br>
          <p>2、拼团失败</p>
          <p>超过成团有效期，未达成相应参团人数，则该团失败。在成团有效期内，商品已提前售完，若还未拼团成功，则该团失败。高峰期间，同时支付的人数过多，团人数有限制，系统以接收第三方支付信息先后时间为准，超出该团人数限制的用户则会拼团失败。</p><br>
          <p>3、退款</p>
          <p>拼团失败的订单，系统会在1-2个工作日内处理退款，系统处理后2-7个工作日内原路退回原支付账户中。</p><br>
          <p>4、等待成团中如何退款</p>
          <p>超过成团有效期，未达成相应参团人数的要求，则该团失败，系统会自动退款。</p>
          <p class="fontcolor">注：拼团下单支付成功后无自行取消订单入口。</p><br>
          <p>5、开团/参团订单提交后未立即支付的，该订单将失效。</p>
      </div>
      <div style="padding: 15px; position: fixed; width: 100%; bottom: 0px; box-sizing: border-box;">
        <button class="colortbtn" @click="popup = false">关闭</button>
      </div>
    </popup>
  </div>
</template>

<script>
  import { Group, Popup, Tab, TabItem, CellBox, Cell, Card, Clocker } from 'vux'
  export default {
    name: '',
    data () {
      return {
        popup:false,
        detail:'',
        myJoinedTime:'',
        othergroupbuylist:[]
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.getdetail();
      });
    },
    methods: {
      agreement(){
        this.popup = true;
      },
      getdetail(){
        this.$store.dispatch('getJssdk');
        let d = {
          id:this.$route.query.id
        };
        let l = "mall/getgroupbuy.do";
        this.$post(l,d,function(_t,r){
          _t.detail = r.data;
          if(r.data.myJoinedTime){
            _t.myJoinedTime = r.data.myJoinedTime.replace(/T/,' ');
          }
          if(r.data.joined==1&&r.data.state==1){
            var title = r.data.goodsTitle;
            var subTitle = '活动现价：'+r.data.groupbuyPrice + '元' + title;
            var linkurl = _t.$store.state.basePath + 'mall/suppliermall.do?partnerid='+_t.$store.state.partnerid+'&cb='+_t.$store.state.basePath+'suppliermall/index.html'+ '#/groupbuy/detail?id='+ r.data.id;
            var themeImageUrl = r.data.goodsLogoUrl;
            _t.$store.dispatch('wxshare',{
              title:title,
              subTitle:subTitle,
              linkurl:linkurl,
              themeImageUrl:themeImageUrl
            });
          }
          if(r.data.state==2||r.data.state==3&&r.data.failedReason==3){
            _t.getothergroup(r.data.promotionGoodsId); //其他团列表
          }
        });
      },
      offered(id,gid){
        var objects = {};
        objects[gid] = 1;
        let d = {
          goods: JSON.stringify(objects),
          activityType:341,
          activityTag: id
        };
        let l = "mall/prepareystsettle.do";
        this.$post(l,d,function(_t,r){
          _t.$router.push({path:'/order/submit', query:{ id: r.data }});
        });
      },
      getothergroup(id){
        let d = {
          gpgid: id
        };
        let l = "mall/listrelatehotgroups.do";
        this.$post(l,d,function(_t,r){
          _t.othergroupbuylist =r.data;
        });
      }
    },
    filters:{
      Currency:function(date){
          return date
      },
    },
    components: {
      Group,
      Popup,
      Tab,
      TabItem,
      CellBox,
      Cell,
      Card,
      Clocker
    }
  }
</script>
