<template>
  <base-modal>
    <div slot="title"
         class="headline">프로젝트 수정
    </div>
    <v-container slot="content"
                 grid-list-md>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            label="이름"
            v-model="getEditProject.name"
            required>
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            label="설명"
            v-model="getEditProject.description"
            required
            @keydown.enter="updateProject">
          </v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn slot="negative-button"
           color="blue darken-1"
           flat
           @click="CLOSE_MODAL_PROJECT">
      닫기
    </v-btn>
    <v-btn slot="positive-button"
           color="blue darken-1"
           flat
           @click="updateProject">
      수정
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
        'getEditProject'
      ])
    },
    methods: {
      ...mapMutations([
        'CLOSE_MODAL_PROJECT'
      ]),
      ...mapActions([
        'requestUpdateProject'
      ]),
      // UpdateProject
      updateProject() {
        this.requestUpdateProject(this.getEditProject)
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
