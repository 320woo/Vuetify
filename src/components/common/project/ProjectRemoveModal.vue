<template>
  <base-modal>
    <div slot="title"
         class="headline">프로젝트 제거
    </div>
    <v-btn slot="negative-button"
           color="blue darken-1"
           flat
           @click="CLOSE_MODAL_PROJECT">
      취소
    </v-btn>
    <v-btn slot="positive-button"
           color="blue darken-1"
           flat
           @click="deleteProject">
      확인
    </v-btn>
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/shared-components/BaseModal'
  import {mapActions, mapGetters, mapMutations} from 'vuex'

  export default {
    props: [],
    data: () => ({}),
    computed: {
      ...mapGetters([
        'getRemoveProjectId'
      ])
    },
    methods: {
      ...mapMutations([
        'CLOSE_MODAL_PROJECT'
      ]),
      ...mapActions([
        'requestDeleteProject'
      ]),
      // DeleteProject
      deleteProject() {
        this.requestDeleteProject(this.getRemoveProjectId)
        // if (this.calList.length === 0) {
        //   this.prevPage();
        // }
        this.CLOSE_MODAL_PROJECT()
      },
    },
    components: {
      'BaseModal': BaseModal
    }
  }
</script>

<style scoped>

</style>
