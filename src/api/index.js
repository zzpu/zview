// 统一请求路径前缀在libs/axios.js中修改
import {
  getRequest,
  postRequest,
  deleteRequest,
  patchRequest,
  putBodyRequest,
  postBodyRequest,
  getNoAuthRequest,
  postNoAuthRequest
} from '@/libs/axios'

// 文件上传接口
export const uploadFile = '/zmang/upload/file'
// 验证码渲染图片接口
export const drawCodeImage = '/zmang/v1/pub/login/captcha?id='
// 获取菜单
export const getMenuList = '/zmang/v1/pub/current/menutree'
// 获取数据字典
export const getDictData = '/zmang/dictData/getByType/'

// 登陆
export const login = (params) => {
  return postNoAuthRequest('/v1/pgit ub/login', params)
}
// 获取用户登录信息
export const userInfo = (params) => {
  return getRequest('/v1/pub/current/user', params)
}
// 注册
export const regist = (params) => {
  return postNoAuthRequest('/user/regist', params)
}
// 初始化验证码
export const initCaptcha = (params) => {
  return getNoAuthRequest('/v1/pub/login/captchaid', params)
}
// IP天气信息
export const ipInfo = (params) => {
  return getRequest('/common/ip/info', params)
}
// 个人中心编辑
export const userInfoEdit = (params) => {
  return postRequest('/user/edit', params)
}
// 个人中心修改密码
export const changePass = (params) => {
  return postRequest('/user/modifyPass', params)
}
// 解锁
export const unlock = (params) => {
  return postRequest('/users/unlock', params)
}

// 获取用户数据 多条件
export const getUserListData = (params) => {
  return getRequest('/users', params)
}
// 通过用户名搜索
export const searchUserByName = (username, params) => {
  return getRequest('/users/searchByName/' + username, params)
}
// 获取全部用户数据
export const getAllUserData = (params) => {
  return getRequest('/users/getAll', params)
}
// 通过部门获取全部用户数据
export const getUserByDepartmentId = (id, params) => {
  return getRequest(`/user/getByDepartmentId/${id}`, params)
}
// 添加用户
export const addUser = (params) => {
  return postBodyRequest('/users', params)
}
// 编辑用户
export const editUser = (params) => {
  return putBodyRequest(`/users/${params.id}`, params)
}
// 启用用户
export const enableUser = (id, params) => {
  return patchRequest(`/users/${id}/enable`, params)
}
// 禁用用户
export const disableUser = (id, params) => {
  return patchRequest(`/users/${id}/disable`, params)
}
// 删除用户
export const deleteUser = (id) => {
  return deleteRequest(`/users/${id}`)
}
// 重置用户密码
export const resetUserPass = (params) => {
  return postRequest('/user/resetPass', params)
}

// 获取全部角色数据
export const getAllRoleList = (params) => {
  return getRequest('/roles', params)
}
// 分页获取角色数据
export const getRoleList = (params) => {
  return getRequest('/roles', params)
}
// 添加角色
export const addRole = (params) => {
  return postBodyRequest('/roles', params)
}
// 编辑角色
export const editRole = (params) => {
  return putBodyRequest(`/roles/${params.id}`, params)
}
// 获取特定角色
export const getRole = (id) => {
  return getRequest('/roles/' + id, id)
}
// 设为或取消注册角色
export const setDefaultRole = (params) => {
  return postRequest('/role/setDefault', params)
}
// 分配角色权限
export const editRolePerm = (id, params) => {
  return putBodyRequest('/roles/' + id, params)
}
// 分配角色数据权限
export const editRoleDep = (params) => {
  return postRequest('/role/editRoleDep', params)
}
// 删除角色
export const deleteRole = (id) => {
  return deleteRequest(`/roles/${id}`)
}

// 获取全部权限数据
export const getMenuTreeList = (params) => {
  return getRequest('/menus.tree', params)
}
// 添加权限
export const addMenus = (params) => {
  return postBodyRequest('/menus', params)
}
// 编辑权限
export const editMenus = (params) => {
  return putBodyRequest(`/menus/${params.id}`, params)
}
// 删除权限
export const deleteMenus = (ids) => {
  return deleteRequest(`/menus/${ids}`)
}
// 搜索权限
export const searchMenus = (params) => {
  return getRequest('/menus/search', params)
}

// 获取全部字典
export const getAllDictList = (params) => {
  return getRequest('/dict/getAll', params)
}
// 添加字典
export const addDict = (params) => {
  return postRequest('/dict/add', params)
}
// 编辑字典
export const editDict = (params) => {
  return postRequest('/dict/edit', params)
}
// 删除字典
export const deleteDict = (params) => {
  return postRequest('/dict/delByIds', params)
}
// 搜索字典
export const searchDict = (params) => {
  return getRequest('/dict/search', params)
}
// 获取全部字典数据
export const getAllDictDataList = (params) => {
  return getRequest('/dictData/getByCondition', params)
}
// 添加字典数据
export const addDictData = (params) => {
  return postRequest('/dictData/add', params)
}
// 编辑字典数据
export const editDictData = (params) => {
  return postRequest('/dictData/edit', params)
}
// 删除字典数据
export const deleteData = (params) => {
  return postRequest('/dictData/delByIds', params)
}
// 通过类型获取字典数据
export const getDictDataByType = (type, params) => {
  return getRequest(`/dictData/getByType/${type}`, params)
}

// 分页获取日志数据
export const getLogListData = (params) => {
  return getRequest('/log/getAllByPage', params)
}
// 删除日志
export const deleteLog = (params) => {
  return postRequest('/log/delByIds', params)
}
// 清空日志
export const deleteAllLog = (params) => {
  return postRequest('/log/delAll', params)
}

// 分页获取Redis数据
export const getRedisData = (params) => {
  return getRequest('/redis/getAllByPage', params)
}
// 通过key获取Redis信息
export const getRedisByKey = (key, params) => {
  return getRequest(`/redis/getByKey/${key}`, params)
}
// 获取Redis键值数量
export const getRedisKeySize = (params) => {
  return getRequest('/redis/getKeySize', params)
}
// 获取Redis内存
export const getRedisMemory = (params) => {
  return getRequest('/redis/getMemory', params)
}
// 获取Redis信息
export const getRedisInfo = (params) => {
  return getRequest('/redis/info', params)
}
// 添加编辑Redis
export const saveRedis = (params) => {
  return postRequest('/redis/save', params)
}
// 删除Redis
export const deleteRedis = (params) => {
  return postRequest('/redis/delByKeys', params)
}
// 清空Redis
export const deleteAllRedis = (params) => {
  return postRequest('/redis/delAll', params)
}

// 分页获取定时任务数据
export const getQuartzListData = (params) => {
  return getRequest('/quartzJob/getAllByPage', params)
}
// 添加定时任务
export const addQuartz = (params) => {
  return postRequest('/quartzJob/add', params)
}
// 编辑定时任务
export const editQuartz = (params) => {
  return postRequest('/quartzJob/edit', params)
}
// 暂停定时任务
export const pauseQuartz = (params) => {
  return postRequest('/quartzJob/pause', params)
}
// 恢复定时任务
export const resumeQuartz = (params) => {
  return postRequest('/quartzJob/resume', params)
}
// 删除定时任务
export const deleteQuartz = (params) => {
  return postRequest('/quartzJob/delByIds', params)
}

// base64上传
export const base64Upload = (params) => {
  return postRequest('/upload/file', params)
}
