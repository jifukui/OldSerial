// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/store'
import "babel-polyfill"
import liguoConfig from "./js/liguoConfig"
import liguoEDID from "./js/edidReader"
import liguoCheckInp from "./js/checkInp"
import ElementUI from 'element-ui'


require('es6-promise').polyfill()
Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios
Vue.prototype.$indexJsonUrl = "/static/json/indexjson.json"
Vue.prototype.$indexJsonUrl32 = "/static/json/indexjson32.json"
Vue.prototype.$indexJsonUrl64 = "/static/json/indexjson64.json"
Vue.prototype.$conf = liguoConfig
Vue.prototype.$EDID=liguoEDID
Vue.prototype.$checkInp=liguoCheckInp
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
