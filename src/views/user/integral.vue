<template>
  <div class="bgcolor-255 scrollrows"  @scroll="scroller($event)">
    <div class="sum-scores">
      <div class="scores-tips" style="margin-left:-30px;">
        <i class="scores-icon"></i>
        <span class="scores-title">剩余积分</span>
      </div>
      <div class="dividing-line"></div>
      <span id="totalscores" class="scores">{{integral}}</span>
    </div>

    <div class="tab-nav">
      <a  :class="{tabActive:active==i}" v-for="(item,i) in tabs" :key="item.index" @click="switchtab(i)"><i :class="{topIcon:active==i}"></i>{{item.name}}</a>
    </div>
    <div class="rule p-b-10 pd-10 " id="rule-content" v-show="!active">
      <h6 style="margin-top: 6px;">*积分如何获取 </h6>
      <p v-for="(item,i) in gain" >{{item}}</p>
      <h6 style="margin-top: 6px;">消耗积分 </h6>
      <p v-for="(item,i) in expend">{{item}}</p>
    </div>
    <div class="recording" id="record-content" v-show="active">
      <ul class="recording-list" style="margin-bottom: 47px;">
        <li v-for="item in records" :key="item.id">
          <div class="left-info">
            <span class="list-title character wp100">{{item.notes}}</span>
            <span class="list-time">{{item.createdDate.replace(/T/,' ')}}</span>
          </div>
          <div class="list-sum">{{item.points}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/babel">
    export default {
        name: '',
        data(){
            return {
              tabs:[{name:'积分规则',index:0},{name:'积分记录',index:1}],
              active:0,
              gain:'',
              expend:'',
              records:'',
              integral:'',
              lastflowid:''
            }
        },
        beforeRouteEnter (to, from, next) {
          next(vm => {
            vm.getlist();
          });
        },
        methods:{
          getlist(){
            let l = 'integral/myintegralrules.do',d={};
            this.$post(l,d,function(_t,r){
             _t.gain=r.data.gain;
             _t.expend=r.data.expend;
            });
            let u = 'integral/myintegralflow.do',o={lastflowid:this.lastflowid};
            this.$post(u,o,function(_t,r){
                console.log(r)
              _t.records=r.data.records;
              _t.integral=r.data.integral;

              if(_t.records.length!=0) {
                _t.lastflowid = _t.records[_t.records.length - 1].id
              };
            });
          },
          switchtab(i){
              this.active=i;
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
          },
        }
    }
</script>

<style lang="scss">
  .recording,.rule{
    background: #fff;
    overflow: hidden;
  }
  .sum-scores {
    height: 69px;
    text-align: center;
  }
  .sum-scores .scores-icon {
    display: block;
    margin: auto;
    width: 25px;
    height: 24px;
    background: url(../../assets/images/icon-score.jpg) no-repeat;
    background-size: cover;
  }
  .topIcon {
    position: absolute;
    margin: 0 auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: 19px;
    height: 8px;
    background: url(../../assets/images/icon-top.png) no-repeat;
    background-size: cover;
  }
  .sum-scores .scores-tips {
    display: inline-block;
    vertical-align: top;
    padding: 15px 10px 0 0;
  }
  .sum-scores .scores-title {
    font-size: 12px;
    color: #919191;
    display: block;
  }
  .sum-scores .dividing-line {
    width: 1px;
    height: 60px;
    margin: 5px 0;
    background-color: #e5e5e5;
    display: inline-block;
  }
  .sum-scores .scores {
    color: #ec584e;
    font-size: 28px;
    vertical-align: top;
    display: inline-block;
    line-height: 69px;
    padding-left: 10px;
  }
  .tab-nav {
    width: 100%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 0;
  }
  .tab-nav a.tabActive {
    background-color: #dbdbdb;
  }
  .tab-nav a {
    position: relative;
    width: 50%;
    height: 44px;
    font-size: 16px;
    color: #646464;
    display: inline-block;
    background-color: #e5e5e5;
  }
  .rule h6 {
    color: #ec584e;
    padding: 6px 0 6px 0;
  }
  .rule p {
    color: #919191;
    font-size: 12px;
    line-height: 18px;
  }
  .recording .recording-list li {
    height: 45px;
    color: #666;
    font-size: 12px;
    padding: 10px 6px;
    border-bottom: 1px solid #e5e5e5;
  }
  .recording .recording-list .left-info {
    float: left;
    padding: 4px 0;
    width: 80%;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    overflow: hidden;
  }
  .recording .recording-list .list-title {
    display: block;
    padding-bottom: 4px;
  }
  .recording .recording-list .list-sum {
    float: right;
    line-height: 45px;
  }
</style>
