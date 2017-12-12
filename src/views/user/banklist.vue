<template>
  <div class="banklist">
    <div class="scrollrows">
      <div class="mg-10" v-for="item in list" > <!--C75056-->
        <masker style="border-radius: 2px; overflow:hidden;" color="FF7C43" :opacity="1.0">
          <div class="m-img" >
            <span class="icon_very">默认</span>
            <p class="set">
              <a>设为默认</a>
              <a>删除</a>
            </p>
          </div>
          <div slot="content" class="m-title">
          {{item.title}}
              <br/>
            <span class="m-time">{{item.cardno}}</span>
          </div>
        </masker>
      </div>
      <p class="mg-10">
        <button class="defaultbtn" @click="$router.push('/user/addbank')">+ 添加银行卡</button>
      </p>
    </div>
  </div>
</template>

<script>
  import { Masker } from 'vux'
  export default {
    name: '',
    data () {
      return {
        list: [{
          title: '中国工商银行',
          cardno: '6222 **** **** 1967'
        }, {
          title: '中国建设银行',
          cardno: '6222 **** **** 4511'
        }, {
          title: '中国农业银行',
          cardno: '6222 **** **** 2202'
        }]
      }
    },
    created(){

    },
    components: {
      Masker
    }
  }
</script>

