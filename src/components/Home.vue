<template>
  <div class="home">
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
      <a-layout-sider collapsible v-model="collapsed">
        <div class="logo" />
        <a-menu theme="dark" :defaultSelectedKeys="['1']" mode="inline">
          <a-sub-menu v-for="item in menuList" :key="item.id" index="item.id">
            <span slot="title">
              <a :class="iconsObj[item.id]"></a>
              <span class="title" :style="{opacity:isOpacity}">{{item.authName}}</span>
            </span>
            <a-menu-item v-for="subItem in item.children" :key="subItem.id">
              <router-link :to="'/'+subItem.path">{{subItem.authName}}</router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0;height:100px;	position: relative;">
          <a-button type="danger" @click="logout" class="logoutBtn">
            <a-icon type="poweroff" />退出登录
          </a-button>
        </a-layout-header>
        <a-breadcrumb style="margin: 20px 0 10px 30px">
          <a-breadcrumb-item>
            <router-link to="/home">首页</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item></a-breadcrumb-item>
          <a-breadcrumb-item></a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content style="margin: 0 16px">
          <div :style="{ padding: '24px', background: '#fff', minHeight: '100%'}">
            <router-view></router-view>
          </div>
        </a-layout-content>

        <a-layout-footer style="text-align: center">
          Created by
          <a-icon type="github" />HeartZX ©2019
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
export default {
	created() {
		this.getMenuList()
	},
	beforeUpdate() {
		this.changeOpacity()
	},
	data() {
		return {
			collapsed: false,
			isOpacity: 1,
			menuList: [],
			iconsObj: {
				'125': 'iconfont icon-yonghu',
				'103': 'iconfont icon-icon--quanxian',
				'101': 'iconfont icon-shangpinguanli',
				'102': 'iconfont icon-dingdan',
				'145': 'iconfont icon-kujialeqiyezhan_shujutongji'
			}
		}
	},
	methods: {
		logout() {
			window.sessionStorage.clear()
			this.$router.push('/login')
		},
		async getMenuList() {
			const { data: res } = await this.$http.get('menus')
			console.log(res)
			console.log(res.data)
			if (res.meta.status == 200) {
				this.menuList = res.data
			} else {
				return this.$message.error(res.meta.msg)
			}
		},
		changeOpacity() {
			if (this.collapsed) {
				this.isOpacity = 0
			} else {
				this.isOpacity = 1
			}
		}
	}
}
</script>

<style lang="less" scoped>
#components-layout-demo-side .logo {
	height: 55px;
	margin: 16px;
}
.logoutBtn {
	position: absolute;
	right: 50px;
	top: 50%;
	transform: translateY(-50%);
}
.title {
	padding-left: 10px;
}
</style>