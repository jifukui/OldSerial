<template>
    <div class="content">
        <div class="proInfoConfigure">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="Device" name="first">
                    <section class="portInfo" v-if="activeName=='first'">
                        <Device></Device>
                    </section>
                </el-tab-pane>
                <el-tab-pane label="Card" name="second">
                    <section class="portInfo" v-if="activeName=='second'">
                        <Card></Card>
                    </section>
                </el-tab-pane>
                <el-tab-pane label="Port" name="third">
                    <section class="portInfo" v-if="activeName=='third'">
                        <Port></Port>
                    </section>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import Device from "./proInfo/device";
import Card from "./proInfo/card";
import Port from "./proInfo/port";
export default {
    name: "SwtichContent",
    components: {
        Device,
        Card,
        Port
    },
    data() {
        return {
            activeName: this.$store.state.Settingsname
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
};
</script>
<style>
.proInfoConfigure .el-tabs__item {
    padding: 0 20px;
    height: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 40px;
    display: inline-block;
    list-style: none;
    font-size: 20px;
    font-weight: 500;
    color: #303133;
    position: relative;
}
.proInfoConfigure .el-tabs {
    height: calc(100% - 10px);
}
.proInfoConfigure .el-tabs__content {
    height: calc(100% - 10px);
}
.proInfoConfigure .el-tab-pane {
    height: calc(100% - 10px);
}
</style>

<style scoped>
@import "../style/common";
.content {
    height: 100%;
}
.proInfoConfigure {
    height: calc(100% - 10px);
}
.portInfo {
    overflow: auto;
    height: calc(100% - 10px);
}
</style>
