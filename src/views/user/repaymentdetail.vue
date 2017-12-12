<template>
  <div class="advancedetail">
    <div class="scrollrows" @scroll="scroller($event)">
      <group>  <!--is-link-->
        <cell :title="item.flowType" :inline-desc="item.createdDate.replace(/T/,' ')" v-for="(item , index) in list" :key="item.id">
          <p class=" gcolor">{{item.amount}}元</p>
        </cell>
      </group>
    </div>
  </div>
</template>

<script>
  import { Group, Cell } from 'vux'
  export default {
    name: '',
    data () {
      return {
        list:[],
        lastFlowId:''
      }
    },
    created(){
      this.getList();
    },
    methods: {
      getList(){
        let d = {
          creditId:this.$route.query.id,
          lastFlowId:this.lastFlowId
        };
        let l = "mall/morecreditrepaydetail.do";
        this.$post(l,d,function(_t,r){
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
          this.getList()
        }
      }
    },
    components: {
      Group,
      Cell
    }
  }
</script>

<style lang="scss">
  .noborder :before{ display: none !important;}
</style>

