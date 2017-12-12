import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
var config = require('../../config')

const store = new Vuex.Store({
  state: {
    basePath: config.build.ApiPath,
    wxmpid : "",
    partnerid : "",
    siteid:"",
  },
  actions: {
    getJssdk() {
      const jssdkUrl = store.state.basePath + 'login/getwxjscallparameters.do';
      const locationUrl = document.location.href.split('#')[0];
      Vue.prototype.$http.post(jssdkUrl,Vue.prototype.qs.stringify({
        sid:Vue.prototype.getUrlParameter('sid'),
        url:locationUrl
      })).then(function (response) {
        var obj = response.data;
        if(obj.code == "200"){
          store.state.wxmpid = obj.data.wxmpid;
          store.state.partnerid = obj.data.partnerid;
          store.state.siteid = obj.data.siteid;
          document.title = obj.data.sitetitle;
          Vue.wechat.config({
            debug: false,
            appId: obj.data.appid,
            timestamp: obj.data.timestamp,
            nonceStr: obj.data.noncestr,
            signature: obj.data.signature,
            jsApiList: [
              'getLocation',
              'chooseImage',
              'previewImage',
              'uploadImage',
              'downloadImage',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareQZone',
              'onMenuShareWeibo',
              'startRecord',
              'stopRecord',
              'onVoiceRecordEnd',
              'playVoice',
              'pauseVoice',
              'stopVoice',
              'onVoicePlayEnd',
              'uploadVoice',
              'downloadVoice',
              'translateVoice',
              'hideOptionMenu',
              'showOptionMenu',
              'hideAllNonBaseMenuItem',
              'showAllNonBaseMenuItem',
            ]
          })
        }
      });
    },
    wxshare(t,d){
      Vue.wechat.ready(()=>{
        var title = d.title;
        var subTitle = d.subTitle;
        var linkurl = d.linkurl;
        var themeImageUrl = d.themeImageUrl;
        Vue.wechat.showAllNonBaseMenuItem();
        Vue.wechat.onMenuShareAppMessage({
          title: title,
          desc: subTitle,
          link: linkurl,
          imgUrl: themeImageUrl
        });
        // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        Vue.wechat.onMenuShareTimeline({
          title: title,
          link: linkurl,
          imgUrl: themeImageUrl
        });
        // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
        Vue.wechat.onMenuShareQQ({
          title: title,
          desc: subTitle,
          link: linkurl,
          imgUrl: themeImageUrl
        });
        // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
        Vue.wechat.onMenuShareWeibo({
          title: title,
          desc: subTitle,
          link: linkurl,
          imgUrl: themeImageUrl
        });
        // 2.5 监听“分享到QZone”按钮点击、自定义分享内容及分享接口
        Vue.wechat.onMenuShareQZone({
          title: title,
          desc: subTitle,
          link: linkurl,
          imgUrl: themeImageUrl
        });
      });
    },

  }
})
export default store
