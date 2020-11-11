<template>
  <base-modal>
    <div slot="title"
         class="headline">시설물 정보 수정
    </div>
    <v-container slot="content"
                 grid-list-md>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field label="이름"
                        v-model="getEditFacility.name"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="주소"
                        v-model="getEditFacility.position"
                        required
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="관리자"
                        v-model="getEditFacility.admin"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field label="소유자"
                        v-model="getEditFacility.owner"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
        <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="getEditFacility.install_date"
          persistent
          lazy
          full-width
          width="290px">
          <v-text-field
            slot="activator"
            v-model="getEditFacility.install_date"
            label="설치 날짜"
            readonly
          ></v-text-field>
          <v-date-picker v-model="getEditFacility.install_date"
                         scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="modal = false">취소</v-btn>
            <v-btn flat color="primary" @click="$refs.dialog.save(getEditFacility.install_date)">확인</v-btn>
          </v-date-picker>
        </v-dialog>
        <v-flex v-for="(item, index) in getFacilityCustomFieldKeyList"
                :key="index" xs12>
          <v-text-field :label=item
                        v-model="getEditFacility.custom_info[item]"
                        :rules="[rules.required]">
          </v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn slot="negative-button"
           color="blue darken-1"
           flat
           @click="CLOSE_MODAL_FACILITY">
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
  import BaseModal from '@/components/shared-components/BaseModal'
  import BaseComponent from '@/components/shared-components/BaseComponent.vue'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import StringUtil from '@/utils/utils/stringUtil'
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
      isOpenConfirmModal: false,
      modalTitle: '',
      modalContent: ''
    }),
    computed: {
      ...mapGetters([
        'getEditFacility',
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
        'requestUpdateFacility',
        'openGlobalModal'
      ]),
      async onClickConfirm() {
        if (await this._validAccessToken() === true) {
          this._updateFacility()
        } else {
          this.openGlobalModal({})
        }
      },
      // UpdateFacility
      async _updateFacility() {
        await this.requestUpdateFacility(this.getEditFacility)
        this.CLOSE_MODAL_FACILITY()
      },
      _convertDate(date) {
        return StringUtil.getConvertDateFormat(new Date(date), "YYYY년 MM월 DD일");
      },
    },
    components: {
      'BaseModal': BaseModal,
      'ConfirmModal': ConfirmModal
    }
  }

</script>

<style scoped>

</style>
