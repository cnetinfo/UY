// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import { WechatPlugin , ConfirmPlugin, ToastPlugin, LoadingPlugin  } from 'vux'
import Public from './assets/js/public'
Vue.use(Vuex);
Vue.use(WechatPlugin);
Vue.use(ConfirmPlugin);
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);
Vue.use(Public);
Vue.prototype.qs = qs;
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created(){
    var sid = this.getUrlParameter('sid');
    localStorage.setItem("sid", sid);
    this.pv();
  },
  methods:{
    pv:function () {
      var wx = this.$wechat;
      wx.ready(()=>{
        wx.hideOptionMenu();
      });
      var url= store.state.basePath+"open/logpageview.do";
      var data = {
        sid:localStorage.getItem("sid"),
        url:location.href,
        module:'supplierplatform',
        system:'U易'
      };
      axios.post(url,qs.stringify(data));
    }
  },
  watch: {
    '$route':'pv'
  }
})
