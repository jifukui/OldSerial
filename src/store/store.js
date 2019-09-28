import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  portNumber: '',
  sn: '',
  version:"",
  resetLoading: false,
  upgradeLoading: false,
  upgradeDeviceLoading: false,
  upgradeNumbers: 0,
  upgradeNumber: -1,
  setInfo:{},
  a: 0,
  b: 17,
  c: 0,
  d: 17,
  e: 0,
  f: 18,
  g: 0,
  h: 17,
  VideoSelectAll:false,
  VideoALLChecked:[],
  Settingsname:"first",
  JiFileSize:0,
  PageLoading:false,
  EDIDActive:-1,
  EDIDType:1,
  EDIDDefault:true,
  CardStatus:-1,
  PortStatus:-1
}


export default new Vuex.Store({
  state
})