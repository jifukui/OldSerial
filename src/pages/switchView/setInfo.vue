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
            <select v-model="item.lastervalue">
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
            <div class="block">
              <el-slider
                :min="item.value.min"
                :max="item.value.max"
                :debounce="300"
                :show-input-controls="false"
                v-model="item.lastervalue"
                @change="change(item)"
                show-input
                input-size="mini"
              ></el-slider>
            </div>
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
        v-show="status"
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
    <!-- <h5 class="tc">{{data}}</h5> -->
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
      dataSet: []
    };
  },
  watch: {
    portSetInfo: {
      handler(newValue, oldValue) {
        console.log(this.portSetInfo);
        if(this.portSetInfo.Info.length==0){
          this.status=false
        }else{
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
    }
  },
  computed: {},
  methods: {
    inpNum(item, min, max) {
      console.log(item.lastervalue);
      console.log(min);
      console.log(max);
      var r = /^[1-9]\d*|0$/;
      if (!r.test(item.lastervalue)) {
        this.$alert("Data type error", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {}
        });
        item.lastervalue = item.oldvalue;
        return false;
      }
      if (item.lastervalue < min || item.lastervalue > max) {
        this.$alert("Data out of range", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {}
        });
        item.lastervalue = item.oldvalue;
        return false;
      }
    },
    change(item) {
      console.log("===============", Math.floor(item.lastervalue));
      return (item.lastervalue = Math.floor(item.lastervalue));
    },
    CancelBtn() {
      this.$emit("closePage", false);
      this.$conf.PortCancel();
    },
    OKBtn() {
      let data = {};
      let that = this;
      data.cmd = "SetPortFunc";
      data.Data = [];
      data.Data = this.$conf.PortAvOK(
        this.$conf.PortInfoAv.info,
        this.index,
        this.dir
      );
      if (data.Data.length == 0) {
        that.$alert("Save success", "Prompt information", {
          confirmButtonText: "OK",
          callback: action => {}
        });
        that.$emit("closePage", false);
        that.$conf.PortCancel();
        return false;
      }
      console.log("The data is " + JSON.stringify(data));
      this.$axios
        .post("/cgi-bin/ligline.cgi", data)
        .then(function(response) {
          if (response.data.status == "SUCCESS") {
            that.$alert("Save success", "Prompt information", {
              confirmButtonText: "OK",
              callback: action => {}
            });
            that.$emit("closePage", false);
            that.$conf.PortCancel();
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
  },
  created() {},
  mounted() {
    console.log(this.portSetInfo.Setting);
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
</style>