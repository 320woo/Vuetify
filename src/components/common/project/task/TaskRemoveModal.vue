<template>
  <base-modal>
    <div slot="title"
         class="headline">프로젝트 제거
    </div>
    <v-btn slot="negative-button"
           color="blue darken-1"
           flat
           @click="CLOSE_MODAL">
      취소
    </v-btn>
    <v-btn slot="positive-button"
           color="blue darken-1"
           flat
           @click="_onRemoveTask">
      확인
    </v-btn>
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/shared-components/BaseModal'
  import {mapMutations} from 'vuex'
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'

	export default {
    props: [
      'project_id'
    ],
		computed: {
      ...mapGetters([
        'getProject',
        'getEditTask',
        'getRemoveTask',
        'isOpenAddModal',
        'isOpenEditModal',
        'isOpenRemoveModal'
      ])
    },
    methods: {
      _onRemoveTask() {
        const task = this.getRemoveTask
        task.project_id = this.project_id
        this.requestDeleteTask(task)
        this.CLOSE_MODAL()
      },
      ...mapMutations([
        'OPEN_ADD_MODAL',
        'OPEN_EDIT_MODAL',
        'OPEN_REMOVE_MODAL',
        'CLOSE_MODAL'
      ]),
      ...mapActions([
        'requestGetProject',
        'requestPatchTask',
        'requestDeleteTask'
      ])
    },
    components: {
		  'BaseModal': BaseModal
    }
	}
</script>

<style scoped>

</style>
