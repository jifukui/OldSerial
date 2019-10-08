<template>
  <div class="wrapper">
    <div id="cardsInfo">
      <div style="width:230px">
        <span class="title titleML">Card List</span>
        <div class="listBoard">
          <p
            v-for="(items, index) in cardList"
            :key="index"
            :class="{ activeCard: items.slot == isActive }"
            class="cardList"
            @click="selectCardInfo(items.slot, items.type, items)"
          >
            Slot {{ items.slot }}-{{ items.name }}
          </p>
        </div>
      </div>
      <div style="width:570px">
        <div class="information" v-show="isCard">
          <span class="title">Information - Slot {{ isActive }}</span>
          <div class="box">
            <div class="left">
              <p>Type:</p>
              <p>Model:</p>
              <p>Model ID:</p>
              <p>Direction:</p>
              <p>Firmware version:</p>
            </div>
            <div class="right">
              <p>{{ type }}</p>
              <p>{{ model }}</p>
              <p>{{ modelId }}</p>
              <p>{{ direction }}</p>
              <p>{{ firmwareVersion }}</p>
            </div>
          </div>
        </div>
        <div class="information" v-show="!isCard">
          <span class="title">Information - Slot {{ isActive }}</span>
          <div class="nocard">No Card</div>
        </div>
      </div>
    </div>
    <div class="upgradeDiv" v-show="cardList.length>0">
      <div class="information modify1">
        <span class="title modify">Firmware Upgrade</span>
        <div class="boxUpgrad">
          <div class="firmware">
            <p>Choose a file</p>
            <!-- 上传文件 -->
            <p class="line40 martop10">
              <input
                v-model="uploadedFiles"
                type="file"
                name="inputFile"
                id="fileCard"
                hidden
                @change="selectFile($event)"
              />
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
      </div>
    </div>
    <el-dialog
      title="Please select the card you want to upgrade"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      width="500px"
    >
      <div
        v-for="(items, index) in upgardeCardArr"
        :key="index"
        class="upgradeStyle"
      >
        Slot {{ items.slot }}-{{ items.name }}
        <input
          type="checkbox"
          checked="checked"
          :value="items.slot"
          v-model="selectCardUpgradeArr"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpload">Cancel</el-button>
        <el-button type="primary" @click="selectCardUpgrade">Ok</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      type: "",
      model: "",
      modelId: "",
      direction: "",
      firmwareVersion: "",
      cardList: [],
      file: "",
      fileName: "",
      decompressionFileName: "",
      isFile: false,
      fileGrogress: 0,
      uploading: false,
      uploadStatus: "",
      resetN: 0,
      isActive: this.$store.state.CardStatus,
      slotIndex: "",
      isCard: true,
      isUpgrade: false,
      dialogFormVisible: false,
      upgradeNum: 0,
      upgardeCardArr: [],
      selectCardUpgradeArr: [],
      uploadedFiles: ""
    };
  },
  watch: {},
  computed: {},
  methods: {
    uplaodFile() 
    {
      document.getElementById("fileCard").click();
    },
    // 选择文件
    selectFile(event) 
    {
      this.file = event.target.files[0];
      let filemaxsize = 1024 * 2;
      let size = this.file.size / 1024;
      let index = this.file.name.lastIndexOf(".");
      let ext = this.file.name.substr(index + 1);
      let extUpperCase = ext.toUpperCase();
      this.$store.state.JiFileSize=this.file.size;
      //console.log("the file size is "+this.$store.state.JiFileSize);
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
      if (extUpperCase != "KMPT" && extUpperCase != "KPTW") 
      {
        this.$alert("Upgrade file type error", "Prompt information", 
        {
          confirmButtonText: "OK",
          callback: action => {
            this.uploading = false;
            this.uploadedFiles = "";
          }
        });
        return false;
      }
      this.fileName = this.file.name;
      this.isFile = true;
      this.uploading = false;
      this.uploadStatus = "";
      this.fileGrogress = 0;
      this.getfileInfo(event);
    },
    // 上传升级文件
    getfileInfo(event) 
    {
      event.preventDefault();
      let that = this;
      that.uploading = true;
      let formData = new window.FormData();
      formData.append("file", this.file);
      let config = 
      {
        headers: 
        {
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
          that.isDecompression();
          console.log("good for this ");
        } 
        else 
        {
            console.log("The value is " + msg.data.status);
            that.uploading = false;
            that.uploadedFiles = ""
        }
      }).catch(function(error) {
           console.log(error);
        });
    },
    //解压文件
    isDecompression() {
      this.decompressionFileName = "";
      let index = this.fileName.lastIndexOf(".");
      let extLast = this.fileName.substr(index + 1);
      let extUpperCase = extLast.toUpperCase();
      let that = this;
      let aoData = 
      {
        cmd: "GetUpgradeFileName",
        Data: {
          Filename: that.fileName
        }
      };
      this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
      {
        if (response.data.status == "SUCCESS") 
        {
          that.decompressionFileName = response.data.echo.result.Filename;
          that.$store.state.JiFileSize=response.data.echo.result.FileSize;
          console.log("the file size is "+that.$store.state.JiFileSize);
          let portNumber = that.$store.state.portNumber;
          if (portNumber == 16)
          {
            if (
                that.decompressionFileName.indexOf("IN2") == -1 &&
                that.decompressionFileName.indexOf("OUT2") == -1
              ) 
            {
              that.$alert(
                "The upgrade file is incorrect. Please check and upload it!",
                "Prompt information",
                {
                  confirmButtonText: "OK",
                  callback: action => {
                    that.uploading = false;
                    that.uploadedFiles = ""
                  }
                }
              );
              return false;
            }
          }
          else if (portNumber == 32) 
          {
            if (
              that.decompressionFileName.indexOf("IN4") == -1 &&
              that.decompressionFileName.indexOf("OUT4") == -1
              )
            {
              that.$alert(
                "The upgrade file is incorrect. Please check and upload it!",
                "Prompt information",
                {
                  confirmButtonText: "OK",
                  callback: action => {
                    that.uploading = false;
                    that.uploadedFiles = ""
                  }
                }
              );
              return false;
            }
          } 
          else if (portNumber == 64) 
          {
            if (
              that.decompressionFileName.indexOf("IN8") == -1 &&
              that.decompressionFileName.indexOf("OUT8") == -1
              ) 
            {
              that.$alert(
                "The upgrade file is incorrect. Please check and upload it!",
                "Prompt information",
                {
                  confirmButtonText: "OK",
                  callback: action => {
                    that.uploading = false;
                    that.uploadedFiles = ""
                  }
                }
              );
              return false;
            }
          }
          let index = that.decompressionFileName.lastIndexOf(".");
          let index_ = that.decompressionFileName.lastIndexOf("_");
          let ext = that.decompressionFileName.substring(index_ + 1, index);
          let filename = that.decompressionFileName.substring(0, index);
          let fileNameStr = "";
          let fileNameSlotArr = [];
          let isTrue = false;
          fileNameStr = filename.substring(
            filename.lastIndexOf("[") + 1,
            filename.lastIndexOf("]")
          );
          let fileNameArr = fileNameStr.split("_");
          if (fileNameArr[1].indexOf("&") != -1) 
          {
            fileNameSlotArr = fileNameArr[1].split("&");
          } 
          else 
          {
            fileNameSlotArr.push(fileNameArr[1]);
          }
          console.log(ext);
          console.log(typeof ext);
          if (ext == "N") 
          {
            console.log("是N");
            that.Upgrade(that.decompressionFileName);
          }
          else if (ext == "200" || ext == "203") 
          {
            that.Upgrade(that.decompressionFileName);
            console.log("是200");
          } 
          else if (parseInt(ext) > 0 && parseInt(ext) < 17) 
          {
            for (let i = 0; i < that.cardList.length; i++) 
            {
              if (that.cardList[i].slot == parseInt(ext)) 
              {
                if (that.cardList[i].type < 0) 
                {
                  that.$alert(
                    "The upgrade file is incorrect. Please check and upload it!",
                    "Prompt information",
                    {
                      confirmButtonText: "OK",
                      callback: action => {
                        that.uploading = false;
                        that.uploadedFiles = ""
                      }
                    }
                  );
                  return false;
                }
                for (let j = 0; j < fileNameSlotArr.length; j++)
                {
                    if (that.cardList[i].type == fileNameSlotArr[j]) 
                    {
                      isTrue = true;
                    }
                  if (isTrue == false) 
                  {
                    that.$alert(
                      "The upgrade file is incorrect. Please check and upload it!",
                      "Prompt information",
                      {
                        confirmButtonText: "OK",
                        callback: action => {
                          that.uploading = false;
                          that.uploadedFiles = ""
                        }
                      }
                    );
                    return false;
                  } 
                  else 
                  {
                    that.Upgrade(that.decompressionFileName);
                  }
                }
              }
            }
          } 
          else 
          {
            that.$alert(
              "The upgrade file is incorrect. Please check and upload it!",
              "Prompt information",
              {
                confirmButtonText: "OK",
                callback: action => {
                  that.uploading = false;
                  that.uploadedFiles = ""
                }
              }
            );
            return false;
          }
        } 
        else if (response.data.status == "ERROR") 
        {
          that.$alert(response.data.error, "Prompt information", {
            confirmButtonText: "OK",
            callback: action => {
              that.uploading = false;
              that.uploadedFiles = ""
            },
          });
        }
      }).catch(function(error) {
           console.log(error);
        });
      console.log(this.fileName);
    },
    //开始升级
    Upgrade(file) 
    {
      this.selectCardUpgradeArr.length = 0;
      let index = file.lastIndexOf(".");
      let ext = file.charAt(index - 1);
      let filename = file.substring(0, index);
      let fileNameStr = "";
      if (ext == "N") 
      {
        fileNameStr = filename.substring(
          filename.lastIndexOf("[") + 1,
          filename.lastIndexOf("]")
        );
        let fileNameArr = fileNameStr.split("_");
        let fileNameSlotArr = [];

        if (fileNameArr[1].indexOf("&") != -1) 
        {
          fileNameSlotArr = fileNameArr[1].split("&");
        } 
        else 
        {
          fileNameSlotArr.push(fileNameArr[1]);
        }
        let upgradeArr = [];
        if (fileNameArr[0].indexOf("OUT") != -1) 
        { 
          for (let i = 0; i < this.cardList.length; i++) 
          {
            if (this.cardList[i].Direction == "Out") 
            {
              for (let j = 0; j < fileNameSlotArr.length; j++) 
              {
                if (this.cardList[i].type == fileNameSlotArr[j]) 
                {
                  upgradeArr.push(this.cardList[i]);
                  this.selectCardUpgradeArr.push(this.cardList[i].slot);
                }
              }
            }
          }
        } 
        else if (fileNameArr[0].indexOf("IN") != -1) 
        { 
          console.log("IN this.cardList.length "+this.cardList.length);
          for (let i = 0; i < this.cardList.length; i++) 
          {
            console.log("type is "+ this.cardList[i].type+ "dir is "+this.cardList[i].Direction);
            if (this.cardList[i].Direction == "In") 
            {
              for (let j = 0; j < fileNameSlotArr.length; j++) 
              {
                if (this.cardList[i].type == fileNameSlotArr[j]) 
                {
                  upgradeArr.push(this.cardList[i]);
                  this.selectCardUpgradeArr.push(this.cardList[i].slot);
                }
              }
            }
          }
        }
        
        
        this.upgardeCardArr = upgradeArr;
        if(this.upgardeCardArr.length==0)
        {
          this.$alert(
            "Documents do not match the module card and cannot be upgraded",
            "Prompt information",
            {
              confirmButtonText: "OK",
              callback: action => {
                this.uploadedFiles="";
                this.uploading=false;
              }
            }
          );
          return false;
        }
        else
        {
          this.dialogFormVisible = true;
        }
        //console.log("upgardeCardArr "+this.upgardeCardArr.length);
        //console.log("fileNameArr "+fileNameArr);
        //console.log("upgradeArr "+upgradeArr);
        //console.log("fileNameSlotArr "+fileNameSlotArr);
        //console.log("this.selectCardUpgradeArr "+this.selectCardUpgradeArr);
      } 
      else 
      {
        this.upgardeCardOne(file);
      }
    },
    // 确认开始升级
    selectCardUpgrade() 
    {
      console.log("this.selectCardUpgradeArr "+this.selectCardUpgradeArr);
      if (this.selectCardUpgradeArr.length == 0) 
      {
        this.$alert(
          "Please check the cards you want to upgrade",
          "Prompt information",
          {
            confirmButtonText: "OK",
            callback: action => {
              return false;
            }
          }
        );
      } 
      else 
      {
        let fileArr = [];
        fileArr.length = 0;
        let fileName1 = "";
        let index = "";
        if (this.decompressionFileName != "") 
        {
          fileArr.push(this.decompressionFileName);
          index = this.decompressionFileName.lastIndexOf(".");
          fileName1 = this.decompressionFileName;
        } 
        else 
        {
          fileArr.push(this.fileName);
          index = this.fileName.lastIndexOf(".");
          fileName1 = this.fileName;
        }

        for (let i = 0; i < this.selectCardUpgradeArr.length; i++) 
        {
          let fileName = this.replacePos(
            fileName1,
            index - 1,
            this.selectCardUpgradeArr[i]
          );
          console.log(fileName);
          fileArr.push(fileName);
        }
        console.log(fileArr);
        this.$store.state.upgradeNumber = -1;
        window.clearInterval(window.getMatrixInterval);
        this.$store.state.upgradeLoading = true;
        this.$store.state.upgradeNumbers = fileArr.length - 1;
        this.upgardeFile(fileArr);
      }
    },
    // 取消开始升级
    cancelUpload()  
    {
      this.dialogFormVisible = false;
      this.uploading = false;
      this.uploadedFiles = ""
    },
    replacePos(strObj, pos, replacetext) 
    {
      var str =
        strObj.substr(0, pos) +
        replacetext +
        strObj.substring(pos + 1, strObj.length);
      return str;
    },
    upgardeFile(arr) 
    {
      if (this.upgradeNum < arr.length - 1) 
      {
        this.upgardeCard(arr[this.upgradeNum], arr[this.upgradeNum + 1], arr);
      } 
      else 
      {
        this.upgradeNum = 0;
        setTimeout(() => {
          this.getCardList();
          setTimeout(() => {
            this.$store.state.upgradeNumber = -2;
            console.log("cccc:" + this.$store.state.upgradeNumber);
          }, 2000);
        }, 3000);
        
      }
    },
    upgardeCard(oldfile, newfile, arr) 
    {
      let that = this;
      let aoData = 
      {
        cmd: "Upgrade",
        Data: {
          oldfile: oldfile, //旧文件名称
          newfile: newfile //新文件名称
        }
      };
      this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
      {
        if (response.data.status == "SUCCESS") 
        {
          that.upgradeNum = that.upgradeNum + 1;
          console.log("成功:" + that.upgradeNum);
          that.$store.state.upgradeNumber = that.upgradeNum;
          console.log("BBBB:" + that.$store.state.upgradeNumber);
          that.upgardeFile(arr);
        } 
        else if (response.data.status == "ERROR") 
        {
          that.$alert(response.data.error, "Prompt information", 
          {
            confirmButtonText: "OK",
            callback: action => {
              that.$store.state.upgradeLoading = false;
            }
          });
        }
      }).catch(function(error) {
          console.log(error);
        });
    },
    upgardeCardOne(file) 
    {
      this.$store.state.upgradeLoading = true;
      this.$store.state.upgradeNumbers = 1;
      this.$store.state.upgradeNumber = -1;
      let that = this;
      let aoData = {
        cmd: "Upgrade",
        Data: {
          oldfile: file, //旧文件名称
          newfile: file //新文件名称
        }
      };
      this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
      {
        if (response.data.status == "SUCCESS")
        {
          that.$store.state.upgradeNumbers = 1;
          that.$store.state.upgradeNumber = -2;
          console.log("成功升级");
        } 
        else if (response.data.status == "ERROR") 
        {
          that.$alert(response.data.error, "Prompt information", 
          {
            confirmButtonText: "OK",
            callback: action => {
              that.$store.state.upgradeLoading = false;
            }
            });
        }
      }).catch(function(error) {
           console.log(error);
        });
    },
    reset() 
    {
      let that = this;
      let value = "";
      if (that.direction == "In") 
      {
        value = 0;
      } 
      else if (that.direction == "Out") 
      {
        value = 1;
      }
      this.$confirm(
        "RESET Card to factory default ? <br/>Press OK to confirm",
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
          let aoData = {
            cmd: "SetCardFactory",
            CardInfo: {
              index: that.isActive,
              type: value
            }
          };
          this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
          {
            if (response.data.status == "SUCCESS") 
            {
              that.$alert("Factory success", "Prompt information", 
              {
                confirmButtonText: "OK",
                callback: action => {}
              });
            } 
            else if (response.data.status == "ERROR") 
            {
              that.$alert(response.data.error, "Prompt information", {
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
    selectCardInfo(index, status, items) 
    {
      console.log("The index is "+index);
      this.isActive = index;
      this.$store.state.CardStatus=index;
      if (status >= 0) 
      {
        this.isCard = true;
        this.model = items.name;
        this.modelId = items.type;
        this.firmwareVersion = items.fw_info[0].version;
        if (index > 0 && index < 5) 
        {
          this.type = "Input";
          this.direction = "In";
        } 
        else if (index >= 5 && index < 9) 
        {
          this.type = "Output";
          this.direction = "Out";
        } 
        else if (index >= 9 && index < 13) 
        {
          this.type = "Input";
          this.direction = "In";
        } 
        else if (index >= 13 && index < 17) 
        {
          this.type = "Output";
          this.direction = "Out";
        } 
        else 
        {
          this.type = "Output";
          this.direction = "Out";
        }
      } 
      else if (status < 0) 
      {
        this.isCard = false;
      }
    },
    //获取cardList
    getCardList() 
    {
      let that = this;
      this.$axios.get("/configuration.json").then(response => {
        let card= response.data.data.card;
        //console.log(JSON.stringify(card));
        for (let index = 0; index < 17; index++) 
        {
          if(card[index].name=="unknown")
          {
            
          }
          else
          {
            if(index==16)
            {
              card[index].Direction = "Out";
            }
            else
            {
              //console.log("datta is "+((index/4)%2));
              //console.log("datta1 is "+((parseInt(index/4))%2));
              if(((parseInt(index/4))%2)==0)
              {
                card[index].Direction = "In";
              }
              else
              {
                card[index].Direction = "Out";
              }
            }
            that.cardList.push(card[index]);
          }
          
        }
        //console.log("card list is "+JSON.stringify(that.cardList));
        if(that.cardList.length>0)
        {
          if(that.isActive>0)
          {
            that.selectCardInfo(that.cardList[that.isActive-1].slot, that.cardList[that.isActive-1].type, that.cardList[that.isActive-1]);
          }
          else
          {
            that.selectCardInfo(that.cardList[0].slot, that.cardList[0].type, that.cardList[0]);
          }
        }
        else
        {
          that.selectCardInfo("", -1, "");
        }
        }).catch(function(error) 
        {
          console.log(error);
        });
      }
  },
  created() {
    this.getCardList();
    if (window.getDeviceInterval) 
    {
      window.clearInterval(window.getDeviceInterval);
    }
  },
  mounted() {
    this.$store.state.Settingsname='second';
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
  display: flex;
  flex-direction: row;
  height: calc(100% - 10px);
}
#cardsInfo {
  width: 560px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  height: calc(100% - 10px);
  background-color: white;
  padding: 10px 5px 0;
  border-radius: 5px;
}
.listBoard {
  width: auto;
  height: calc(100% - 34px);
  overflow: auto;
  padding: 5px;
  border: 1px solid black;
  /* -webkit-overflow-scrolling: auto; */
}
.information {
  width: auto;
  padding: 0 10px;
  height: calc(100% - 10px);
  overflow: auto;
  font-size: 0;
  /* -webkit-overflow-scrolling: auto; */
}
p {
  font-size: 14px;
  line-height: 30px;
}
.box {
  width: 340px;
  margin: 0 auto;
  border-bottom: none;
  font-size: 0;
}

.left,
.right {
  display: inline-block;
  width: 150px;
}
.firmware {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  text-align: center;
}
.btn {
  width: 150px;
  height: 30px;
  padding: 0px 20px;
}
.line40 {
  line-height: 35px;
}
.line41 {
  line-height: 45px;
  height: 35px;
}
.cardList {
  cursor: pointer;
}
.activeCard {
  background-color: #409eff;
  color: #ffffff;
}

@media (min-width: 1025px) {
  .cardList:hover {
    background-color: #409eff;
    color: #ffffff;
  }
}
.titleML {
  margin-left: 4px;
}
.nocard {
  text-align: center;
}
.upgradeStyle {
  text-align: center;
  font-size: 14px;
}
.upgradeDiv {
  width: 220px;
  margin-left: 10px;
  background-color: white;
  border-radius: 5px;
  padding: 10px 0 0;
  height: calc(100% - 10px);
}
.modify1{
  text-align:center;
}
.modify{
  font-size: 14px;
  font-weight: bold;
}
</style>