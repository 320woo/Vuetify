<template>
  <div class="text-xs-center">
    <v-btn
      round
      :outline="!isImagePosition"
      icon
      color="primary"
      dark
      @click="showImagePosition"
      :disabled="!isEnableImagePosition"
    >
      <v-icon>
        grain
      </v-icon>
    </v-btn>
    <v-btn
      round
      :outline="!isTimeline"
      icon
      color="primary"
      dark
      @click="showTimeline"
      :disabled="!isEnableGraph"
    >
      <v-icon>
        timeline
      </v-icon>
    </v-btn>
    <v-btn
      round
      icon
      color="primary"
      dark
      @click="moveMyLocation"
    >
      <v-icon>
        my_location
      </v-icon>
    </v-btn>
    <v-btn
      round
      :outline="!isBaseMap"
      color="primary"
      dark
      @click="setEnableBaseMap"
    >기본지도
    </v-btn>
    <v-btn
      round
      :outline="!isHybridMap"
      color="primary"
      dark
      @click="setEnableHybridMap"
    >행정구역
    </v-btn>
    <v-btn
      round
      :outline="!isEoMap"
      color="primary"
      dark
      @click="setEnableEoMap"
    >정사영상(EO)
    </v-btn>
    <v-btn
      round
      :outline="!isDsmMap"
      color="primary"
      dark
      @click="setEnableDsmMap"
    >DSM
    </v-btn>
    <div v-if="false">
      <v-btn
        round
        :outline="!is2DMap"
        color="primary"
        dark
        @click="setEnable2DMap"
      >2D
      </v-btn>
    </div>
  </div>
</template>

<script>
  import * as types from '../../vuex/mutation-types'

  export default {
    data: () => ({
      name: "MapViewTools",
    }),

    props: {
      isEnableImagePosition: {
        type: Boolean
      },
      isEnableGraph: {
        type: Boolean
      },
      isEnableBaseMap: {
        type: Boolean
      },
      isEnableHybridMap: {
        type: Boolean
      },
      isEnable2DMap: {
        type: Boolean
      },
      isEnableEoMap: {
        type: Boolean
      },
      isEnableDsmMap: {
        type: Boolean
      },
    },

    created() {
      console.log("[created] isEnableGraph : " + this.isEnableGraph);
      this.$store.commit(types.MAP_MY_LOCATION, {isMoveMyLocation: false});
      this.$store.commit(types.MAP_VIEW_BASE_MAP, {isEnableBaseMap: this.isEnableBaseMap});
      this.$store.commit(types.MAP_VIEW_HYBRID_MAP, {isEnableHybridMap: this.isEnableHybridMap});
      this.$store.commit(types.MAP_VIEW_2D_MAP, {isEnable2DMap: this.isEnable2DMap});
      this.$store.commit(types.MAP_VIEW_EO_MAP, {isEnableEoMap: this.isEnableEoMap});
      this.$store.commit(types.MAP_VIEW_DSM_MAP, {isEnableDsmMap: this.isEnableDsmMap});
    },

    methods: {
      showImagePosition() {
        this.$store.commit(types.MAP_IMAGE_POSITION, {isEnableImagePosition: !this.isImagePosition});
      },

      showTimeline() {
        this.$store.commit(types.MAP_TIMELINE, {isEnableTimeline: !this.isTimeline});
      },

      moveMyLocation() {
        this.$store.commit(types.MAP_MY_LOCATION, {isMoveMyLocation: true});
      },

      setEnableBaseMap() {
        this.$store.commit(types.MAP_VIEW_BASE_MAP, {isEnableBaseMap: !this.isBaseMap});
      },

      setEnableHybridMap() {
        this.$store.commit(types.MAP_VIEW_HYBRID_MAP, {isEnableHybridMap: !this.isHybridMap});
      },

      setEnable2DMap() {
        this.$store.commit(types.MAP_VIEW_2D_MAP, {isEnable2DMap: !this.is2DMap});
      },

      setEnableEoMap() {
        console.log('####### 000')
        this.$store.commit(types.MAP_VIEW_EO_MAP, {isEnableEoMap: !this.isEoMap});
      },

      setEnableDsmMap() {
        this.$store.commit(types.MAP_VIEW_DSM_MAP, {isEnableDsmMap: !this.isDsmMap});
      },

    },

    computed: {
      isImagePosition() {
        return this.$store.getters.isEnableImagePosition;
      },

      isTimeline() {
        return this.$store.getters.isEnableTimeLayer;
      },

      isBaseMap() {
        return this.$store.getters.isEnableBaseMap;
      },

      isHybridMap() {
        return this.$store.getters.isEnableHybridMap;
      },

      is2DMap() {
        return this.$store.getters.isEnable2DMap;
      },

      isEoMap() {
        return this.$store.getters.isEnableEoMap;
      },

      isDsmMap() {
        return this.$store.getters.isEnableDsmMap;
      },
    }
  }
</script>

<style scoped>

</style>
