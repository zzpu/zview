<template>
  <div class="user-edit">
    <!-- Drawer抽屉 -->
    <Modal :title="title" v-model="visible" width="720" draggable :mask-closable="type==='0'">
      <div :style="{maxHeight: maxHeight}" class="drawer-content">
        <div class="user-title">
          <div class="info-title">基本信息</div>
          <Avatar :src="form.avatar" size="large" v-show="type!='2'"/>
        </div>
        <Form label-colon v-show="type!='2'">
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="用户ID">
                {{form.id}}
                <Tooltip trigger="hover" placement="right" content="账户已禁用">
                  <Icon
                    v-show="form.status===-1"
                    type="md-lock"
                    size="18"
                    style="margin-left:10px;cursor:pointer"
                  />
                </Tooltip>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="用户名">
                {{form.user_name}}
                <Tooltip trigger="hover" placement="right" :content="`密码强度：${form.passStrength}`">
                  <Icon
                    v-show="form.passStrength"
                    type="md-key"
                    :color="passColor"
                    size="18"
                    style="margin-left:10px;cursor:pointer"
                  />
                </Tooltip>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Form ref="form" :model="form" :rules="formValidate" label-position="top">
          <Row :gutter="32" v-if="type==='2'">
            <Col span="12">
              <FormItem label="用户名" prop="user_name">
                <Input v-model="form.user_name" autocomplete="off" :maxlength="16"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="密码" prop="password">
                <SetPassword v-model="form.password" @on-change="changePass"/>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="真实姓名" prop="real_name">
                <Input v-model="form.real_name"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="邮箱" prop="email">
                <Input v-model="form.email"/>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="手机号" prop="phone">
                <Input v-model="form.phone"/>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="用户类型">
                <Select v-model="form.type" placeholder="请选择">
                  <Option :value="0">普通用户</Option>
                  <Option :value="1">管理员</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="头像">
                <upload-pic-input v-model="form.avatar"></upload-pic-input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="角色分配" prop="roleIds">
                <Select v-model="form.roleIds" multiple>
                  <Option
                    v-for="item in roleList"
                    :value="item.id"
                    :key="item.id"
                    :label="item.name"
                  >
                    <span style="margin-right:10px;">{{ item.name }}</span>
                    <span style="color:#ccc;">{{ item.description }}</span>
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Divider/>
        </Form>
      </div>
      <div class="drawer-footer br" v-show="type!='0'">
        <Button type="primary" :loading="submitLoading" @click="submit">提交</Button>
        <Button @click="visible = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getAllRoleList, addUser, editUser } from '@/api/index'
  import {
    validateUsername,
    validateMobile,
    validatePassword
  } from '@/libs/validate'
  import uploadPicInput from '@/zview/upload-pic-input'
  import SetPassword from '@/zview/set-password'

  export default {
    name: 'user',
    components: {
      uploadPicInput,
      SetPassword
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object
      },
      type: {
        type: String,
        default: '0'
      }
    },
    data () {
      return {
        visible: this.value,
        title: '',
        passColor: '',
        submitLoading: false,
        maxHeight: 510,
        form: {
          id: 0,
          email: 'dfsfsdfg@qq.com',
          user_name: 'aaa',
          real_name: 'aaa',
          phone: '15887745688',
          password: '123456',
          type: 1,
          avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600023701136&di=a6ebbc4093d095d1f863e86203f825ea&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F22%2F59%2F19300001325156131228593878903.jpg'
        },
        formValidate: {
          // 表单验证规则
          user_name: [
            { required: true, message: '请输入登录账号', trigger: 'blur' },
            { validator: validateUsername, trigger: 'blur' }
          ],
          real_name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur' }
          ],
          roleIds: [
            { required: true, message: '用户角色不能为空!', trigger: 'change', type: 'array' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '邮箱格式不正确' }
          ]
        },
        roleList: []
      }
    },
    methods: {
      init () {
        this.getRoleList()
      },
      getRoleList () {
        getAllRoleList().then(res => {
          if (res.message === 'success') {
            this.roleList = res.data.list
          }
        })
      },

      changePass (v, grade, strength) {
        this.form.passStrength = strength
      },
      submit () {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (typeof this.form.birth === 'object') {
              this.form.birth = this.format(this.form.birth, 'yyyy-MM-dd')
            }
            let userroles = []
            this.form.roleIds.forEach(function (e) {
              userroles.push({ role_id: e })
            })

            let newuser = {
              user_name: this.form.user_name,
              real_name: this.form.real_name,
              password: this.form.password,
              phone: this.form.phone,
              email: this.form.email,
              avatar: this.form.avatar,
              type: this.form.type,
              user_roles: userroles
            }
            if (this.type === '1') {
              // 编辑

              newuser.id = this.form.id
              this.submitLoading = true
              editUser(newuser).then(res => {
                this.submitLoading = false
                if (res.message === 'success') {
                  this.$Message.success('操作成功')
                  this.$emit('on-submit', true)
                  this.visible = false
                }
              })
            } else {
              // 添加
              this.submitLoading = true
              addUser(newuser).then(res => {
                this.submitLoading = false
                if (res.message === 'success') {
                  this.$Message.success('操作成功')
                  this.$emit('on-submit', true)
                  this.visible = false
                }
              })
            }
          }
        })
      },
      setCurrentValue (value) {
        if (value === this.visible) {
          return
        }
        if (this.type === '1') {
          this.title = '编辑用户'
          this.maxHeight = Number(document.documentElement.clientHeight - 121) + 'px'
        } else if (this.type === '2') {
          this.title = '添加用户'
          this.maxHeight = Number(document.documentElement.clientHeight - 121) + 'px'
        } else {
          this.title = '用户详情'
          this.maxHeight = '100%'
        }
        // 清空数据
        this.$refs.form.resetFields()
        if (this.type === '0' || this.type === '1') {
          // 回显数据
          let data = this.data
          // 角色
          let selectRolesId = []
          data.roles.forEach(function (e) {
            selectRolesId.push(e.id)
          })
          data.roleIds = selectRolesId
          delete data.roles
          delete data.permissions
          // 密码强度
          if (data.passStrength === '弱') {
            this.passColor = '#ed3f14'
          } else if (data.passStrength === '中') {
            this.passColor = '#faad14'
          } else if (data.passStrength === '强') {
            this.passColor = '#52c41a'
          }
          // 回显
          this.form = data
        } else {
          // 添加
          // $refs 是一个对象，持有已注册过 ref 的所有的子组件。
          // this.$refs.depTree.setData('', '')
        }
        this.visible = value
      }
    },
    watch: {
      value (val) {
        this.setCurrentValue(val)
      },
      visible (value) {
        this.$emit('input', value)
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style lang="less">
  @import "../../../styles/table-common.less";

  .drawer-content {
    overflow: auto;
  }

  .drawer-content::-webkit-scrollbar {
    display: none;
  }

  .user-title {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .info-title {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      display: block;
      margin-right: 16px;
    }
  }

  .info-header {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    display: block;
    margin-bottom: 16px;
  }
</style>
