<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="imgCode">
      <Input
        v-model="form.captchaCode"
        name="logVerify"
        placeholder="请输入验证码"
        style="width:50%"
      />
      <div style="width:45%;height: 50px;float: right !important;">
        <!--        <Spin v-if="loadingCaptcha" fix></Spin>-->
        <Img
          :src="picPath"
          alt="加载验证码失败"
          @click="$emit('on-verify')"
          style="width:120px;cursor:pointer;display:block"
        />
      </div>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>

  import './login-form.css'

  export default {
    name: 'LoginForm',
    props: {
      userNameRules: {
        type: Array,
        default: () => {
          return [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ]
        }
      },
      passwordRules: {
        type: Array,
        default: () => {
          return [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      },
      picPath: ''
    },
    data () {
      return {
        loadingCaptcha: true,
        form: {
          captchaCode: '',
          userName: 'root',
          password: '123456'
        }
      }
    },
    computed: {
      rules () {
        return {
          userName: this.userNameRules,
          password: this.passwordRules
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$emit('on-success-valid', {
              userName: this.form.userName,
              password: this.form.password,
              captchaCode: this.form.captchaCode
            })
          }
        })
      }
    }

  }
</script>
