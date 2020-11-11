<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Waypoint plan</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout column wrap justify-center>
              <base-map
                class="pa-1"
                style="width: 100%">
              </base-map>
              <v-flex py3>
                <v-divider></v-divider>
              </v-flex>
              <v-spacer></v-spacer>
              <p>비행 설정</p>
              <v-text-field
                v-model="frontOverlap"
                label="Front overlap (%)"
              ></v-text-field>
              <v-text-field
                v-model="sideOverlap"
                label="Side overlap (%)"
              ></v-text-field>
              <v-text-field
                v-model="flightSpeed"
                label="Flight Speed (m/s)"
              ></v-text-field>
              <v-text-field
                v-model="altitude"
                label="Altitude (m)"
              ></v-text-field>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closePopup()">닫기</v-btn>
          <v-btn color="blue darken-1" flat @click="closePopup()">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import BaseMap from '@/components/map/BaseMap'
  import {mapMutations} from 'vuex'
  import AreaUtil from '@/utils/utils/areaUtil'

  export default {
    name: "WaypointPlanDialog",
    components: {
      BaseMap
    },
    props: {
      areaBoundary: {
        type: Array,
        default: () => []
      }
    },
    data: () => ({
      dialog: false,

      // 비행 설정
      frontOverlap: 75,
      sideOverlap: 75,
      flightSpeed: 10,
      altitude: 100,
    }),
    created() {
      this.dialog = true
      this.setWaypoint()
    },
    methods: {
      ...mapMutations([
        'SET_WAYPOINT'
      ]),

      setWaypoint() {
        console.log("[setWaypoint] this.areaBoundary: ", this.areaBoundary)
        let waypoint = this.areaBoundary.map((point) => {
          return {"lat": point[AreaUtil.DB_KEY_LATITUDE], "lng": point[AreaUtil.DB_KEY_LONGITUDE]}
        })
        // this.SET_WAYPOINT(waypoint)
      },

      closePopup() {
        this.dialog = false
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>

</style>
