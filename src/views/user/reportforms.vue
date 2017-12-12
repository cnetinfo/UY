<template>
  <div class="reportforms">
    <tab  custom-bar-width="100px">
      <tab-item selected @on-item-click="onItemClick">今日报表</tab-item>
      <tab-item @on-item-click="onItemClick">本月报表</tab-item>
    </tab>

    <div class="scrollrows s-t-50">
      <card>
        <div slot="content" class="card-demo-flex card-demo-content01">
          <div class="vux-1px-r">
            <span class="font-size-16 bcolor">¥{{info.salesAmount}}</span>
            <p><i class="icon_unit_price_small"></i> {{el}}销售额</p>
          </div>
          <div>
            <span class="font-size-16 bcolor">¥{{info.customerPrice}}</span>
            <p><i class="icon_unit_price_small"></i> {{el}}客单价</p>
          </div>
        </div>
        <div slot="content" class="card-demo-flex card-demo-content01">
          <div class="vux-1px-r">
            <span class="font-size-16 bcolor">{{info.salesOrderCount}}</span>
            <p><i class="icon_order_small"></i> {{el}}订单数</p>
          </div>
          <div>
            <span class="font-size-16 bcolor">{{info.pv}}</span>
            <p><i class="icon_traffic_small"></i> {{el}}总流量</p>
          </div>
        </div>
      </card>
      <group class="m-t-10">
        <div class="grouptitle">
          <span class="font-size-14">{{el}}商品分类销量排行</span>
        </div>
        <cell v-for="(item,index) in salelist" :key="index">
          <div slot="inline-desc">
            <div style="display: flex">
              <span style="margin-right: 10px; display:flex">
                <img :src="item.logoUrl?item.logoUrl:defalutimg" width="60" height="60" />
              </span>
              <span>
                <p>订单数量：<span class="gcolor">{{item.salesOrderCount}}</span></p>
                <p class="m-t-5">订单金额：<span class="gcolor">{{item.salesAmount}} 元</span></p>
                <p class="m-t-5">客户单价：<span class="gcolor">{{item.customerPrice}} 元</span></p>
              </span>
            </div>
          </div>
        </cell>
      </group>

      <group class="m-t-10">
        <div class="grouptitle">
          <span class="font-size-14">{{el}}商品销量排行</span>
        </div>
        <cell :link="'/goods?id='+item.goodsSpecificationId" v-for="(item,index) in goodslist" :key="index">
          <div slot="inline-desc">
            <div style="display: flex">
            <span class="font-size-16" style="margin-right: 10px; display:flex">
              <img :src="item.logoUrl" width="60" height="60" />
            </span>
              <span>
              <p ><span class="font-size-14 bcolor twoline">{{item.title}}</span></p>
              <p class="m-t-5">销售量：<span class="gcolor">{{item.salesNumber}}</span></p>
            </span>
            </div>
          </div>
        </cell>
      </group>
    </div>
  </div>
</template>

<script>
  import { Group, Tab, TabItem, CellBox, Cell, Card } from 'vux'
  export default {
    name: '',
    data () {
      return {
        info:'',
        el:'',
        defalutimg:'static/COD.png',
        salelist:[],
        goodslist:[]
      }
    },
    created(){
      this.$vux.loading.show({
        text: '加载中'
      })
      this.getbBase('day');
    },
    methods: {
      onItemClick (index) {
        if(index==0){
          this.$vux.loading.show({
            text: '加载中'
          })
          this.getbBase('day');
        }else{
          this.$vux.loading.show({
            text: '加载中'
          })
          this.getbBase('month');
        }
      },
      getbBase(type){
        if(type=='day'){
          this.el='今日';
        }else{
          this.el='本月';
        }
        let d = {
          type:type
        };
        let l = "mall/salessummary.do";
        this.$post(l,d,function(_t,r){
          _t.$vux.loading.hide()
          _t.info=r.data;
        });
        let salelink = "mall/salesbycategory.do";
        this.$post(salelink,d,function(_t,r){
          _t.salelist = r.data;
        });
        let goodslink = "mall/salesbygoods.do";
        this.$post(goodslink,d,function(_t,r){
          _t.goodslist = r.data;
        });
      }
    },
    components: {
      Group,
      Tab,
      TabItem,
      CellBox,
      Cell,
      Card
    }
  }
</script>
