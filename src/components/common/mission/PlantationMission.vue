<template>
  <div v-if="mission">
    <v-card class="task-card-wrapper">
      <v-layout class="task-status-wrapper">
        <v-flex xs12 sm6 md4 lg3 xl2> 
          <div v-if="isSelected">
            <v-img :src="icons.selectedItem" width="5px" height="250px"/>
          </div>
        </v-flex>
        <v-flex xs7>
          <mission-status :status="mission.state"></mission-status>
        </v-flex>
      </v-layout>
      <v-container fluid>
        <v-layout row wrap>
          <v-layout class="task-card-category-type-wrapper">
            <v-layout
              justify-center
              align-center
              class="task-card-category-type"
            >
              <v-chip
                :color="_calBadgeColorByCategory(mission.mission_type_category)"
                small
                label
                text-color="white"
              >
                {{ mission.mission_type_name }}
              </v-chip>
            </v-layout>
          </v-layout>
          <v-flex class="task-card-image">
            <v-layout align-center justify-center>
              <!-- <img :src="`https://picsum.photos/150/150?image=10`" width="120px" /> -->
              <img :src="_convertURL(task.asset_thumbnail_url)" width="120px"/>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-container class="pt-0">
              <v-layout column>
                <v-layout pl-2 row wrap align-center justify-start>
                  <MissionInformation :missioninfo="missioninfo"/>
                  <v-flex>
                    <v-layout justify-end>
                      <v-tooltip bottom>
                        <v-btn
                          slot="activator"
                          style="min-width: 0!important;
                        border-radius: 10px !important;
                        border: 1px solid #E1E2E4;
                        background: linear-gradient(to top right, #E6EDFF 0%, #FFFFFF 100%);"
                          ripple
                          @click.prevent="moveToMissionHistoryOverride()"
                        >
                          <v-icon dark>
                            history
                          </v-icon>
                        </v-btn>
                        <span>작업 히스토리</span>
                      </v-tooltip>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <v-divider class="ma-1"></v-divider>

                <v-layout row>
                  <v-flex>
                    <!-- <v-btn
                      class="task-card-menu-button"
                      color="taskButton"
                      dark
                      ripple
                      small
                      @click="showWaypointDialog()"
                    >
                      <img class="button-content-icon" :src="icons.map2D"/>
                      Waypoint
                    </v-btn> -->
                    <v-btn
                      class="task-card-menu-button"
                      color="taskButton"
                      dark
                      ripple
                      small
                      @click="moveToSpayPlanMapOverride()"
                    >
                      <img class="button-content-icon" :src="icons.ndvi"/>
                      살포정보
                    </v-btn>
                    <!-- <v-btn
                      class="task-card-menu-button"
                      color="taskButton"
                      dark
                      ripple
                      small
                      @click="showSprayDialog()"
                    >
                      <img class="button-content-icon" :src="icons.ndvi"/>
                      Spray
                    </v-btn> -->
                  </v-flex>
                </v-layout>
                <v-divider class="ma-1"></v-divider>
                <v-layout row>
                  <v-layout>
                    <v-layout align-center style="max-width: fit-content">
                      <v-btn
                        v-if="!isuser()"
                        @click="gcsExport()"
                        class="task-card-menu-button start"
                        dark
                        ripple
                        small
                      >
                        <img :src="icons.image" class="mr-1"/>
                        GCS 내보내기
                      </v-btn>
                    </v-layout>
                  </v-layout>
                  <v-layout row v-if="!isuser()">
                    <v-spacer></v-spacer>
                    <v-layout justify-end>
                      <v-divider class="ma-1" vertical></v-divider>
                      <v-tooltip bottom>
                        <v-btn
                          slot="activator"
                          class="default-action-button"
                          ripple
                          @click.prevent="editMissionReport()"
                        >
                          <img :src="icons.edit"/>
                        </v-btn>
                        <span>편집</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <v-btn
                          slot="activator"
                          class="default-action-button"
                          ripple
                          @click.prevent="deleteMissionOverride()"
                        >
                          <img :src="icons.delete"/>
                        </v-btn>
                        <span>삭제</span>
                      </v-tooltip>
                    </v-layout>
                  </v-layout>
                </v-layout>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <!-- Dialog -->
    <!-- <waypoint-plan-dialog
      v-if="waypointPlanDialog"
      @close="waypointPlanDialog = false"
    />
    <waypoint-dialog v-if="waypointDialog" @close="waypointDialog = false"/> -->
    <spray-plan-dialog
      v-if="sprayPlanDialog"
      @close="sprayPlanDialog = false"
    />
    <!-- <spray-dialog 
      v-if="sprayDialog" 
      :mission="mission"
      @close="sprayDialog = false"
    /> -->
    <image-import-dialog
      v-if="imageImportDialog"
      @close="imageImportDialog = false"
    />
    <confirm-delete-mission-dialog
      v-if="deleteDialog"
      :mission="mission"
      @close="refreshList()"
    />
  </div>
</template>

<script>
  import { missionMixin } from '@/components/common/mission/missionMixin'
  import Constants from "@/components/common/constants"

  export default {
    name: 'PlantationMission',
    mixins: [missionMixin],
    components: {},
    props: {
      selectedIndex: {
        type: Number,
        default: -2
      },
      itemIndex: {
        type: Number
      }
    },
    data: () => ({}),
    methods: {
      refreshList() {
        this.deleteDialog = false
        this.$emit("on-refresh")
      },
      commitSelectedIndex() {
        console.log('################# commit itemIndex: '+this.itemIndex)
        this.$store.commit('setPosition', {
          pos: this.itemIndex
        })
      },
      moveToMissionHistoryOverride() {
        this.commitSelectedIndex()
        this.moveToMissionHistory()
      },
      moveToSpayPlanMapOverride() {
        this.commitSelectedIndex()
        this.moveToSpayPlanMap()
      },
      _convertURL(url) {
        if (this.mission.mission_type_category === '시비')
          return require('@/assets/AGDrone-Manure.png')
        else if (this.mission.mission_type_category === '방제')
          return require('@/assets/AGDrone-Pesticide.png')

        return require('@/assets/AGDrone-Pesticide.png')
      },
      deleteMissionOverride() {
        this.commitSelectedIndex()
        this.showDeleteDialog()
      },

      async gcsExport() {
        this.commitSelectedIndex()

        const link = document.createElement("a")
        link.href =
          `${Constants.API_SERVER}/api/missions/` +
          this.mission.mission_id +
          "/export"
        link.setAttribute("download", name)
        document.body.appendChild(link)
        link.click()
      }
    },

    watch: {
      getSelectedIndex (val, oldVal) {
        console.log('####### itemIndex: '+this.itemIndex+', watched: ', val)
        this.selectedIndex = val
      }
    },  
    computed: {
      isSelected() {
        return (this.selectedIndex === this.itemIndex)
      },
      getSelectedIndex () {
        return this.$store.getters.getPosition
      },

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/mission.scss";
</style>
