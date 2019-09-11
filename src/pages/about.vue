<template>
    <div class="wrapper">
        <div class="box">
            <div class="logo"></div>
            <div class="content">
                <p class="font30 coBlue">WEB VERSION 1.0.4</p>
                <p class="font18">KRAMER ELECTRONICS LTD.</p>
                <p>3 Am Veolamo st.Jerusalem, 9546303</p>
                <p>Tel: +972-73-265-0200</p>
                <p>Fax: +972-2-653-5369</p>
                <p>Email: <a class="coBlue" href="mailto:info@kramerav.com">info@kramerav.com</a></p>
                <p>Web: <a class="coBlue" target="value" href="http://www.KramerAV.com/">www.KramerAV.com</a></p>
            </div>
            <div class="clear"></div>
            <p class="font15">© 2019 - Kramer Electronics LTD. all rights reserved.</p>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {};
    },
    watch: {},
    computed: {},
    methods: {},
    created() {},
    mounted() {}
};
</script>

<style scoped>
@import "../style/common";
.wrapper {
    width: 100%;
    height: calc(100% - 20px);
    overflow: auto;
}
.box {
    width: 562px;
    height: 430px;
    padding: 60px;
    /*border: 1px solid #409EFF;*/
    margin: 0 auto;
    overflow: auto;
}
.logo {
    width: 140px;
    height: 140px;
    background: url(../../static/img/sprite.png) 0 -62px;
    float: left;
}
.content {
    float: left;
}
.content p {
    padding: 7px 0 7px 10px;
}
.font30 {
    font-size: 30px;
}
.font18 {
    font-size: 18px;
}
.font15 {
    font-size: 15px;
}
</style>