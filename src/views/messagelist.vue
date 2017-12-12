<template>
  <div class="message">
    <div class="scrollrows s-b-50" @scroll="scroller($event)">
      <group v-if="list.length!=0">
        <cell v-for="(item,index) in list" :key="item.id" :link="item.link" @click.native="goactive(item.id)">
          <div slot="inline-desc">
            <div style="display: flex">
              <span class="font-size-16" style="margin-right: 10px; display:flex">
                <img src="../assets/images/read.png" width="40" height="40" v-if="item.readed==0" />
                <img src="../assets/images/readed.png" width="40" height="40" v-else />
              </span>
              <span style="width: 100%">
              <p >
                <span class="font-size-14 bcolor">{{item.title}} </span>
                <span class="font-size-12 greycolor pull-right">{{item.createTimeFmt}}</span>
              </p>
              <p class="m-t-5 oneline">{{item.summary | Currency}}</p>
            </span>
            </div>
          </div>
        </cell>
      </group>
      <div class="text-center post-center" v-else>
        <p><img src="../assets/images/message-null.png" width="100"/></p>
        <p><span class="greycolor m-t-10">暂时没有相关的消息~</span></p>
      </div>
      <load-more v-if="loading" tip="正在加载..." style="margin-bottom:5px; margin-top:5px;"></load-more>
    </div>
    <footer-common ref="calling"></footer-common>
  </div>
</template>

<script>

  import { Group, Cell, LoadMore } from 'vux'
  import footerCommon from '../components/footer.vue'
  export default {
    name: '',
    data () {
      return {
        loading: false,
        pending: false,
        list: [],
        pageIndex:0,
      }
    },
    mounted(){
      this.getList();
    },
    methods: {
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
      getList(){
        let _this = this;
        _this.pending = true;
        _this.loading = true;
        let d = {
          pageIndex:this.pageIndex
        };
        let l = "mall/messageList.do";
        this.$post(l,d,function(_t,r){
          _t.loading = false;
          _t.pending = false;
          var _list = r.data.list;
          _t.list = [..._t.list, ..._list];
          if (_list.length==0) {
            return;
          }
          if(_list.length!=0) {
            _t.pageIndex++
          };
        });
      },
      goactive(id){
        this.$refs.calling.getShopcartCount();
        let d = {
          messageDetailsId:id
        };
        let l = "mall/setMessageDetailsReaded.do";
        this.$post(l,d,function(_t,r){
          _t.list.forEach(function(item){
            if(id==item.id){
              _t.$set(item,"readed",1)
            }
          })
        });
      }
    },
    filters:{
      Currency:function(val){
        return val.replace(/<br>/g, " ");
      }
    },
    components: {
      footerCommon,
      Group,
      Cell,
      LoadMore
    }
  }
</script>
