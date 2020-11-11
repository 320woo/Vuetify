<template>
  <base-modal>
    <div slot="title"
         class="headline">프로젝트 추가
    </div>
    <v-container slot="content"
                 grid-list-md>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field label="이름"
                        v-model="getNewProject.name"
                        required>
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            label="설명"
            v-model="getNewProject.description"
            @keydown.enter=""
            required>
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
           @click="addProject">
      추가
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
        'getNewProject'
      ])
    },
    methods: {
      ...mapMutations([
        'CLOSE_MODAL_PROJECT'
      ]),
      ...mapActions([
        'requestAddProject'
      ]),
      // Add Project
      addProject() {
        const project = JSON.parse(JSON.stringify(this.getNewProject))
        this.requestAddProject(project)
        this._closeModal()
      },
      _closeModal() {
        this.CLOSE_MODAL_PROJECT()
        for (let key in this.getNewProject) {
          if (this.getNewProject[key] instanceof Object) {
            for (let inKey in this.getNewProject[key]) {
              this.getNewProject[key][inKey] = '';
            }
          }
          else
            this.getNewProject[key] = '';
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
