<template>
  <div class="particulars">
    <div class="scrollrows" @scroll="scroller($event)">
      <group>  <!--is-link-->
        <cell :title="item.notes" :inline-desc="item.createdDate.replace(/T/,' ')" v-for="(item , index) in list" :key="item.id" :link=" item.dealObjId?'/user/applyapproval/'+item.dealObjId:item.dealObjId">
          <p class=" gcolor"> {{item.amount>0?'+'+item.amount:item.amount}}</p>
          <p>可用 {{item.accountBalance}}</p>
        </cell>
      </group>
      <load-more tip="加载更多" v-show="loading"></load-more> <!--v-if="item.dealObjId!=undefined"-->
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
        list:[],
        lastFlowId:''
      }
    },
    created(){
      this.getlist();
    },
    methods: {
      getlist(){
        this.loading = true;
        let d = {
          creditId:this.$route.query.id,
          lastFlowId:this.lastFlowId
        };
        let l = "mall/morecreditdetail.do";
        this.$post(l,d,function(_t,r){
          _t.loading = false;
          var _list = r.data;
          _t.list = [..._t.list, ..._list]; //_t.productlist = r.data.goods;
          if (_list.length==0) {
            return;
          }
          if(_list.length!=0) {
            _t.lastFlowId = _list[_list.length - 1].id
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
          this.getlist()
        }
      }
    },
    components: {
      Group,
      Cell,
      LoadMore
    }
  }
</script>

<style lang="scss">
  .nolink :after { display: none !important;}
</style>

