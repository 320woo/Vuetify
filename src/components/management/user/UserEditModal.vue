<template>
  <base-modal>
    <div slot="title"
         class="headline">사용자 정보 수정
    </div>
    <v-container slot="content"
                 grid-list-md>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field label="ID"
                        v-model="getEditUser.account_id"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
        <!--<v-flex xs12>-->
          <!--<v-text-field label="비밀번호"-->
                        <!--v-model="getEditUser.password"-->
                        <!--:append-icon="showText ? 'visibility_off' : 'visibility'"-->
                        <!--:rules="[rules.required, rules.min]"-->
                        <!--:type="showText ? 'text' : 'password'"-->
                        <!--hint="4글자 이상 입력해주세요."-->
                        <!--counter-->
                        <!--@click:append="showText = !showText">-->
          <!--</v-text-field>-->
        <!--</v-flex>-->
        <v-flex xs12>
          <v-text-field label="이메일"
                        v-model="getEditUser.email"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="이름"
                        v-model="getEditUser.full_name"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn slot="custom-button"
           color="blue darken-1"
           flat
           @click="onClickUpdatePassword()">
      비밀번호 변경
    </v-btn>
    <v-btn slot="negative-button"
           color="blue darken-1"
           flat
           @click="CLOSE_MODAL_USER">
      닫기
    </v-btn>
    <v-btn slot="positive-button"
           color="blue darken-1"
           flat
           @click="onClickConfirm()">
      수정
    </v-btn>
  </base-modal>
</template>

<script>
  import BaseComponent from '@/components/shared-components/BaseComponent.vue'
  import BaseModal from '@/components/shared-components/BaseModal'
  import {mapActions, mapGetters, mapMutations} from 'vuex'

  export default {
    extends: BaseComponent,
    props: [],
    data: () => ({
      showText: false,
      rules: {
        required: value => !!value || '필수 입력',
        min: v => v.length >= 4 || 'Min 4 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || '이메일 형식이 올바르지 않습니다.'
        }
      }
    }),
    computed: {
      ...mapGetters([
        'getEditUser'
      ])
    },
    methods: {
      ...mapMutations([
        'CLOSE_MODAL_USER',
        'OPEN_EDIT_PASSWORD_MODAL_USER'
      ]),
      ...mapActions([
        'requestUpdateUser',
        'openGlobalModal'
      ]),
      async onClickConfirm() {
        if (await this._validAccessToken() === true) {
          this._updateUser()
        } else {
          this.openGlobalModal({})
        }
      },
      async onClickUpdatePassword() {
        await this.CLOSE_MODAL_USER()
        await this.OPEN_EDIT_PASSWORD_MODAL_USER()
      },
      // UpdateUser
      _updateUser() {
        this.getEditUser.account_id = this.getEditUser.account_id.trim()
        // this.getEditUser.password = this.getEditUser.password.trim()
        this.requestUpdateUser(this.getEditUser)
        this.CLOSE_MODAL_USER()
      },
    },
    components: {
      'BaseModal': BaseModal
    }
  }

</script>

<style scoped>

</style>
