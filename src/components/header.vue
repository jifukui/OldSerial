<template>
    <div>
        <div class='user_img'></div>
        <div class="container_fluid">
            <span class="titleKramer">Kramer&nbsp;&nbsp;</span><span>{{headerInfo}}</span> Digital Matrix Switcher
        </div>
    </div>
</template>

<script>
export default {
    props: ["headerInfo"],
    data() {
        return {
            userName: ""
        };
    },
    methods: {},
    mounted() {}
};
</script>

<style scoped>
@import "../style/common";
.user_img {
    width: 44px;
    height: 44px;
    background: url(../../static/img/logo.png) no-repeat;
    background-size: 43px;
    margin-left: 8px;
}
.titleKramer{
    color: #ddd;
}
</style>
