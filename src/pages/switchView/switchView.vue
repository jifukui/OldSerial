<template>
  <div class="wrapper">
    <div id="matrix_content">
      <div class="table">
        <div class="tableRow">
          <div class="table_cell">
            <p style="text-align:left;font-size:22px">Video</p>
            <p style="text-align:left">
              Number of Inputs:{{ this.aoDataLength - 1 }}
            </p>
            <p style="text-align:left">
              Number of Outputs:{{ this.aoDataOut.length }}
            </p>
          </div>
          <div class="table_cell1">
            <div
              class="nav_left_content"
              :class="isleftHidden == true ? 'hide' : ''"
            >
              <div
                class="nav_left_content_in"
                @click="turnLeft"
                :class="isleftHidden == true ? 'hide' : ''"
              ></div>
            </div>
          </div>
          <div class="table_cel3 table_cel4">
            <div class="output">Outputs</div>
          </div>
          <div class="outPutInfo outPutInfo_title">
            <div
              class="tableCell "
              v-for="(items, index) in aoDataOut.slice(c, d)"
              :key="index"
            >
              <div class="groupHeader groupHeaderSecound">
                <span
                  :class="items.status == false ? 'signalNo' : 'signal'"
                ></span
                ><span
                  class="port_name"
                  :class="{
                    selected: index == nowIndex1 || index == bg_index2
                  }"
                  @mouseover="showInfo(index, items, 'up')"
                  @mouseleave="hideInfo()"
                  @click="openSet(items.portIndex,'Out',items.title,items.OnlineStatus)"
                  >{{ items.title }}</span
                >
              </div>
            </div>
          </div>
          <div class="table_celR table_cel5"></div>
          <div class="table_cell">
            <div class="nav_right" :class="isrightHidden == true ? 'hide' : ''">
              <div
                class="nav_right_content"
                @click="turnRight"
                :class="isrightHidden == true ? 'hide' : ''"
              ></div>
            </div>
          </div>
        </div>
        <div class="tableRow1">
          <div class="table_cell1">
            <div class="nav_top" :class="istopHidden == true ? 'hide' : ''">
              <div
                class="nav_top_content_in"
                @click="turnTop"
                :class="istopHidden == true ? 'hide' : ''"
              ></div>
            </div>
          </div>
          <div class="table_cell1"></div>
          <div class="table_cel2"></div>
          <div>
            <div
              v-for="(items, index) in aoDataOut.slice(c, d)"
              :key="index"
            ></div>
          </div>
        </div>
        <div class="tableRow1">
          <div class="table_cel6">Inputs</div>
          <div class="table_cell1"></div>
          <div class="isAll table_cell1">
            <el-checkbox v-model="ckeckVal" @change="clickMe">All</el-checkbox>
          </div>
          <div class="table_cell1" v-if="isSelectAll">
            <div
              v-for="(items, index) in aoDataOut.slice(c, d)"
              :key="index"
              class="table_checkbox"
            >
              <input
                type="checkbox"
                :checked="items.switchSelect"
                :value="items.indexTitle"
                @change="clickSelect(items.switchSelect, items.indexTitle)"
              />
            </div>
          </div>
        </div>
        <div
          class="tableRow"
          v-for="(items, index) in aoData.slice(e, f)"
          :key="index"
        >
          <div class="tableCell">
            <div class="groupRow">
              <span
                :class="[
                  { signalNo: items.status == false },
                  { signal: items.status == true },
                  { signalClose: items.status == 'close'}
                ]"
              ></span
              ><span
                :class="{ selected: index!=0&&index == nowIndex || index == bg_index,port_name:index!=0}"
                @mouseover="showInfo(index, items)"
                @mouseleave="hideInfo()"
                @click="openSet(items.portIndex,'In',items.title,items.OnlineStatus)"
                >{{ items.title }}</span
              >
            </div>
          </div>
          <div class="table_cell1"></div>
          <div class="table_cell">
            <div
              v-if="items.link_status == 'true' && isSelectAll"
              class="link_status"
              :class="{ checked: true }"
              @mouseenter="showPortLink(index)"
              @mouseleave="hidePortLink(index)"
            ></div>
            <div
              v-else-if="isSelectAll"
              class="link_status"
              :class="{ checked: items.checked }"
              :title="aoData[index].title+'>ALL'"
              @click="selectedSwitchAll(items, items.indexTitle)"
              @mouseenter="showPortLink(index)"
              @mouseleave="hidePortLink(index)"
            ></div>
          </div>
          <div v-if="showBtn">
            <div
              class="table_cell"
              v-for="(interitems, interindex) in items.sourceGroup.slice(g, h)"
              :key="interindex"
              :class="{
                table_cell_bg:
                  (index == bg_index && interindex <= bg_index2) ||
                  (interindex == bg_index2 && index <= bg_index)
              }"
            >
              <div>
                <div
                  v-if="interitems.link_status == 'no'"
                  class="link_status_no"
                  :title="aoData[index].title+'>'+aoDataOut[interindex].title"
                  @mouseenter="showPortLink(index, interindex)"
                  @mouseleave="hidePortLink(index, interindex)"
                ></div>
                <div
                  v-else-if="interitems.link_status == 'true'"
                  class="link_status"
                  :class="{ checked: true }"
                  :title="aoData[index].title+'>'+aoDataOut[interindex].title"
                  @mouseenter="showPortLink(index, interindex)"
                  @mouseleave="hidePortLink(index, interindex)"
                ></div>
                <div
                  v-else-if="interitems.link_status == 'noLine'"
                  class="link_status_noLine"
                  @click="
                    selectedSwitch(
                      interitems,
                      items.indexTitle,
                      interitems.indexTitle
                    )
                  "
                  :title="aoData[index].title+'>'+aoDataOut[interindex].title"
                  @mouseenter="showPortLink(index, interindex)"
                  @mouseleave="hidePortLink(index, interindex)"
                ></div>
                <div
                  v-else
                  class="link_status"
                  :class="{ checked: interitems.checked }"
                  @click="
                    selectedSwitch(
                      interitems,
                      items.indexTitle,
                      interitems.indexTitle
                    )
                  "
                  :title="aoData[index].title+'>'+aoDataOut[interindex].title"
                  @mouseenter="showPortLink(index, interindex)"
                  @mouseleave="hidePortLink(index, interindex)"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="tableRow1">
          <div class="table_cel7"></div>
          <div></div>
          <div></div>
          <div>
            <div
              v-for="(items, index) in aoData.slice(c, d)"
              :key="index"
            ></div>
          </div>
        </div>
        <div class="tableRow">
          <div class="table_cell">
            <div class="nav_bottom" :class="isdownHidden == true ? 'hide' : ''">
              <div
                class="nav_bottom_content"
                @click="turnDown"
                :class="isdownHidden == true ? 'hide' : ''"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="switchLoading" class="mask">
        <p style="font-size:25px;color:#409eff;">
          <i class="el-icon-loading"></i>Switching
        </p>
      </div>
      <div v-if="openSetInfo" class="setInfo">
        <SetInfo :portSetInfo="setInfo" @closePage="CancelShow" @SelectPort="PortRefresh"></SetInfo>
      </div>
    </div>
  </div>
