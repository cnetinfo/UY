<template>
  <div class="tradedetail">
    <div class="scrollrows" @scroll="scroller($event)">
      <div class="bg-white m-b-10" v-for="(item , i) in list" :key="i">
        <div class="pd-10">
          <p>{{item.flowType}}</p>
          <p>
            <span class="font-size-14 dcolor">{{item.amount}}</span>
            <span class="font-size-12 pull-right">余额:¥<span class="gcolor">{{item.accountBalance}}</span></span>
          </p>
        </div>
        <p class="linerows topborder">备注：{{item.notes}} <span class="font-size-12 pull-right">{{item.createdDate | formatDate}}</span></p>
      </div>
      <load-more tip="正在加载" v-if="loading"></load-more>
      <load-more :show-loading="false" tip="暂无数据" background-color="#f6f6f6"  v-if="!loading"></load-more>
    </div>
  </div>
</template>

<script>
  import { LoadMore } from 'vux'
  export default {
    name: '',
    data () {
      return {
        loading:false,
        pageIndex:1,
        pageSize:10,
        list:[]
      }
    },
    created(){
      this.getList();
    },
    methods:{
      getList(){
        this.loading=true;
        let d = {
          aid:this.$route.query.id,
          pageIndex:this.pageIndex,
          pageSize:this.pageSize
        };
        let l = "money/flow.do";
        this.$post(l,d,function(_t,r){
          _t.loading=false;
          var _list = r.data.list;
          _t.list = [..._t.list, ..._list]; //_t.productlist = r.data.goods;
          if (_list.length==0) {
            return;
          }
          if(_list.length!=0) {
            _t.pageIndex++
          };
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
    },
    components: {
      LoadMore,
    },
    filters:{
      formatDate(time){
        return time.replace(/T/,' ');
      }
    }
  }
</script>
