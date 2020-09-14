/**
 * ①添
 * @@新增 定义初始化菜单
 */
import store from '@/store'
import { getToken, localSave, localRead } from '@/libs/util'
// import config from '@/config'
import { lazyLoadingCop } from '@/libs/tools'
import { getMenuData } from '@/api/data'
import Main from '@/components/main' // Main 是架构组件，不在后台返回，在文件里单独引入
import parentView from '@/components/parent-view' // parentView 是二级架构组件，不在后台返回，在文件里单独引入
// eslint-disable-next-line no-unused-vars
const _import = require('@/router/_import_' + process.env.NODE_ENV)// 获取组件的方法
// 初始化路由
export const initRouter = (vm) => {
  if (!getToken()) {
    return
  }

  var routerData
  let menuTree = []
  if (!vm.$store.state.app.added) {
    // 第一次加载 读取数据
    getMenuData().then(res => {
      routerData = res.data.list // 后台拿到路由

      localSave('dynamicRouter', JSON.stringify(routerData)) // 存储路由到localStorage
      menuTree = filterAsyncRouter(routerData) // 过滤路由,路由组件转换

      store.commit('updateMenuList', menuTree)

      vm.$store.commit('setAdded', true)
      dynamicRouterAdd()
    })
  } else {
    menuTree = dynamicRouterAdd()
  }

  return menuTree
}

// 加载路由菜单,从localStorage拿到路由,在创建路由时使用
export const dynamicRouterAdd = () => {
  let dynamicRouter = []
  let data = localRead('dynamicRouter')
  if (!data) {
    return dynamicRouter
  }
  dynamicRouter = filterAsyncRouter(JSON.parse(data))
  return dynamicRouter
}

// @函数: 遍历后台传来的路由字符串，转换为组件对象
export const filterAsyncRouter = (asyncRouterMap) => {
  const accessedRouters = asyncRouterMap.filter(route => {
    // 按钮不展示在菜单中
    if (route.method !== '') {
      return false
    }
    if (route.component) {
      if (route.component === 'Main') { // Main组件特殊处理
        route.component = Main
      } else if (route.component === 'parentView') { // parentView组件特殊处理
        route.component = parentView
      } else {
        // route.component = _import(route.component)
        route.component = lazyLoadingCop(route.component)
      }
    }
    let meta = {}
    // 给页面添加权限、标题、第三方网页链接
    meta.permTypes = route.permTypes ? route.permTypes : null
    meta.title = route.title ? route.title : null
    meta.icon = route.icon ? route.icon : 'order'
    meta.__titleIsFunction__ = true
    route.meta = meta
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}
