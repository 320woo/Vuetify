<template>
  <base-modal>
    <div slot="title"
         class="headline">비밀번호 변경
    </div>
    <v-container slot="content"
                 grid-list-md>
      <v-layout wrap>
        <!--{{ getEditUser.account_id }}-->
        <!--{{ getEditPasswordUser }}-->
        <v-flex xs12>
          <v-text-field label="관리자 비밀번호"
                        v-model="getEditPasswordUser.password"
                        :append-icon="showText ? 'visibility_off' : 'visibility'"
                        :rules="[rules.required, rules.min]"
                        :type="showText ? 'text' : 'password'"
                        hint="4글자 이상 입력해주세요."
                        counter
                        @click:append="showText = !showText">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="새로운 비밀번호"
                        v-model="getEditPasswordUser.newPassword"
                        :append-icon="showText ? 'visibility_off' : 'visibility'"
                        :rules="[rules.required, rules.min]"
                        :type="showText ? 'text' : 'password'"
                        hint="4글자 이상 입력해주세요."
                        counter
                        @click:append="showText = !showText">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="새로운 비밀번호 확인"
                        v-model="confirmPassword"
                        :append-icon="showText ? 'visibility_off' : 'visibility'"
                        :rules="[rules.required, rules.min, rules.confirm]"
                        :type="showText ? 'text' : 'password'"
                        hint="새로운 비밀번호를 한번 더 입력해주세요."
                        counter
                        @click:append="showText = !showText">
          </v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn slot="negative-button"
           color="blue darken-1"
           flat
           @click="CLOSE_EDIT_PASSWORD_MODAL_USER">
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
    data() {
      return {
        confirmPassword: '',
        showText: false,
        rules: {
          required: value => !!value || '필수 입력',
          min: v => v.length >= 4 || 'Min 4 characters',
          confirm: v => v === this.getEditPasswordUser.newPassword || '새로운 비밀번호와 똑같이 입력해주세요'
        }
      }
    },
    computed: {
      ...mapGetters([
        'getEditPasswordUser',
        'getEditUser'
      ]),
    },
    methods: {
      ...mapMutations([
        'CLOSE_EDIT_PASSWORD_MODAL_USER',
      ]),
      ...mapActions([
        'requestUpdatePasswordUser',
        'openGlobalModal'
      ]),
      async onClickConfirm() {
        if (await this._validAccessToken() === true) {
          this._updatePasswordUser()
        } else {
          this.openGlobalModal({})
        }
      },
      // UpdateUser
      async _updatePasswordUser() {
        this.getEditPasswordUser.password = await this.getEditPasswordUser.password.trim()
        this.getEditPasswordUser.newPassword = await this.getEditPasswordUser.newPassword.trim()
        const editPasswordUser = await JSON.parse(JSON.stringify(this.getEditPasswordUser))
        await this.requestUpdatePasswordUser({
          account_id: this.getEditUser.account_id,
          editPasswordUser: editPasswordUser
        })
        this._closeModal()
      },
      _closeModal() {
        this.CLOSE_EDIT_PASSWORD_MODAL_USER()
        this.confirmPassword = ''
        for (let key in this.getEditPasswordUser) {
          if (this.getEditPasswordUser[key] instanceof Object) {
            for (let inKey in this.getEditPasswordUser[key]) {
              this.getEditPasswordUser[key][inKey] = '';
            }
          }
          else
            this.getEditPasswordUser[key] = '';
        }
      }
    },
    components: {
      'BaseModal': BaseModal
    }
  }

</script>

<style scoped>

</style>
