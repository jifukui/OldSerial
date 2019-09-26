import Vue from 'vue'
import Router from 'vue-router'
const IndexHtml = resolve => require(['../pages/indexHtml'], resolve)
// 切换页面
const SwitchContent = resolve => require(['../pages/switchContent'], resolve)
// edid 页面
const Edid = resolve => require(['../pages/edidPage'], resolve)
// configure 页面
const Configure = resolve => require(['../pages/configure'], resolve)
// about 页面
const About = resolve => require(['../pages/about'], resolve)
Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      component: IndexHtml,
      redirect: '/pages/switchContent', //重定向到第一个子路由，否则只渲染Layout组件
      children: [
        {
          path: '/pages/switchContent',
          component: SwitchContent
        },
        {
          path: '/pages/configure',
          component: Configure
        },
        {
          path: '/pages/about',
          component: About
        },
        {
          path: '/pages/edidPage',
          component: Edid
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {

  if (window.myInterval) {
    window.clearInterval(window.myInterval);
  }
  if (window.getDeviceInterval) {
    window.clearInterval(window.getDeviceInterval);
  }
  if(window.GetPortOnline)
  {
    window.clearInterval(window.GetPortOnline);
  }
  next();
})
export default router
