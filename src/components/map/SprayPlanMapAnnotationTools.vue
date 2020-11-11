<template>
  <v-layout column wrap class="spray-plan-map-annotation-tool">
    <v-layout align-start justify-center wrap>
      <v-switch
        :label="'분석의견 보이기'"
        v-model="switchAnalisys">
      </v-switch>
      <v-switch
        :label="'살포영역 보이기'"
        v-model="switchValue">
      </v-switch>
    </v-layout>
    <v-layout v-if="!isReadonly" align-start justify-center>
      <v-card class="map-annotation-card">
        <v-btn-toggle
          v-model="toggleExclusive"
          class="map-annotation-toggle"
          @change="clickToggle()">
          <v-flex v-for="index in toggleList.length - 1" class="map-annotation-wrapper" :key="index">
            <v-layout align-center justify-center wrap>
              <v-btn
                class="map-annotation-button"
                ripple
                :key="index"
                :disabled="!visibleValue(index)"
                slot="activator">
                <v-layout column wrap>
                  <img :src="toggleList[index].icon">
                </v-layout>
              </v-btn>
            </v-layout>
            <v-layout class="label" align-center justify-center wrap>
              {{ toggleList[index].label }}
            </v-layout>
          </v-flex>
        </v-btn-toggle>
      </v-card>
    </v-layout>
  </v-layout>
</template>

<script>
  import * as types from '@/vuex/mutation-types'
  import Constants from '@/components/common/constants'

  export default {
    props: {
      readonly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        name: 'SprayPlanMapAnnotationTools',
        fab: false,
        toggleExclusive: null,
        switchValue: true,
        switchAnalisys: false,
        toggleList: [
          { icon: 'expand_more', label: 'none', key: 0 },
          { icon: require('@/assets/icon/area.png'), label: '기본영역', key: 1 },
          { icon: require('@/assets/icon/area.png'), label: '차등영역', key: 2 }
        ]
      }
    },
    methods: {
      clickToggle() {
        console.log('[clickToggle @change] ' + this.toggleExclusive)

        let mode = 0

        if (this.toggleExclusive != null) {
          mode = this.toggleExclusive + 8
        }

        this.$store.commit(types.MAP_TOOL_MODE, { mode: mode })
      },

      visibleValue(index) {
        if (!this.switchValue) {
          return this.switchValue
        } else {
          if (index === 3) {
            return !!this.isShowContent
          } else {
            return this.switchValue
          }
        }
      },

      resetToggle() {
        console.log('[resetToggle] ')
        this.toggleExclusive = undefined
      }
    },
    computed: {
      currentIcon() {
        let mode = 0

        if (this.toggleExclusive != null) {
          mode = this.toggleExclusive + 1
        }

        return this.toggleList[mode].icon
      },

      isShowContent() {
        return this.$store.getters.isAvailableDsmTiff
      },

      isMapToolMode() {
        return this.$store.getters.getToolMode
      },

      isReadonly() {
        console.log('[isReadonly] this.readonly : ', this.readonly)
        return this.readonly
      }
    },

    watch: {
      switchValue: function(val, oldVal) {
        console.log('[switchValue] val : ' + val)

        this.$store.commit(types.SHOW_CONTENT, { showContents: val })

        if (!val) {
          this.toggleExclusive = null
          this.clickToggle()
        }
      },

      isMapToolMode(val, oldVal) {
        console.log('[isMapToolMode] val ' + val)

        if (val === Constants.MODE_MAP_TOOL_NONE) {
          this.resetToggle()
        }
      }
    }
  }
</script>

<style scoped>
  /*.btnFlex {*/
  /*width: 100%;*/
  /*height: auto;*/
  /*}*/
  .btnToggle {
    background: #EEEEEE;
  }

  .v-btn-toggle {
    background: #344164;
  }

  .spray-plan-map-annotation-tool >>> .map-annotation-card {
    border-radius: 10px;
    background: rgba(238,238,238, 0.0);
  }

  .map-annotation-card >>> .map-annotation-toggle {
    background: rgba(238,238,238, 0.1);
  }

  .map-annotation-wrapper >>> .map-annotation-button {
    margin-bottom: 5px;
    min-width: 0 !important;
    min-height: 0 !important;
    border-radius: 10px !important;
    border: 1px solid #E1E2E4;
    background: linear-gradient(to top right, #E6EDFF 0%, #FFFFFF 100%);
  }

  .map-annotation-wrapper >>> .map-annotation-button:disabled {
    border: 1px solid #636363;
    background: linear-gradient(to top right, #6d6a6c 0%, #8d8a8c 100%);
  }

  .map-annotation-card >>> .map-annotation-wrapper {
    margin: 15px;
  }

  .label {
    cursor: default;
  }
</style>
