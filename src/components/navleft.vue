<template>
  <div>
    <div class="nav_content">
      <ul
        class="panel-group"
        id="accordion"
      >
        <li>
          <div
            id="change_nav"
            :class="open_nav"
            @click="switch_nav"
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </li>
        <router-link
          :to="{ path: items.routerLink,query:{item:index}}"
          v-for="(items,index) in nav_list"
          :key="index"
        >
          <li
            class="nav_li"
            :class="{nav_li_selected:index==nowIndex}"
            @click="selected(index)"
          >
            <i
              class="iconfont"
              :class="items.class"
            ></i>
            <span
              class="nav_title"
              v-show="open"
            >{{items.text}}<br/>{{items.text1}}</span>
          </li>
        </router-link>

      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nav_list: [
        {
          text: "Routing Settings",
          class: "icon-wangluo1",
          routerLink: "../pages/switchContent"
        },
        {
          text: "EDID",
          text1: "Management",
          class: "icon-dianshi-_EDID",
          routerLink: "../pages/edidPage"
        },
        {
          text: "Settings",
          class: "icon-cogs",
          routerLink: "../pages/configure"
        },
        {
          text: "About",
          class: "icon-info",
          routerLink: "../pages/about"
        }
      ],
      nowIndex: 0,
      open_nav: "open_nav",
      open: "true",
      temp: "false",
      voltage: "false",
      fan: "false"
    };
  },
  methods: {
    selected: function(index) {
      this.nowIndex = index;
    },
    switch_nav: function() {
      if (this.open_nav == "open_nav") {
        this.open_nav = "close_nav";
        this.$emit("nav_switch", "close_nav");
        this.open = false;
      } else {
        this.open_nav = "open_nav";
        this.open = true;
        this.$emit("nav_switch", "open_nav");
      }
    }
  },
  mounted() {
    if (this.$route.query.item) {
      this.nowIndex = this.$route.query.item;
    } else {
      this.nowIndex = 0;
    }
  }
};
</script>

<style scoped >
@import "../style/common";
@import "../style/fontIcon/iconfont.css";
.nav_content {
  min-height: 485px;
  height: 100%;
}
#accordion {
}
.accordion {
  height: calc(100% - 385px);
  min-height: 100px;
  position: relative;
}
.nav_li,
.nav_li_selected {
  height: 65px;
  border-bottom: 1px solid rgba(69, 74, 84, 0.7);
  cursor: pointer;
  padding: 15px 0 15px 15px;
  display: flex;
  flex-direction: row;
  position: relative;
  box-sizing: border-box;
}

#change_nav {
  height: 56px;
  border-bottom: 1px solid rgba(69, 74, 84, 0.7);
  cursor: pointer;
  padding: 25px 0 15px 15px;
  background-color: #ededed;
  border-bottom: 1px solid rgba(69, 74, 84, 0.7);
  -webkit-transform: rotate(0);
  -moz-transform: rotate(0);
  -o-transform: rotate(0);
  transform: rotate(0);
  -webkit-transition: 0.5s ease-in-out;
  -moz-transition: 0.5s ease-in-out;
  -o-transition: 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
  box-sizing: border-box;
  /*position: relative;*/
}

.nav_li span,
.nav_li_selected span,
.nav_li i {
  position: relative;
  align-items: center;
  display: flex;
}

.nav_li i {
  font-size: 20px;
  color: #fff;
}

.nav_li_selected i {
  font-size: 20px;
  color: #4d4d4d;
}

.nav_li .nav_title {
  color: white;
  margin-left: 15px;
  font-size: 16px;
  white-space: nowrap;
}

.nav_li_selected .nav_title {
  margin-left: 15px;
  color: black;
  white-space: nowrap;
}

.nav_li_selected {
  background-color: #ededed;
  border-left: 5px solid #409eff;
}
@media (min-width: 1025px) {
  .panel-group .nav_li:hover {
    text-decoration: none;
    background: linear-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.1)
    ); /* 标准的语法（必须放在最后） */
    /*background-color: #444;*/
    color: #ffffff;
  }
  .panel-group .nav_li_selected:hover {
    /*text-decoration: none;*/
    background-color: #ccc;
  }
}

#change_nav:hover {
  background-color: #ccc;
}

#change_nav.open_nav span:nth-child(1) {
  top: 18px;
  width: 0%;
  left: 50%;
}

#change_nav.open_nav span:nth-child(2) {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}

#change_nav.open_nav span:nth-child(3) {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

#change_nav.open_nav span:nth-child(4) {
  top: 18px;
  width: 0%;
  left: 50%;
}

.close_nav span:nth-child(1) {
  top: 15px;
}

.close_nav span:nth-child(2),
.close_nav span:nth-child(3) {
  top: 26px;
}

.close_nav span:nth-child(4) {
  top: 37px;
}

#change_nav span {
  display: block;
  position: absolute;
  height: 4px;
  width: 30px;
  background: #666;
  border-radius: 4px;
  opacity: 1;
  right: 15px;
  -webkit-transform: rotate(0);
  -moz-transform: rotate(0);
  -o-transform: rotate(0);
  transform: rotate(0);
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
.light {
  width: 24px;
  height: 24px;
  display: inline-block;
  margin-right: 20px;
}
.abnormalT {
  background: url(../../static/img/sprite.png) -23px -204px;
}
.normalT {
  background: url(../../static/img/sprite.png) 1px -204px;
}
.abnormalV {
  background: url(../../static/img/sprite.png) -23px -228px;
}
.normalV {
  background: url(../../static/img/sprite.png) 1px -228px;
}
.abnormalF {
  background: url(../../static/img/sprite.png) -23px -251px;
}
.normalF {
  background: url(../../static/img/sprite.png) 1px -251px;
}
.positionB {
  padding: 15px 0 10px 15px;
  position: absolute;
  left: 0;
  bottom: 0;
}
.status {
  height: 24px;
  font-size: 16px;
  display: flex;
  align-items: center;
  color: white;
  margin-bottom: 5px;
}
</style>
