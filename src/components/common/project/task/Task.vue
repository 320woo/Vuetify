<template>
  <v-container v-if="showComponent && !this._isEmpty(this.getProject)">
    <v-container class="pt-0">
      <v-layout class="task_project_title"
                row>
          {{ this.getProject.name }}
      </v-layout>
      <v-layout class="task_project_description"
                row>
        {{this.getProject.description }}
      </v-layout>
    </v-container>
    <v-card class="task_header_card"
            color="#E6EDFF">
      <v-container fluid>
        <v-layout align-center
                  jusify-center
                  row
                  wrap>
          <v-flex class="task_title">
            <v-layout
              row
              align-center
              jusify-center>
              <img src="@/assets/prepand_title.png">
              <v-flex class="ml-1 task_title_name">{{ this.getProject.name + ' 작업 리스트'}}</v-flex>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-text-field label="작업명을 입력해주세요."
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
    <transition-group appear name="list">
      <template v-for="task in calList">
        <task-card :key="task.task_id"
                   :project_id="project_id"
                   :task="task">
        </task-card>
      </template>
    </transition-group>
    <v-card>
      <v-layout justify-center
                class="pa-2">
        <v-pagination v-model="curPageNum"
                      :length="numOfPages">
        </v-pagination>
      </v-layout>
    </v-card>
    <v-layout class="create-data-button">
      <v-btn fab
             dark
             color="indigo"
             @click="_onClickAddButton">
        <v-icon dark>
          add
        </v-icon>
      </v-btn>
    </v-layout>

    <v-dialog v-model="isOpenAddModal"
              persistent
              max-width="500px">
      <task-add-modal :project_id="project_id"></task-add-modal>
    </v-dialog>
    <v-dialog v-model="isOpenEditModal"
              persistent
              max-width="500px">
      <task-edit-modal :project_id="project_id"></task-edit-modal>
    </v-dialog>
    <v-dialog v-model="isOpenRemoveModal"
              max-width="500px"
              @keydown.enter="_onRemoveTask"
              persistent>
      <task-remove-modal :project_id="project_id"></task-remove-modal>
    </v-dialog>
  </v-container>
</template>

<script>
  import TaskCard from './TaskCard'
  import TaskAddModal from './TaskAddModal'
  import TaskEditModal from './TaskEditModal'
  import TaskRemoveModal from './TaskRemoveModal'
  import BaseModal from '@/components/shared-components/BaseModal'
  import {mapActions, mapGetters, mapMutations} from 'vuex'

  export default {
    props: ['project_id'],
    data() {
      return {
        //Pagination 속성
        curPageNum: 1,
        itemPerPage: 10,
        interval: '',
        showComponent: false,

        //Search 속성
        search: ''
      }
    },
    async created() {
      console.log("created");
      console.log(this.$router.currentRoute)
      await this._getProject(this.project_id)
      this.showComponent = true;
    },
    mounted() {
      this.interval = setInterval(() => {
        this._getProject(this.project_id)
      }, 5000)
    },
    beforeDestroy() {
      this.showComponent = false;
      clearInterval(this.interval)
    },
    computed: {
      //Pagination Computed methods
      startOffset() {
        return ((this.curPageNum - 1) * this.itemPerPage);
      },
      endOffset() {
        return (this.startOffset + this.itemPerPage);
      },
      numOfPages() {
        return Math.ceil(this.getProject.tasks.length / this.itemPerPage);
      },
      calList() {
        return this.getProject.tasks.filter((data) => {
          return data.name.toLowerCase().includes(this.search.toLowerCase())
        }).slice(0).slice(this.startOffset, this.endOffset);
      },
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
      ]),
      _isEmpty(obj) {
        return Object.keys(obj).length === 0;
      },
      _getProject(project_id) {
        return this.requestGetProject(project_id);
      },
      _onClickAddButton() {
        return this.OPEN_ADD_MODAL()
      },
    },
    components: {
      'TaskCard': TaskCard,
      'BaseModal': BaseModal,
      'TaskAddModal': TaskAddModal,
      'TaskEditModal': TaskEditModal,
      'TaskRemoveModal': TaskRemoveModal
    },
  }
</script>

<style scoped>
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
  .task_project_title {
    color: #191D5C;
    font-size: x-large;
    font-weight: bold;
  }
  .task_project_description {
    color: #374051;
    font-size: small
  }


  .task_title {
    color: #191D5C;
    font-size: large;
    font-weight: bold;
  }
  .task_title_name {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .task_header_card {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .create-data-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
</style>


