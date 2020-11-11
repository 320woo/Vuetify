<template>
  <base-modal>
    <div slot="title"
         class="headline">점검내역 삭제
    </div>
    <v-btn slot="negative-button"
           color="blue darken-1"
           flat
           @click="CLOSE_MODAL_CHECK_HISTORY">
      취소
    </v-btn>
    <v-btn slot="positive-button"
           color="blue darken-1"
           flat
           @click="onClickConfirm">
      확인
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
      isOpenConfirmModal: false,
      modalTitle: '',
      modalContent: ''
    }),
    computed: {
      ...mapGetters([
        'getFacility',
        'getRemoveCheckHistory'
      ])
    },
    methods: {
      ...mapMutations([
        'CLOSE_MODAL_CHECK_HISTORY'
      ]),
      ...mapActions([
        'requestDeleteCheckHistory',
        'openGlobalModal'
      ]),
      async onClickConfirm() {
        if (await this._validAccessToken() === true) {
          this.deleteCheckHistory()
        } else {
          this.openGlobalModal({})
        }
      },
      // DeleteCheckHistory
      async deleteCheckHistory() {
        await this.requestDeleteCheckHistory({
          basicId: this.getFacility.basic_id,
          checkHistoryId: this.getRemoveCheckHistory.checkhistory_id
        })
        this.CLOSE_MODAL_CHECK_HISTORY()
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
