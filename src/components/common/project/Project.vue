<template>
  <v-container v-if="isDataLoaded">
    <v-card class="card-header"
            color="#E6EDFF">
      <v-container fluid>
        <v-layout align-center
                  jusify-center
                  row
                  wrap>
          <v-flex class="card-header-title">
            <v-layout
              align-center
              jusify-center
              wrap>
              <img src="@/assets/prepand_title.png">
              <span class="ml-1">드론 실사지도 관리</span>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-text-field label="프로젝트 이름을 입력해주세요."
                          single-line
                          hide-details
                          solo
                          v-model="search"
                          append-icon="search">
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <transition-group name="list">
      <template
        v-for="project in calList">
        <project-list
          :key="project.project_id"
          :project="project">
        </project-list>
      </template>
    </transition-group>
    <v-card>
      <v-layout justify-center
                class="pa-2">
        <v-pagination
          v-model="curPageNum"
          :length="numOfPages">
        </v-pagination>
      </v-layout>
    </v-card>

    <v-layout class="create-data-button">
      <v-btn fab
             dark
             color="indigo"
             @click="_onClickAddButton()">
        <v-icon dark>
          add
        </v-icon>
      </v-btn>
    </v-layout>

    <v-dialog v-model="isOpenAddProjectModal"
              persistent
              max-width="500px">
      <project-add-modal/>
    </v-dialog>

    <v-dialog v-model="isOpenEditProjectModal"
              persistent
              max-width="500px">
      <project-edit-modal/>
    </v-dialog>

    <v-dialog v-model="isOpenRemoveProjectModal"
              max-width="500px"
              @keydown.enter="deleteProject"
              persistent>
      <project-remove-modal/>
    </v-dialog>
  </v-container>
</template>

<script>
  import BaseModal from '@/components/shared-components/BaseModal'
  import ProjectList from '@/components/common/project/ProjectList'
  import ProjectAddModal from '@/components/common/project/ProjectAddModal'
  import ProjectEditModal from '@/components/common/project/ProjectEditModal'
  import ProjectRemoveModal from '@/components/common/project/ProjectRemoveModal'
  import {mapActions, mapGetters, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        // projectList: [],
        isDataLoaded: false,

        //Pagination 속성
        curPageNum: 1,
        itemPerPage: 10,

        //Search 속성
        search: '',

      }
    },
    async created() {
      console.log("created");
      await this._getProjectList()
      this.isDataLoaded = true;
    },
    beforeDestroy() {
      this.CLEAR_PROJECT_STATE()
    },

    computed: {
      startOffset() {
        return ((this.curPageNum - 1) * this.itemPerPage);
      },
      endOffset() {
        return (this.startOffset + this.itemPerPage);
      },
      numOfPages() {
        if (this.getProjectList === undefined) return;
        return Math.ceil(this.getProjectList.length / this.itemPerPage);
      },
      calList() {
        if (this.getProjectList === undefined) return;
        return this.getProjectList.filter((data) => {
          return data.name.toLowerCase().includes(this.search.toLowerCase())
        }).slice(0).slice(this.startOffset, this.endOffset);
      },
      ...mapGetters([
        'getProjectList',
        'isOpenAddProjectModal',
        'isOpenEditProjectModal',
        'isOpenRemoveProjectModal'
      ])
    },
    methods: {
      ...mapMutations([
        'OPEN_ADD_MODAL_PROJECT',
        'OPEN_EDIT_MODAL_PROJECT',
        'OPEN_REMOVE_MODAL_PROJECT',
        'CLOSE_MODAL_PROJECT',
        'CLEAR_PROJECT_STATE'
      ]),
      ...mapActions([
        'requestGetProjectList',
      ]),

      _getProjectList() {
        return this.requestGetProjectList()
      },
      _onClickAddButton() {
        this.OPEN_ADD_MODAL_PROJECT()
      },
      prevPage() {
        this.curPageNum--;
      },
    },
    components: {
      'BaseModal': BaseModal,
      'ProjectList': ProjectList,
      'ProjectAddModal': ProjectAddModal,
      'ProjectEditModal': ProjectEditModal,
      'ProjectRemoveModal': ProjectRemoveModal
    }
  }
</script>

<style scoped>
  .list-tile {
    padding: 0;
    margin-bottom: 15px;
  }

  .list-move {
    transition: transform 1s;
  }

  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }

  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  .create-data-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }

  .project_title {
    color: #191D5C;
    font-size: large;
    font-weight: bold;
  }

  .project_header_card {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
</style>
