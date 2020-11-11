<template>
  <v-app id="scan">
    <v-navigation-drawer
      class="drawer"
      :clipped="true"
      :mobile-break-point="600"
      v-model="drawer"
      app
    >
      <v-layout v-if="taskId"
                column
                justify-center
                align-center
                pa-3>
        <task-info v-if="task.address"
                   :address="task.address.result[0]"
                   :created_at="task.created_at"></task-info>
        <v-btn small
               @click="_goToDetailView()">
          원본 이미지 보기
        </v-btn>
      </v-layout>
      <v-layout>
        <img class="histogram" src="@/assets/histogramthermal.png"/>
      </v-layout>
      <v-layout>
        <img class="histogram" src="@/assets/histogramthermal2.png"/>
      </v-layout>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="true"
      color="blue darken-3"
      dark
      app
    >
      <v-btn icon class="hidden-xs-only"
             @click=_goToPrevPage>
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title class="toolbarTitle">
        {{ task.name }}
      </v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-btn
        class="drawOpener mt-4"
        block
        color="dark accent-2"
        @click="drawer=!drawer"
      >
        <div v-if="drawer">
          <v-icon>chevron_left</v-icon>
        </div>
        <div v-else>
          <v-icon>chevron_right</v-icon>
        </div>
      </v-btn>
    </v-content>
    <detail-image-view
      v-if="enableDetailView"
      :project-id="projectId"
      :task-info="task"
      @close="enableDetailView = false"
    ></detail-image-view>
  </v-app>

</template>

<script>
  import API from '@/utils/api/taskAPI'
  import StringUtil from '@/utils/utils/stringUtil'
  import TaskInfo from '@/components/shared-components/TaskInfo'
  import DetailImageView from "../common/DetailImageView";

  export default {
    props: [
      'projectId',
      'taskId'
    ],
    data() {
      return {
        drawer: true,
        task: {},
        enableDetailView: false
      }
    },
    async created() {
      this.task = await this._getTaskInfo()
      // this.resetMapShotPoints()
      console.log("Scan.Vue created")
    },
    methods: {
      _goToPrevPage() {
        return this.$router.go(-1)
      },
      async _getTaskInfo() {
        await this.$store.dispatch('requestGetTask', {
          project_id: this.projectId,
          task_id: this.taskId
        })
        return this.$store.getters.getTask
      },
      _convertDate(date) {
        return StringUtil.getConvertDate(new Date(date));
      },
      _goToDetailView() {
        console.log("[goToDetailView] ");
        this.enableDetailView = true;
      },
    },
    components: {
      'TaskInfo': TaskInfo,
      'DetailImageView': DetailImageView
    },
  }
</script>

<style scoped>
  .histogram {
    width: 100%;
    height: auto;
  }

  .drawOpener {
    position: absolute;
    z-index: 2;
    top: 20px;
    width: 10px;
    min-width: 5px;
  }
</style>
