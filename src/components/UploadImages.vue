<template>
  <div class="photocelllist">
    <span class="photocell">
      <figure style="background-image:url('http://fs.51xnb.cn/97c15e37-501b-4790-84c1-0d6757bf2b8f.jpg')" v-on:click="chooseImage">
        <input type="hidden" v-model="urlid" >
      </figure>
    </span>
    <span class="photocell" v-for="(el,index) in url" v-on:click="deletePhoto(index)">
      <span class="colse"><i class="icon_colse" ></i></span>
      <figure v-bind:style="{ backgroundImage:'url('+ el + ')'}">
      </figure>
    </span>
  </div>
</template>
<script>
    export default {
        name: '',
        props: [
          'postindex',
          'count'
        ],
        data(){
            return{
              url:[],
              urlid:[]
            }
        },
        created(){
          this.$store.dispatch('getJssdk');
        },
        methods:{
          chooseImageInit(count){
            let vm = this;
            let qs = vm.qs;
            let wx = this.$wechat;
            wx.ready(()=>{
              if(vm.url.length > count) {
                vm.$vux.toast.text('您最多能上传9张图片','middle');
                return;
              }
              wx.chooseImage({
                count: count,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'],      // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {
                  var localIds = res.localIds;
                  if(localIds.length > 0) {
                    var i = 0,length = localIds.length;
                    function upload() {
                      wx.uploadImage({
                        localId: localIds[i],
                        success: function(res) {
                          i++;
                          if(i < length + 1) {
                            upFileToWX(res.serverId);
                          }
                        },
                        fail: function(res) {
                          vm.$vux.toast.text(JSON.stringify(res),'middle');
                        }
                      })
                    }
                    upload();
                    function upFileToWX(serverId) {
                      let uploadurl = vm.$store.state.basePath + "file/uploadprivatewxmedia.do";
                      let data = {
                        wxmpid:vm.$store.state.wxmpid,
                        serverId:serverId,
                        mediatype:1,
                      };
                      vm.$http.post(uploadurl,qs.stringify(data)).then(function (response) {
                        var obj = response.data;
                        if(obj.code == "200"){
                          var imgList =obj.data.url;
                          var imgId =obj.data.id;
                          vm.url.push(imgList);
                          vm.urlid.push(imgId);
                          vm.$parent.photolist[vm.postindex].key = vm.urlid.join(',');
                          vm.$parent.photolist[vm.postindex].value = vm.url.join(',');
                          if(i < length) {
                            upload();
                          }
                        }else{
                          vm.$vux.toast.text(obj.msg,'middle');
                        }
                      });
                    }
                  }
                }
              })
            })
          },
          chooseImage(){
            var count = this.count;
            if(count == undefined){
              count = 9;
            }
            this.chooseImageInit(count)
          },
          deletePhoto(id){
            var index = this.urlid.join(',').match(id);
            if(index != null) {
              this.urlid.splice(index, 1);
              this.url.splice(index, 1);
            }
            this.$parent.photolist[this.postindex].key = this.urlid.join(',');
            this.$parent.photolist[this.postindex].value = this.url.join(',');
          }
        }
    }
</script>
