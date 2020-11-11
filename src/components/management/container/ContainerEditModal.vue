<template>
  <base-modal>
    <div slot="title"
         class="headline">컨테이너 정보 수정
    </div>
    <v-container slot="content"
                 grid-list-md>
      <v-layout wrap>
        <v-flex xs12>
          <v-select
            :items="getServerTypeItem"
            label="서버 타입"
            v-model="getEditContainer.server_type"
            return-object
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="호스트"
                        v-model="getEditContainer.hostname"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="포트"
                        v-model="getEditContainer.port"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn slot="negative-button"
           color="blue darken-1"
           flat
           @click="CLOSE_MODAL_CONTAINER">
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
        'getEditContainer',
        'getServerTypeItem'
      ])
    },
    methods: {
      ...mapMutations([
        'CLOSE_MODAL_CONTAINER',
      ]),
      ...mapActions([
        'requestUpdateContainer',
        'openGlobalModal'
      ]),
      async onClickConfirm() {
        if (await this._validAccessToken() === true) {
          this._updateContainer()
        } else {
          this.openGlobalModal({})
        }
      },
      // UpdateContainer
      _updateContainer() {
        this.requestUpdateContainer(this.getEditContainer)
        this.CLOSE_MODAL_CONTAINER()
      },
    },
    components: {
      'BaseModal': BaseModal
    }
  }

</script>

<style scoped>

</style>
