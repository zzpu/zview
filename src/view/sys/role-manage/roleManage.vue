<style lang="less">
  @import "../../../styles/table-common.less";
  @import "./roleManage.less";
</style>
<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button @click="addRole" type="primary" icon="md-add">添加角色</Button>
        <Button @click="delAll" icon="md-trash">批量删除</Button>
        <Button @click="init" icon="md-refresh">刷新</Button>
        <Button type="dashed" @click="openTip=!openTip">{{openTip ? '关闭提示' : '开启提示'}}</Button>
      </Row>
      <Row v-show="openTip">
        <Alert show-icon>
          已选择
          <span class="select-count">{{selectCount}}</span> 项
          <a class="select-clear" @click="clearSelectAll">清空</a>
        </Alert>
      </Row>
      <Row>
        <Table
          :loading="loading"
          border
          :columns="columns"
          :data="data"
          ref="table"
          sortable="custom"
          @on-sort-change="changeSort"
          @on-selection-change="changeSelect"
        ></Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page
          :current="pageNumber"
          :total="total"
          :page-size="pageSize"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10,20,50]"
          size="small"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </Row>
    </Card>

    <!-- 编辑 -->
    <Modal :title="modalTitle" v-model="roleModalVisible" :mask-closable="false" :width="500">
      <Form ref="roleForm" :model="roleForm" :label-width="80" :rules="roleFormValidate">
        <FormItem label="角色名称" prop="name">
          <Input v-model="roleForm.name" placeholder="按照Spring Security约定建议以‘ROLE_’开头"/>
        </FormItem>
        <FormItem label="备注" prop="memo">
          <Input v-model="roleForm.memo"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelRole">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitRole">提交</Button>
      </div>
    </Modal>
    <!-- 菜单权限 -->
    <Modal
      :title="modalTitle"
      v-model="permModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{top: '30px'}"
      class="permModal"
    >
      <div style="position:relative">
        <Tree
          ref="tree"
          :data="menusData"
          show-checkbox
          :render="renderContent"
          :check-strictly="true"
        ></Tree>
        <Spin size="large" fix v-if="treeLoading"></Spin>
      </div>
      <div slot="footer">
        <Button type="text" @click="cancelPermEdit">取消</Button>
        <Select
          v-model="expandLevel"
          @on-change="changeOpen"
          style="width:110px;text-align:left;margin-right:10px"
        >
          <Option value="0">展开所有</Option>
          <Option value="1">收合所有</Option>
          <Option value="2">仅展开一级</Option>
          <Option value="3">仅展开两级</Option>
        </Select>
        <Button @click="selectTreeAll">全选/反选</Button>
        <Button type="primary" :loading="submitPermLoading" @click="submitPermEdit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    getRoleList,
    getMenuTreeList,
    getRole,
    addRole,
    editRole,
    deleteRole,
    setDefaultRole,
    editRolePerm,
    loadDepartment
  } from '@/api/index'

  import { initRouter } from '@/libs/router-util.js'

  export default {
    name: 'role-manage',
    data () {
      return {
        openTip: true,
        expandLevel: 3,
        loading: true,
        treeLoading: true,
        depTreeLoading: true,
        submitPermLoading: false,
        searchKey: '',
        sortColumn: 'created_at',
        sortType: 'desc',
        modalType: 0,
        roleModalVisible: false,
        permModalVisible: false,
        depModalVisible: false,
        modalTitle: '',
        roleForm: {
          id: 0,
          name: '',
          memo: '',
          role_menus: {}
        },
        roleFormValidate: {
          name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
        },
        submitLoading: false,
        selectList: [],
        selectCount: 0,
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '角色名称',
            key: 'name',
            width: 250,
            sortable: true
          },
          {
            title: '备注',
            key: 'memo',
            minWidth: 150,
            sortable: true
          },
          {
            title: '创建时间',
            key: 'created_at',
            render: (h, params) => {
              var moment = require('moment')
              return h(
                'div',
                moment(params.row.created_at).format('YYYY-MM-DD HH:mm:ss')
              )
            },
            width: 270,
            sortable: true,
            sortType: 'desc'
          },
          {
            title: '更新时间',
            key: 'updated_at',
            render: (h, params) => {
              var moment = require('moment')
              return h(
                'div',
                moment(params.row.updated_at).format('YYYY-MM-DD HH:mm:ss')
              )
            },
            width: 270,
            sortable: true
          },
          {
            title: '是否设置为新用户默认角色',
            key: 'defaultRole',
            align: 'center',
            width: 220,
            render: (h, params) => {
              if (params.row.defaultRole) {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'success',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.cancelDefault(params.row)
                        }
                      }
                    },
                    '取消默认'
                  )
                ])
              } else {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'info',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.setDefault(params.row)
                        }
                      }
                    },
                    '设为默认'
                  )
                ])
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editPerm(params.row)
                      }
                    }
                  },
                  '菜单权限'
                ),
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.edit(params.row)
                      }
                    }
                  },
                  '编辑'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.remove(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        ],
        data: [],
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        menusData: [], // 所有菜单权限
        editRolePermId: '',
        editRole: {},
        selectAllFlag: false,
        depData: [],
        dataType: 0,
        editDepartments: []
      }
    },
    methods: {
      init () {
        this.getRoleList()
        // 获取所有菜单权限树
        this.getPermList()
      },
      renderContent (h, { root, node, data }) {
        let icon = ''
        if (data.level === 0) {
          icon = 'ios-navigate'
        } else if (data.level === 1) {
          icon = 'md-list-box'
        } else if (data.level === 2) {
          icon = 'md-list'
        } else if (data.level === 3) {
          icon = 'md-radio-button-on'
        } else {
          icon = 'md-radio-button-off'
        }
        return h(
          'span',
          {
            style: {
              display: 'inline-block',
              cursor: 'pointer'
            },
            on: {
              click: () => {
                data.checked = !data.checked
              }
            }
          },
          [
            h('span', [
              h('Icon', {
                props: {
                  type: icon,
                  size: '16'
                },
                style: {
                  'margin-right': '8px',
                  'margin-bottom': '3px'
                }
              }),
              h('span', data.title)
            ])
          ]
        )
      },
      changePage (v) {
        this.pageNumber = v
        this.getRoleList()
        this.clearSelectAll()
      },
      changePageSize (v) {
        this.pageSize = v
        this.getRoleList()
      },
      changeSort (e) {
        this.sortColumn = e.key
        this.sortType = e.order
        if (e.order === 'normal') {
          this.sortType = ''
        }
        this.getRoleList()
      },
      getRoleList () {
        this.loading = true
        let params = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          sort: this.sortColumn,
          order: this.sort
        }
        getRoleList(params).then(res => {
          this.loading = false
          if (res.message === 'success') {
            this.data = res.data.list
            this.total = res.data.pagination.total
          }
        })
      },
      getPermList () {
        this.treeLoading = true
        getMenuTreeList().then(res => {
          if (res.message === 'success') {
            this.deleteDisableNode(res.data.list)
            this.expandNode(3, res.data.list)
            // // 添加 checked 属性
            // this.checkPermTree(res.data.list, [])
            // 菜单赋值
            this.menusData = res.data.list
            this.treeLoading = false
          }
          this.treeLoading = false
        })
      },
      // 递归标记禁用节点
      deleteDisableNode (menusData) {
        let that = this
        menusData.forEach(function (e) {
          if (e.status === -1) {
            e.title = '[已禁用] ' + e.title
            e.disabled = true
          }
          if (e.children && e.children.length > 0) {
            that.deleteDisableNode(e.children)
          }
        })
      },
      cancelRole () {
        this.roleModalVisible = false
      },
      submitRole () {
        this.$refs.roleForm.validate(valid => {
          if (valid) {
            if (this.modalType === 0) {
              // 添加
              this.submitLoading = true
              const data = {
                name: this.roleForm.name,
                memo: this.roleForm.memo,
                status: 1
              }
              addRole(data).then(res => {
                this.submitLoading = false
                if (res.message === 'success') {
                  this.$Message.success('操作成功')
                  this.getRoleList()
                  this.roleModalVisible = false
                }
              })
            } else {
              this.submitLoading = true
              // 修改name和memo
              this.editRole.name = this.roleForm.name
              this.editRole.memo = this.roleForm.memo
              editRole(this.editRole).then(res => {
                this.submitLoading = false
                if (res.message === 'success') {
                  this.$Message.success('操作成功')
                  this.getRoleList()
                  this.roleModalVisible = false
                }
              })
            }
          }
        })
      },
      addRole () {
        this.modalType = 0
        this.modalTitle = '添加角色'
        this.$refs.roleForm.resetFields()
        delete this.roleForm.id
        this.roleModalVisible = true
      },
      edit (v) {
        this.modalType = 1
        this.modalTitle = '编辑角色'
        this.$refs.roleForm.resetFields()
        getRole(v.id).then(res => {
          if (res.message === 'success') {
            this.editRole = res.data
            // 转换null为""
            for (let attr in v) {
              if (v[attr] === null) {
                v[attr] = ''
              }
            }
            let str = JSON.stringify(v)
            let roleInfo = JSON.parse(str)
            this.roleForm = roleInfo
            this.roleModalVisible = true
          }
        })
      },
      remove (v) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '您确认要删除角色 ' + v.name + ' ?',
          loading: true,
          onOk: () => {
            deleteRole(v.id).then(res => {
              this.$Modal.remove()
              if (res.message === 'success') {
                this.$Message.success('删除成功')
                this.getRoleList()
              }
            })
          }
        })
      },
      setDefault (v) {
        this.$Modal.confirm({
          title: '确认设置',
          content: '您确认要设置所选的 ' + v.name + ' 为注册用户默认角色?',
          loading: true,
          onOk: () => {
            let params = {
              id: v.id,
              isDefault: true
            }
            setDefaultRole(params).then(res => {
              this.$Modal.remove()
              if (res.success) {
                this.$Message.success('操作成功')
                this.getRoleList()
              }
            })
          }
        })
      },
      cancelDefault (v) {
        this.$Modal.confirm({
          title: '确认取消',
          content: '您确认要取消所选的 ' + v.name + ' 角色为默认?',
          loading: true,
          onOk: () => {
            let params = {
              id: v.id,
              isDefault: false
            }
            setDefaultRole(params).then(res => {
              this.$Modal.remove()
              if (res.success) {
                this.$Message.success('操作成功')
                this.getRoleList()
              }
            })
          }
        })
      },
      clearSelectAll () {
        this.$refs.table.selectAll(false)
      },
      changeSelect (e) {
        this.selectList = e
        this.selectCount = e.length
      },
      delAll () {
        if (this.selectCount <= 0) {
          this.$Message.warning('您还未选择要删除的数据')
          return
        }
        this.$Modal.confirm({
          title: '确认删除',
          content: '您确认要删除所选的 ' + this.selectCount + ' 条数据?',
          loading: true,
          onOk: () => {
            let ids = ''
            this.selectList.forEach(function (e) {
              ids += e.id + ','
            })
            ids = ids.substring(0, ids.length - 1)
            deleteRole(ids).then(res => {
              this.$Modal.remove()
              if (res.message === 'success') {
                this.$Message.success('删除成功')
                this.clearSelectAll()
                this.getRoleList()
              }
            })
          }
        })
      },
      editPerm (v) {
        this.permModalVisible = true
        this.editRolePermId = v.id
        this.modalTitle = '分配 ' + v.name + ' 的菜单权限'
        // 匹配勾选
        let rolePerms = []
        // 对象深度拷贝,否则
        let allMenus = JSON.parse(JSON.stringify(this.menusData))
        rolePerms = v.role_menus
        this.editRole = v
        if (this.treeLoading) {
          this.$Message.warning('菜单权限数据加载中，请稍后点击查看')
          return
        }
        // 递归判断子节点
        this.checkPermTree(allMenus, rolePerms)
        this.expandNode(this.expandLevel, allMenus)
        // 重新赋值回去
        this.menusData = allMenus
        //
      },
      // 递归标记展开节点
      expandNode (level, menuData) {
        let that = this
        menuData.forEach(function (e) {
          if (e.level < level) {
            e.expand = true
          } else {
            e.expand = false
          }
          if (e.children && e.children.length > 0) {
            that.expandNode(level, e.children)
          }
        })
      },
      // 递归判断子节点
      checkPermTree (menusData, rolePerms) {
        let that = this
        menusData.forEach(function (p) {
          if (that.hasPerm(p, rolePerms) && p.status !== -1) {
            p.checked = true
          } else {
            p.checked = false
          }
          if (p.children && p.children.length > 0) {
            that.checkPermTree(p.children, rolePerms)
          }
        })
      },
      // 判断角色拥有的权限节点勾选
      hasPerm (p, rolePerms) {
        let flag = false
        for (let i = 0; i < rolePerms.length; i++) {
          if (p.id === rolePerms[i].menu_id) {
            flag = true
            break
          }
        }
        if (flag) {
          return true
        }
        return false
      },
      // 全选反选
      selectTreeAll () {
        this.selectAllFlag = !this.selectAllFlag
        let select = this.selectAllFlag
        this.selectedTreeAll(this.menusData, select)
      },
      // 递归全选节点
      selectedTreeAll (menusData, select) {
        let that = this
        menusData.forEach(function (e) {
          e.checked = select
          if (e.children && e.children.length > 0) {
            that.selectedTreeAll(e.children, select)
          }
        })
      },
      submitPermEdit () {
        this.submitPermLoading = true
        let role_menus = []
        let selectedNodes = this.$refs.tree.getCheckedNodes()
        let editRole = this.editRole
        selectedNodes.forEach(function (e) {
          let role_menu = {}
          role_menu.role_id = editRole.id
          role_menu.menu_id = e.id
          role_menus.push(role_menu)
        })

        editRole.role_menus = role_menus
        editRolePerm(this.editRolePermId, editRole).then(res => {
          this.submitPermLoading = false
          if (res.message === 'success') {
            this.$Message.success('操作成功')
            // 标记重新获取菜单数据
            this.$store.commit('setAdded', false)
            initRouter(this)
            this.getRoleList()
            this.permModalVisible = false
          }
        })
      },
      cancelPermEdit () {
        this.permModalVisible = false
      },
      loadData (item, callback) {
        loadDepartment(item.id, { openDataFilter: false }).then(res => {
          if (res.success) {
            res.result.forEach(function (e) {
              e.selected = false
              if (e.isParent) {
                e.loading = false
                e.children = []
              }
              if (e.status === -1) {
                e.title = '[已禁用] ' + e.title
                e.disabled = true
              }
            })
            callback(res.result)
          }
        })
      },
      changeOpen (v) {
        if (v === '0') {
          this.expandLevel = 4
          this.expandNode(this.expandLevel, this.menusData)
        } else if (v === '1') {
          this.expandLevel = 1
          this.expandNode(this.expandLevel, this.menusData)
        } else if (v === '2') {
          this.expandLevel = 2
          this.expandNode(this.expandLevel, this.menusData)
        } else if (v === '3') {
          this.expandLevel = 3
          this.expandNode(this.expandLevel, this.menusData)
        }
      }
    },
    mounted () {
      this.init()
    }
  }
</script>
