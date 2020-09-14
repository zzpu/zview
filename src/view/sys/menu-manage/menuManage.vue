<style lang="less">
  @import "../../../styles/tree-common.less";
  @import "./menuManage.less";
</style>
<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button @click="addMenu" type="primary" icon="md-add">添加子节点</Button>
        <Button @click="delAll" icon="md-trash">批量删除</Button>
        <Dropdown @on-click="handleDropdown">
          <Button>
            更多操作
            <Icon type="md-arrow-dropdown"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="refresh">刷新</DropdownItem>
            <DropdownItem name="expandOne">收合所有</DropdownItem>
            <DropdownItem name="expandTwo">仅展开一级</DropdownItem>
            <DropdownItem name="expandThree">仅展开两级</DropdownItem>
            <DropdownItem name="expandAll">展开所有</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <i-switch v-model="strict" size="large" style="margin-left:5px">
          <span slot="open">级联</span>
          <span slot="close">单选</span>
        </i-switch>
      </Row>
      <Row type="flex" justify="start">
        <Col :md="8" :lg="8" :xl="6">
          <Alert show-icon>
            当前选择编辑：
            <span class="select-title">{{editTitle}}</span>
            <a class="select-clear" v-if="form.id" @click="cancelEdit">取消选择</a>
          </Alert>
          <Input
            v-model="searchKey"
            suffix="ios-search"
            @on-change="search"
            placeholder="输入菜单名搜索"
            clearable
          />
          <div class="tree-bar" :style="{maxHeight: maxHeight}">
            <Tree
              ref="tree"
              :data="data"
              show-checkbox
              :render="renderContent"
              @on-select-change="selectTree"
              @on-check-change="changeSelect"
              :check-strictly="!strict"
            ></Tree>
            <Spin size="large" fix v-if="loading"></Spin>
          </div>
        </Col>
        <Col :md="15" :lg="13" :xl="9" style="margin-left:10px;">
          <Form ref="form" :model="form" :label-width="110" :rules="formValidate">
            <FormItem label="类型" prop="type">
              <div v-show="form.type===-1">
                <Icon type="ios-navigate-outline" size="16" style="margin-right:5px;"></Icon>
                <span>顶部菜单</span>
              </div>
              <div v-show="form.type===0">
                <Icon type="ios-list-box-outline" size="16" style="margin-right:5px;"></Icon>
                <span>页面菜单</span>
              </div>
              <div v-show="form.type===1">
                <Icon type="md-radio-button-on" size="16" style="margin-right:5px;"></Icon>
                <span>操作按钮</span>
              </div>
            </FormItem>
            <FormItem label="名称" prop="title">
              <Input v-model="form.title"/>
            </FormItem>
            <FormItem label="名称" prop="title" v-if="form.type===1" class="block-tool">
              <Tooltip placement="right" content="操作按钮名称不得重复">
                <Input v-model="form.title"/>
              </Tooltip>
            </FormItem>
            <FormItem label="路径" prop="path" v-if="form.method==''">
              {{form.method}}
              <Input v-model="form.path"/>
            </FormItem>
            <FormItem label="请求路径" prop="path" v-if="form.method!=''" class="block-tool">
              <Tooltip
                placement="right"
                :max-width="430"
                transfer
                content="填写后端请求URL，后端将作权限拦截，若无可填写'无'或其他"
              >
                <Input v-model="form.path"/>
              </Tooltip>
            </FormItem>
            <FormItem label="请求方法" prop="method" v-if="form.method!=''">
              <Tooltip
                placement="right"
                :max-width="430"
                transfer
                content="选择按钮点击后请求的方法"
              >
                <Select v-model="form.method" placeholder="请选择或输入搜索" filterable>
                  <Option
                    v-for="(item, i) in [{title:'GET', value:'GET'},{title:'POST', value:'POST'},{title:'PUT', value:'PUT'},{title:'PATCH', value:'PATCH'},{title:'DELETE', value:'DELETE'}]"
                    :key="i"
                    :value="item.value"
                  >{{item.title}}
                  </Option>
                </Select>
              </Tooltip>

            </FormItem>
            <FormItem label="英文名" prop="name" class="block-tool">
              <Tooltip placement="right" content="需唯一">
                <Input v-model="form.name"/>
              </Tooltip>
            </FormItem>
            <FormItem label="图标" prop="icon" v-if="form.type===-1||form.type===0">
              <icon-choose v-model="form.icon"></icon-choose>
            </FormItem>
            <FormItem label="前端组件" prop="component" v-if="form.method===''">
              <Input v-model="form.component"/>
            </FormItem>
            <FormItem label="排序值" prop="sequence">
              <Tooltip trigger="hover" placement="right" content="值越大越靠前">
                <InputNumber :max="1000" :min="0" v-model="form.sequence"></InputNumber>
              </Tooltip>
            </FormItem>
            <FormItem label="始终显示" prop="show_status" v-if="form.method==''" class="block-tool">
              <i-switch size="large" v-model="form.show_status">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
              <Tooltip
                content="当设为不始终显示时，一级菜单下仅有一个子级菜单只会显示该子级菜单，避免用户多次点击"
                placement="right"
                transfer
                max-width="280"
                style="display: inline-block !important;"
              >
                <Icon
                  type="md-help-circle"
                  size="20"
                  color="#c5c5c5"
                  style="margin-left:10px;cursor:pointer;"
                />
              </Tooltip>
            </FormItem>
            <FormItem label="是否启用" prop="status">
              <i-switch size="large" v-model="form.status" :true-value="0" :false-value="-1">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
            <Form-item>
              <Button
                style="margin-right:5px"
                @click="submitEdit"
                :loading="submitLoading"
                type="primary"
                icon="ios-create-outline"
              >修改并保存
              </Button>
              <Button @click="handleReset">重置</Button>
            </Form-item>
          </Form>
        </Col>
      </Row>
    </Card>

    <Modal
      draggable
      :title="modalTitle"
      v-model="menuModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{top: '30px'}"
    >
      <Form ref="formAdd" :model="formAdd" :label-width="100" :rules="formValidate">
        <div v-if="showParent">
          <FormItem label="上级节点：">{{parentTitle}}</FormItem>
        </div>
        <FormItem label="类型" prop="type">
          <div v-show="formAdd.type===-1">
            <Icon type="ios-navigate-outline" size="16" style="margin-right:5px;"></Icon>
            <span>顶部菜单</span>
          </div>
          <div v-show="formAdd.type===0">
            <Icon type="ios-list-box-outline" size="16" style="margin-right:5px;"></Icon>
            <span>页面菜单</span>
          </div>
          <div v-show="formAdd.type===1">
            <Icon type="md-radio-button-on" size="16" style="margin-right:5px;"></Icon>
            <span>操作按钮</span>
          </div>
        </FormItem>
        <FormItem label="名称" prop="title" v-if="formAdd.type===-1||formAdd.type===0">
          <Input v-model="formAdd.title"/>
        </FormItem>
        <FormItem label="名称" prop="title" v-if="formAdd.type===1" class="block-tool">
          <Tooltip placement="right" content="操作按钮名称不得重复">
            <Input v-model="formAdd.title"/>
          </Tooltip>
        </FormItem>
        <FormItem label="路径" prop="path" v-if="formAdd.type===0">
          <Input v-model="formAdd.path"/>
        </FormItem>
        <FormItem label="请求路径" prop="path" v-if="formAdd.type===1" class="block-tool">
          <Tooltip
            placement="right"
            :max-width="230"
            transfer
            content="填写后端请求URL，后端将作权限拦截，若无可填写'无'或其他"
          >
            <Input v-model="formAdd.path"/>
          </Tooltip>
        </FormItem>
        <FormItem label="请求方法" prop="method" v-if="formAdd.type===1">
          <Select v-model="formAdd.method" placeholder="请选择或输入搜索" filterable clearable>
            <Option
              v-for="(item, i) in [{title:'GET', value:'GET'},{title:'POST', value:'POST'},{title:'PUT', value:'PUT'},{title:'PATCH', value:'PATCH'},{title:'DELETE', value:'DELETE'}]"
              :key="i"
              :value="item.value"
            >{{item.title}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="英文名" prop="name" class="block-tool">
          <Tooltip placement="right" content="需唯一">
            <Input v-model="formAdd.name"/>
          </Tooltip>
        </FormItem>
        <FormItem label="图标" prop="icon" v-if="formAdd.type===-1||formAdd.type===0">
          <icon-choose v-model="formAdd.icon"></icon-choose>
        </FormItem>
        <FormItem label="前端组件" prop="component" v-if="formAdd.type===0">
          <Input v-model="formAdd.component"/>
        </FormItem>
        <FormItem
          label="第三方链接"
          prop="url"
          v-if="formAdd.type===0&&formAdd.level===2"
          class="block-tool"
        >
          <Tooltip
            placement="right"
            content="前端组件需为 sys/monitor/monitor 时生效"
            max-width="300"
            transfer
          >
            <Input v-model="formAdd.url" placeholder="http://" @on-change="changeAddUrl"/>
          </Tooltip>
        </FormItem>
        <FormItem label="排序值" prop="sequence">
          <Tooltip trigger="hover" placement="right" content="值越大越靠前">
            <InputNumber :max="1000" :min="0" v-model="formAdd.sequence"></InputNumber>
          </Tooltip>
        </FormItem>
        <FormItem label="始终显示" prop="show_status" v-if="formAdd.level===1" class="block-tool">
          <i-switch size="large" :trueValue="1" :falseValue="2" v-model="formAdd.show_status">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <Tooltip
            content="当设为不始终显示时，一级菜单下仅有一个子级菜单只会显示该子级菜单，避免用户多次点击"
            placement="right"
            transfer
            max-width="280"
            style="display: inline-block !important;"
          >
            <Icon
              type="md-help-circle"
              size="20"
              color="#c5c5c5"
              style="margin-left:10px;cursor:pointer;"
            />
          </Tooltip>
        </FormItem>
        <FormItem label="是否启用" prop="status">
          <i-switch size="large" :trueValue="1" :falseValue="2" v-model="formAdd.status">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="menuModalVisible = false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitAdd">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    addMenus,
    editMenus,
    deleteMenus,
    searchMenus,
    getDictDataByType
  } from '@/api/index'
  import IconChoose from '@/zview/icon-choose'
  import { getMenuTreeList } from '../../../api'
  // import util from '@/libs/util.js'
  export default {
    name: 'menu-manage',
    components: {
      IconChoose
    },
    data () {
      return {
        loading: true,
        strict: true,
        maxHeight: '500px',
        expandLevel: 3,
        menuModalVisible: false,
        iconModalVisible: false,
        selectList: [],
        selectCount: 0,
        showParent: false,
        searchKey: '',
        parentTitle: '',
        editTitle: '',
        modalTitle: '',
        form: {
          id: '',
          title: '',
          component: '',
          name: '',
          sequence: 0,
          icon: '',
          path: '',
          parent_id: '',
          level: 0,
          show_status: 1,
          status: 0,
          method: '',
          type: 0,
          url: ''
        },
        iSwitch: {
          value: {
            type: Number,
            default: 1
          },
          trueValue: {
            type: Number,
            default: 1
          },
          falseValue: {
            type: Number,
            default: 2
          }
        },
        formAdd: {
          method: ''
        },
        formValidate: {
          title: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          name: [
            { required: true, message: '路由英文名不能为空', trigger: 'blur' }
          ],
          icon: [{ required: true, message: '图标不能为空', trigger: 'click' }],
          path: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
          component: [
            { required: true, message: '前端组件不能为空', trigger: 'blur' }
          ],
          sequence: [
            {
              required: true,
              type: 'number',
              message: '排序值不能为空',
              trigger: 'blur'
            }
          ]
        },
        submitLoading: false,
        data: [],
        dictPermissions: []
      }
    },
    methods: {
      init () {
        this.getAllList()
        // this.getDictPermissions()
      },
      getDictPermissions () {
        getDictDataByType('permission_type').then(res => {
          if (res.success) {
            this.dictPermissions = res.result
          }
        })
      },
      renderContent (h, { root, node, data }) {
        let icon = ''
        if (data.level === 0) {
          icon = 'ios-navigate'
        } else if (data.level === 1) {
          icon = 'ios-navigate'
        } else if (data.level === 2) {
          icon = 'md-list'
        } else if (data.level === 3) {
          icon = 'md-radio-button-on'
        } else {
          icon = 'md-radio-button-off'
        }
        return h('span', [
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
        ])
      },
      handleDropdown (name) {
        if (name === 'expandOne') {
          this.expandLevel = 1
          this.getAllList()
        } else if (name === 'expandTwo') {
          this.expandLevel = 2
          this.getAllList()
        } else if (name === 'expandThree') {
          this.expandLevel = 3
          this.getAllList()
        }
        if (name === 'expandAll') {
          this.expandLevel = 3
          this.getAllList()
        } else if (name === 'refresh') {
          this.getAllList()
        }
      },

      getAllList () {
        this.loading = true
        getMenuTreeList().then(res => {
          this.loading = false
          if (res.message === 'success') {
            // 仅展开指定级数 默认后端已展开所有
            let expandLevel = this.expandLevel
            this.expandNode(expandLevel, res.data.list)
            this.data = res.data.list
            console.log(this.data)
          }
        })
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
      search () {
        if (this.searchKey) {
          this.loading = true
          searchMenus({ title: this.searchKey }).then(res => {
            this.loading = false
            if (res.success) {
              this.data = res.result
            }
          })
        } else {
          this.getAllList()
        }
      },
      selectTree (v) {
        if (v.length > 0) {
          // 转换null为""
          for (let attr in v[0]) {
            if (v[0][attr] === null) {
              v[0][attr] = ''
            }
          }
          let str = JSON.stringify(v[0])
          let menu = JSON.parse(str)
          this.form = menu
          this.editTitle = menu.title
        } else {
          this.cancelEdit()
        }
      },
      cancelEdit () {
        let data = this.$refs.tree.getSelectedNodes()[0]
        if (data) {
          data.selected = false
        }
        this.$refs.form.resetFields()
        this.form.id = ''
        this.editTitle = ''
      },
      handleReset () {
        let type = this.form.type
        this.$refs.form.resetFields()
        this.form.icon = ''
        this.form.component = ''
        this.form.type = type
      },
      submitEdit () {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (!this.form.id) {
              this.$Message.warning('请先点击选择要修改的菜单节点')
              return
            }
            this.submitLoading = true
            if (this.form.sequence === null) {
              this.form.sequence = ''
            }
            if (this.form.method === null) {
              this.form.method = ''
            }
            if (this.form.type === 1) {
              this.form.name = ''
              this.form.icon = ''
              this.form.component = ''
            }
            editMenus(this.form).then(res => {
              this.submitLoading = false
              if (res.success) {
                this.$Message.success('编辑成功')
                // 标记重新获取菜单数据
                this.$store.commit('setAdded', false)
                // util.initRouter(this)
                this.init()
                this.menuModalVisible = false
              }
            })
          }
        })
      },
      submitAdd () {
        this.$refs.formAdd.validate(valid => {
          if (valid) {
            this.submitLoading = true
            if (this.formAdd.type === 1) {
              this.formAdd.icon = ''
              this.formAdd.component = ''
            }
            addMenus(this.formAdd).then(res => {
              this.submitLoading = false
              if (res.message === 'success') {
                this.$Message.success('添加成功')
                // 标记重新获取菜单数据
                this.$store.commit('setAdded', false)
                // util.initRouter(this)
                this.init()
                this.menuModalVisible = false
              }
            })
          }
        })
      },
      changeEditUrl (e) {
        let v = e.target.value
        if (v.indexOf('http') > -1) {
          this.form.component = 'sys/monitor/monitor'
        }
      },
      changeAddUrl (e) {
        let v = e.target.value
        if (v.indexOf('http') > -1) {
          this.formAdd.component = 'sys/monitor/monitor'
        }
      },
      addMenu: function () {
        if (!this.form.id) {
          this.$Message.warning('请先点击选择一个菜单权限节点')
          return
        }
        this.parentTitle = this.form.title
        this.modalTitle = '添加子节点(可拖动)'
        this.showParent = true
        let type = 0
        if (this.form.level === 1) {
          type = 0
        } else if (this.form.level === 2) {
          type = 1
        } else if (this.form.level === 3) {
          this.$Modal.warning({
            title: '抱歉，不能添加啦',
            content: '仅支持2级菜单目录'
          })
          return
        } else {
          type = 0
        }
        // let component = ''
        this.formAdd = {
          icon: '',
          type: type,
          parent_id: this.form.id,
          level: Number(this.form.level) + 1,
          sequence: 0,
          method: '',
          status: 1,
          show_status: 1
        }
        if (this.form.level === 0) {
          this.formAdd.path = '/'
          this.formAdd.component = 'Main'
        }
        this.menuModalVisible = true
      },
      changeSelect: function (v) {
        this.selectCount = v.length
        this.selectList = v
      },
      delAll: function () {
        if (this.selectCount <= 0) {
          this.$Message.warning('您还未勾选要删除的数据')
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
            deleteMenus(ids).then(res => {
              this.$Modal.remove()
              if (res.success) {
                this.$Message.success('删除成功')
                // 标记重新获取菜单数据
                this.$store.commit('setAdded', false)
                // util.initRouter(this)
                this.selectList = []
                this.selectCount = 0
                this.cancelEdit()
                this.init()
              }
            })
          }
        })
      }
    },
    mounted () {
      // 计算高度
      let height = document.documentElement.clientHeight
      this.maxHeight = Number(height - 287) + 'px'
      this.init()
    }
  }
</script>
