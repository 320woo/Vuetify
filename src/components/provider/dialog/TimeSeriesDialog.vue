<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" scrollable persistent
              max-width="300px">
      <v-card>
        <v-card-title>영역을 선택하세요</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-radio-group v-model="selectedAreaName" column>
            <v-radio v-for="areaName in getAreaNameList"
                     :key="areaName"
                     :label=areaName
                     :value="areaName"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="closePopup()">닫기</v-btn>
          <v-btn color="blue darken-1" flat @click="onClickTimeSeriesView()">시계열 보기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    name: "TimeSeriesDialog",
    props: {
      missionData: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      dialog: false,
      selectedAreaName: ''
    }),
    created() {
      this.dialog = true
      console.log(this.missionData)
    },
    methods: {
      closePopup() {
        this.dialog = false
        this.$emit('close')
      },
      async onClickTimeSeriesView() {
        console.log(this.selectedAreaName)

        const projectId = await null || await this.missionData.find(mission => {
          return mission.area_name === this.selectedAreaName
        }).project_id

        await this._goProvider2DMapViewByProjectId(projectId)
      },
      _goProvider2DMapViewByProjectId(projectId) {
        this.$router.push({
          name: "providerTimelineMap",
          params: {
            projectId: projectId
          }
        })
      }
    },
    computed: {
      getAreaNameList() {
        // return this.areaNameList.slice(1)
        const areaNameList = this.missionData.map(mission => mission.area_name)
        return areaNameList.filter((name, index) => areaNameList.indexOf(name) === index)
      }
    }
  }
</script>

<style scoped>

</style>
