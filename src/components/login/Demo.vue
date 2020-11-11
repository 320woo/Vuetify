<template>
  <v-app class="demo">
    <v-layout align-center
              justify-center
              :style="{ backgroundImage: `url('${loginBackgroundImage}')`,
                        height: '100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover' }">
      <v-layout column
                justify-center
                align-center>
        <v-card class="login-card pa-4"
                height="440"
                :color="'rgb(44, 53, 87)'">
          <v-card-title primary-title
                        class="custom-title-center">
            <div class="login-title">드론을 활용한</div>
            <div class="login-title login-title-large">정밀농업 플랫폼</div>
          </v-card-title>
            <div style="height:48px"> </div>
            <v-card-actions>
              <v-layout row
                        align-center
                        justify-start
                        :style="{height: '138px', minHeight: '138px'}">
                <v-btn class="login-button white--text"
                       @click="onClickLoginAnalysis()"
                       primary
                       large
                       block>벼 시계열 분석
                </v-btn>
                <v-btn class="login-button white--text"
                       @click="onClickLoginLodging()"
                       primary
                       large
                       block>도복 검출
                </v-btn>
              </v-layout>
            </v-card-actions>
        </v-card>
      </v-layout>
    </v-layout>
  </v-app>
</template>

<script>
  import authAPI from '@/utils/api/authAPI'
  import ConfirmModal from '@/components/shared-components/ConfirmModal'
  import { mapActions } from 'vuex'

  export default {
    theme: {},
    data: () => {
      return {
        id: '',
        password: '',
        visiblePassword: false,
        isActiveLoginButton: false
      }
    },
    computed: {
      loginBackgroundImage() {
        return require('@/assets/login_background_img.png')
      }
    },
    methods: {
      ...mapActions([
        'openGlobalModal',
        'closeGlobalModal'
      ]),
      async onClickLogin(id, password, nextFunc) {
        const data = await authAPI.login(id.trim(), password.trim())
        if ('account_id' in data) {
          await this.$session.start()
          // await this.$session.set('jwt', data.accessToken)
          await this.$session.set('account_id', data.account_id)
          await this.$session.set('user_type', data.user_type)
          await this.$session.set('solar', data.account_id == 'solar')

          console.log(this.$session.get('account_id'), this.$session.get('user_type'))
          // this.$http.defaults.headers.common['Authorization'] = await this.$session.get('jwt')

          nextFunc()
        } else {
          console.log(data)
          this.openGlobalModal({
            modalTitle: '로그인 오류',
            modalContent: data.message
          })
        }
      },
      async onClickLoginAnalysis() {
        this.onClickLogin('neighbor21', '1234', () => {
          this.$router.push('/providerMap/064540ed-b1b7-4bb7-96b1-7b37d05ed906')
        })
      },
      async onClickLoginLodging() {
        this.onClickLogin('asiatech', '1234', () => {
          this.$router.push('providerMap/bba9efb1-b3f5-454e-a00b-3061deb86ca4/18df40ce-104b-4f63-bee8-52c42d765d53/320/62')
        })
      }
    },
    components: {
      'ConfirmModal': ConfirmModal
    }
  }
</script>

<style scoped>
  /* Vue-router Link 밑줄, 글씨색 제거*/

  .login-wrapper {
    background-image: url("/src/assets/login_background_img.png");
  }

  .custom-title-center {
    text-align: center;
    display: inline;
  }

  .login >>> .theme--light.v-input:not(.v-input--is-disabled) input,
  .theme--light.v-input:not(.v-input--is-disabled) textarea {
    font-family: NotoSansCJKkr;
    font-size: 15px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 2;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
  }

  .login-card {
    max-width: 480px;
    width: 100%;
    border-radius: 20px;
  }

  .login-title {
    font-family: NotoSansCJKkr;
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
  }

  .login-title-large {
    font-size: 30px;
  }

  .login-button {
    background: linear-gradient(to top right, #8671f2 0%, #f775b3 100%);
    height: 184px;
    min-height: 184px;
    max-height: 184px;
    border-radius: 20px;
    font-family: NotoSansCJKkr;
    font-size: 18px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
  }

  .login >>> .v-icon {
    color: #C6F76F
  }

  .login >>> .v-label {
    color: #C6F76F;
  }

  .login >>> .v-input {
    color: #C6F76F;
  }

  .login >>> .v-input__slot {
    background-color: rgba(26, 32, 55, 1.0);
  }

  .theme--light.v-text-field .v-input__slot:before {
    color: #C6F76F;
  }

  .create-account {
    margin-top: 16px;
    font-family: NotoSansCJKkr;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    cursor: pointer;
  }
</style>
