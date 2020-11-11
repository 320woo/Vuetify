<template>
  <base-modal>
    <div slot="title"
         class="headline">시설물 등록
    </div>
    <v-container slot="content"
                 grid-list-md>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field label="이름"
                        v-model="getAddFacility.name"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="주소"
                        v-model="getAddFacility.position"
                        required
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="관리자"
                        v-model="getAddFacility.admin"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="소유자"
                        v-model="getAddFacility.owner"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="getAddFacility.install_date"
            persistent
            lazy
            full-width
            width="290px">
            <v-text-field
              slot="activator"
              v-model="getAddFacility.install_date"
              label="설치 날짜"
              readonly
            ></v-text-field>
            <v-date-picker v-model="getAddFacility.install_date"
                           scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="modal = false">취소</v-btn>
              <v-btn flat color="primary" @click="$refs.dialog.save(getAddFacility.install_date)">확인</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-flex>
        <v-flex v-for="(item, index) in getFacilityCustomFieldKeyList"
                :key="index" xs12>
          <v-text-field :label=item
                        v-model="getAddFacility.custom_info[item]"
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
           @click="addFacility">
      추가
    </v-btn>
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/shared-components/BaseModal'
  import BaseComponent from '@/components/shared-components/BaseComponent.vue'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import ConfirmModal from '@/components/shared-components/ConfirmModal'

  export default {
    extends: BaseComponent,
    props: [],
    data: () => ({
      modal: false,
      showText: false,
      rules: {
        required: value => !!value || '필수 입력',
        min: v => v.length >= 4 || 'Min 4 characters',
      },
    }),
    computed: {
      ...mapGetters([
        'getAddFacility',
        'getFacilityCustomFieldKeyList',
        'isActiveFacilityCustomField'
      ])
    },
    methods: {
      ...mapMutations([
        'CLOSE_MODAL_FACILITY',
        'SET_IS_ACTIVE_CUSTOM_FIELD'
      ]),
      ...mapActions([
        'requestAddFacility',
        'openGlobalModal'
      ]),
      async onClickConfirm() {
        if (await this._validAccessToken() === true) {
          this.addFacility()
        } else {
          this.openGlobalModal({})
        }
      },
      // Add Facility
      async addFacility() {
        const facility = await JSON.parse(JSON.stringify(this.getAddFacility))
        await this.requestAddFacility(facility)
        this._closeModal()
      },
      _closeModal() {
        this.CLOSE_MODAL_FACILITY()
        for (let key in this.getAddFacility) {
          if (this.getAddFacility[key] instanceof Object) {
            for (let inKey in this.getAddFacility[key]) {
              this.getAddFacility[key][inKey] = '';
            }
          }
          else
            this.getAddFacility[key] = '';
        }
      },
      _setModalText(title, content) {
        this.modalTitle = title
        this.modalContent = content
      }
    },
    components: {
      'BaseModal': BaseModal,
      'ConfirmModal': ConfirmModal
    }
  }
</script>

<style scoped>

</style>
