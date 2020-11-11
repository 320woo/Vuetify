<template>
  <base-modal>
    <div slot="title"
         class="headline">시설물 삭제
    </div>
    <v-btn slot="negative-button"
           color="blue darken-1"
           flat
           @click="CLOSE_MODAL_FACILITY">
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
        'getRemoveFacility'
      ])
    },
    methods: {
      ...mapMutations([
        'CLOSE_MODAL_FACILITY'
      ]),
      ...mapActions([
        'requestDeleteFacility',
        'openGlobalModal'
      ]),
      async onClickConfirm() {
        if (await this._validAccessToken() === true) {
          this._deleteFacility()
        } else {
          this.openGlobalModal({})
        }
      },
      // DeleteFacility
      async _deleteFacility() {
        this.requestDeleteFacility(this.getRemoveFacility.basic_id)
        this.CLOSE_MODAL_FACILITY()
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
