<template>
  <div id="app">
   <router-view></router-view>
  </div>
</template>

<script>
var jifukuixxxx=true;
console.log("Hello,my name is jifukui if you have any questions please contact with me, Email:805013833@qq.com");
if(jifukuixxxx)
{
  window.console.log=function(params) {
    return ;
  }
}
export default {
    name: "App",
    
};

</script>

<style>
#app {
    font-family: "Arial";
}
</style>
