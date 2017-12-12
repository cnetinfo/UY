<template>
  <div class="home">

    <div class="scrollrows" @scroll="scroller($event)">

      <div  class="searchBar">
        <input type="text" v-model="searchtext" placeholder="请输入商品名称">
        <button @click="searchGoods">搜 索</button>
      </div>

      <div class="scrollbar-wrap">
        <div class="scrollbar-cell" v-if="firstcategory"><a @click="showCategory">{{value[1]}}<i class="icon_down"></i></a></div>
        <div class="scrollbar-cell" v-if="havecategory"><a @click="showchildCategory">{{childvalue[1]}}<i class="icon_down"></i></a></div>
        <div class="scrollbar-cell" v-if="lastcategory">{{value[1]}}</div>
      </div>

      <popup-picker :show="showPopupPicker" style="overflow: hidden;" :show-cell="false" :data="categorylist" :columns="1" show-name v-model="value" @on-change="onChange"  @on-hide="onHide" ></popup-picker>

      <popup-picker :show="childshowPopupPicker" style="overflow: hidden;" :show-cell="false" :data="childcategorylist" :columns="1" show-name v-model="childvalue" @on-change="onchildChange"  @on-hide="onHide" ></popup-picker>


      <div class="list">
        <div class="list-rows">
          <div class="list-cell">
            <ul>
              <li v-for="(item,index) in productlist">
                <a @click='$router.push("goods?id="+item.goodsSpecId)'>
                  <span class="icon_very" v-if="item.rushbuy==1" style="background: #F33966; color: #FFFFFF;">抢购</span>
                  <span class="icon_very" v-if="item.groupbuyPrice!=undefined" style="background: #FF7C43; color: #FFFFFF;">团购</span>
                  <img :src="item.thumbnailUrl" width="100%"/>
                  <div class="info">
                    <p class="twoline">{{item.title}}</p>
                    <p v-if="item.rushbuy==1" >
                      <span class="gcolor">{{'¥'+item.rushbuyPrice}}</span>
                      <span class="greycolor pull-right" style="text-decoration:line-through;">{{item.goodsPrice.costPrice?'¥'+item.goodsPrice.costPrice:'暂无货'}}</span>
                    </p>
                    <p class="gcolor"  v-else-if="item.groupbuyPrice!=undefined">
                      <span class="gcolor">{{'¥'+item.groupbuyPrice}}</span>
                      <span class="greycolor pull-right" style="text-decoration:line-through;">{{item.goodsPrice.costPrice?'¥'+item.goodsPrice.costPrice:'暂无货'}}</span>
                    </p>
                    <p class="gcolor" v-else>{{item.goodsPrice.costPrice?'¥'+item.goodsPrice.costPrice:'暂无货'}}</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <load-more tip="正在加载" v-if="loading"></load-more>
        <load-more :show-loading="false" tip="暂无数据" background-color="#f6f6f6"  v-if="!loading"></load-more>
      </div>

    </div>
    <login v-show="islogin"></login>
  </div>
</template>

<script type="text/babel">
  import { Grid, GridItem, PopupPicker, LoadMore } from 'vux'
  import login from '../components/login.vue'
  import footerCommon from '../components/footer.vue'
  export default {
    name: '',
    data () {
      return {
        firstcategory:false,
        lastcategory:false,
        havecategory:false,
        showPopupPicker:false,
        childshowPopupPicker:false,
        value:[],
        childvalue:[],
        searchtext:'',
        loading:false,
        pending:false,
        islogin:false,
        show:false,
        categorylist:[],
        childcategorylist:[],
        productlist:[],
        categoryId:'',
        pageIndex:'',
        pageSize:10,
        seq:0,
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.getcategory();
      });
    },
    methods: {
      showCategory(){
        this.showPopupPicker = true;
      },
      showchildCategory(){
        this.childshowPopupPicker = true;
      },
      onHide (type) {
        this.showPopupPicker = false;
        this.childshowPopupPicker = false;
      },
      onChange (val) {
        let that = this;
        that.pageIndex = '';
        that.childcategorylist = [];
        that.productlist = [];
        this.categorylist.forEach(function(item){
          if(val == item.id){
            that.value.push(item.name)
          }
        });
        this.categoryId = val.toString();
        this.getList(this.categoryId);
        this.getchildcategory(this.categoryId);
      },
      onchildChange (val) {
        let that = this;
        that.pageIndex = '';
        that.childvalue = [];
        that.productlist = [];
        this.childcategorylist.forEach(function(item){
          if(val == item.id){
            that.childvalue.push(item.id)
            that.childvalue.push(item.name)
          }
        });
        this.categoryId = val.toString()
        this.getList(this.categoryId);
      },
      searchGoods(){
        if(this.searchtext!=''){
          this.$router.push('/goods/search?key='+this.searchtext);
        }else{
          this.$vux.toast.text('请输入商品名称','middle');
        }
      },
      getcategory(){
        let l = "mall/queryCategoryByParentId.do";
        let d = {
          pid:this.$route.query.id,
        };
        this.$post(l,d,function(_t,r){
          if(r.data.length!=0){
            _t.firstcategory = true;
            /*if(_t.$route.query.id==undefined){
              _t.value =[ '','请选择分类' ];
            }else{
              _t.value =[ r.data[0].id,r.data[0].name ];
            }*/
            _t.value =[ '','请选择分类' ];
            _t.categorylist=r.data;
            _t.categorylist.forEach(function (item) {
              _t.$set(item,'value',item.id);
            });
            if(r.data[0].level!=3){
              if(_t.$route.query.id!=undefined){
                _t.getchildcategory(r.data[0].id)
              }
            }
          }else{
            _t.lastcategory = true;
            _t.value = ['',_t.$route.query.name];
          }
          _t.getList(_t.$route.query.id);
        });
      },
      getchildcategory(id){
        let l = "mall/queryCategoryByParentId.do";
        let pid = id.toString();
        let d = {
          pid:pid,
        };
        this.$post(l,d,function(_t,r){
          if(r.data.length!=0){
            _t.havecategory = true;
            //_t.childvalue =[ r.data[0].id,r.data[0].name ];
            _t.childvalue =[ '','请选择分类' ];
            _t.childcategorylist=r.data;
            _t.childcategorylist.forEach(function (item) {
              _t.$set(item,'value',item.id);
            });
          }else{
            _t.havecategory = false;
          }
        });
      },
      getList(id){
        this.categoryId=id;
        this.loading = true;
        this.pending = true;
        let d = {
          categoryId:this.categoryId,
          lastGoodsId: this.pageIndex,
        };
        let l = "mall/searchitems.do";
        this.$post(l,d,function(_t,r){
          _t.loading = false;
          _t.pending = false;
          var _list = r.data;
          _t.productlist = [..._t.productlist, ..._list]; //_t.productlist = r.data.goods;
          if (_list.length==0) {
            return;
          }
          if(_list.length!=0) {
            _t.pageIndex = _list[_list.length - 1].goodsId;
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
          this.getList(this.categoryId)
        }
      },
      onIndexChange (index) {
        //this.demo06_index = index
      },
      onTurn(link){
        if(link!=''){
          location.href = link;
        }
      }
    },
    mounted () {
    },
    components: {
      Grid,
      GridItem,
      PopupPicker,
      LoadMore,
      login,
      footerCommon,
    }
  }
</script>