</template>

<script>
import SetInfo from "./setInfo";
export default {
  components: {
    SetInfo
  },
  data() {
    return {
      onlineInfo: "",
      allPortInfo: "",
      portInfo: "",
      videoRouting: "",
      aoDataLength: 1,
      aoData: "",
      aoDataOut: "",
      nowIndex: "100",
      nowIndex1: "100",
      showBtn: true,
      openSetInfo: false,
      bg_index: null,
      bg_index2: null,
      screenWidth: document.body.clientWidth,
      aoDataSelected: [],
      ckeckVal: this.$store.state.VideoSelectAll,
      isSelectAll: this.$store.state.VideoSelectAll,
      setInfo: "",
      portSetInfo: "",
      switchLoading: false
    };
  },
  watch: {
    screenWidth(val) {
      if (!this.timer) {
        this.screenWidth = val;
        this.timer = true;
        let that = this;
        setTimeout(function() {
          that.timer = false;
        }, 400);
      }
    },
    isSelectAll(val)
    {
      this.$store.state.VideoSelectAll=val;
    }
  },
  computed: {
    a() {
      return this.$store.state.a;
    },
    b() {
      return this.$store.state.b;
    },
    c() {
      return this.$store.state.c;
    },
    d() {
      return this.$store.state.d;
    },
    e() {
      return this.$store.state.e;
    },
    f() {
      return this.$store.state.f;
    },
    g() {
      return this.$store.state.g;
    },
    h() {
      return this.$store.state.h;
    },
    isrightHidden() 
    {
      if (this.$store.state.b < this.aoDataOut.length) 
      {
        return false;
      } 
      else 
      {
        return true;
      }
    },
    isleftHidden() {
      if (this.$store.state.a > 0) 
      {
        return false;
      } 
      else 
      {
        return true;
      }
    },
    istopHidden() 
    {
      if (this.$store.state.e > 0) 
      {
        return false;
      } 
      else 
      {
        return true;
      }
    },
    isdownHidden() 
    {
      if (this.$store.state.f < this.aoDataLength) 
      {
        return false;
      } 
      else 
      {
        return true;
      }
    }
  },
  methods: {
    //点击全选按钮
    clickMe() 
    {
      console.log("全切");
      //console.log("The data is "+JSON.stringify(this.aoDataOut));
      let that = this;
      if (that.ckeckVal) 
      {
        that.isSelectAll = true;  
      } 
      else 
      {
        that.isSelectAll = false;
      }
      that.getportNumInfo();
    },
    //全选模式内的选择按钮
    clickSelect(ckeckValue, index) {
      let that = this;
      if (ckeckValue == true) 
      {
        for (let i = 0; i < this.aoDataOut.length; i++) 
        {
          if (this.aoDataOut[i].indexTitle == index) 
          {
            this.aoDataOut[i].switchSelect = false;
            this.$store.state.VideoALLChecked[i]=false;
          }
        }
      } 
      else 
      {
        for (let i = 0; i < this.aoDataOut.length; i++) 
        {
          if (this.aoDataOut[i].indexTitle == index) 
          {
            this.aoDataOut[i].switchSelect = true;
            this.$store.state.VideoALLChecked[i]=true;
          }
        }
      }
    },
    selectedSwitch(item, c, d) {
      let output = [d];
      let aoData = {
        cmd: "VideoSetting",
        Data: {
          Outport: output,
          Inport: c
        }
      };
      let that = this;
      this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) {
        if (response.data.status == "SUCCESS") 
        {
          //that.getOnline();
        } 
        else if (response.data.status == "ERROR") 
        {
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    //多切功能
    selectedSwitchAll(items, index) {
      console.log(items);
      let aoOut = [];
      let routingData = "";
      let that = this;
      that.switchLoading = true;
      that.$store.state.PageLoading=true;
      for (let i = 0; i < that.aoData.length; i++) 
      {
        that.aoData[i].link_status = "false";
        for (let j = 0; j < that.aoData[i].sourceGroup.length; j++) 
        {
          that.aoData[i].sourceGroup[j].link_status = "no";
        }
      }
      that.$set(items, "link_status", "true");
      for (let i = 0; i < this.aoDataOut.length; i++) 
      {
        if (this.aoDataOut[i].switchSelect == true) 
        {
          aoOut.push(this.aoDataOut[i].indexTitle);
          routingData = {
            Outport: aoOut,
            Inport: index
          };
        }
      }
      let aoData = {
        cmd: "VideoSetting",
        Data: routingData
      };
      this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) {
        if (response.data.status == "SUCCESS") 
        {
          for (let i = 0; i < that.aoData.length; i++) 
          {
            that.aoData[i].link_status = "false";
            for (let j = 0; j < that.aoData[i].sourceGroup.length; j++) 
            {
              that.aoData[i].sourceGroup[j].link_status = "no";
            }
          }
          for (let o = 0; o < that.aoData.length; o++) 
          {
            if (that.aoData[o].indexTitle == index) 
            {
              that.aoData[o].link_status = "true";
              for (let k = 0; k < that.aoData[o].sourceGroup.length; k++) 
              {
                for (let w = 0; w < aoOut.length; w++) 
                {
                  if (that.aoData[o].sourceGroup[k].indexTitle == aoOut[w]) 
                  {
                    that.aoData[o].sourceGroup[k].link_status = "true";
                  }
                }
              }
            }
          }
          that.switchLoading = false;
          that.$store.state.PageLoading=false;
        } 
        else if (response.data.status == "ERROR") 
        {
          that.switchLoading = false;
          that.$store.state.PageLoading=false;
        }
      }).catch(function(error) {
        that.switchLoading = false;
        that.$store.state.PageLoading=false;
        console.log(error);
      });
    },
    showInfo(index, item, isPosition) 
    {
      if (this.screenWidth > 1025) 
      {
        if (isPosition == "up") 
        {
          this.nowIndex1 = index;
        } 
        else 
        {
          this.nowIndex = index;
        }
      }
    },
    hideInfo(index) {
      if (this.screenWidth > 1025) {
        this.nowIndex = "100";
        this.nowIndex1 = "100";
      }
    },
    // 端口号点击事件（返回数据）
    openSet(index, dir, title, status) 
    {
      console.log("Hello this ");
      if (title == "CLOSE") 
      {
        return false;
      }
      if (status == true) 
      {
        console.log("Hello this 1");
        let that = this;
        let saveDir = "";
        this.$axios.get("/configuration.json").then(response => 
          {
            let listInfo = response.data.data.port;
            let cardInfo = response.data.data.card;
            let portNumber = that.$store.state.portNumber;
            if (dir == "In") 
            {
              saveDir = 0;
              for (let i = 0; i < listInfo.in.length; i++) 
              {
                if (listInfo.in[i].index == index) 
                {
                  if (portNumber == 16) 
                  {
                    for (let j = 0; j < cardInfo.length; j++) 
                    {
                      if (Math.ceil(index / 2) == cardInfo[j].slot) 
                      {
                        console.log(cardInfo[j].name);
                        listInfo.in[i].portType = cardInfo[j].name;
                      }
                    }
                  } 
                  else if (portNumber == 32) 
                  {
                    for (let j = 0; j < cardInfo.length; j++) 
                    {
                      if (Math.ceil(index / 4) == cardInfo[j].slot) 
                      {
                        console.log(cardInfo[j].name);
                        listInfo.in[i].portType = cardInfo[j].name;
                      }
                    }
                  } 
                  else if (portNumber == 64) 
                  {
                    for (let j = 0; j < cardInfo.length; j++) 
                    {
                      if (Math.ceil(index / 8) == cardInfo[j].slot) 
                      {
                        console.log(cardInfo[j].name);
                        listInfo.in[i].portType = cardInfo[j].name;
                      }
                    }
                  }
                  console.log("In The i is "+i);
                  that.selectPortInfo(listInfo.in[i], saveDir, title, index);
                }
              }
            } 
            else if (dir == "Out") 
            {
              console.log("Hello this OUT");
              saveDir = 1;
              for (let i = 0; i < listInfo.out.length; i++) 
              {
                if (listInfo.out[i].index == index) 
                {
                  if (portNumber == 16) 
                  {
                    for (let j = 0; j < cardInfo.length; j++) 
                    {
                      if (Math.ceil(index / 2) == cardInfo[j].slot) 
                      {
                        console.log(cardInfo[j].name);
                        listInfo.out[i].portType = cardInfo[j].name;
                      }
                    }
                  } 
                  else if (portNumber == 32) 
                  {
                    for (let j = 0; j < cardInfo.length; j++) 
                    {
                      if (Math.ceil(index / 4) == cardInfo[j].slot) 
                      {
                        console.log(cardInfo[j].name);
                        listInfo.out[i].portType = cardInfo[j].name;
                      }
                    }
                  } 
                  else if (portNumber == 64) 
                  {
                    for (let j = 0; j < cardInfo.length; j++) 
                    {
                      if (Math.ceil(index / 8) == cardInfo[j].slot) 
                      {
                        console.log(cardInfo[j].name);
                        listInfo.out[i].portType = cardInfo[j].name;
                      }
                    }
                  }
                  console.log("Out The i is "+i);
                  that.selectPortInfo(listInfo.out[i], saveDir, title, index);
                }
              }
            }
            else
            {
              console.log("Hello this Error");
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      } 
      else 
      {
        this.portSetInfo = {};
        this.portSetInfo.title = JSON.parse(JSON.stringify(title));
        this.portSetInfo.Info = [];
        this.portSetInfo.Setting = [];
        this.setInfo = JSON.parse(JSON.stringify(this.portSetInfo));
        this.openSetInfo = true;
      }
    },
    selectPortInfo(items, dir, title, index) {
      let that = this;
      let hdcpStatus = "";
      let statusList = "";
      that.portSetInfo = {};
      console.log("selectPortInfo item " +JSON.stringify(items));
      that.portSetInfo.title = title;
      that.portSetInfo.index = items.index;
      that.portSetInfo.dir = dir;
      let staticAoData = [];
      let setInfo1 = [];
      let aoData = {
        cmd: "GetHDCPStatus"
      };
      this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
      {
          if (response.data.status == "SUCCESS") 
          {
            statusList = response.data.echo.result.HDCPStatus;
            for (let i = 0; i < statusList.length; i++) 
            {
              if (statusList[i].PortIndex == index) 
              {
                console.log(statusList[i].HDCPStatus);
                if (statusList[i].HDCPStatus == false) 
                {
                  hdcpStatus = "none";
                } 
                else 
                {
                  hdcpStatus = "1.4";
                }
              }
            }
            for (var i in items) 
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
                if (items[i] == "v") 
                {
                  items[i] = "Video Matrix";
                }
                if (items[i] == "a") 
                {
                  items[i] = "Audio Matrix";
                }
                if (items[i] == "av") 
                {
                  items[i] = "Audio & Video Matrix";
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
                  value: items[i]
                };
                staticAoData.push(ht);
              }
              if (items[i].sid) 
              {
                let ht1 = {
                  Name: i,
                  Value: items[i].value
                };
                setInfo1.push(ht1);
                //console.log("data is "+JSON.stringify(setInfo));
              }
            }
            staticAoData.push({
              id: "HDCP Status",
              value: hdcpStatus
            });
            that.portSetInfo.Info = JSON.parse(JSON.stringify(staticAoData));
            that.portSetInfo.Setting = JSON.parse(JSON.stringify(setInfo1));
            that.setInfo={};
            that.setInfo = JSON.parse(JSON.stringify(that.portSetInfo));
            that.openSetInfo = true;
            console.log(that.setInfo);
          } 
          else if (response.data.status == "ERROR") 
          {
          }
        }).catch(function(error) {
          console.log(error);
        });
    },
    coverString(subStr, str) 
    {
      var reg = eval("/" + subStr + "/ig");
      return reg.test(str);
    },
    turnRight() {
      if (this.$store.state.b < this.aoDataOut.length) {
        if (this.$store.state.b == this.aoDataOut.length - 2) {
          this.isrightHidden = true;
        }
        this.$store.state.a += 2;
        this.$store.state.b += 2;
        this.$store.state.c += 2;
        this.$store.state.d += 2;
        this.$store.state.g += 2;
        this.$store.state.h += 2;
        this.isleftHidden = false;
      }
    },
    turnLeft() {
      if (this.$store.state.a > 0) {
        if (this.$store.state.a == 2) {
          this.isleftHidden = true;
        }
        this.$store.state.a -= 2;
        this.$store.state.b -= 2;
        this.$store.state.c -= 2;
        this.$store.state.d -= 2;
        this.$store.state.g -= 2;
        this.$store.state.h -= 2;
        this.isrightHidden = false;
      }
    },
    turnTop() {
      if (this.$store.state.e > 0) {
        if (this.$store.state.e == 2) {
          this.istopHidden = true;
        }
        this.$store.state.e -= 2;
        this.$store.state.f -= 2;
        this.isdownHidden = false;
      }
    },
    turnDown() {
      if (this.$store.state.f < this.aoDataLength) {
        if (this.$store.state.f == this.aoDataLength - 2) {
          this.isdownHidden = true;
        }
        this.$store.state.e += 2;
        this.$store.state.f += 2;
        this.istopHidden = false;
      }
    },
    showPortLink(a, b) {
      this.bg_index = a;
      this.bg_index2 = b;
    },
    hidePortLink() {
      this.bg_index = null;
      this.bg_index2 = null;
    },
    CancelShow(value) {
      this.openSetInfo = false;
      this.showBtn = true;
    },
    PortRefresh(index,dir,title,status){
      dir=dir==0?"In":"Out";
      console.log("index "+index);
      console.log("dir "+dir);
      console.log("title "+title);
      console.log("status "+status);
      this.openSet(index,dir,title,status);
    },
    //获取端口的初始化信息
    getProInfo() {
      console.log("获取端口信息");
      let that = this;
      let portNumber = that.$store.state.portNumber;
      if (portNumber == 16) 
      {
        that.$axios(that.$indexJsonUrl).then(response => {
          that.allPortInfo = response;
        });
      } 
      else if (portNumber == 32) 
      {
        that.$axios(that.$indexJsonUrl32).then(response => {
          that.allPortInfo = response;
        });
      } 
      else if (portNumber == 64) 
      {
        that.$axios(that.$indexJsonUrl64).then(response => {
          that.allPortInfo = response;
        });
      }

    },
    /**处理端口的状态信息 */
    getportNumInfo() 
    {
      //console.log(this.allPortInfo.data);
      if(typeof this.allPortInfo.data=='undefined')
      {
        return false;
      }
      let proVInfo = this.allPortInfo.data.Port;
      let sourceGroup = [];
      let i=0;
      for (let j = 0; j < proVInfo.length; j++,i++) 
      {
        for (let i = 0; i < this.onlineInfo.length; i++) 
        {
          if (proVInfo[j].portIndex == this.onlineInfo[i].PortIndex) 
          {
           
            proVInfo[j].OnlineStatus = this.onlineInfo[i].OnlineStatus;
            
          }
        }
        for (let i = 0; i < this.portInfo.length; i++) 
        {
          if (proVInfo[j].portIndex == this.portInfo[i].PortIndex) 
          {
            proVInfo[j].status = this.portInfo[i].Linkstatus;
          }
        }
        for (let i = 0; i < this.videoRouting.length; i++) 
        {
          if (proVInfo[j].portIndex == this.videoRouting[i].OutPort) 
          {
            proVInfo[j].switch = this.videoRouting[i].InPort;
          }
        }
        if (proVInfo[j].Dir == "Out") 
        {
          sourceGroup.push(proVInfo[j]);
        }
      }
      let sourceGroup1 = [
        {
          indexTitle: 0,
          Dir: "in",
          portIndex: 0,
          title: "CLOSE",
          status: "close",
          link_status: "false",
          sourceGroup: JSON.parse(JSON.stringify(sourceGroup))
        }
      ];
      for (let i = 0; i < proVInfo.length; i++) 
      {
        if (proVInfo[i].Dir == "In") 
        {
          proVInfo[i].sourceGroup = sourceGroup;
          sourceGroup1.push(proVInfo[i]);
        }
      }
      this.aoDataOut = sourceGroup;
      for(let i=0;i<this.$store.state.portNumber;i++)
      {
        this.aoDataOut[i].switchSelect = this.$store.state.VideoALLChecked[i];
      }
      this.aoData = JSON.parse(JSON.stringify(sourceGroup1));
      this.aoDataLength = this.aoData.length;
      
      if (this.aoDataOut.length <= 17) 
      {
        this.isrightHidden = true;
      }
      else if (this.isrightHidden == true) 
      {
        this.isrightHidden = true;
      } 
      else 
      {
        this.isrightHidden = false;
      }
      if (this.aoDataLength <= 18) 
      {
        this.isdownHidden = true;
      } 
      else if (this.isdownHidden == true) 
      {
        this.isdownHidden = true;
      } 
      else 
      {
        this.isdownHidden = false;
      }
      for (let i = 0; i < proVInfo.length; i++) 
      {
        if(this.isSelectAll)
        {
          for(let j=0;j<this.aoData.length;j++)
          {
            if (proVInfo[i].Dir == "Out") 
            {
              let index = proVInfo[i].portIndex;
              for (let k = 0; k < this.aoData[j].sourceGroup.length; k++) 
              {
                if (this.aoData[j].sourceGroup[k].portIndex == index) 
                {
                  if(proVInfo[i].switch == this.aoData[j].portIndex)
                  {
                    this.aoData[j].sourceGroup[k].link_status = "true";
                  }
                  else
                  {
                    this.aoData[j].sourceGroup[k].link_status = "no";
                  }
                  
                }
              }
            }
          }
        }
        else
        {
          for (let j = 0; j < this.aoData.length; j++) 
          {
            if (proVInfo[i].Dir == "Out" && proVInfo[i].OnlineStatus == false) 
            {
              let index = proVInfo[i].portIndex;
              for (let k = 0; k < this.aoData[j].sourceGroup.length; k++) 
              {
                if (this.aoData[j].sourceGroup[k].portIndex == index) 
                {
                  this.aoData[j].sourceGroup[k].link_status = "noLine";
                }
              }
            }
            if (proVInfo[i].Dir == "In" && proVInfo[i].OnlineStatus == false) 
            {
              let index = proVInfo[i].indexTitle;
              for (let k = 0; k < this.aoData[index].sourceGroup.length; k++) 
              {  
                this.aoData[index].sourceGroup[k].link_status = "noLine";  
              }
            }
            if (proVInfo[i].Dir == "Out" &&proVInfo[i].switch == this.aoData[j].portIndex) 
            {
              for (let k = 0; k < this.aoData[j].sourceGroup.length; k++) 
              {
                if (proVInfo[i].portIndex ==this.aoData[j].sourceGroup[k].portIndex) 
                {
                  this.aoData[j].sourceGroup[k].link_status = "true";
                }
              }
            }
        
          }
        }
        this.$emit("closeLoading", false);
      }
    },
    getOnline() {
      console.log("获取端口在线状态");
      let that = this;
      let aoData = {
        cmd: "PortOnline"
      };
      this.$axios
        .post("/cgi-bin/ligline.cgi", aoData)
        .then(function(response) {
          if (response.data.status == "SUCCESS") 
          {
            that.onlineInfo = response.data.echo.result.Data;
            that.getportInfo();
          } 
          else if (response.data.status == "ERROR") 
          {
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    /**获取端口的切换状态和连接状态 */
    getportInfo() {
      let that = this;
      let aoData = {
        cmd: "PortInfo"
      };
      this.$axios
        .post("/cgi-bin/ligline.cgi", aoData)
        .then(function(response) 
        {
          if (response.data.status == "SUCCESS") 
          {
            that.portInfo = response.data.echo.result.LinkStatus;
            that.videoRouting = response.data.echo.result.VideoRouting;
            that.getportNumInfo();
          } 
          else if (response.data.status == "ERROR") 
          {
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  created() {
    console.log("created");
    /*
    for(let i=0;i<this.portNumber;i++)
    {
      this.aoDataOut[i].switchSelect = this.$store.state.VideoALLChecked[i];
    }
    this.getOnline();
    this.getProInfo();*/
  },
  mounted() {
    //获取端口信息
    console.log("mounted");
    this.getOnline();
    this.getProInfo();
    let that = this;
    that.getportInfo();
    window.myInterval = setInterval(function() {
      that.getportInfo();
    }, 3000);
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
  }
};
</script>
<style>
.el-checkbox__label {
  display: inline-block;
  padding-left: 5px;
  line-height: 19px;
  font-size: 14px;
}
</style>

<style scoped>
@import "../../style/common";
.hide {
  visibility: hidden;
}
#matrix_content {
  width: 830px;
  padding: 10px 10px 0 10px;
  height: 805px;
  min-height: 750px;
  margin: 0 auto;
  position: relative;
}
.ProTitle {
  text-align: center;
  font-size: 20px;
  margin-bottom: 10px;
}
.table {
  display: table;
  /* border-collapse: collapse; */
  table-layout: fixed;
}
.tableRow {
  display: table-row;
  height: 25px;
}
.tableRow1 {
  display: table-row;
  /* height: 10px; */
}
.tableCell,
.table_cell {
  width: 30px;
  height: 30px;
  display: table-cell;
  vertical-align: middle;
  box-sizing: border-box;
  text-align: center;
}
.tableCellAfv {
  width: 30px;
  height: 10px;
  display: table-cell;
  vertical-align: middle;
  box-sizing: border-box;
  text-align: center;
  background-color: white;
}
.table_checkbox {
  display: table-cell;
  width: 30px;
  height: 30px;
  box-sizing: border-box;
  text-align: center;
}
.table_cel2 {
  width: 50px;
  /* height: 10px; */
  display: table-cell;
  vertical-align: middle;
  box-sizing: border-box;
}
.table_cel3 {
  width: 65px;
  height: 145px;
  display: table-cell;
  vertical-align: middle;
  box-sizing: border-box;
  background-color: white;
}
.table_celR {
  width: 45px;
  height: 145px;
  display: table-cell;
  vertical-align: middle;
  box-sizing: border-box;
  background-color: white;
}
.table_cel4 {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-right: 1px solid white;
}
.output {
  text-align: center;
  transform: translate(0, 100%) rotate(-90deg);
  transform-origin: 0 0;
  font-size: 20px;
  line-height: 50px;
}
.table_cel5 {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left: 1px solid white;
}
.table_cel6 {
  text-align: center;
  line-height: 50px;
  font-size: 20px;
  background-color: white;
  width: 180px;
  height: 50px;
  display: table-cell;
  vertical-align: middle;
  box-sizing: border-box;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.table_cel7 {
  background-color: white;
  width: 180px;
  height: 10px;
  display: table-cell;
  vertical-align: middle;
  box-sizing: border-box;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.table_cell1 {
  /* width: 10px; */
  display: table-cell;
  position: relative;
}
.tableCell {
  background-color: white;
}
.selected {
  color: blue;
}
.groupHeader {
  text-align: center;
  transform: translate(0, 85%) rotate(-65deg);
  transform-origin: 1px 0;
  white-space: nowrap;
  width: 0;
  /* margin-bottom: 5px; */
  line-height: 30px;
}

.groupHeaderSecound {
  height: 145px;
  box-sizing: border-box;
}
.groupHeaderAfv {
  width: 30px;
  height: 20px;
  box-sizing: border-box;
}
.groupRow {
  width: 180px;
  /* cursor: pointer; */
  height: 30px;
  /* background-color: #ffffff; */
  box-sizing: border-box;
  padding-left: 20px;
  text-align: left;
  line-height: 30px;
}
.groupRowFirst {
  width: 75px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 1025px) {
  .link_status,
  .link_status_no,
  .link_status_noLine {
    width: 29px;
    height: 29px;
    cursor: pointer;
    margin: auto;
    display: block;
    /* // box-sizing: border-box; */
    background: url(../../../static/img/yuan2.png) no-repeat;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    border-radius: 15px;
    z-index: 99;
  }
  .link_status_no {
    background: url(../../../static/img/yuan3.png) no-repeat;
    cursor: no-drop;
  }
  .link_status_noLine {
    background: url(../../../static/img/yuan3.png) no-repeat;
  }
  .checked {
    background: url(../../../static/img/yuan4.png) no-repeat;
  }
}

@media (max-width: 1025px) {
  .link_status,
  .link_status_no,
  .link_status_noLine {
    width: 29px;
    height: 29px;
    cursor: pointer;
    margin: auto;
    display: block;
    box-sizing: border-box;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    border-radius: 15px;
    box-shadow: 1px 1px 1px 0 #777;
    -moz-box-shadow: 1px 1px 1px 0 #777;
    -webkit-box-shadow: 1px 1px 1px 0 #777;
    -o-box-shadow: 1px 1px 1px 0 #777;
    background-color: white;
    z-index: 99;
  }
  .link_status_no {
    background-color: #ccc;
    cursor: no-drop;
  }
  .link_status_noLine {
    background-color: #ccc;
  }
  .checked {
    background-color: #009a61;
  }
}

.nav_left_content {
  display: block;
  width: 0;
  height: 0;
  cursor: pointer;
  border-top: 60px solid transparent;
  border-right: 30px solid #4d4d4d;
  border-bottom: 60px solid transparent;
  position: absolute;
  top: 15px;
  left: -30px;
}
.nav_left_content_in {
  display: block;
  width: 0;
  height: 0;
  cursor: pointer;
  border-top: 56px solid transparent;
  border-right: 27px solid white;
  border-bottom: 56px solid transparent;
  position: absolute;
  top: -56px;
  left: 2px;
}
.nav_right {
  width: 0;
  height: 0;
  border-top: 60px solid transparent;
  border-left: 30px solid #4d4d4d;
  border-bottom: 60px solid transparent;
  position: relative;
}
.nav_right_content {
  display: block;
  width: 0;
  height: 0;
  cursor: pointer;
  border-top: 56px solid transparent;
  border-left: 27px solid white;
  border-bottom: 56px solid transparent;
  position: absolute;
  top: -56px;
  left: -29px;
}
.nav_top {
  width: 0;
  height: 0;
  border-left: 60px solid transparent;
  border-right: 60px solid transparent;
  border-bottom: 30px solid #4d4d4d;
  position: absolute;
  top: -30px;
  left: 30px;
}
.nav_top_content_in {
  display: block;
  width: 0;
  height: 0;
  cursor: pointer;
  border-left: 56px solid transparent;
  border-right: 56px solid transparent;
  border-bottom: 27px solid white;
  position: absolute;
  top: 2px;
  left: -56px;
}
.nav_bottom {
  width: 0;
  height: 0;
  border-left: 60px solid transparent;
  border-right: 60px solid transparent;
  border-top: 30px solid #4d4d4d;
  position: relative;
  left: 30px;
}
.nav_bottom_content {
  display: block;
  cursor: pointer;
  width: 0;
  height: 0;
  border-left: 56px solid transparent;
  border-right: 56px solid transparent;
  border-top: 27px solid white;
  position: absolute;
  top: -29px;
  left: -56px;
}
.nav_bottom_content:hover {
  border-top: 27px solid #ededed;
}
.nav_left_content_in:hover {
  border-right: 27px solid #ededed;
}
.nav_top_content_in:hover {
  border-bottom: 27px solid #ededed;
}
.nav_right_content:hover {
  border-left: 28px solid #ededed;
}

.port_name {
  cursor: pointer;
}
.setInfo {
  width: 591px;
  height: 587px;
  border: 1px solid #ccc;
  position: absolute;
  top: 168px;
  left: 198px;
  background-color: white;
  z-index: 100;
}
.bottom_btn {
  text-align: center;
  width: 475px;
  position: absolute;
  bottom: 20px;
}
.btn {
  width: 100px;
  height: 30px;
}
.btn:first-child {
  margin-right: 50px;
}
button {
  cursor: pointer;
}
.table_cell_bg {
  background-color: #909399;
}
.signal {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: #009a61;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
  margin-right: 10px;
  text-align: center;
}
.signalNo {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: #ccc;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
  margin-right: 10px;
  text-align: center;
}
.afvStatus {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: #ccc;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
}
.afvStatusT {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: #009a61;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
}
.signalClose {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: black;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
  margin-right: 10px;
  text-align: center;
}
.isAll {
  width: 58px;
  text-align: center;
  line-height: 50px;
}
.outPutInfo {
  width: 510px;
  background-color: white;
}
.outPutInfo_title {
  height: 145px;
}
.mask {
  opacity: 0.7;
  width: 563px;
  height: 572px;
  position: absolute;
  top: 172px;
  left: 209px;
  background-color: white;
  z-index: 100;
  line-height: 540px;
  text-align: center;
}
/* 板卡信息 */
.setInfo_box {
  height: 555px;
  padding: 20px 45px;
  position: relative;
  overflow-y:auto;
}
.boxC {
  width: 100%;
}
.boxContent {
  height: 467px;
  overflow: auto;
  -webkit-overflow-scrolling: auto;
}
.staticTr {
  line-height: 35px;
}
.isOk {
  width: 100px;
  height: 40px;
  position: absolute;
  bottom: 0;
  left: 40px;
}
.isCancel {
  width: 100px;
  height: 40px;
  position: absolute;
  bottom: 0;
  right: 40px;
}
</style>