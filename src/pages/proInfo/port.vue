<template>
  <div class="wrapper">
    <div id="portsInfo">
      <div style="width:230px">
        <span class="title titleML">Port List</span>
        <div class="listBoard">
          <p
            v-for="(items, index) in portList"
            :key="index"
            class="portList"
            :class="{ activePort: items.portIndex == isActive }"
            @click="selectPortInfo(items.portIndex)"
          >
            Port-{{ items.title }}<span v-show="items.OnlineStatus == false">(Unknown)</span>
          </p>
        </div>
      </div>
      <div style="width:570px" v-loading="loading">
        <div class="information" v-show="isPort">
          <span class="title">Information - Port {{ portTitle }}</span>
          <table class="box">
            <tr
              v-for="(item, index) in staticData"
              :key="index"
              class="staticTr">
              <td width="35%">{{ item.id }}:</td>
              <td width="65%">{{ item.value }}</td>
            </tr>
            <tr
              v-for="(item, index) in setData"
              :key="index"
              class="staticTr">
              <td width="35%" v-if="item.type === 'static'">{{ item.id }}:</td>
              <td width="65%" v-if="item.type === 'static'">
                {{ item.value }}
                <span v-show="item.id == 'Temperature'"> ℃</span>
                <span v-show="item.id == 'Voltage'"> V</span>
                <span v-show="item.id == 'FPGAVersion'"> V</span>
              </td>
              <td width="35%" v-if="item.type === 'staticList'">{{ item.id }}:</td>
              <td width="65%" v-if="item.type === 'staticList'">
                <span 
                  v-for="(items, index) in item.value"
                  :key="index" 
                  v-show="items.value==item.oldvalue"
                  >{{items.name}}
                </span>
              </td>
              <td width="35%" v-if="item.type === 'list'">{{ item.id }}:</td>
              <td width="65%" v-if="item.type === 'list'">
                <select v-model="item.lastervalue" @change="listchange(item,index)">
                  <option
                    v-for="(item, index) in item.value"
                    :key="index"
                    :value="item.value"
                    >{{ item.name }}
                  </option>
                </select>
              </td>
              <td width="35%" v-if="item.type === 'slider'">{{ item.id }}:</td>
              <td width="65%" v-if="item.type === 'slider'">
                <div class="block fl" style="width:85%">
                  <el-slider
                  style="width:90%"
                  :min="item.value.min"
                  :max="item.value.max"
                  @change="sliderchange(item,index)"
                  v-model="item.lastervalue"
                  input-size="mini"
                  ></el-slider>
                </div>
                <input
                  style="width:12%"
                  v-model="item.lastervalue"
                  type="text"
                  @keyup="silderInputInput(item,index)"
                  @change="silderInputChange(item,index)"
                />
              </td>
              <td width="35%" v-if="item.type === 'switch'">{{ item.id }}:</td>
              <td width="65%" v-if="item.type === 'switch'">
                <el-switch
                  v-model="item.lastervalue"
                  active-color="#13ce66"
                  inactive-color="#ccc"
                  :active-text="item.value.on_text"
                  :inactive-text="item.value.off_text">
                </el-switch>
              </td>
              <td width="35%" v-if="item.type === 'inputOnlySetNum'">{{ item.id }}:</td>
              <td width="65%" v-if="item.type === 'inputOnlySetNum'">
                <input
                  type="text"
                  v-text="item.oldvalue"
                  v-model="item.lastervalue"
                  @blur="inpNum(item, item.value.min, item.value.max)"
                />
              </td>
              <td width="35%" v-if="item.type === 'inputNum'">{{ item.id }}:</td>
              <td width="65%" v-if="item.type === 'inputNum'">
                <input
                  type="text"
                  v-text="item.oldvalue"
                  v-model="item.lastervalue"
                  @blur="inpNum(item, item.value.min, item.value.max)"
                />
              </td>
              <td width="35%" v-if="item.type === 'buttonR'">{{ item.id }}:</td>
              <td width="65%" v-if="item.type === 'buttonR'">
                <el-button
                  class="btn"
                  type="primary"
                  @click="clickBtn(isActive, 1,dir)"
                  >Repower
                </el-button>
                <el-button
                  class="btn"
                  type="primary"
                  @click="clickBtn(isActive, 2,dir)"
                  >Factory
                </el-button>
              </td>
            </tr>
            <tr v-show="isNeedSave">
              <td width="35%" style="font-size:14px;">Save Changes:</td>
              <td width="65%">
                <el-button
                  class="btn"
                  type="primary"
                  @click="saveBtn(isActive,dir)"
                  :disabled= !HaveChange>
                  Save Changes
                </el-button>
              </td>
            </tr>
          </table>
        </div>
        <div class="information" v-show="!isPort">
          <span class="title">Information - Port {{ portTitle }}</span>
          <div class="nocard">No Port</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      slider: 50,
      portList: [],
      isActive: -1,
      dir: "",
      content: "",
      staticData: [],
      value: "",
      setData: "",
      loading: true,
      isPort: true,
      portTitle: "",
      selectportInfo: "",
      isNeedSave: true,
      HaveChange:false,
      ChangeFlag:[]
    };
  },
  watch: {
    ChangeFlag:function(value)
    {
      let that =this;
      console.log("The data is "+JSON.stringify(value));
      let i=0;
      for(i;i<value.length;i++)
      {
        if(value[i]!=0)
        {
          break;
        }
      }
      if(i<value.length)
      {
        that.HaveChange=true;
      }
      else
      {
        that.HaveChange=false;
      }
    }
  },
  computed: {},
  methods: {
    inpNum(item, min, max) 
    {
      console.log(item.lastervalue);
      console.log(min);
      console.log(max);
      let r = /^([1-9]\d*|[0]{1,1})$/;
      if (!r.test(item.lastervalue)) {
        this.$alert("Data type error", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {}
        });
        item.lastervalue = item.oldvalue;
        return false;
      }
      if (item.lastervalue < min || item.lastervalue > max) 
      {
        this.$alert("Data out of range", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {}
        });
        item.lastervalue = item.oldvalue;
        return false;
      }
    },
    inpNum2(item) 
    {
      let r = /^([1-9]\d*|[0]{1,1})$/;
      if (!r.test(item.lastervalue)) {
        this.$alert("Data type error", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {}
        });
        item.lastervalue = item.oldvalue;
        return false;
      }
    },
    sliderchange(item,index) {
      console.log("===============", Math.floor(item.lastervalue));
      let that=this;
      item.lastervalue = Math.floor(item.lastervalue);
      if(item.lastervalue==item.oldvalue)
      {
        that.ChangeFlagData(index,false);
      }
      else
      {
        that.ChangeFlagData(index,true);
      }
      console.log("silder data is "+JSON.stringify(item));
    },
    clickBtn(index, info, dir) 
    {
      let confirmValue = "";
      if (info == 1) 
      {
        confirmValue = "RESET port to repower ? <br/>Press OK to confirm";
      } 
      else if (info == 2) 
      {
        confirmValue ="RESET port to factory default ? <br/>Press OK to confirm";
      }
      let that = this;
      let savedir = "";
      if (dir == "in") 
      {
        savedir = 0;
      } 
      else 
      {
        savedir = 1;
      }
      that.$confirm(confirmValue, "Prompt information", {
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
          type: "warning",
          closeOnClickModal: false,
          dangerouslyUseHTMLString: true
        }).then(() => {
          var data = {
            cmd: "SetPortFunc",
            Data: [
              {
                index: index,
                sid: 36,
                value: info,
                dir: savedir
              }
            ]
          };
          console.log("The data is " + JSON.stringify(data));
          this.$axios.post("/cgi-bin/ligline.cgi", data).then(function(response) 
          {
            if (response.data.status == "SUCCESS") 
            {
              that.$alert("Save success", "Prompt information", {
                confirmButtonText: "OK",
                callback: action => {
                  that.selectPortInfo(that.isActive);
                }
              });
            } 
            else if (response.data.status == "ERROR") 
            {
              that.$alert(response.data.error, "Prompt information", {
                confirmButtonText: "OK",
                callback: action => {
                  that.selectPortInfo(that.isActive);
                }
              });
            }
          }).catch(function(error) {
              console.log(error);
            });
        }).catch(() => {
          let sendata = {
            resetSure: "取消重置信息"
          };
        });
    },
    /**选择端口的信息 */
    selectPortInfo(index) 
    {
      console.log("The index is "+index);
      let that = this;
      that.loading = true;
      let portList = [];
      let portNumber = that.$store.state.portNumber;
      that.isActive = index;
      if (portNumber == 16) 
      {
        that.$axios(that.$indexJsonUrl).then(response => {
          portList = response.data.Port;
          that.showPortInfo(portList, index);
        });
      } 
      else if (portNumber == 32) 
      {
        that.$axios(that.$indexJsonUrl32).then(response => {
          portList = response.data.Port;
          that.showPortInfo(portList, index);
        });
      } 
      else if (portNumber == 64) 
      {
        that.$axios(that.$indexJsonUrl64).then(response => {
          portList = response.data.Port;
          that.showPortInfo(portList, index);
        });
      }
    },
    /**显示端口信息 */
    showPortInfo(portList, index) {
      let that = this;
      /**读取信息 */
      this.$axios.get("/configuration.json").then(response => {
        /**端口信息 */
        let listInfo = response.data.data.port;
        /**板卡信息 */
        let cardInfo = response.data.data.card;
        /**端口数量 */
        let portNumber = that.$store.state.portNumber;
        /**设置端口参数 */
        for (let i = 0; i < portList.length; i++) 
        {
          for (let j = 0; j < listInfo.in.length; j++) 
          {
            if (portList[i].portIndex == listInfo.in[j].index) 
            {
              Object.assign(portList[i], listInfo.in[j]);
            }
          }
          for (let j = 0; j < listInfo.out.length; j++) 
          {
            if (portList[i].portIndex == listInfo.out[j].index) 
            {
              Object.assign(portList[i], listInfo.out[j]);
            }
          }
          /**添加端口的类型 */
          if (portNumber == 16) 
          {
            for (let j = 0; j < cardInfo.length; j++) 
            {
              if (Math.ceil(portList[i].portIndex / 2) == cardInfo[j].slot) 
              {
                portList[i].portType = cardInfo[j].name;
              }
            }
          } 
          else if (portNumber == 32) 
          {
            for (let j = 0; j < cardInfo.length; j++) 
            {
              if (Math.ceil(portList[i].portIndex / 4) == cardInfo[j].slot) 
              {
                portList[i].portType = cardInfo[j].name;
              }
            }
          } 
          else if (portNumber == 64) 
          {
            for (let j = 0; j < cardInfo.length; j++) 
            {
              if (Math.ceil(portList[i].portIndex / 8) == cardInfo[j].slot) 
              {
                portList[i].portType = cardInfo[j].name;
              }
            }
          }
        }
        //console.log("port list is "+JSON.stringify(portList));
        for (let j = 0; j < portList.length; j++) 
        {
          if (index == portList[j].portIndex) 
          {
            that.dir = portList[j].dir;
            that.portTitle = portList[j].title;
            /**端口类型错误 */
            if (portList[j].typeid < 0) 
            {
              that.isPort = false;
              that.loading = false;
            } 
            else 
            {
              that.isPort = true;
              that.value = "";
              that.setData = "";
              let staticAoData = [];
              let setInfo = [];
              for (var i in portList[j]) 
              {
                if (
                  i == "index" ||
                  i == "dir" ||
                  i == "type" ||
                  i == "typeid" ||
                  i == "portType"
                ) 
                {
                  let iName = "";
                  if (portList[j][i] == "v") 
                  {
                    portList[j][i] = "Video Matrix";
                  }
                  if (portList[j][i] == "a") 
                  {
                    portList[j][i] = "Audio Matrix";
                  }
                  if (portList[j][i] == "av") 
                  {
                    portList[j][i] = "Audio & Video Matrix";
                  }
                  if (i == "index") 
                  {
                    iName = "Index";
                  }
                  if (i == "dir") 
                  {
                    iName = "Direction";
                  }
                  if (i == "type") 
                  {
                    iName = "Matrix Type";
                  }
                  if (i == "typeid") 
                  {
                    iName = "Typeid";
                  }
                  if (i == "portType") 
                  {
                    iName = "Port Type";
                  }
                  let ht = {
                    id: iName,
                    value: portList[j][i]
                  };
                  staticAoData.push(ht);
                  //consoleconsole.log("static data is "+JSON.stringify(staticAoData));
                }
                if (portList[j][i].sid) 
                {
                  let ht1 = {
                    Name: i,
                    Value: portList[j][i].value
                  };
                  setInfo.push(ht1);
                  //console.log("data is "+JSON.stringify(setInfo));
                }
              }
              if (setInfo.length == 1 && setInfo[0].Name == "EDID") 
              {
                that.isNeedSave = false;
              } 
              else 
              {
                that.isNeedSave = true;
              }
              that.staticData = staticAoData;
              that.value = that.$conf.PortInitAv(setInfo, portList[j].Dir,portNumber);
              that.setData = that.$conf.PortInfoAv.info;
              that.loading = false;
            }
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    /**设置端口参数 */
    saveBtn(index, dir) 
    {
      console.log(this.$conf.PortInfoAv.info);
      this.ChangeFlag=new Array();
      var data = {};
      let that = this;
      let savedir = "";
      let val={};
      if (dir == "in") 
      {
        savedir = 0;
      } 
      else 
      {
        savedir = 1;
      }
      data.cmd = "SetPortFunc";
      data.Data = [];
      val = this.$conf.PortAvOK(
        this.$conf.PortInfoAv.info,
        index,
        savedir
      );
      data.Data=val.data;
      if(!val.status)
      {
        that.$message(
          {
            message: val.ErrorText,
            type: "warning"
          }
        );
        return false;
      }
      if (data.Data.length == 0) {
        that.$alert(
          "Please set relevant parameters before saving.",
          "Prompt information",
          {
            confirmButtonText: "OK",
            callback: action => {
              that.ChangeFlag=new Array();
            }
          }
        );
        return false;
      }
      that.ChangeFlag=new Array();
      console.log("The data is " + JSON.stringify(data));
      this.$axios.post("/cgi-bin/ligline.cgi", data).then(function(response) 
      {
        that.$conf.PortInfoAv.info=JSON.parse(JSON.stringify(that.$conf.BasePortInfo.info));
        that.setData=that.$conf.PortInfoAv.info;
        if (response.data.status == "SUCCESS") 
        {
          that.$alert("Save success", "Prompt information", {
            confirmButtonText: "OK",
            callback: action => {
              that.selectPortInfo(that.isActive);
            }
          });
        } 
        else if (response.data.status == "ERROR") 
        {
          that.$alert(response.data.error, "Prompt information", {
            confirmButtonText: "OK",
            callback: action => {
              that.selectPortInfo(that.isActive);
            }
          });
        }
      }).catch(function(error) {
          console.log(error);
        });
    },
    /**获取配置文件的同时获取端口的在线状态 */
    getOnline(list) {
      let that = this;
      let aoData = {
        cmd: "PortOnline"
      };
      this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
      {
        if (response.data.status == "SUCCESS") 
        {
          let onlineInfo = response.data.echo.result.Data;
          for (let j = 0; j < list.length; j++) 
          {
            for (let i = 0; i < onlineInfo.length; i++) 
            {
              if (list[j].portIndex == onlineInfo[i].PortIndex) 
              {
                list[j].OnlineStatus = onlineInfo[i].OnlineStatus;
                if(onlineInfo[i].OnlineStatus==false)
                {
                  list.splice(j,1);
                }
              }
            }
          }
          //console.log("getOnline");
          that.portList=JSON.parse(JSON.stringify(list));
          that.selectPortInfo(that.portList[0].portIndex);
        } 
        else if (response.data.status == "ERROR") 
        {
        }
        }).catch(function(error) {
          console.log(error);
        });
    },
    /**根据端口数量的不同获取不同的配置文件 */
    getJson() 
    {
      let that = this;
      let portNumber = that.$store.state.portNumber;
      if (portNumber == 16) 
      {
        that.$axios(that.$indexJsonUrl).then(response => {
          let portList = response.data.Port;
          that.getOnline(portList);
          //console.log("getJson");
          //console.log("port list is "+JSON.stringify(that.portList));
          //that.selectPortInfo(that.portList[0].portIndex);
        });
      } 
      else if (portNumber == 32) 
      {
        that.$axios(that.$indexJsonUrl32).then(response => {
          let portList = response.data.Port;
          that.getOnline(portList);
          //that.selectPortInfo(that.portList[0].portIndex);
        });
      } 
      else if (portNumber == 64) 
      {
        that.$axios(that.$indexJsonUrl64).then(response => {
          let portList = response.data.Port;
          that.getOnline(portList);
          //that.selectPortInfo(that.portList[0].portIndex);
        });
      }
    },
    silderInputChange(item,index)
    {
      let that=this;
      console.log("have change "+item.id);
      let data;
      data=parseInt(item.lastervalue);
      if(item.lastervalue==item.oldvalue)
      {
        that.ChangeFlagData(index,false);
      }
      else
      {
        that.ChangeFlagData(index,true);
      }
      if(isNaN(data)||data<item.value.min||data>item.value.max)
      {
        console.log("data error");
      }
      else
      {
        item.lastervalue=data;
      }
      console.log("data is "+JSON.stringify(item));
    },
    silderInputInput(item,index)
    {
      let that=this;
      item.lastervalue=item.lastervalue.replace(/\D/g,'');
      if(item.lastervalue==item.oldvalue)
      {
        that.ChangeFlagData(index,false);
      }
      else
      {
        that.ChangeFlagData(index,true);
      }
    },
    listchange(item,index){
      console.log("list change ");
      let that=this;
      if(item.oldvalue==item.lastervalue)
      {
        that.ChangeFlagData(index,false);
      }
      else
      {
        that.ChangeFlagData(index,true);
      }
    },
    ChangeFlagData(index,flag)
    {
      let that=this;
      let i=parseInt(index/32);
      let n=index%32;
      let data=JSON.parse(JSON.stringify(that.ChangeFlag));
      if(flag)
      {
        data[i]|=(1<<n);
      }
      else
      {
        data[i]&=(~(1<<n));
      }
      that.ChangeFlag=data;
    }
  },
  created() {
    this.getJson();
  },
  mounted() {
    this.$store.state.Settingsname='third';
    if (window.getDeviceInterval) {
      window.clearInterval(window.getDeviceInterval);
    }
  }
};
</script>
<style>
.information .el-tabs {
  height: auto;
}
.information .el-tabs__content {
  height: auto;
}
.information .el-tab-pane {
  height: auto;
}
</style>
<style scoped>
@import "../../style/common";
.wrapper {
  width: 800px;
  margin: 0 auto;
  height: calc(100% - 10px);
}
#portsInfo {
  padding: 10px 5px 0;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  height: calc(100% - 10px);
  background-color: white;
  border-radius: 5px;
}
p {
  font-size: 14px;
  line-height: 30px;
}
.he40 {
  height: 40px;
}
.he30 {
  height: 30px;
}
.line40 {
  line-height: 40px;
}
.padtop10 {
  padding-top: 10px;
}
.magtop10 {
  margin-top: 10px;
}
.listBoard {
  width: auto;
  height: calc(100% - 34px);
  overflow: auto;
  padding: 5px;
  -webkit-overflow-scrolling: auto;
  border: 1px solid black;
}
.information {
  padding: 0 10px;
  width: auto;
  height: calc(100% - 10px);
  overflow: auto;
  -webkit-overflow-scrolling: auto;
  font-size: 0;
}
.box {
  width: 100%;
  margin-left: 10px;
  font-size: 14px;
}
.staticTr {
  line-height: 30px;
}
.staticTr td {
  font-size: 14px;
}
.left,
.right {
  display: inline-block;
  width: 200px;
  float: left;
}
.btn {
  width: 150px;
  height: 30px;
  padding: 0px 20px;
  margin-bottom: 4px;
}
.portList {
  cursor: pointer;
}
.activePort {
  background-color: #409eff;
  color: #ffffff;
}

@media (min-width: 1025px) {
  .portList:hover {
    background-color: #409eff;
    color: #ffffff;
  }
}
.titleML {
  margin-left: 4px;
}
.block {
  width: 92%;
}
.boxtable {
  border: 1px solid #ccc;
}
.PaddingContent {
  padding-left: 15px;
  font-size: 14px !important;
}
.nocard {
  text-align: center;
}
</style>