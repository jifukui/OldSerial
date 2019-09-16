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
                @focus="Check('name')"
                @blur="Blur('name')"
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
            <!-- 文件名称 -->
            <!-- <p>
              <span style="white-space:normal;word-wrap: break-word;">
                <p style="margin:0">{{ fileName }}</p>
              </span>
            </p> -->
            <!-- 上传进度条 -->
            <p>
              <el-progress 
                :percentage="fileGrogress" 
                v-show="uploading" 
                :status="uploadStatus"
              ></el-progress>
            </p>
            <!-- 开始上传 -->
            <!-- <p class="line40">
              <el-button
                class="btn"
                type="primary"
                @click="getfileInfo($event)"
                :disabled="isFile == true ? false : true"
              >Upload</el-button>
            </p> -->
            <!-- 开始升级 -->
            <!-- <p class="line40">
              <el-button
                class="btn"
                type="primary"
                @click="Upgrade()"
                :disabled="isUpgrade == true ? false : true"
              >Start Upgrade</el-button>
            </p> -->
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
                @focus="Check('ip')"
                @blur="Blur('ip')"
                type="text"
                id
                ref="ipInp"
                value
              >
            </p>

            <p>
              <input
                :class="
                  maskCheck == true
                    ? 'equipment_information_two_input'
                    : 'equipment_information_two_input1'
                "
                @focus="Check('mask')"
                @blur="Blur('mask')"
                type="text"
                id
                ref="subnetMask"
                value
              >
            </p>

            <p>
              <input
                :class="
                  gatewayCheck == true
                    ? 'equipment_information_two_input'
                    : 'equipment_information_two_input1'
                "
                @focus="Check('gateway')"
                @blur="Blur('gateway')"
                type="text"
                id
                ref="gateway"
                value
              >
            </p>

            <p>
              <input
                :class="
                  tcpCheck == true
                    ? 'equipment_information_two_input'
                    : 'equipment_information_two_input1'
                "
                @focus="Check('tcp')"
                @blur="Blur('tcp')"
                type="text"
                id
                ref="tcp"
                value
                onKeyUp="value=value.replace(/\D/g,'')"
                onafterpaste="value=value.replace(/\D/g,'')"
              >
            </p>

            <p>
              <input
                :class="
                  udpCheck == true
                    ? 'equipment_information_two_input'
                    : 'equipment_information_two_input1'
                "
                @focus="Check('udp')"
                @blur="Blur('udp')"
                type="text"
                id
                ref="udp"
                value
                onKeyUp="value=value.replace(/\D/g,'')"
                onafterpaste="value=value.replace(/\D/g,'')"
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
            <p class="line40">Get Configure File:</p>
            <p class="line40">Reset:</p>
            <!-- <p class="line40">ISP Mode:</p> -->
          </div>
          <div class="right">
            <p class="line40">
              <el-button class="btn" type="primary" @click="saveInfo">Save Changes</el-button>
            </p>
            <p class="line40">
              <el-button class="btn" type="primary" @click="downLoad">Get Configure File</el-button>
            </p>
            <p class="line40">
              <el-button class="btn" type="primary" @click="reset">Repower</el-button>
              <el-button class="btn" type="primary" @click="factory">Factory</el-button>
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
      uploadedFiles: ""
    };
  },
  watch: {},
  computed: {},
  methods: {
    Check(inp) {
      switch (inp) {
        case "name":
          this.nameCheck = true;
          break;
        case "ip":
          this.ipCheck = true;
          break;
        case "mask":
          this.maskCheck = true;
          break;
        case "gateway":
          this.gatewayCheck = true;
          break;
        case "tcp":
          this.tcpCheck = true;
          break;
        case "udp":
          this.udpCheck = true;
          break;
        default:
          break;
      }
      if (window.getDeviceInterval) {
        window.clearInterval(window.getDeviceInterval);
      }
    },
    Blur(inp) {
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
    uplaodFile() {
      document.getElementById("file").click();
    },
    // 选择文件点击确认后
    selectFile(event) {
      this.file = event.target.files[0];
      var filemaxsize = 1024 * 2;
      var size = this.file.size / 1024;
      let index = this.file.name.lastIndexOf(".");
      let nameIndex = this.file.name.lastIndexOf("_");
      let fileNameExt = this.file.name.substring(0, nameIndex);
      let ext = this.file.name.substr(index + 1);
      let extUpperCase = ext.toUpperCase();
      // if (size > filemaxsize) {
      //   this.$alert(
      //     "The appendix size should not exceed " + filemaxsize / 1024 + "M！",
      //     "Prompt information",
      //     {
      //       confirmButtonText: "OK",
      //       callback: action => {}
      //     }
      //   );
      //   return false;
      // }
      if (size <= 0) {
        this.$alert("The appendix size can not be 0M！", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {
            this.uploading = false;
            this.uploadedFiles = ""
          }
        });
        return false;
      }
      if (extUpperCase != "KPTW") {
        this.$alert("Upgrade file type error", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {
            this.uploading = false;
            this.uploadedFiles = ""
          }
        });
        return false;
      }
      if (fileNameExt != "VS-1616DN-EM_VS-3232DN-EM_VS-6464DN-EM") {
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
      this.$axios
        .post("/cgi-bin/upload.cgi", formData, config)
        .then(function(msg) {
          if (msg.data.status == "SUCCESS") {
            that.uploadStatus = "success";
            that.fileGrogress = 100;
            that.isUpgrade = true;
            that.Upgrade();
            console.log("good for this ");
          } else {
            console.log("The value is " + msg.data.status);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //开始升级
    Upgrade() {
      let that = this;
      let aoData = {
        cmd: "GetUpgradeFileName",
        Data: {
          Filename: that.fileName
        }
      };
      this.$axios
        .post("/cgi-bin/ligline.cgi", aoData)
        .then(function(response) {
          if (response.data.status == "SUCCESS") {
            let decompressionFileName = response.data.echo.result.Filename;
            that.realUpgrade(decompressionFileName);
          } else if (response.data.status == "ERROR") {
            that.$alert(response.data.error, "Prompt information", {
              confirmButtonText: "OK",
              callback: action => {}
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    realUpgrade(fileName) {
      let that = this;
      that.$store.state.upgradeDeviceLoading = true;
      window.upgradeSettimeout = setTimeout(function() {
        window.location.reload();
      }, 100000);
      let aoData = {
        cmd: "Upgrade",
        Data: {
          newfile: fileName,
          oldfile: fileName
        }
      };
      this.$axios
        .post("/cgi-bin/ligline.cgi", aoData)
        .then(function(response) {
          if (response.data.status == "SUCCESS") {
          } else if (response.data.status == "ERROR") {
            that.$alert(response.data.error, "Prompt information", {
              confirmButtonText: "OK",
              callback: action => {
                that.uploading = false;
                that.uploadedFiles = ""
              }
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    clickMe() {
      let that = this;
      let val = 0;
      if (that.ckeckVal) {
        val = 1;
      } else {
        val = 0;
      }
      let aoData = {
        cmd: "SetDHCPStatus",
        Data: {
          dhcp: val
        }
      };
      this.$axios
        .post("/cgi-bin/ligline.cgi", aoData)
        .then(function(response) {
          if (response.data.status == "SUCCESS") {
          } else if (response.data.status == "ERROR") {
            that.$alert(response.data.error, "Prompt information", {
              confirmButtonText: "OK",
              callback: action => {}
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    saveInfo() {
      let ipaddr = this.$refs.ipInp.value;
      let nameaddr = this.$refs.nameInp.value;
      let maskaddr = this.$refs.subnetMask.value;
      let gateway = this.$refs.gateway.value;
      let tcp = this.$refs.tcp.value;
      let udp = this.$refs.udp.value;
      console.log(ipaddr);
      if (
        this.$checkInp.fnValidateIPAddress(ipaddr) == true &&
        this.$checkInp.fnValidateMask(maskaddr) == true &&
        this.$checkInp.fnValidateGateway(gateway) == true &&
        this.$checkInp.fnValidateIcp(tcp) == true &&
        this.$checkInp.fnValidateUdp(udp) == true &&
        this.$checkInp.fnValidateName(nameaddr) == true
      ) {
        this.$confirm("Are you sure?", "Prompt information", {
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
          type: "warning",
          closeOnClickModal: false
        })
          .then(() => {
            let that = this;
            let setInfo = {};
            if (
              ipaddr != that.oldIpVal0 ||
              maskaddr != that.oldMaskVal0 ||
              gateway != that.oldGateVal0
            ) {
              setInfo.ip = ipaddr;
              setInfo.mask = maskaddr;
              setInfo.gateway = gateway;
            }
            if (tcp != that.oldTcpVal0) {
              setInfo.tcp = Number(tcp);
            }
            if (udp != that.oldUdpVal0) 
            {
              setInfo.udp = Number(udp);
            }
            if (
              Object.keys(setInfo).length == 0 &&
              nameaddr == that.oldNameVal0
            ) {
              that.$alert(
                "Please save after modifying the parameters",
                "Prompt information",
                {
                  confirmButtonText: "OK",
                  callback: action => {}
                }
              );
              return false;
            }
            if (nameaddr != that.oldNameVal0) {
              let aoData = {
                cmd: "SetDeviceName",
                Data: {
                  Name: nameaddr
                }
              };
              this.$axios
                .post("/cgi-bin/ligline.cgi", aoData)
                .then(function(response) {
                  if (response.data.status == "SUCCESS") {
                  } else if (response.data.status == "ERROR") {
                    that.$alert(response.data.error, "Prompt information", {
                      confirmButtonText: "OK",
                      callback: action => {}
                    });
                  }
                })
                .catch(function(error) {
                  console.log(error);
                });
            }
            if (
              ipaddr != that.oldIpVal0 ||
              maskaddr != that.oldMaskVal0 ||
              gateway != that.oldGateVal0
            ) {
              window.setTimeoutSetIp = setTimeout(function() {
                that.$alert("Save success", "Prompt information", {
                  confirmButtonText: "OK",
                  callback: action => {
                    let aNum = ipaddr.split(".");
                    let num = "";
                    num += parseInt(aNum[0]) + ".";
                    num += parseInt(aNum[1]) + ".";
                    num += parseInt(aNum[2]) + ".";
                    num += parseInt(aNum[3]);
                    window.location.href = "http://" + num;
                  }
                });
              }, 1500);
            }

            if (
              Object.keys(setInfo).length == 0 &&
              nameaddr != that.oldNameVal0
            ) {
              return false;
            }
            let aoData = {
              cmd: "SetNetwork",
              Data: setInfo
            };
            this.$axios
              .post("/cgi-bin/ligline.cgi", aoData)
              .then(function(response) {
                if (response.data.status == "SUCCESS") 
                {
                } 
                else if (response.data.status == "ERROR") 
                {
                  if (window.setTimeoutSetIp) 
                  {
                    window.clearTimeout(window.setTimeoutSetIp);
                  }
                  that.$alert(response.data.error, "Prompt information", {
                    confirmButtonText: "OK",
                    callback: action => {}
                  });
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          })
          .catch(() => {
            let sendata = {
              resetSure: "取消保存信息"
            };

            console.log(sendata);
          });
      } else {
        this.$alert("Parameter is incorrect!", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {}
        });
      }
      if (this.$checkInp.fnValidateIPAddress(ipaddr) == false) {
        this.ipCheck = false;
      }
      if (this.$checkInp.fnValidateMask(maskaddr) == false) {
        this.maskCheck = false;
      }
      if (this.$checkInp.fnValidateGateway(gateway) == false) {
        this.gatewayCheck = false;
      }
      if (this.$checkInp.fnValidateIcp(tcp) == false) {
        this.tcpCheck = false;
      }
      if (this.$checkInp.fnValidateUdp(udp) == false) {
        this.udpCheck = false;
      }
      if (this.$checkInp.fnValidateName(nameaddr) == false) {
        this.nameCheck = false;
      }
    },
    downLoad() {
      var ip_addr = document.location.hostname;
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = "http://" + ip_addr + "/configuration.json";
      link.setAttribute("download", "configuration.json");
      document.body.appendChild(link);
      link.click();
    },
    reset() {
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
      )
        .then(() => {
          let that = this;
          let ip_addr = document.location.hostname;
          let aoData = {
            cmd: "SetDeviceReset"
          };
          this.$axios
            .post("/cgi-bin/ligline.cgi", aoData)
            .then(function(response) {
              if (response.data.status == "SUCCESS") {
                that.$store.state.resetLoading = true;
                window.mysettimeout = setTimeout(function() {
                  window.location.href = "http://" + ip_addr;
                }, 80000);
              } else if (response.data.status == "ERROR") {
                that.$alert(response.data.error, "Prompt information", {
                  confirmButtonText: "OK",
                  callback: action => {}
                });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(() => {
          let sendata = {
            resetSure: "取消重置信息"
          };
          console.log(sendata);
        });
    },
    factory() {
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
      )
        .then(() => {
          let that = this;
          let aoData = {
            cmd: "SetDeviceFactory"
          };
          this.$axios
            .post("/cgi-bin/ligline.cgi", aoData)
            .then(function(response) {
              if (response.data.status == "SUCCESS") {
                that.$store.state.resetLoading = true;
                window.mysettimeout = setTimeout(function() {
                  window.location.href = "http://192.168.1.39";
                }, 80000);
              } else if (response.data.status == "ERROR") {
                that.$alert(response.data.error, "Prompt information", {
                  confirmButtonText: "OK",
                  callback: action => {}
                });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(() => {
          let sendata = {
            resetSure: "取消重置信息"
          };
          console.log(sendata);
        });
    },
    getDeviceInfo() {
      let that = this;
      this.$axios
        .get("/configuration.json")
        .then(response => {
          that.model = response.data.data.matrix.model;
          that.sn = that.$store.state.sn;
          that.firmwareVersion = that.$store.state.version;
          if (response.data.data.communication.Ethernet[0].dhcp == 0) {
            that.ckeckVal = false;
          } else {
            that.ckeckVal = true;
          }
          // that.Moreinfo =
          //   response.data.information.echo.result.DeviceInfo.BaseInfo.Moreinfo;
          that.mac0 = response.data.data.communication.Ethernet[0].mac;
          that.$refs.ipInp.value =
            response.data.data.communication.Ethernet[0].ip;
          that.$refs.subnetMask.value =
            response.data.data.communication.Ethernet[0].mask;
          that.$refs.gateway.value =
            response.data.data.communication.Ethernet[0].gate;
          that.$refs.tcp.value =
            response.data.data.communication.Ethernet[0].tcp;
          that.$refs.udp.value =
            response.data.data.communication.Ethernet[0].udp;
          that.$refs.nameInp.value = response.data.data.matrix.name;
          that.oldNameVal0 = JSON.parse(
            JSON.stringify(response.data.data.matrix.name)
          );
          that.oldIpVal0 = JSON.parse(
            JSON.stringify(response.data.data.communication.Ethernet[0].ip)
          );
          that.oldMaskVal0 = JSON.parse(
            JSON.stringify(response.data.data.communication.Ethernet[0].mask)
          );
          that.oldGateVal0 = JSON.parse(
            JSON.stringify(response.data.data.communication.Ethernet[0].gate)
          );
          that.oldTcpVal0 = JSON.parse(
            JSON.stringify(response.data.data.communication.Ethernet[0].tcp)
          );
          that.oldUdpVal0 = JSON.parse(
            JSON.stringify(response.data.data.communication.Ethernet[0].udp)
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    ChooseFile() {}
  },
  created() {},
  mounted() {
    let that = this;
    that.getDeviceInfo();
    window.getDeviceInterval = setInterval(function() {
      that.getDeviceInfo();
    }, 3000);
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