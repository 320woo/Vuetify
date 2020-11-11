<template>
  <base-map></base-map>
</template>

<script>
import BaseMap from '@/components/map/BaseMap'
import { mapGetters, mapMutations } from 'vuex'
import dbAPI from '@/utils/api/dbAPI'
import AreaUtil from '@/utils/utils/areaUtil'

export default {
  name: 'AreaMap',
  components: {
    BaseMap
  },
  props: {
    areaId: {
      type: Number,
      default: undefined
    },
    userId: {
      type: Number,
      default: undefined
    }
  },
  data: () => {
    return {}
  },
  async created() {
    this.clearAreaList()
    this.clearAreaSize()

    if (this.areaId && this.areaId != -1) {
      this.requestGetArea()
    }
  },
  computed: {
    ...mapGetters(['getToolMode', 'getAreaList', 'getAreaSize'])
  },
  methods: {
    ...mapMutations([
      'addAreaList',
      'clearAreaList',
      'clearAreaSize',
      'setMapFeatureRemove',
      'setAreaList'
    ]),
    async requestGetArea() {
      console.log('[requestGetArea] ')
      this.clearAreaList()
      this.clearAreaSize()
      try {
        let queryName = this.userId
          ? 'select.area.user.area_id'
          : 'select.area.me.area_id'
        let queryParams = {
          area_id: this.areaId
        }
        if (this.userId) {
          queryParams.user_id = this.userId
        }
        let result = await dbAPI.query(queryName, queryParams)
        console.log('[requestGetArea] result : ', result)

        if (result.rowCount > 0) {
          let areaList = AreaUtil.getConvertDBToMapJson(result.rows[0].area_boundary.area)
          this.setAreaList(areaList)
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  watch: {
    areaId(newValue) {
      this.requestGetArea()
    }
  }
}
</script>
