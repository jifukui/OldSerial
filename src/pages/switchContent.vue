<template>
    <div id="contentView">
        <div class="contentLoading" v-loading="loading" v-show="swtichView" element-loading-background="#ededed">
        </div>
        <div class="content" v-show="!swtichView">
            <section class="switchView">
                <Switchview class="switchViewInfo" @closeLoading="closeLoading"></Switchview>
            </section>
        </div>
    </div>
</template>

<script>
import Switchview from "./switchView/switchView";
export default {
    name: "SwtichContent",
    data() {
        return {
            loading: true,
            swtichView: true
        };
    },
    components: {
        Switchview
    },
    watch: {},
    methods: {
        closeLoading(data) {
            var that = this;
            that.loading = false;
            that.swtichView = false;
        }
    },
    created() {
        this.loading = true;
    },
    mounted() {}
};
</script>

<style scoped>
@import "../style/common";
#contentView {
    height: 100%;
}
.content {
    /* display: flex;
    justify-content: space-between;
    flex-direction: row; */
    height: 100%;
}
.contentLoading {
    width: 100%;
    height: 100%;
}
.switchView {
    width: 100%;
    height: calc(100% - 10px);
}
.switchViewInfo {
    width: auto;
    height: 100%;
    overflow: auto;
    /* overflow-y: scroll;
    overflow-x: scroll; */
    -webkit-overflow-scrolling: auto;
    position: static;
}
</style>
