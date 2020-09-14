<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" @on-verify="loginVefify" v-bind:picPath="picPath"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import LoginForm from '_c/login-form'
  import { mapActions } from 'vuex'
  import { drawCodeImage, initCaptcha } from '@/api/user'
  import { initRouter } from '@/libs/router-util' // ①新增  引入动态菜单渲染
  export default {
    components: {
      LoginForm
    },
    data () {
      return {
        picPath: '',
        captchaId: ''
      }
    },
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      handleSubmit ({ userName, password, captchaCode }) {
        let captchaId = this.captchaId
        this.handleLogin({ userName, password, captchaId, captchaCode }).then(res => {
          this.getUserInfo().then(res => {
            initRouter(this)
            this.$router.push({
              name: this.$config.homeName
            })
          })
        })
      },
      loginVefify () {
        initCaptcha({}).then((ele) => {
          this.picPath = drawCodeImage + ele.data.captcha_id
          this.captchaId = ele.data.captcha_id
        })
      }
    },
    mounted () {
      this.loginVefify()
    }
  }
</script>

<style>

</style>
