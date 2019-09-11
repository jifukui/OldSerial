<template>
  <div>
    <Header class="header" :headerInfo="moudelInfo"></Header>
    <div
      class="main_section"
      v-if="status && !restartStatus && !upgradeStatus && !upgradeDeviceStatus"
    >
      <Navleft
        class="aside_nav"
        @nav_switch="changeNavInfo"
        :style="aside_nav[selectIndex]"
      ></Navleft>
      <div class="mainFrame" :style="main_section[selectIndex]">
        <router-view />
      </div>
    </div>
    <div
      class="main_section"
      v-if="!status && !restartStatus && !upgradeStatus && !upgradeDeviceStatus"
      v-loading="loading"
      element-loading-text="Matrix Initial ……"
      element-loading-background="#ededed"
      style="width: 100%"
    >
      <p class="failedP">{{ failed }}</p>
    </div>
    <div
      class="main_section"
      v-if="restartStatus"
      v-loading="loading1"
      element-loading-text="Device Restart ……"
      element-loading-background="#ededed"
      style="width: 100%"
    ></div>
    <div
      class="main_section"
      v-if="upgradeStatus"
      style="width: 100%；background='#ededed'"
    >
      <div class="el-loading-spinner gress">
        <svg viewBox="25 25 50 50" class="circular">
          <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
        </svg>
        <p class="upgrade">Upgrade ……</p>
        <el-progress
          :percentage="fileGrogress"
          :status="uploadStatus"
        ></el-progress>
      </div>
    </div>
    <div
      class="main_section"
      v-if="upgradeDeviceStatus"
      style="width: 100%；background='#ededed'"
    >
      <div class="el-loading-spinner gress">
        <svg viewBox="25 25 50 50" class="circular">
          <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
        </svg>
        <p class="upgrade">Upgrade ……</p>
        <el-progress
          :percentage="fileGrogress1"
          :status="uploadStatus"
        ></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/header";
import Navleft from "../components/navleft";

