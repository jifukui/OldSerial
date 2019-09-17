<template>
  <div class="wrapper">
    <div class="set_content">
      <div class="edidC">
        <p class="set_content_edid_title">EDID</p>
        <div class="set_content_edid_box set_content_one">
          <p>Read From</p>
          <div class="set_content_one_box">
            <p style="margin-top: 5px;margin-left: 5px;">Outputs</p>
            <button
              class="s_c_o_b_block disabledBtn"
              v-for="(item, index) in outputdata"
              @click="outClcick(item.output, item.classIndex)"
              :class="{ active: item.classIndex == isActive }"
              :key="index"
              :disabled="selecting"
            >
              {{ item.output }}
            </button>
            <p style="margin-top: 5px;margin-left: 5px;">Inputs</p>
            <button
              class="s_c_o_b_block disabledBtn"
              v-for="(item, index) in inputdata"
              @click="inClcick(item.input, item.classIndex)"
              :class="{ active: item.classIndex == isActive }"
              :key="index"
              :disabled="selecting"
            >
              {{ item.input }}
            </button>
          </div>
          <button
            class="set_content_one_default disabledBtn"
            :disabled="selecting"
            :style="
              style_bg == true
                ? 'background: #fff; color: #333;'
                : 'background: #409EFF;'
            "
            @click="defaultClick"
          >
            DEFAULT
          </button>
          <input
            type="file"
            id="EDIDFile"
            ref="uploadExcelId"
            hidden
            @change="ReadEDIDFile"
          />
          <button
            class="set_content_one_file disabledBtn"
            :disabled="selecting"
            :style="
              edidFile == true
                ? 'background:#409EFF;color:#fff'
                : 'background:#fff'
            "
            @click="GetEDID"
          >
            File<br />BROWSE
          </button>
        </div>
        <div class="set_content_edid_box set_content_two">
          <p>Short Summary</p>
          <div class="set_content_two_information" v-show="trueEdid">
            <p class="set_content_two_font set_content_two_font1">
              {{ ModuleName }}
            </p>
            <p class="set_content_two_font">{{ size }}</p>
            <p class="set_content_two_font clear">{{ audio }}</p>
            <p class="set_content_two_font set_content_two_font2 ">
              {{ Model }}
            </p>
          </div>
          <div class="set_content_two_information" v-show="!trueEdid">
            <p class="errorInfo">Error EDID</p>
          </div>
          <div class="clear"></div>
          <div class="set_content_one_box2">
            <p class="set_content_two_inputs">FROM</p>
            <p class="set_content_two_inputs" style="color: #409EFF;">
              {{ DefaultTxt }}
            </p>
            <p class="set_content_two_inputs" style="color: #409EFF;">
              {{ output }}
            </p>
            <p class="set_content_two_inputs" style="color: #409EFF;">
              {{ Uploading }}
            </p>
            <p class="set_content_two_inputs" v-show="!selectInput">
              Select a destination
            </p>
            <p class="set_content_two_inputs" v-show="selectInput">TO input</p>
            <p
              class="set_content_two_inputs"
              v-show="selectInput"
              v-for="(item, index) in selectMsg"
              style="color: #409EFF;"
              :key="index"
            >
              {{ item.title }}
            </p>
          </div>
          <el-button
            class="set_content_two_copy disabledCopyBtn"
            v-show="showCopy"
            :disabled="selecting"
            :loading="selecting == true ? true : false"
            @click="edidCopyClick()"
            >{{ copyBtn }}</el-button
          >
        </div>
        <div class="set_content_edid_box set_content_three">
          <p>Copy to</p>
          <p class="set_content_one_p">
            <input
              id="EDID_inputs"
              class="s_c_o_p_input disabledBtn"
              type="checkbox"
              :disabled="selecting"
              :checked="ischecked == true ? 'checked' : false"
              @click="allSelect($event)"
            />
            <label for="EDID_inputs" class="cp">All</label>
          </p>
          <div class="set_content_one_box">
            <button
              class="s_c_o_b_block disabledBtn"
              v-for="(item, index) in copyInput"
              :key="index"
              :disabled="selecting"
              @click="copyInputClick(item)"
              :class="{ active: item.checked }"
            >
              {{ item.title }}
            </button>
          </div>
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
      // 左侧部分
      outputdata: [], // 输出
      inputdata: [], // 输入
      // 上传文件
      fileList: [],
      uploadsuccess: false,
      // 点击变色
      style_bg: true, //Default按钮状态
      edidFile: false, //上传文件按钮状态
      isActive: -1, //输入输出按钮状态
      // 中间部分
      ModuleName: "",
      size: "",
      audio: "",
      Model: "",
      output: "", //输入输出
      DefaultTxt: "", //默认按钮
      Uploading: "", //文件名
      // 默认按钮
      selectInput: false,
      selectMsg: [], //右侧输入名
      edidCheckbox: [],
      edidCheckboxSet: 0,
      // 右侧输入
      copyInput: [],
      copyIndex: [],
      showCopy: false, // 提交按钮
      EDIDData: "",
      EDIDinfo: "",
      trueEdid: true,
      type: "",
      indexNumber: 0,
      selecting: false,
      copyBtn: "COPY"
    };
  },
  watch: {
    selectMsg(val, oldval) 
    {
      // console.log(val, oldval);
      if (oldval.length == 0) 
      {
        this.selectInput = false;
        this.showCopy = false;
      } 
      else 
      {
        this.selectInput = true;
        this.showCopy = true;
      }
    },
    fileList(val, oldval) {
      console.log(val, oldval);
      if (oldval.length == 0) {
        this.uploadsuccess = false;
      } else {
        this.uploadsuccess = true;
      }
    }
  },
  computed: {},
  methods: {
    /**点击源输出端口 */
    outClcick(output, classIndex) 
    {
      this.output = output;
      this.isActive = classIndex;
      this.edidFile = false;
      this.Uploading = "";
      if (this.style_bg == false) 
      {
        this.type = 2;
        this.getEdidInfo(this.type, classIndex);
      } 
      else 
      {
        this.type = 1;
        let that = this;
        this.$axios.get("/configuration.json").then(response => {
            let proVInfo = response.data.data.port;
            for (let j = 0; j < proVInfo.out.length; j++) 
            {
              if (proVInfo.out[j].index == classIndex) 
              {
                if (proVInfo.out[j].EDID) 
                {
                  that.EDIDHandle(proVInfo.out[j].EDID.value);
                } 
                else 
                {
                  that.trueEdid = false;
                }
              }
            }
          }).catch(function(error) 
          {
            console.log(error);
          });
      }
    },
    /**点击源的输入端口 */
    inClcick(output, classIndex) 
    {
      this.output = output;
      this.isActive = classIndex;
      this.edidFile = false;
      this.Uploading = "";
      if (this.style_bg == false) 
      {
        this.type = 2;
        this.getEdidInfo(this.type, classIndex);
      } 
      else 
      {
        this.type = 0;
        let that = this;
        this.$axios.get("/configuration.json").then(response => {
            let proVInfo = response.data.data.port;
            for (let j = 0; j < proVInfo.in.length; j++) 
            {
              if (proVInfo.in[j].index == classIndex) 
              {
                if (proVInfo.in[j].EDID) 
                {
                  that.EDIDHandle(proVInfo.in[j].EDID.value);
                } 
                else 
                {
                  that.trueEdid = false;
                }
              }
            }
          }).catch(function(error) {
            console.log(error);
          });
      }
    },
    //点击默认按钮
    defaultClick() 
    {
      if (this.isActive != -1) 
      {
        let type = 0;
        if (this.style_bg == true) 
        {
          type = 2;
          this.getEdidInfo(type, this.isActive);
          this.DefaultTxt = "Default";
          this.style_bg = false;
        } 
        else 
        {
          for (let i = 0; i < this.outputdata.length; i++) 
          {
            if (this.isActive == this.outputdata[i].classIndex) 
            {
              type = 1;
            }
          }
          let that = this;
          this.$axios.get("/configuration.json").then(response => {
              let proVInfo = response.data.data.port;
              if (type == 1) 
              {
                for (let j = 0; j < proVInfo.out.length; j++) 
                {
                  if (proVInfo.out[j].index == this.isActive) 
                  {
                    if (proVInfo.out[j].EDID) 
                    {
                      that.EDIDHandle(proVInfo.out[j].EDID.value);
                    } 
                    else 
                    {
                      that.trueEdid = false;
                    }
                  }
                }
              } 
              else 
              {
                for (let j = 0; j < proVInfo.in.length; j++) 
                {
                  if (proVInfo.in[j].index == this.isActive) 
                  {
                    if (proVInfo.in[j].EDID) 
                    {
                      that.EDIDHandle(proVInfo.in[j].EDID.value);
                    } 
                    else 
                    {
                      that.trueEdid = false;
                    }
                  }
                }
              }
            }).catch(function(error) {
              console.log(error);
            });
          this.DefaultTxt = "";
          this.style_bg = true;
        }
        this.edidFile = false;
        this.Uploading = "";
        this.type = type;
      }
    },
    // 上传文件
    GetEDID() {
      document.getElementById("EDIDFile").click();
    },
    // 
    ReadEDIDFile() 
    {
      let that = this;
      let file = document.getElementById("EDIDFile").files[0];
      let re = /.bin$/i;
      let SafariFlag = navigator.userAgent.search("Safari");
      if (typeof FileReader == "undefined") 
      {
        SafariFlag = true;
      } 
      else 
      {
        SafariFlag = false;
      }
      if (parseInt(file.size) % 128 != 0) 
      {
        that.$alert("ERROR File Type Error", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {}
        });
        return false;
      }
      if (re.test(file.name)) 
      {
        var reader;
        reader = new FileReader();
        that.Uploading = file.name;
        reader.readAsArrayBuffer(file);
        reader.onprogress = function() {
          reader.onload = function() {
            var aByte, byteStr;
            console.log(reader.result);
            let result = new Uint8Array(reader.result);
            console.log(result);
            var edidText = "";
            let n;
            for (n = 0; n < result.length; ++n) 
            {
              aByte = result[n];
              byteStr = aByte.toString(16);
              if (byteStr.length < 2) 
              {
                byteStr = "0" + byteStr;
              }
              edidText += byteStr;
            }
            that.EDIDinfo = edidText;
            that.EDIDHandle(edidText);
          };
          reader.onerror = function() 
          {
            if (evt.target.error.name == "NotReadableError")
            {
            }
          };
        };
      } 
      else 
      {
        that.$alert("File type error", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {}
        });
      }
      this.output = "";
      this.DefaultTxt = "";
      this.style_bg = true;
      this.edidFile = true;
      this.isActive = -1;
      this.$refs.uploadExcelId.value = null;
    },
    /**点击复制按钮 */
    edidCopyClick() 
    {
      let that = this;
      if (that.trueEdid == false) 
      {
        that.$alert("Error EDID,cannot copy", "Prompt information", 
        {
          confirmButtonText: "OK",
          callback: action => {}
        });
        return false;
      }
      that.copyBtn = "COPYING";
      that.selecting = true;
      if (this.edidFile == false) 
      {
        let copyIndexLength = that.copyIndex.length;
        if (that.indexNumber < copyIndexLength) 
        {
          setTimeout(function() 
          {
            that.edidCopy(that.copyIndex[that.indexNumber]);
          }, 2000);
        } 
        else 
        {
          that.indexNumber = 0;
          setTimeout(function() {
            that.selecting = false;
            that.copyBtn = "COPY";
          }, 2000);
        }
      } 
      else 
      {
        let copyIndexLength = that.copyIndex.length;
        if (that.indexNumber < copyIndexLength) 
        {
          setTimeout(function() 
          {
            that.loadCopy(that.copyIndex[that.indexNumber]);
          }, 2000);
        } 
        else 
        {
          that.indexNumber = 0;
          setTimeout(function() 
          {
            that.selecting = false;
            that.copyBtn = "COPY";
          }, 2000);
        }
      }
    },
    /**真正的拷贝EDID过程 */
    edidCopy(items) {
      let copyIn = [items.classIndex];
      let aoData = {
        cmd: "CopyPortEDID",
        Data: {
          dim: copyIn,
          type: this.type, //0 in,1 out,2default
          org: this.isActive
        }
      };
      console.log(aoData);
      let that = this;
      this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
      {
          if (response.data.status == "SUCCESS") 
          {
            that.$message({
              message: items.title + " copy success",
              type: "success"
            });
            that.indexNumber++;
            that.edidCopyClick();
          } 
          else if (response.data.status == "ERROR") 
          {
            that.$confirm(items.title + " copy error", "Prompt information", {
                confirmButtonText: "Next",
                cancelButtonText: "Again",
                type: "warning",
                closeOnClickModal: false
              }).then(() => {
                that.indexNumber++;
                that.edidCopyClick();
              }).catch(() => {
                that.edidCopyClick();
              });
          }
        }).catch(function(error) {
          console.log(error);
        });
    },
    /**拷贝上传的EDID */
    loadCopy(items) {
      let copyIn = [items.classIndex];
      let aoData = {
        cmd: "LoadEDID",
        Data: {
          dim: copyIn,
          EDID: this.EDIDinfo
        }
      };
      console.log(aoData);
      let that = this;
      this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response)
      {
        if (response.data.status == "SUCCESS") 
        {
            that.$message({
              message: items.title + " copy success",
              type: "success"
            });
            that.indexNumber++;
            that.edidCopyClick();
        } 
        else if (response.data.status == "ERROR") 
        {
          that.$confirm(items.title + " copy error", "Prompt information", {
            confirmButtonText: "Next",
            cancelButtonText: "Again",
            type: "warning",
            closeOnClickModal: false
            }).then(() => {
                that.indexNumber++;
                that.edidCopyClick();
              }).catch(() => {
                that.edidCopyClick();
              });
          }
        }).catch(function(error) {
          console.log(error);
        });
    },
    /** */
    allSelect(e) 
    {
      let that = this;
      if (e.target.checked) 
      {
        that.ischecked = true;
        that.selectMsg.length = 0;
        that.copyIndex.length = 0;
        for (var i = 0; i < that.copyInput.length; i++) 
        {
          that.$set(that.copyInput[i], "checked", true);
          let ht = {
            title: that.copyInput[i].title,
            index: that.copyInput[i].index,
            classIndex: that.copyInput[i].classIndex
          };
          that.selectMsg.push(ht);
          that.copyIndex.push(ht);
        }
      } 
      else 
      {
        that.ischecked = false;
        that.selectInput = false;
        that.showCopy = false;
        for (var i = 0; i < that.copyInput.length; i++) 
        {
          that.$delete(that.copyInput[i], "checked");
        }
        that.selectMsg.length = 0;
        that.copyIndex.length = 0;
      }
    },
    compare(property) 
    {
      return function(a, b) 
      {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    // Out多选按钮
    copyInputClick(item) 
    {
      let ht = {
        title: item.title,
        index: item.index,
        classIndex: item.classIndex
      };
      if (typeof item.checked == "undefined") 
      {
        this.$set(item, "checked", true);
        this.selectMsg.push(ht);
        this.copyIndex.push(ht);
        this.selectMsg.sort(this.compare("index"));
      } 
      else 
      {
        this.$delete(item, "checked");
        this.ischecked = false;
        for (var i = 0; i < this.selectMsg.length; i++) 
        {
          if (this.selectMsg[i].index == item.index) 
          {
            this.selectMsg.splice(i, 1);
            break;
          } 
          else 
          {
          }
        }
        for (var i = 0; i < this.copyIndex.length; i++) 
        {
          if (this.copyIndex[i].classIndex == item.classIndex) 
          {
            this.copyIndex.splice(i, 1);
            break;
          } 
          else 
          {
          }
        }
      }
    },
    // 插件调用的函数
    edidClear() {},
    ischecked() {},
    handleSuccess(response, file, fileList) 
    {
      this.uploadsuccess = true;
      console.log(response, file, fileList);
    },
    handleRemove(file, fileList) 
    {
      // console.log(file, fileList);
      if (fileList.length == 0) 
      {
        this.uploadsuccess = false;
      }
    },
    handlePreview(file) 
    {
      console.log(file);
    },
    EDIDHandle(data) 
    {
      let that = this;
      that.trueEdid = true;
      //that.$EDID.setEdidData(data);
      if (that.$EDID.setEdidData(data) == "errorEDID") 
      {
        that.$alert("ERROR EDID", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {}
        });
        that.trueEdid = false;
        return false;
      } 
      else 
      {
        that.ModuleName = that.$EDID.getName();
        that.size = that.$EDID.getNativeResolution();
        that.audio = that.$EDID.getAudioChannels();
        that.Model = that.$EDID.getLength();
      }
    },
    getProInfo() 
    {
      let that = this;
      this.$axios
        .get("/configuration.json")
        .then(response => {
          let proVInfo = response.data.data.port;
          that.outputdata = [];
          that.inputdata = [];
          that.copyInput = [];
          for (let j = 0; j < proVInfo.in.length; j++) 
          {
            let i = j + 1;
            if (j < proVInfo.in.length - 1) 
            {
              that.inputdata.push({
                classIndex: proVInfo.in[j].index,
                index: i,
                input: "in" + i
              });
              that.copyInput.push({
                classIndex: proVInfo.in[j].index,
                index: i,
                title: "in" + i
              });
            }
          }
          for (let j = 0; j < proVInfo.out.length; j++) 
          {
            let i = j + 1;
            that.outputdata.push({
              classIndex: proVInfo.out[j].index,
              index: i,
              output: "out" + i
            });
          }
          that.outClcick(
            that.outputdata[0].output,
            that.outputdata[0].classIndex
          );
        }).catch(function(error) {
          console.log(error);
        });
    },
    getEdidInfo(type, index) 
    {
      let aoData = {
        cmd: "GetPortEDID",
        Data: {
          port: index,
          attr: type //0 in,1 out,2default
        }
      };
      console.log(aoData);
      let that = this;
      this.$axios.post("/cgi-bin/ligline.cgi", aoData).then(function(response) 
      {
          if (response.data.status == "SUCCESS") 
          {
            that.selecting = false;
            that.trueEdid = true;
            that.EDIDinfo = response.data.echo.result.EDID;
            that.EDIDHandle(that.EDIDinfo);
          } 
          else if (response.data.status == "ERROR") 
          {
            that.EDIDinfo = "";
            that.selecting = false;
            that.trueEdid = false;
          }
        }).catch(function(error) {
          that.selecting = false;
          console.log(error);
        });
    },
    truncate(arr) 
    {
      let m = arr.slice(0);
      m.splice(m.length - 1, 1);
      return m;
    }
  },
  created() {
    this.getProInfo();
  },
  mounted() {}
};
</script>

