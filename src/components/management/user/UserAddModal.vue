<template>
  <base-modal>
    <div slot="title"
         class="headline">사용자 추가
    </div>
    <v-container slot="content"
                 grid-list-md>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field label="ID"
                        v-model="getAddUser.account_id"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="비밀번호"
                        v-model="getAddUser.password"
                        :append-icon="showText ? 'visibility_off' : 'visibility'"
                        :rules="[rules.required, rules.min]"
                        :type="showText ? 'text' : 'password'"
                        hint="4글자 이상 입력해주세요."
                        counter
                        @click:append="showText = !showText">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="이메일"
                        v-model="getAddUser.email"
                        required
                        :rules="[rules.required, rules.email]">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="이름"
                        v-model="getAddUser.full_name"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn slot="negative-button"
           color="blue darken-1"
           flat
           @click="_closeModal()">
      닫기
    </v-btn>
    <v-btn slot="positive-button"
           color="blue darken-1"
           flat
           @click="onClickConfirm()">
      추가
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
        'getAddUser'
      ])
    },
    methods: {
      ...mapMutations([
        'CLOSE_MODAL_USER'
      ]),
      ...mapActions([
        'requestAddUser',
        'openGlobalModal'
      ]),
      async onClickConfirm() {
        if (await this._validAccessToken() === true) {
          this.addUser()
        } else {
          this.openGlobalModal({})
        }
      },
      // Add User
      async addUser() {
        this.getAddUser.account_id = await this.getAddUser.account_id.trim()
        this.getAddUser.password = await this.getAddUser.password.trim()
        const user = await JSON.parse(JSON.stringify(Object.assign(this.getAddUser, {'group_id': this.$session.get('group_id'), 'permission': "rw"})))
        console.log(user)
        await this.requestAddUser(user)
        this._closeModal()
      },
      _closeModal() {
        this.CLOSE_MODAL_USER()
        for (let key in this.getAddUser) {
          if (this.getAddUser[key] instanceof Object) {
            for (let inKey in this.getAddUser[key]) {
              this.getAddUser[key][inKey] = '';
            }
          }
          else
            this.getAddUser[key] = '';
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
