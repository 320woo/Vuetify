<template>
  <base-modal>
    <div slot="title"
         class="headline">사용자 탈퇴
    </div>
    <v-container slot="content"
                 grid-list-md>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field label="비밀번호를 입력해주세요."
                        v-model="getRemoveUser.password"
                        :append-icon="showText ? 'visibility_off' : 'visibility'"
                        :rules="[rules.required, rules.min]"
                        :type="showText ? 'text' : 'password'"
                        hint="4글자 이상 입력해주세요."
                        counter
                        @click:append="showText = !showText">
          </v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn slot="negative-button"
           color="blue darken-1"
           flat
           @click="CLOSE_MODAL_USER">
      취소
    </v-btn>
    <v-btn slot="positive-button"
           color="blue darken-1"
           flat
           @click="onClickConfirm()">
      확인
    </v-btn>
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/shared-components/BaseModal'
  import BaseComponent from '@/components/shared-components/BaseComponent.vue'
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
        'getRemoveUser'
      ])
    },
    methods: {
      ...mapMutations([
        'CLOSE_MODAL_USER'
      ]),
      ...mapActions([
        'requestDeleteUser',
        'openGlobalModal'
      ]),
      async onClickConfirm() {
        if (await this._validAccessToken() === true) {
          this._deleteUser()
        } else {
          this.openGlobalModal({})
        }
      },
      // DeleteUser
      _deleteUser() {
        this.requestDeleteUser(this.getRemoveUser)
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
