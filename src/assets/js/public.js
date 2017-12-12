
const Pubilc = module.exports;

var countdown = function(date, id) {
  date = date.replace(/:|\s/g, "-");
  var year = date.split('-')[0];
  var month = date.split('-')[1];
  var day = date.split('-')[2];
  var h = date.split('-')[3];
  var m = date.split('-')[4];
  var s = date.split('-')[5];
  var now = new Date();
  var endDate = new Date(year, month - 1, day, h, m, s);
  var leftTime = endDate.getTime() - now.getTime();
  var leftsecond = parseInt(leftTime / 1000);
  var day1 = Math.floor(leftsecond / (60 * 60 * 24));
  var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
  var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
  var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
  if(hour < 10) {
    hour = "0" + hour
  }
  if(minute < 10) {
    minute = "0" + minute
  }
  if(second < 10) {
    second = "0" + second
  }
  var el = document.getElementById(id);
  if(day1 == 0) {
    day1 = "";
  } else {
    day1 = day1 + "天";
  }
  if(el!=null){
    el.innerHTML = day1 + hour + ":" + minute + ":" + second;
  }
};

Pubilc.install = function (Vue, options) {

  Vue.prototype.getUrlParameter = function (para){
    var reg = new RegExp("(^|&)" + para + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    return r?decodeURIComponent(r[2]):null;
  };

  Vue.prototype.arrayUnique = function(ar){
    var a1=(new Date).getTime()
    var m,n=[],o= {};
    for (var i=0;(m= ar[i])!==undefined;i++){
      if (!o[m]){
        n.push(m);o[m]=true;
      }
    }
    return n.sort(function(a,b){return a-b});
  };

  Vue.prototype.hasClass = function(obj, cls){
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  };

  Vue.prototype.addClass = function(obj, cls){
    if (!Vue.prototype.hasClass(obj, cls)) obj.className += " " + cls;
  };

  Vue.prototype.removeClass = function(obj, cls){
    if (Vue.prototype.hasClass(obj, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      obj.className = obj.className.replace(reg, ' ');
    }
  };

  Vue.prototype.countDownTimer = function(date, id){
    setInterval(function() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      if(month < 10) {
        month = "0" + month
      }
      var day = now.getDate();
      if(day < 10) {
        day = "0" + day
      }
      var h = now.getHours();
      if(h < 10) {
        h = "0" + h
      }
      var m = now.getMinutes();
      if(m < 10) {
        m = "0" + m
      }
      var s = now.getSeconds();
      if(s < 10) {
        s = "0" + s
      }
      var nowtime = year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
      if(nowtime == date) {
        location.reload();
      }
      countdown(date, id);
    }, 1000)
  };

  Vue.prototype.$get = function(link, objdata,success,err){
    let _this = this;
    let data ={
      params:objdata
    };
    this.$http.get(link,data).then(function (response) {
      var obj = response.data;
      if(obj.code==200){
        success(_this,obj);
      }else{
        err()
      }
    }).catch(function (error) {
      console.log(error)
    })
  }

  Vue.prototype.$post = function(link, objdata,success,islogin,err,showerr){
    let _this = this;
    objdata.sid = localStorage.getItem('sid');
    let url= _this.$store.state.basePath + link;
    this.$http.post(url,this.qs.stringify(objdata)).then(function (response) {
      _this.$vux.loading.hide();
      var obj = response.data;
      if(obj.code==200){
        success(_this,obj);
      }else if(obj.code==401){
        islogin(_this,obj)
        /*_this.$vux.confirm.show({
          title: '用户登录',
          content: '<p><input id ="s1" /></p><p><input id ="s2"/></p>',
          onShow () {
            console.log('plugin show')
          },
          onHide () {
            console.log('plugin hide')
          },
          onCancel () {
            console.log('plugin cancel')
          },
          onConfirm () {
            console.log(document.getElementById('s1').value)
            console.log(document.getElementById('s2').value)
            console.log('plugin confirm')
          }
        })*/
      }else{
        if(showerr!=1){
          _this.$vux.toast.show({
            text: obj.msg,
            type: 'cancel',
            width: '15em'
          });
        }
        //err(_this,obj)
      }
    }).catch(function (error) {
      console.log(error)
    })
  };


};
