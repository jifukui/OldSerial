<template>
  <div class="wrapper">
    <div class="title">Port Information {{ title }}</div>
    <div class="boxContent" v-show="status">
      <table class="boxC">
        <tr v-for="(item, index) in staticData" :key="index" class="staticTr">
          <td width="35%">{{ item.id }}:</td>
          <td width="65%">{{ item.value }}</td>
        </tr>
        <tr 
          v-for="(item, index) in dataSet" 
          :key="index" 
          class="staticTr">
          <td width="35%" v-if="item.type === 'static'">{{ item.id }}:</td>
          <td width="65%" v-if="item.type === 'static'">
            {{ item.value }}<span v-show="item.id == 'Temperature'"> ℃</span
            ><span v-show="item.id == 'Voltage'"> V</span>
          </td>
          <td width="35%" v-if="item.type === 'list'">{{ item.id }}:</td>
          <td width="65%" v-if="item.type === 'list'">
            <select v-model="item.lastervalue" @change="listchange(item,index)">
              <option
                v-for="(item, index) in item.value"
                :key="index"
                :value="item.value"
                >{{ item.name }}</option
              >
            </select>
          </td>
          <td width="35%" v-if="item.type === 'slider'">{{ item.id }}:</td>
          <td width="65%" v-if="item.type === 'slider'">
            <div class="block fl" style="width:70%">
              <el-slider
              style="width:80%"
              :min="item.value.min"
              :max="item.value.max"
              @change="sliderchange(item,index)"
              v-model="item.lastervalue"
              input-size="mini"
              ></el-slider>
            </div>
            <input
              style="width:16%"
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
              :inactive-text="item.value.off_text"
            ></el-switch>
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
          <td width="35%" v-if="item.type === 'inputOnlySetNum'">
            {{ item.id }}:
          </td>
          <td width="65%" v-if="item.type === 'inputOnlySetNum'">
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
              @click="clickBtn(index, 1,dir)"
              >Repower
            </el-button>
            <el-button
              class="btn"
              type="primary"
              @click="clickBtn(index, 2,dir)"
              >Factory
            </el-button>
          </td>
        </tr>
        <tr v-show="dataSet.length!=0">
          <td width="35%" style="font-size:14px;">Refresh:</td>
          <td width="65%">
            <el-button
              class="btn"
              type="primary"
              @click="refresh()">
              Refresh
            </el-button>
          </td>
        </tr>
      </table>
    </div>
    <div class="boxContent" v-show="!status">
      <p class="nodata">The port not online</p>
    </div>
    <div>
      <el-button 
        class="isOk" 
        type="primary" 
        value="OK" 
        @click="OKBtn" 
        v-show="dataSet.length!=0"
        :disabled= !HaveChange
        >Save</el-button
      >
      <el-button
        class="isCancel"
        type="primary"
        value="Cancel"
        @click="CancelBtn"
        >Exit</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["portSetInfo"],
  data() {
    return {
      value: "",
      data: [],
      title: "",
      status:true,
      index: "",
      staticData: [],
      dataSet: [],
      HaveChange:false,
      ChangeFlag:[],
    };
  },
  watch: {
    portSetInfo: {
      handler(newValue, oldValue) 
      {
        this.ChangeFlag=new Array();
        if(this.portSetInfo.Info.length==0)
        {
          this.status=false
        }
        else
        {
          this.status=true
        }
        //父组件param对象改变会触发此函数
        this.title = this.portSetInfo.title;
        this.index = this.portSetInfo.index;
        this.dir = this.portSetInfo.dir;
        this.staticData = this.portSetInfo.Info;
        this.value = this.$conf.PortInitAv(
          this.portSetInfo.Setting,
          this.portSetInfo.dir
        );
        this.dataSet = this.$conf.PortInfoAv.info;
      },
      immediate: true,
      deep: true
    },
    ChangeFlag:function(value)
    {
      let that =this;
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
      var r = /^[1-9]\d*|0$/;
      if (!r.test(item.lastervalue)) 
      {
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
    change(item) 
    {
      console.log("===============", Math.floor(item.lastervalue));
      return (item.lastervalue = Math.floor(item.lastervalue));
    },
    CancelBtn() 
    {
      this.$emit("closePage", false);
      this.$conf.PortCancel();
    },
    OKBtn() 
    {
      let data = {};
      let that = this;
      data.cmd = "SetPortFunc";
      data.Data = [];
      let val={};
      val = this.$conf.PortAvOK(
        this.$conf.PortInfoAv.info,
        this.index,
        this.dir
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
      console.log("data.Data.length "+data.Data.length)
      if (data.Data.length == 0) 
      {
        that.$alert("Save success", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {
            that.ChangeFlag=new Array();
          }
        });
        //that.$emit("closePage", false);
        //that.$conf.PortCancel();
        return false;
      }
      that.ChangeFlag=new Array();
      that.$store.state.PageLoading=true;
      console.log("The data is " + JSON.stringify(data));
      this.$axios.post("/cgi-bin/ligline.cgi", data).then(function(response) 
      {
        that.$conf.PortInfoAv.info=JSON.parse(JSON.stringify(that.$conf.BasePortInfo.info));
        that.setData=that.$conf.PortInfoAv.info;
        if (response.data.status == "SUCCESS") 
        {
          if(response.data.error)
          {
            let i=0,n=0;
            let errortitle=[];
            let errorstr="";
            let errorvalue=response.data.error.split(",");
            for(i=0;i<errorvalue.length;i++)
            {
              for(n=0;n<that.$conf.PortInfoAv.info.length;n++)
              {
                if(that.$conf.PortInfoAv.info[n].sid==errorvalue[i])
                {
                  errortitle.push(that.$conf.PortInfoAv.info[n].id);
                }
              }
            }
            errorstr=errortitle.join(",");
            errorstr+=" Setting Failed";
            that.$message({
              message: errorstr,
              type: "warning"
            });
          }
          else
          {
              that.$message({
              message: "Save success",
              type: "success"
            });
          } 
          setTimeout(() => {
            that.refresh();
            setTimeout(() => {
              that.$store.state.PageLoading=false;
            }, 1000);
          }, 1000); 
          
        } 
        else if (response.data.status == "ERROR") 
        {
          that.$alert("Setting Failed", "Prompt information", {
              confirmButtonText: "OK",
              callback: action => {
                that.refresh();
                that.$store.state.PageLoading=false;
              }
            });
        }
      }).catch(function(error) {
          console.log(error);
          that.$store.state.PageLoading=false;
        });
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
    },
    sliderchange(item,index) {
      //console.log("===============", Math.floor(item.lastervalue));
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
      //console.log("silder data is "+JSON.stringify(item));
    },
    refresh()
    {
      this.ChangeFlag=new Array();
      this.$emit("SelectPort", this.index,this.portSetInfo.dir,this.portSetInfo.title,true);
      //console.log("refresh")
    },
    clickBtn(index, info, dir) 
    {
      let confirmValue = "";
      let successstr="";
      let errorstr="";
      if (info == 1) 
      {
        confirmValue = "RESET port to repower ? <br/>Press OK to confirm";
        successstr="Device setup has been successfully finished";
        errorstr="Device setup failed";
      } 
      else if (info == 2) 
      {
        confirmValue ="RESET port to factory default ? <br/>Press OK to confirm";
        successstr="Device factory reset has been successfully finished";
        errorstr="Device factory reset failed";
      }
      let that = this;
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
                index: that.index,
                sid: 36,
                value: info,
                dir: dir
              }
            ]
          };
          console.log("The data is " + JSON.stringify(data));
          that.$store.state.PageLoading=true;
          this.$axios.post("/cgi-bin/ligline.cgi", data).then(function(response) 
          {
            if (response.data.status == "SUCCESS") 
            {
              that.$alert(successstr, "Prompt information", {
                  confirmButtonText: "OK",
                  callback: action => {
                    setTimeout(() => {
                      that.refresh();
                      that.$store.state.PageLoading=false;
                    }, 3000);
                  }
                });
            } 
            else if (response.data.status == "ERROR") 
            {
              that.$alert(errorstr, "Prompt information", {
                  confirmButtonText: "OK",
                  callback: action => {
                    that.$store.state.PageLoading=false;
                  }
                });
            }
          }).catch(function(error) {
              console.log(error);
              that.$store.state.PageLoading=false;
            });
        }).catch(() => {
          let sendata = {
            resetSure: "取消重置信息"
          };
        });
    }
  },
  beforeCreate()
  {
    console.log("beforeCreate");
  },
  created() {
    console.log("creat");
  },
  beforeMount(){
    console.log("beforeMount");
  },
  mounted() {
    //console.log(this.portSetInfo.Setting);
    console.log("mount");
  },
  updated(){
    console.log("updated");
  },
  beforeDestroy(){
    console.log("beforeDestroy");
  },
  destroyed(){
    console.log("destroyed");
  },
  activated(){
    console.log("activated");
  },
  deactivated(){
    console.log("deactivated");
  }
};
</script>
<style>
.el-switch__input:focus ~ .el-switch__core {
  outline: none;
}
</style>

<style scoped>
@import "../../style/common";
.wrapper {
  height: 520px;
  padding: 20px;
  position: relative;
}
.box {
  /*margin-top: 5px;*/
  height: 35px;
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
.slider {
  width: 300px;
}
.staticTr {
  line-height: 35px;
}
.boxC {
  width: 100%;
}
.boxContent {
  height: 410px;
  overflow: auto;
  -webkit-overflow-scrolling: auto;
}
.nodata{
  text-align:center;
}

.btn {
  width: 150px;
  height: 30px;
  padding: 0px 20px;
  margin-bottom: 4px;
}
</style>