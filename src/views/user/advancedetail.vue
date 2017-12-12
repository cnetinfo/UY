<template>
  <div class="advancedetail">
    <div class="scrollrows" @scroll="scroller($event)">
      <group>  <!--is-link-->
        <cell :title="item.notes" :inline-desc="item.createdDate|formatDate" v-for="(item , i) in list" :key="i">
          <p class=" gcolor"> {{item.amount}}</p>
          <p>可用 {{item.accountBalance}}</p>
        </cell>
      </group>
      <load-more tip="正在加载" v-if="loading"></load-more>
      <load-more :show-loading="false" tip="暂无数据" background-color="#f6f6f6"  v-if="!loading"></load-more>
    </div>
  </div>
</template>

<script>
  import { Group, Cell ,LoadMore } from 'vux'
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
      Group,
      Cell
    },
    filters:{
      formatDate(time){
        return time.replace(/T/,' ');
      }
    }
  }
</script>

<style lang="scss">
  .noborder :before{ display: none !important;}
</style>

