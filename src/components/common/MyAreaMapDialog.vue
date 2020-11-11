<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="1000px">
      <v-card>
        <v-card-title>
          <span class="headline">내 영역 설정</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout row wrap>
              <address-search></address-search>
              <v-spacer></v-spacer>
              <v-switch v-model="areaDraw" label="영역그리기"></v-switch>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="setMapFeatureRemove(true)" v-on="on">
                    <v-icon>
                      delete
                    </v-icon>
                  </v-btn>
                </template>
                <span>선택 영역 삭제</span>
              </v-tooltip>
            </v-layout>
            <v-layout wrap>
              <base-map class="pa-1" style="width: 100%"></base-map>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs6>
                <v-text-field
                  v-model="new_area.area_name"
                  label="영역명"
                  required
                />
              </v-flex>
              <v-flex xs4>
                <v-text-field
                  v-model="new_area.lot_address"
                  label="주소"
                  required
                />
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="new_area.post_num" label="우편번호"/>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="new_area.description" label="설명"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closePopup()">닫기</v-btn>
          <v-btn color="blue darken-1" flat @click="saveData()">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import BaseMap from '@/components/map/BaseMap'
  import AddressSearch from '@/components/map/AddressSearch'
  import * as types from '@/vuex/mutation-types'
  import { mapGetters, mapMutations } from 'vuex'
  import Constants from '@/components/common/constants'
  import StringUtils from '@/utils/utils/stringUtil'
  import projectAPI from '@/utils/api/projectAPI'
  import dbAPI from '@/utils/api/dbAPI'
  import AreaUtil from '@/utils/utils/areaUtil'

  export default {
    name: 'MyAreaMapDialog',
    components: {
      BaseMap,
      AddressSearch
    },
    props: {
      areaId: Number,
      default: undefined
    },
    data: () => ({
      dialog: false,

      areaDraw: false,
      new_area: {
        area_name: '',
        description: '',
        lot_address: '',
        post_num: '',
        area_size: 0,
        area_unit: 0,
        area_boundary: []
      }
    }),
    created() {
      this.dialog = true

      this.clearAreaList()
      this.clearAreaSize()

      if (this.areaId) {
        this.requestGetArea()
      }
    },
    computed: {
      ...mapGetters(['getToolMode', 'getAreaList', 'getAreaSize'])
    },
    methods: {
      ...mapMutations([
        'clearAreaList',
        'clearAreaSize',
        'addAreaList',
        'setMapFeatureRemove',
        'setAreaList'
      ]),

      closePopup() {
        this.dialog = false
        this.$emit('close')
      },

      saveData() {
        if (this.areaId) {
          this.requestUpdateArea()
        } else {
          this.requestAddArea()
        }
      },

      async requestAddArea() {
        console.log('[requestAddArea] areaList : ', this.getAreaList)
        console.log('[requestAddArea] getAreaSize : ', this.getAreaSize)

        if (this.getAreaList.length > 0) {
          let areaInfo = AreaUtil.getConvertMapToDBJson(this.getAreaList)

          console.log('[requestAddArea] areaBoundary : ', areaInfo.areaBoundary)
          console.log('[requestAddArea] size : ', areaInfo.size)

          // Project 추가
          let project = {
            name: this.new_area.area_name, // project 이름은 area name 과 동일하게.
            description: this.new_area.description // description 도 area description 과 동일하게.
          }
          let response = await projectAPI.addProject(project)
          console.log('response==>', response.data.project_id)

          // Area 추가
          let result = await dbAPI.query('sp.add_area', {
            project_id: response.data.project_id,
            area_name: this.new_area.area_name,
            description: this.new_area.description,
            lot_address: this.new_area.lot_address,
            post_num: this.new_area.post_num,
            area_size: areaInfo.size,
            area_unit: 0, // [고정], 면적 단위(0:제곱미터, 1:평)
            area_boundary: areaInfo.areaBoundary
          })
          console.log('result ====> ', result)

          this.closePopup()
        }
      },

      async requestUpdateArea() {
        console.log('[requestUpdateArea] areaList : ', this.getAreaList)
        let areaInfo = AreaUtil.getConvertMapToDBJson(this.getAreaList)

        let result = await dbAPI.query('update.area.me', {
          area_id: this.areaId,
          area_name: this.new_area.area_name,
          description: this.new_area.description,
          lot_address: this.new_area.lot_address,
          post_num: this.new_area.post_num,
          area_size: areaInfo.areaSize,
          area_boundary: areaInfo.areaBoundary
        })
        console.log('result ====> ', result)
        this.closePopup()
      },

      clickToggle() {
        let mode = 0

        if (this.areaDraw) {
          mode = 2
        }

        this.$store.commit(types.MAP_TOOL_MODE, { mode: mode })
      },
      async requestGetArea() {
        console.log('[requestGetArea] areaId :', this.areaId)
        try {
          let result = await dbAPI.query('select.area.me.area_id', {
            area_id: this.areaId
          })
          console.log('[requestGetArea] result : ', result)

          if (result.rowCount > 0) {
            this.new_area.area_name = result.rows[0].area_name
            this.new_area.description = result.rows[0].description
            this.new_area.lot_address = result.rows[0].lot_address
            this.new_area.post_num = result.rows[0].post_num
            this.new_area.area_size = result.rows[0].area_size
            this.new_area.area_unit = result.rows[0].area_unit
            this.new_area.area_boundary = result.rows[0].area_boundary

            let areaList = AreaUtil.getConvertDBToMapJson(result.rows[0].area_boundary.area)
            this.setAreaList(areaList)
          }
        } catch (err) {
          console.log(err)
        }
      }
    },
    watch: {
      areaDraw() {
        this.clickToggle()
      },
      getToolMode(value) {
        console.log('[getToolMode] value : ' + value)
        if (value === Constants.MODE_MAP_TOOL_NONE) {
          this.areaDraw = false
        }
      }
    }

  }
</script>

<style scoped></style>
