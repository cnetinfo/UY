import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('../views/index')
    },
    {
      path: '/message',
      component: require('../views/message'),
      children: [
        {
          path: '',
          name: 'messagelist',
          component: require('../views/messagelist')
        },
      ]
    },
    {
      path: '/shopcart',
      name: 'shopcart',
      component: require('../views/shopcart')
    },
    {
      path: '/user',
      component: require('../views/user/user'),
      children: [
        {
          path: '',
          name: 'userinfo',
          component: require('../views/user/userinfo')
        },
        {
          path: 'wallet',
          name: 'wallet',
          component: require('../views/user/wallet')
        },
        {
          path: 'advance',
          name: 'advance',
          component: require('../views/user/advance')
        },
        {
          path: 'advancedetail',
          name: 'advancedetail',
          component: require('../views/user/advancedetail')
        },
        {
          path: 'tradedetail',
          name: 'tradedetail',
          component: require('../views/user/tradedetail')
        },
        {
          path: 'banklist',
          name: 'banklist',
          component: require('../views/user/banklist')
        },
        {
          path: 'addbank',
          name: 'addbank',
          component: require('../views/user/addbank')
        },
        {
          path: 'dealercredit',
          name: 'dealercredit',
          component: require('../views/user/dealercredit')
        },
        {
          path: 'applycredit',
          name: 'applycredit',
          component: require('../views/user/applycredit')
        },
        {
          path: 'orderdetail',
          name: 'orderdetail',
          component: require('../views/user/orderdetail')
        },
        {
          path: 'repayment',
          name: 'repayment',
          component: require('../views/user/repayment')
        },{
          path: 'repaymentdetail',
          name: 'repaymentdetail',
          component: require('../views/user/repaymentdetail')
        },
        {
          path: 'managercredit',
          name: 'managercredit',
          component: require('../views/user/managercredit')
        },
        {
          path: 'particulars',
          name: 'particulars',
          component: require('../views/user/particulars')
        },
        {
          path: 'management',
          name: 'management',
          component: require('../views/user/management')
        },
        {
          path: 'management/:id',
          name: 'managementdetail',
          component: require('../views/user/managementdetail')
        },
        {
          path: 'applyapproval',
          name: 'applyapproval',
          component: require('../views/user/applyapproval')
        },
        {
          path: 'applyapproval/:id',
          name: 'applyapprovaldetail',
          component: require('../views/user/applyapprovaldetail')
        },
        {
          path: 'address',
          name: 'addresslist',
          component: require('../views/user/addresslist')
        },
        {
          path: 'address/add',
          name: 'newaddress',
          component: require('../views/user/newaddress')
        },
        {
          path: 'address/:id',
          name: 'modifyaddress',
          component: require('../views/user/modifyaddress')
        },
        {
          path: 'faq',
          name: 'faq',
          component: require('../views/user/faq')
        },
        {
          path: 'reportforms',
          name: 'reportforms',
          component: require('../views/user/reportforms')
        },
        {
          path: 'join',
          name: 'join',
          component: require('../views/user/join')
        },
        {
          path: 'integral',
          name: 'integral',
          component: require('../views/user/integral')
        },
        {
          path: 'agreement',
          name: 'agreement',
          component: require('../views/user/agreement')
        },
        {
          path: 'transfer',
          name: 'transfer',
          component: require('../views/user/transfer')
        },
        {
          path: 'transfer/:id',
          name: 'transferdetail',
          component: require('../views/user/transferdetail')
        },
        {
          path: 'transferrecord',
          name: 'transferrecord',
          component: require('../views/user/transferrecord')
        }
      ]
    },
    {
      path: '/order',
      component: require('../views/order/order'),
      children: [
        {
          path: '',
          name: 'orderlist',
          component: require('../views/order/orderlist')
        },
        {
          path: 'detail',
          name: 'detail',
          component: require('../views/order/orderdetail')
        },
        {
          path: 'refund',
          name: 'refund',
          component: require('../views/order/refundorder')
        },
        {
          path: 'comment',
          name: 'comment',
          component: require('../views/order/comment')
        },
        {
          path: 'manager',
          name: 'ordermanager',
          component: require('../views/order/ordermanager')
        },
        {
          path: 'managerdetail',
          name: 'managerdetail',
          component: require('../views/order/managerdetail')
        },
        {
          path: 'submit',
          name: 'ordersubmit',
          component: require('../views/order/ordersubmit')
        }
      ]
    },
    {
      path: '/groupbuy',
      component: require('../views/groupbuy/index'),
      children: [
        {
          path: '',
          name: 'groupbuy',
          component: require('../views/groupbuy/groupbuy')
        },
        {
          path: 'detail',
          name: 'groupbuydetail',
          component: require('../views/groupbuy/detail')
        },
        {
          path: 'spellorder',
          name: 'spellorder',
          component: require('../views/groupbuy/spellorder')
        },
        {
          path: 'groupall',
          name: 'groupall',
          component: require('../views/groupbuy/groupall')
        }
      ]
    },
    {
      path: '/ticket',
      component: require('../views/ticket/ticket'),
      children: [
        {
          path: '',
          name: 'ticket',
          component: require('../views/ticket/ticketlist')
        },
        {
          path: 'detail',
          name: 'ticketdetail',
          component: require('../views/ticket/ticketdetail')
        }
      ]
    },
    {
      path: '/goods',
      component: require('../views/goods'),
      children: [
        {
          path: '',
          name: 'goodsdetail',
          component: require('../views/goodsdetail')
        },
        {
          path: 'exchange',
          name: 'exchangegoodsdetail',
          component: require('../views/exchangegoodsdetail')
        },
        {
          path: 'search',
          name: 'searchlist',
          component: require('../views/searchlist')
        },
        {
          path: 'rushbuy',
          name: 'rushbuy',
          component: require('../views/rushbuy')
        },
        {
          path: 'rushbuy/:id',
          name: 'rushbuylist',
          component: require('../views/rushbuylist')
        },
        {
          path: 'integralmall',
          name: 'integralmall',
          component: require('../views/integralmall')
        },
        {
          path: 'integralmall/:id',
          name: 'integralorder',
          component: require('../views/integralorder')
        }
      ]
    },
    {
      path: '/category',
      name: 'category',
      component: require('../views/category')
    },
    {
      path: '/pay',
      name: 'pay',
      component: require('../views/pay')
    },
    {
      path: '/offlinepay',
      name: 'offlinepay',
      component: require('../views/offlinepay')
    },
  ]
});
export default router
