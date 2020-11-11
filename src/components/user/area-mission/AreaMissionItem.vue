<template>
  <v-layout
    align-center
    jusify-center
    wrap>
    <v-icon>
      subdirectory_arrow_right
    </v-icon>
    <div>{{ title }}</div>
    <div> ({{ subTitle }})</div>
    <div> {{ subTitleName }}</div>
    <v-spacer></v-spacer>
    <div> {{ date }}</div>
    <v-spacer></v-spacer>
    <div> {{ state }}</div>
    <v-spacer></v-spacer>
    <template v-if="isValidWaypointPlan">
      <v-btn round color="primary" dark @click="showWaypointPlan()">Waypoint plan</v-btn>
    </template>
    <template v-if="isValidWaypoint">
      <v-btn round color="primary" dark @click="showWaypoint()">Waypoint</v-btn>
    </template>
    <template v-if="isValidSprayPlan">
      <v-btn round color="primary" dark @click="showSprayPlan()">Spray plan</v-btn>
    </template>
    <template v-if="isValidSpray">
      <v-btn round color="primary" dark @click="showSpray()">Spray</v-btn>
    </template>
    <!-- <v-btn round color="primary" dark @click="exportData()">GCS에 내보내기</v-btn> -->
  </v-layout>
</template>

<script>
  export default {
    name: "AreaMissionItem",

    props: {
      areaId: {
        type: Number,
        default: null
      },
      missionTypeId: {
        type: Number,
        default: null
      },
      missionId: {
        type: Number,
        default: null
      },
      title: {
        type: String,
        required: true
      },
      subTitle: {
        type: String,
        required: true
      },
      subTitleName: {
        type: String,
        required: true
      },
      date: {
        type: String
      },
      state: {
        type: String,
        default: ""
      },
      mission: {
        type: Object,
        default: null
      },
    },

    methods: {
      showWaypointPlan() {
      },
      showWaypoint() {
      },
      showSprayPlan() {
      },
      showSpray() {
      },
      // onClickEditMissionReport() {
      //   console.log("[onClickEditMissionReport] this.requestMissionTypeId : " + this.requestMissionTypeId)
      //   this.$router.push({
      //     name: 'editMissionGenerateReport4user',
      //     params: {
      //       "missionRequestId": this.missionRequestId.toString(),
      //       "requestMissionTypeId": this.requestMissionTypeId.toString(),
      //       "missionId": this.missionId.toString()
      //     }
      //   })
      // }
    },

    computed: {
      isValidMissionId: {
        get() {
          return this.missionId !== null
        }
      },
      isValidWaypointPlan: {
        get() {
          return this.mission.waypoint_plan_id !== null
        }
      },
      isValidWaypoint: {
        get() {
          return this.mission.waypoint_id !== null
        }
      },
      isValidSprayPlan: {
        get() {
          return this.mission.spray_plan_id !== null
        }
      },
      isValidSpray: {
        get() {
          return this.mission.spray_id !== null
        }
      },
    }
  }
</script>

<style scoped>

</style>
