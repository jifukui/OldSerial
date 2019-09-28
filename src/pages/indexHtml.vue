<template>
  <div>
    <Header class="header" :headerInfo="moudelInfo"></Header>
    <div
      class="main_section"
      v-if="status && !restartStatus && !upgradeStatus && !upgradeDeviceStatus"
      v-loading="pageload"
      element-loading-spinner="el-icon-loading"
      element-loading-text="Please Waiting ……"
      element-loading-background="rgba(203,203,203,0.8)"
      style="width: 100%"
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
      onegrogressOne: 0,
      pageload:false,
      errornum:0
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
      if (this.$store.state.upgradeLoading == true) 
      {
        /**开始升级 */
        this.getUpgrade();
      }
      else
      {
        console.log("window.jifukuiupgradesetInterval "+ window.jifukuiupgradesetInterval);
        if(window.jifukuiupgradesetInterval)
        {
          console.log("Close");
          window.clearInterval(window.jifukuiupgradesetInterval);
        }
        let that=this;
        window.getMatrixInterval = setInterval(function() {
          that.getMatrixStatus("jifukui");
        }, 6000);
      }
    },
    "$store.state.upgradeDeviceLoading": function() {
      this.upgradeDeviceStatus = this.$store.state.upgradeDeviceLoading;
      if (this.$store.state.upgradeDeviceLoading == true) 
      {
        this.getDeviceUpgrade();
      }
    },
    "$store.state.upgradeNumber": {
      handler(newValue, oldValue) 
      {
        if (newValue == -2) 
        {
          //console.log("aaaa");
          this.fileGrogress = 100;
          this.$store.state.upgradeLoading = false;
          this.upgradeStatus = this.$store.state.upgradeLoading;
        }
        else if (newValue == -1) 
        {
          //console.log("-1-1-1-1");
        } 
        else 
        {
          //console.log("bbbb");
          this.goGrogress(this.$store.state.upgradeNumber);
        }
      },
      deep: true
    },
    "$store.state.PageLoading":function(value)
    {
      //console.log("Hvae change load");
      //console.log("Value is "+value)
      this.pageload=value; 
    }
  },
  computed: {},
  methods: {
    getUpgrade() {
      let that = this;
      let num = that.$store.state.upgradeNumbers;
      that.Sumsize=0;
      that.onegrogress = parseInt(100 / num);
      that.onegrogressOne = parseInt(0);
      that.fileGrogress = that.onegrogressOne;
      that.jifukuivalue=0;
      console.log("that.$store.state.JiFileSize "+that.$store.state.JiFileSize);
      let val=0;
      console.log("window.jifukuiupgradesetInterval "+ window.jifukuiupgradesetInterval);
      console.log("that.$store.state.upgradeNumbers "+that.$store.state.upgradeNumbers);
      
      window.jifukuiupgradesetInterval = setInterval(function() 
      {
        console.log("Set UP "+that.$store.state.upgradeNumber);
        if(that.Sumsize<that.$store.state.JiFileSize)
        {
          let value=(that.Sumsize*99)/(that.$store.state.JiFileSize*that.$store.state.upgradeNumbers);
          console.log("The value is "+value);
          //that.jifukuivalue=parseInt(value);
          that.fileGrogress=parseInt(that.jifukuivalue+value);
          if(that.fileGrogress>100)
          {
            that.fileGrogress=100;
          }
          that.Sumsize+=2000;
          //console.log("that.fileGrogress "+that.fileGrogress);
          //console.log("that.Sumsize "+that.Sumsize);
          //console.log("that.$store.state.upgradeNumbers "+that.$store.state.upgradeNumbers);
          //console.log("The this.onegrogressOne "+that.fileGrogress);
          //console.log("that.$store.state.JiFileSize "+that.$store.state.JiFileSize);
        }
        else
        {
         
        }
      }, 1200);
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
      this.Sumsize=0;
      let goGrogressNum = this.onegrogress * num + this.onegrogressOne;
      /**当前升级的阶段 */
      this.jifukuivalue=goGrogressNum;
      if (goGrogressNum <= 100) 
      {
        this.fileGrogress = goGrogressNum;
      } 
      else 
      {
        if(window.jifukuiupgradesetInterval)
        {
          window.clearInterval(window.jifukuiupgradesetInterval);
          //console.log("Close");
        }
        this.fileGrogress = 100;
      }
    },
    changeNavInfo: function(data) {
      if (data == "close_nav") 
      {
        this.selectIndex = 0;
      } 
      else 
      {
        this.selectIndex = 1;
      }
    },
    getMatrixStatus(str) {
      //console.log("获取矩阵的状态信息 "+this.errornum)
      let that = this;
      if (that.isGetStatus == true) {
        let aoData = {
          cmd: "matrix_status"
        };
        this.$axios
          .post("/cgi-bin/ligline.cgi", aoData)
          .then(function(response) 
          {
            that.errornum=0;
            if (response.data.status == "SUCCESS") 
            {
              that.loading = false;
              that.status = true;
              if (window.myTimeout) 
              {
                window.clearTimeout(window.myTimeout);
              }
              that.moudelInfo = response.data.echo.result.name;
              that.$store.state.portNumber =response.data.echo.result.PortNumber;
              if(that.$store.state.VideoALLChecked.length==0)
              {
                for(let i=0;i<=that.$store.state.portNumber;i++)
                {
                  that.$store.state.VideoALLChecked[i]=true;
                }
              }
              that.$store.state.sn = response.data.echo.result.sn;
              that.$store.state.version = response.data.echo.result.version;
              document.title = that.moudelInfo;    
            } 
          }).catch(function(error) {
            that.errornum++;
            console.log("catch "+str);
            if (that.errornum==15) 
            {
              that.$alert("Network error", "Prompt information", {
                confirmButtonText: "OK",
                callback: action => {
                  window.location.reload();
                }
              });
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
    window.getMatrixInterval = setInterval(function() {
      that.getMatrixStatus("jifukui");
    }, 6000);
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