<style scoped>
@import "../style/common";
.wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.set_content {
  width: 710px;
  height: calc(100% - 10px);
  margin: 0 auto;
  overflow: auto;
  padding: 50px 30px 10px;
  background: #fff;
  border-radius: 5px;
  -webkit-overflow-scrolling: auto;
}
.edidC {
  width: 630px;
  height: 100%;
  margin: 0 auto;
}
.set_content_edid_title {
  font-size: 20px;
  font-weight: 300;
}
.set_content_edid_box {
  width: 210px;
  float: left;
}
.set_content_one_p {
  margin-top: 5px;
  margin-left: 5px;
}
.s_c_o_p_input {
  width: 14px;
  height: 14px;
  border-radius: 0px;
  cursor: pointer;
}
.set_content_one_box {
  width: 210px;
  height: 500px;
  margin-top: 5px;
  /* padding-left: 5px; */
  border: 1px solid #000;
  overflow: auto;
  -webkit-overflow-scrolling: auto;
}
.set_content_one_box2 {
  width: 210px;
  max-height: 405px;
  margin-top: 5px;
  /* padding-left: 5px; */
  overflow: auto;
}
.set_content_one_default {
  width: 200px;
  line-height: 30px;
  text-align: center;
  margin: 5px auto;
  background: #fff;
  border-radius: 5px;
  border: 1px solid #888;
  color: #fff;
  display: table;
  font-size: 14px;
  cursor: pointer;
}
.set_content_one_default:hover {
  background: #4e96c6;
}
.set_content_one_file {
  width: 200px;
  line-height: 20px;
  color: #333;
  text-align: center;
  margin: 0 auto;
  border: 1px solid #888;
  background: #fff;
  border-radius: 5px;
  display: table;
  font-size: 14px;
  cursor: pointer;
}
.set_content_two_information {
  width: 180px;
  height: 90px;
  padding: 10px;
  margin: 5px auto 0;
  border-radius: 5px;
  background: #409eff;
}
.set_content_two_font {
  color: #fff;
  font-size: 12px;
  margin-top: 5px;
}
.set_content_two_font1 {
  margin: 0;
}
.set_content_two_font2 {
  color: #fff;
  font-size: 10px;
  float: right;
}
.set_content_two_inputs {
  font-size: 12px;
  text-align: center;
}
.set_content_two_copy {
  width: 180px;
  text-align: center;
  margin: 5px auto 0;
  background: #409eff;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: table;
}
.s_c_o_b_block {
  width: 170px;
  margin: 5px auto;
  padding-left: 10px;
  line-height: 45px;
  display: table;
  font-size: 14px;
  cursor: pointer;
  background: #fff;
  color: #000;
  border-radius: 3px;
  border: 1px solid #888;
  box-shadow: 1px 1px 1px #888;
  -moz-box-shadow: 1px 1px 1px #888;
  -webkit-box-shadow: 1px 1px 1px #888;
  -o-box-shadow: 1px 1px 1px #888;
}
.s_c_o_b_block:hover {
  background: #ccc;
}
.active {
  width: 170px;
  margin: 5px auto;
  padding-left: 10px;
  color: #fff;
  line-height: 45px;
  display: table;
  background: #409eff;
  font-size: 14px;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid #888;
  box-shadow: 1px 1px 1px #888;
  -moz-box-shadow: 1px 1px 1px #888;
  -webkit-box-shadow: 1px 1px 1px #888;
  -o-box-shadow: 1px 1px 1px #888;
}
.active:hover {
  background: #66b1ff;
}
.errorInfo {
  line-height: 70px;
  font-size: 16px;
  text-align: center;
}
.disabledCopyBtn[disabled] {
  /* pointer-events: none; */
  /* cursor: not-allowed; */
  /* filter: alpha(opacity=65); */
  -webkit-box-shadow: none;
  box-shadow: none;
  background: #727272;
  color: white;
  /* opacity: .65;     */
}
.disabledBtn[disabled] {
  /* pointer-events: none; */
  cursor: not-allowed;
  filter: alpha(opacity=65);
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>