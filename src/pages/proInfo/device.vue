<template>
  <div class="wrapper">
    <div id="deviceInfo">
      <div class="deviceInformation">
        <div class="box">
          <p class="title_device">Information</p>
          <div class="left">
            <p>Model:</p>
            <p>Name:</p>
            <p>SN:</p>
            <p>Firmware Version:</p>
          </div>
          <div class="content">
            <p>{{ model }}</p>
            <p>
              <input
                :class="
                  nameCheck == true
                    ? 'equipment_information_two_input'
                    : 'equipment_information_two_input1'
                "
                @keyup="Check('name')"
                type="text"
                id
                ref="nameInp"
                value
              >
            </p>
            <p>{{ sn }}</p>
            <p>
              {{ firmwareVersion }}
              <span style="margin-left:10px">
                <!-- <el-button class="btnMore" type="primary" @click="dialogVisible = true">More</el-button> -->
              </span>
            </p>
          </div>
          <div class="firmware">
            <p class="modify">Firmware Upgrade</p>
            <p>Choose a file</p>
            <!-- 选择文件 -->
            <p class="line40 martop10">
              <input 
                v-model="uploadedFiles"
                type="file" 
                name="inputFile" 
                id="file" 
                hidden 
                @change="selectFile($event)"
              >
              <el-button 
                class="btn" 
                type="primary" 
                :disabled="uploadedFiles!=''"
                @click="uplaodFile()"
              >Browse</el-button>
            </p>
            <p>
              <el-progress 
                :percentage="fileGrogress" 
                v-show="uploading" 
                :status="uploadStatus"
              ></el-progress>
            </p>
          </div>
        </div>
        <div class="box">
          <div class="left">
            <p>MAC:</p>
            <p>IP:</p>
            <p>MASK:</p>
            <p>GATE:</p>
            <p>TCP Port:</p>
            <p>UDP Port:</p>
            <p>DHCP:</p>
          </div>
          <div class="content">
            <p>{{ mac0 }}</p>
            <p>
              <input
                :class="
                  ipCheck == true
                    ? 'equipment_information_two_input'
                    : 'equipment_information_two_input1'
                "
                @keyup="Check('ip')"
                type="text"
                id
                ref="ipInp"
                value
                :disabled="ckeckVal==true?true:false"
              >
            </p>

            <p>
              <input
                :class="
                  maskCheck == true
                    ? 'equipment_information_two_input'
                    : 'equipment_information_two_input1'
                "
                @keyup="Check('mask')"
                type="text"
                id
                ref="subnetMask"
                value
                :disabled="ckeckVal==true?true:false"
              >
            </p>

            <p>
              <input
                :class="
                  gatewayCheck == true
                    ? 'equipment_information_two_input'
                    : 'equipment_information_two_input1'
                "
                @keyup="Check('gateway')"
                type="text"
                id
                ref="gateway"
                value
                :disabled="ckeckVal==true?true:false"
              >
            </p>

            <p>
              <input
                :class="
                  tcpCheck == true
                    ? 'equipment_information_two_input'
                    : 'equipment_information_two_input1'
                "
                @keyup="Check('tcp')"
                title="1~65535"
                type="text"
                id
                ref="tcp"
                value
              >
            </p>

            <p>
              <input
                :class="
                  udpCheck == true
                    ? 'equipment_information_two_input'
                    : 'equipment_information_two_input1'
                "
                @keyup="Check('udp')"
                title="1~65535"
                type="text"
                id
                ref="udp"
                value
              >
            </p>
            <p>
              <el-checkbox v-model="ckeckVal" @change="clickMe"></el-checkbox>
            </p>
          </div>
        </div>
        <div class="box">
          <div class="left">
            <p class="line40">Save Changes:</p>
            <p class="line40">Configuration File:</p>
            <p class="line40">Reset:</p>
            <p class="line40">Refresh:</p>
            <!-- <p class="line40">ISP Mode:</p> -->
          </div>
          <div class="right">
            <p class="line40">
              <el-button class="btn" type="primary" @click="saveInfo" :disabled="!HaveChange" >Save Changes</el-button>
            </p>
            <p class="line40">
              <el-button class="btn" type="primary" @click="downLoad">Get</el-button>
            </p>
            <p class="line40">
              <el-button class="btn" type="primary" @click="reset">Repower</el-button>
              <el-button class="btn" type="primary" @click="factory">Factory</el-button>
            </p>
            <p class="line40">
              <el-button class="btn" type="primary" @click="Refresh">Refresh</el-button>
            </p>
            <!-- <p class="line40"><el-button class="btn" type="primary">ISP Mode</el-button></p> -->
          </div>
        </div>
        <el-dialog
          title="APP Information"
          :visible.sync="dialogVisible"
          :append-to-body="true"
          width="500px"
          :close-on-click-modal="false"
        >
          <el-table empty-text="No Data" :data="Moreinfo">
            <el-table-column property="name" label="Name" width="150"></el-table-column>
            <el-table-column property="value" label="Verioson" width="200"></el-table-column>
          </el-table>
        </el-dialog>
        <el-dialog
          title="Set Static IP Address"
          :visible.sync="staticip"
          :append-to-body="true"
          width="400px"
          :close-on-click-modal="false"
        >
          <el-radio-group v-model="ipaddress">
            <el-radio :label="0" style="width:150px">Custom IP</el-radio>
            <input
                :class="
                  staticipCheck == true
                    ? 'equipment_information_two_input'
                    : 'equipment_information_two_input1'
                "
                @change="GetCustomIP()"
                v-model="customIP"
                ref="custom"
            >
            <br>
            <el-radio :label="1" style="width:150px">Default IP</el-radio>
            <input
                :class="'equipment_information_two_input'"
                v-model="defaultip"
                disabled="true"
            >
          </el-radio-group>
          <div slot="footer" class="dialog-footer">
          <el-button @click="SetStaticIP(false)">CANCEL</el-button>
          <el-button type="primary" @click="SetStaticIP(true)">OK</el-button>
          </div>

        </el-dialog>
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
      dialogVisible: false,
      model: "",
      sn: "",
      firmwareVersion: "",
      Moreinfo: [],
      fileName: "",
      file: "",
      mac0: "",
      mac1: "",
      isFile: false,
      fileGrogress: 0,
      uploading: false,
      uploadStatus: "",
      ipCheck: true,
      nameCheck: true,
      maskCheck: true,
      gatewayCheck: true,
      staticipCheck:true,
      name: "",
      tcp: "",
      udp: "",
      tcpCheck: true,
      udpCheck: true,
      oldIpVal0: "",
      oldMaskVal0: "",
      oldGateVal0: "",
      oldTcpVal0: "",
      oldUdpVal0: "",
      oldNameVal0: "",
      isUpgrade: false,
      ckeckVal: false,
      uploadedFiles: "",
      HaveChange:false,
      ChangeFlag:0,
      ipaddress:1,
      staticip:false,
      customIP:"",
      defaultip:"192.168.1.39"
    };
  },
  watch: {
    ChangeFlag:function(value)
    {
      console.log("The data is "+value)
      if(value==0)
      {
        this.HaveChange=false;
      }
      else
      {
        this.HaveChange=true;
      }
    }
  },
  computed: {},
  methods: {
    Check(inp) 
    {
      switch (inp) 
      {
        case "name":
        {
          let value=this.$refs.nameInp.value;
          if(this.oldNameVal0==value)
          {
            this.ChangeFlag&=~1;
          }
          else
          {
            this.ChangeFlag|=1;
          }
          break;
        }
        case "ip":
        {
          let value=this.$refs.ipInp.value;
          if(this.oldIpVal0==value)
          {
            this.ChangeFlag&=~2;
          }
          else
          {
            this.ChangeFlag|=2;
          }
          break;
        }
        case "mask":
        {
          let value=this.$refs.subnetMask.value;
          if(this.oldMaskVal0==value)
          {
            this.ChangeFlag&=~4;
          }
          else
          {
            this.ChangeFlag|=4;
          }
          break;
        }
        case "gateway":
        {
          let value=this.$refs.gateway.value;
          if(this.oldGateVal0==value)
          {
            this.ChangeFlag&=~8;
          }
          else
          {
            this.ChangeFlag|=8;
          }
          break;
        }
        case "tcp":
        {
          this.$refs.tcp.value=this.$refs.tcp.value.replace(/\D/g,'');
          let value=this.$refs.tcp.value;
          if(this.oldTcpVal0==value)
          {
            this.ChangeFlag&=~16;
          }
          else
          {
            this.ChangeFlag|=16;
          }
          break;
        }
        case "udp":
        {
          this.$refs.udp.value=this.$refs.udp.value.replace(/\D/g,'');
          let value=this.$refs.udp.value;
          if(this.oldUdpVal0==value)
          {
            this.ChangeFlag&=~32;
          }
          else
          {
            this.ChangeFlag|=32;
          }
          break;
        }
        default:
          break;
      }
      if (window.getDeviceInterval) 
      {
        window.clearInterval(window.getDeviceInterval);
      }
    },
    Blur(inp) 
    {
      let ipaddr = this.$refs.ipInp.value;
      let nameaddr = this.$refs.nameInp.value;
      let maskaddr = this.$refs.subnetMask.value;
      let gateway = this.$refs.gateway.value;
      let tcp = this.$refs.tcp.value;
      let udp = this.$refs.udp.value;
      let that = this;
      if (
        ipaddr != that.oldIpVal0 ||
        maskaddr != that.oldMaskVal0 ||
        gateway != that.oldGateVal0 ||
        tcp != that.oldTcpVal0 ||
        udp != that.oldUdpVal0 ||
        nameaddr != that.oldNameVal0
      ) {
        console.log("取消轮询");
        if (window.getDeviceInterval) {
          window.clearInterval(window.getDeviceInterval);
        }
      } else {
        console.log("继续轮询");
        window.getDeviceInterval = setInterval(function() {
          that.getDeviceInfo();
        }, 3000);
      }
    },
    // 选择文件
    uplaodFile() 
    {
      document.getElementById("file").click();
    },
    // 选择文件点击确认后
    selectFile(event) 
    {
      this.file = event.target.files[0];
      var filemaxsize = 1024 * 2;
      var size = this.file.size / 1024;
      let index = this.file.name.lastIndexOf(".");
      let nameIndex = this.file.name.lastIndexOf("_");
      let fileNameExt = this.file.name.substring(0, nameIndex);
      let ext = this.file.name.substr(index + 1);
      let extUpperCase = ext.toUpperCase();
      if (size <= 0) 
      {
        this.$alert("The appendix size can not be 0M！", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {
            this.uploading = false;
            this.uploadedFiles = ""
          }
        });
        return false;
      }
      if (extUpperCase != "KPTW") 
      {
        this.$alert("Upgrade file type error", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {
            this.uploading = false;
            this.uploadedFiles = ""
          }
        });
        return false;
      }
      if (fileNameExt != "VS-1616DN-EM_VS-3232DN-EM_VS-6464DN-EM") 
      {
        this.$alert("Error in uploaded file", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {
            this.uploading = false;
            this.uploadedFiles = ""
          }
        });
        return false;
      }
      this.fileName = this.file.name;
      this.isFile = true;
      this.isUpgrade = false;
      this.uploading = false;
      this.uploadStatus = "";
      this.fileGrogress = 0;
      this.getfileInfo(event);
    },
    // 上传升级文件
    getfileInfo(event) {
      event.preventDefault();
      let that = this;
      that.uploading = true;
      let formData = new window.FormData();
      formData.append("file", this.file);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: progressEvent => {
          var complete =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          this.fileGrogress = complete;
        }
      };
      this.$axios.post("/cgi-bin/upload.cgi", formData, config).then(function(msg) 
      {
        if (msg.data.status == "SUCCESS") 
        {
          that.uploadStatus = "success";
          that.fileGrogress = 100;
          that.isUpgrade = true;
          that.Upgrade();
          console.log("good for this ");
        } 
        else 
        {
          console.log("The value is " + msg.data.status);
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    //开始升级
    Upgrade() 
    {
      let that = this;
      let aoData = {
        cmd: "GetUpgradeFileName",
        Data: {
          Filename: that.fileName
        }
      };
      this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
      {
        if (response.data.status == "SUCCESS") 
        {
          let decompressionFileName = response.data.echo.result.Filename;
          that.realUpgrade(decompressionFileName);
        } 
        else if (response.data.status == "ERROR") 
        {
          that.$alert(response.data.error, "Prompt information", {
            confirmButtonText: "OK",
            callback: action => {}
          });
        }
      }).catch(function(error) {
          console.log(error);
        });
    },
    realUpgrade(fileName) 
    {
      let that = this;
      that.$store.state.upgradeDeviceLoading = true;
      window.upgradeSettimeout = setTimeout(function() 
      {
        window.location.reload();
      }, 100000);
      let aoData = {
        cmd: "Upgrade",
        Data: {
          newfile: fileName,
          oldfile: fileName
        }
      };
      this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
      {
          if (response.data.status == "SUCCESS") 
          {
          } 
          else if (response.data.status == "ERROR") 
          {
            that.$alert(response.data.error, "Prompt information", 
            {
              confirmButtonText: "OK",
              callback: action => 
              {
                that.uploading = false;
                that.uploadedFiles = ""
              }
            });
          }
        }).catch(function(error) {
          console.log(error);
        });
    },
    /**设置DHCP状态 */
    clickMe() 
    {
      let that = this;
      let val = 0;
      if (that.ckeckVal) 
      {
        val = 1;
        /**DHCP on */
        this.$confirm(
          "Open DHCP,You Network Settings will change,should  Press OK to confirm",
          "Prompt information",
          {
            confirmButtonText: "Ok",
            cancelButtonText: "Cancel",
            type: "warning",
            closeOnClickModal: false,
            dangerouslyUseHTMLString: true
          }).then(() => {
            let aoData = 
            {
              cmd: "SetDHCPStatus",
              Data: 
              {
                dhcp: val
              }
            };
            this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
            {
              if (response.data.status == "SUCCESS") 
              {
                console.log("DHCP OK");
              } 
              else if (response.data.status == "ERROR") 
              {
                console.log("DHCP Error");
                that.ckeckVal=false;
              }
            }).catch(function(error) 
              {
                that.ckeckVal=false;
                console.log(error);
              });
          }).catch(() => {
            let sendata = {
              resetSure: "取消重置信息"
              
            };
            that.ckeckVal=false;
            console.log(sendata);
          });
      } 
      else 
      {
        val = 0;
        that.staticip=true;
      }
      return false;
      let aoData = 
      {
        cmd: "SetDHCPStatus",
        Data: 
        {
          dhcp: val
        }
      };
      this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
      {
        if (response.data.status == "SUCCESS")
        {
        } 
        else if (response.data.status == "ERROR") 
        {
          that.$alert(response.data.error, "Prompt information", 
          {
            confirmButtonText: "OK",
            callback: action => {}
          });
        }
      }).catch(function(error) {
          console.log(error);
        });
    },
    /**设置修改的参数 */
    saveInfo() 
    {
      let nameaddr = this.$refs.nameInp.value;
      let ipaddr =this.SetIPAddress(this.$refs.ipInp.value) ;
      let maskaddr = this.$refs.subnetMask.value;
      let gateway =this.SetIPAddress(this.$refs.gateway.value) ;
      let tcp = this.$refs.tcp.value;
      let udp = this.$refs.udp.value;
      console.log(ipaddr);
      this.ipCheck=this.$checkInp.fnValidateIPAddress(ipaddr);
      this.maskCheck=this.$checkInp.fnValidateMask(maskaddr);
      this.gatewayCheck=this.$checkInp.fnValidateGateway(gateway);
      this.tcpCheck=this.$checkInp.fnValidateIcp(tcp,udp);
      this.udpCheck=this.$checkInp.fnValidateUdp(udp,tcp);
      this.nameCheck=this.$checkInp.fnValidateName(nameaddr)
      if (
        this.ipCheck &&
        this.maskCheck&&
        this.gatewayCheck&&
        this.tcpCheck&&
        this.udpCheck&&
        this.nameCheck
      ) 
      {
          let that = this;
          let setInfo = {};
          if(that.ChangeFlag&0xE)
          {
            setInfo.ip = ipaddr;
            setInfo.mask = maskaddr;
            setInfo.gateway = gateway;
          }
          if(that.ChangeFlag&16)
          {
            setInfo.tcp = Number(tcp);
          }
          if(that.ChangeFlag&32)
          {
            setInfo.udp = Number(udp);
          }
          if(that.ChangeFlag&1)
          {
            let aoData = {
              cmd: "SetDeviceName",
              Data: {
                Name: nameaddr
              }
            };
            this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
              {
                if (response.data.status == "SUCCESS") 
                {
                  that.$message({
                  message: "Setting DNS Name Successful",
                  type: "success"
                  });
                  if(that.ChangeFlag==1)
                  {
                    that.ChangeFlag=0;
                  }
                } 
                else if (response.data.status == "ERROR") 
                {
                  that.$alert("Setting DNS Name Failed", "Prompt information", {
                  confirmButtonText: "OK",
                  callback: action => {}
                    });
                }
              }).catch(function(error) 
              {
                  console.log(error);
              });
          }
          if(that.ChangeFlag^1)
          {
            let aoData = {
              cmd: "SetNetwork",
              Data: setInfo
            };
            this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
            {
              if (response.data.status == "SUCCESS") 
              {
                 that.$message({
                  message: "Save success",
                  type: "success"
                });
                if((that.ChangeFlag&2)==2)
                {
                  console.log("chanage ip 11"+ipaddr)
                }
                else
                {
                  console.log("The Old ip is "+that.oldIpVal0);
                  that.oldIpVal0=ipaddr;
                  that.oldMaskVal0=maskaddr;
                  that.oldGateVal0=gateway;
                  that.oldTcpVal0=tcp;
                  that.oldUdpVal0=udp;
                  that.ChangeFlag=0;
                  //that.HaveChange=false;
                }
              } 
              else if (response.data.status == "ERROR") 
              {
                that.$alert("Network Setting Failed", "Prompt information", {
                  confirmButtonText: "OK",
                  callback: action => {}
                });
                that.ChangeFlag=0;
                //that.HaveChange=false;
              }
            }).catch(function(error) 
              {
                console.log(error);
                that.ChangeFlag=0;
                //that.HaveChange=false;
              });
            if((that.ChangeFlag&2)==2)
            {
              console.log("chanage ip "+ipaddr);
              window.location.href = "http://" +ipaddr;
            }
            else
            {
              console.log("Have nochangfe")
            }
          }
        }
    },
    SetIPAddress(value)
    {
      let data=value.split(".");
      let val=new Array();
      for(let i=0;i<data.length;i++)
      {
        val[i]=parseInt(data[i])
      }
      return val.join(".")
    },
    downLoad() 
    {
      var ip_addr = document.location.hostname;
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = "http://" + ip_addr + "/configuration.json";
      link.setAttribute("download", "configuration.json");
      document.body.appendChild(link);
      link.click();
    },
    reset() 
    {
      this.$confirm(
        "RESET Device to repower ? <br/>Press OK to confirm",
        "Prompt information",
        {
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
          type: "warning",
          closeOnClickModal: false,
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
          let that = this;
          let ip_addr = document.location.hostname;
          let aoData = 
          {
            cmd: "SetDeviceReset"
          };
          this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
          {
            if (response.data.status == "SUCCESS") 
            {
              that.$store.state.resetLoading = true;
              window.mysettimeout = setTimeout(function() 
              {
                window.location.href = "http://" + ip_addr;
                }, 80000);
            } 
            else if (response.data.status == "ERROR") 
            {
              that.$alert(response.data.error, "Prompt information", 
              {
                confirmButtonText: "OK",
                callback: action => {}
              });
            }
          }).catch(function(error) 
            {
              console.log(error);
            });
        }).catch(() => {
          let sendata = {
            resetSure: "取消重置信息"
          };
          console.log(sendata);
        });
    },
    factory() 
    {
      this.$confirm(
        "RESET Device to factory default ? <br/>Press OK to confirm",
        "Prompt information",
        {
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
          type: "warning",
          closeOnClickModal: false,
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
          let that = this;
          let aoData = {
            cmd: "SetDeviceFactory"
          };
          this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
          {
            if (response.data.status == "SUCCESS") 
            {
              that.$store.state.resetLoading = true;
              window.mysettimeout = setTimeout(function() 
              {
                  window.location.href = "http://192.168.1.39";
              }, 80000);
            } 
            else if (response.data.status == "ERROR") 
            {
              that.$alert(response.data.error, "Prompt information", 
              {
                confirmButtonText: "OK",
                callback: action => {}
              });
            }
          }).catch(function(error) {
              console.log(error);
            });
        }).catch(() => {
          let sendata = {
            resetSure: "取消重置信息"
          };
          console.log(sendata);
        });
    },
    Refresh()
    {
      this.ChangeFlag=0;
      this.getDeviceInfo();
    },
    /**获取设备信息 */
    getDeviceInfo() 
    {
      let that = this;
      this.$axios.get("/configuration.json").then(response => {
          that.model = response.data.data.matrix.model;
          that.sn = that.$store.state.sn;
          that.firmwareVersion = that.$store.state.version;
          if (response.data.data.communication.Ethernet[0].dhcp == 0) 
          {
            that.ckeckVal = false;
          } 
          else 
          {
            that.ckeckVal = true;
          }
          that.mac0 = response.data.data.communication.Ethernet[0].mac;
          that.$refs.ipInp.value =response.data.data.communication.Ethernet[0].ip;
          that.$refs.subnetMask.value =response.data.data.communication.Ethernet[0].mask;
          that.$refs.gateway.value =response.data.data.communication.Ethernet[0].gate;
          that.$refs.tcp.value =response.data.data.communication.Ethernet[0].tcp;
          that.$refs.udp.value =response.data.data.communication.Ethernet[0].udp;
          that.$refs.nameInp.value = response.data.data.matrix.name;
          that.oldNameVal0 = JSON.parse(JSON.stringify(response.data.data.matrix.name));
          that.oldIpVal0 =that.SetIPAddress(JSON.parse(JSON.stringify(response.data.data.communication.Ethernet[0].ip))) ;
          that.oldMaskVal0 = JSON.parse(JSON.stringify(response.data.data.communication.Ethernet[0].mask));
          that.oldGateVal0 = that.SetIPAddress(JSON.parse(JSON.stringify(response.data.data.communication.Ethernet[0].gate)));
          that.oldTcpVal0 = JSON.parse(JSON.stringify(response.data.data.communication.Ethernet[0].tcp));
          that.oldUdpVal0 = JSON.parse(JSON.stringify(response.data.data.communication.Ethernet[0].udp));
          that.customIP=that.oldIpVal0;
          }).catch(function(error) {
          console.log(error);
        });
    },
    SetStaticIP(value)
    {
      
      if(value)
      {
        let ipaddr=this.ipaddress==0?this.customIP:this.defaultip;
        console.log("设置静态IP "+ipaddr);
        if(this.staticipCheck==false)
        {
          this.$message(
          {
            message: "Please Check IP Address",
            type: "warning"
          });
        }
        else
        {
          this.staticip=false;
          console.log("设置网络参数");
          let setInfo={};
          setInfo.ip=ipaddr;
          setInfo.mask = this.oldMaskVal0;
          setInfo.gateway = this.oldGateVal0;
          let time=setTimeout(function() 
          {
            window.location.href = "http://"+ipaddr;
          }, 8000);
          let aoData = {
            cmd: "SetNetwork",
            Data: setInfo
          };
          this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
          {
            if (response.data.status == "SUCCESS") 
            {
                that.$message({
                message: "Save success",
                type: "success"
              });
            } 
            else if (response.data.status == "ERROR") 
            {
              clearTimeout(time);
              that.$alert("Close DHCP Error", "Prompt information", {
                confirmButtonText: "OK",
                callback: action => {}
              });  
            }
          }).catch(function(error) 
            {
              console.log(error);
            });
        }
      }
      else
      {
        console.log("取消设置静态IP ");
        this.ckeckVal=true;
        this.staticip=false;
      }    
      this.staticipCheck=true;
    },
    GetCustomIP()
    {
      let ipaddr = this.SetIPAddress(this.$refs.custom.value);
      this.staticipCheck=this.$checkInp.fnValidateIPAddress(ipaddr);
      if(this.staticipCheck)
      {
        this.customIP=ipaddr;
        console.log("The ip address is "+this.customIP);
      }
      else
      {
        this.customIP=this.oldIpVal0;
      }
    },
    ChooseFile() {}
  },
  
  created() {},
  mounted() {
    let that = this;
    that.getDeviceInfo();
    that.$store.state.Settingsname='first';
  }
};
</script>
<style>
.btn-custom-cancel {
  float: right;
  margin-left: 10px;
}
</style>
<style scoped>
@import "../../style/common";
.wrapper {
  width: 800px;
  margin: 0 auto;
  height: calc(100% - 10px);
}
.title_device {
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 15px;
}
p {
  font-size: 14px;
  line-height: 30px;
}
.box {
  width: 640px;
  margin: 0 auto;
  padding-left: 10px;
  /* border: 1px solid #ccc; */
  border-bottom: none;
  font-size: 0;
}
.left {
  display: inline-block;
  width: 180px;
}
.right {
  display: inline-block;
  width: 315px;
}
.content {
  display: inline-block;
  width: 300px;
}
.firmware {
  width: 150px;
  height: 150px;
  /* border-left: 1px solid #ccc; */
  float: right;
  text-align: center;
}
.btn {
  width: 150px;
  height: 30px;
  padding: 0px 20px;
}
.btnMore {
  width: 50px;
  height: 20px;
  padding: 0px 5px;
}
.martop10 {
  margin-top: 10px;
}
.line40 {
  line-height: 35px;
}
#deviceInfo {
  padding-top: 10px;
  height: 100%;
  background-color: white;
  border-radius: 5px;
}
.deviceInformation {
  width: auto;
  height: calc(100% - 10px);
  overflow: auto;
  padding-left: 10px;
  -webkit-overflow-scrolling: auto;
}
.modify {
  font-size: 14px;
  font-weight: bold;
}
</style>