export default {
  name: "indexHtml",

  data() {
    return {
      aside_nav: ["width:60px", "width:180px"],
      main_section: ["margin-left:60px", "margin-left:180px"],
      selectIndex: 1,
      loading: true,
      loading1: true,
      status: false,  //调试的时候改成 true
      moudelInfo: "",
      failed: "",
      isGetStatus: true,
      restartStatus: false,
      upgradeStatus: false,
      upgradeDeviceStatus: false,
      fileGrogress: 0,
      fileGrogress1: 0,
      uploadStatus: "",
      onegrogress: 0,
      onegrogressOne: 0
    };
  },
  components: {
    Header,
    Navleft
  },
  watch: {
    "$store.state.resetLoading": function() {
      if (this.$store.state.resetLoading == true) {
        this.restartStatus = true;
      }
    },
    "$store.state.upgradeLoading": function() {
      this.upgradeStatus = this.$store.state.upgradeLoading;
      if (this.$store.state.upgradeLoading == true) {
        this.getUpgrade();
      }
    },
    "$store.state.upgradeDeviceLoading": function() {
      this.upgradeDeviceStatus = this.$store.state.upgradeDeviceLoading;
      if (this.$store.state.upgradeDeviceLoading == true) {
        this.getDeviceUpgrade();
      }
    },
    "$store.state.upgradeNumber": {
      handler(newValue, oldValue) {
        if (newValue == -2) {
          console.log("aaaa");
          this.fileGrogress = 100;
          this.$store.state.upgradeLoading = false;
          this.upgradeStatus = this.$store.state.upgradeLoading;
        } else if (newValue == -1) {
          console.log("-1-1-1-1");
        } else {
          console.log("bbbb");
          this.goGrogress(this.$store.state.upgradeNumber);
        }
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    getUpgrade() {
      let that = this;
      let num = that.$store.state.upgradeNumbers;
      that.onegrogress = parseInt(100 / num);
      that.onegrogressOne = parseInt(that.onegrogress / 4);
      that.fileGrogress = that.onegrogressOne;
    },
    getDeviceUpgrade() {
      let that = this;
      that.fileGrogress1 = 0;
      console.log("devicesj");
      window.upgradesetInterval = setInterval(function() {
        that.fileGrogress1 = that.fileGrogress1 + 1;
      }, 1500);
    },
    goGrogress(num) {
      let goGrogressNum = this.onegrogress * num + this.onegrogressOne;
      if (goGrogressNum <= 100) {
        this.fileGrogress = goGrogressNum;
      } else {
        this.fileGrogress = this.onegrogress * num;
      }
    },
    changeNavInfo: function(data) {
      if (data == "close_nav") {
        this.selectIndex = 0;
      } else {
        this.selectIndex = 1;
      }
    },
    getMatrixStatus(str) {
      let that = this;
      if (that.isGetStatus == true) {
        let aoData = {
          cmd: "matrix_status"
        };
        this.$axios
          .post("/cgi-bin/ligline.cgi", aoData)
          .then(function(response) {
            if (response.data.status == "SUCCESS") {
              that.loading = false;
              that.status = true;
              if (window.myTimeout) {
                window.clearTimeout(window.myTimeout);
              }
              that.moudelInfo = response.data.echo.result.name;
              that.$store.state.portNumber =
                response.data.echo.result.PortNumber;
              that.$store.state.sn = response.data.echo.result.sn;
              that.$store.state.version = response.data.echo.result.version;
              document.title = that.moudelInfo;
              if (str) {
              } else {
                window.getMatrixInterval = setInterval(function() {
                  that.getMatrixStatus("check");
                }, 60000);
              }
            } else if (response.data.status == "ERROR") {
              that.getMatrixStatus();
            }
          })
          .catch(function(error) {
            if (str == "check") {
              that.$alert("Network error", "Prompt information", {
                confirmButtonText: "OK",
                callback: action => {
                  window.location.reload();
                }
              });
            } else {
              that.getMatrixStatus();
            }
            console.log(error);
          });
      }
    }
  },
  mounted() {
    let that = this;
    //获取矩阵状态;
    //调试的时候注释掉
    window.myTimeout = setTimeout(function() {
      that.loading = false;
      that.isGetStatus = false;
      that.failed =
        "System Exception！Please check the network connection or restart the matrix.";
    }, 60000);
    that.getMatrixStatus();
  }
};
</script>
<style>
.gress .el-progress-bar {
  padding-right: 50px;
  width: 230px;
  margin-right: -55px;
  box-sizing: border-box;
}
</style>

<style scoped>
@import "../style/common";

#app {
  font-family: "Times New Roman";
}

.header {
  height: 60px;
  width: 100%;
  background-color: #2c2c2c;
  /*box-shadow: 0 3px 10px 3px rgba(77, 77, 77, 0.45);*/
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  align-items: center;
  flex-direction: row;
}

.main_section {
  position: fixed;
  left: 0;
  width: 100%;
  bottom: 0;
  top: 60px;
  box-sizing: border-box;
}

.aside_nav {
  width: 180px;
  height: 100%;
  background-color: #4d4d4d;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transition: width 0.5s;
  -moz-transition: width 0.5s;
  -webkit-transition: width 0.5s;
  -o-transition: width 0.5s;
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  list-style: none;
  overflow-y: auto;
  overflow-x: hidden;
}
.aside_nav::-webkit-scrollbar {
  display: none;
}
.mainFrame {
  transition: margin 0.5s;
  -moz-transition: margin 0.5s;
  -webkit-transition: margin 0.5s;
  -o-transition: margin 0.5s;
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  padding: 10px;
}
.failedP {
  font-size: 24px;
  text-align: center;
  margin-top: 200px;
}
.upgrade {
  font-size: 18px;
}
</style>
