<template class="font1">
  <v-layout row justify-center class="font1">
    <v-dialog v-model="dialog" persistent max-width="1000px">
      <v-card class="font1">
        <v-card-title>
          <span class="font1" style="font-size:25px">임무요청</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <div>
                <!------------------------ 화면에 채울 내용 ----------BEGIN--------------->
                <v-layout row wrap>
                  <v-flex pa-3 xs6>
                    <v-select
                      v-model="selected_area"
                      placeholder="관리 영역을 선택하세요"
                      @change="changeSelectArea(selected_area)"
                      :items="region_viewlist"
                      item-text="name"
                      item-value="id"
                      return-object>
                    </v-select>
                    <v-menu
                      ref="wishDateMenu"
                      :close-on-content-click="false"
                      v-model="wishDateMenu"
                      :nudge-right="40"
                      :return-value.sync="wish_dat"
                      lazy
                      transition="scale-transition"
                      offset-y
                      max-width="170ox"
                      min-width="150px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="wish_dat"
                        label="희망 작업 날짜"
                        prepend-icon="event"
                        readonly
                      ></v-text-field>
                      <v-date-picker
                        v-model="wishDateCal"
                        locale="ko-kr"
                        is-inline
                        :attributes='dates'
                        :min-date="wishMinDate"
                        @input="formatDate(wishDateCal)"
                      >
                      </v-date-picker>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="wishDateMenu = false">취소</v-btn>
                      <v-btn flat color="primary" @click="$refs.wishDateMenu.save(wish_dat)">확인</v-btn>
                    </v-menu>
                  </v-flex>
                  <v-flex xs6>
                    <!--                    <v-sheet width=300 height=200 color="grey">-->
                    <!--                      지도 -> 농지 영역 표시..-->
                    <!--                    </v-sheet>-->
                    <BaseMap></BaseMap>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 sm2 md2>
                    <div class="divTableHead">촬영</div>
                    <v-checkbox
                      v-model="missionTypes"
                      label="일반촬영"
                      color="red"
                      value="0"
                      hide-details
                      @change="changedCheckBox()"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="missionTypes"
                      label="특수촬영"
                      color="red darken-3"
                      value="1"
                      hide-details
                      @change="changedCheckBox()"
                    ></v-checkbox>
                  </v-flex>
                  <v-flex xs12 sm2 md2>
                    <div class="divTableHead">지도제작</div>
                    <v-checkbox
                      v-model="missionTypes"
                      label="정사영상"
                      color="indigo"
                      value="2"
                      hide-details
                      @change="changedCheckBox()"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="missionTypes"
                      label="NDVI"
                      color="indigo darken-3"
                      value="3"
                      hide-details
                      @change="changedCheckBox()"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="missionTypes"
                      label="GeoTIFF"
                      color="indigo darken-3"
                      value="11"
                      hide-details
                      @change="changedCheckBox()"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="missionTypes"
                      label="AI도복검출"
                      color="indigo darken-3"
                      value="12"
                      hide-details
                      @change="changedCheckBox()"
                    ></v-checkbox>
                  </v-flex>
                  <v-flex xs12 sm2 md2>
                    <div class="divTableHead">분석</div>
                    <v-checkbox
                      v-model="missionTypes"
                      label="생육분석"
                      color="orange"
                      value="4"
                      hide-details
                      @change="changedCheckBox()"
                    ></v-checkbox>
                    <!-- <v-checkbox
                      v-model="missionTypes"
                      label="피해분석"
                      color="orange darken-3"
                      value="5"
                      hide-details
                      @change="changedCheckBox()"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="missionTypes"
                      label="경사도분석"
                      color="orange darken-2"
                      value="6"
                      hide-details
                      @change="changedCheckBox()"
                    ></v-checkbox> -->
                  </v-flex>
                  <v-flex xs12 sm2 md2>
                    <div class="divTableHead">시비</div>
                    <v-checkbox
                      v-model="missionTypes"
                      label="일반시비"
                      color="primary"
                      value="7"
                      hide-details
                      @change="changedCheckBox()"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="missionTypes"
                      label="차등시비"
                      color="secondary"
                      value="8"
                      hide-details
                      @change="changedCheckBox()"
                    ></v-checkbox>
                  </v-flex>
                  <v-flex xs12 sm2 md2>
                    <div class="divTableHead">파종</div>
                    <v-checkbox
                      v-model="missionTypes"
                      label="파종"
                      color="success"
                      value="9"
                      hide-details
                      @change="changedCheckBox()"
                    ></v-checkbox>
                  </v-flex>
                  <v-flex xs12 sm2 md2>
                    <div class="divTableHead">방제</div>
                    <v-checkbox
                      v-model="missionTypes"
                      label="방제"
                      color="warning"
                      value="10"
                      hide-details
                      @change="changedCheckBox()"
                    ></v-checkbox>
                  </v-flex>
                </v-layout>


                <v-layout row wrap>
                  <v-flex pa-3 xs4>
                    <v-select
                      v-model="selected_provider"
                      placeholder="공급자 - 해당지역에 선택된 서비스가 가능한 공급자 List"
                      :items="provider_viewlist"
                    >
                    </v-select>
                  </v-flex>
                  <v-flex pa-3 xs4>
                    <v-select
                      v-model='selected_crop'
                      placeholder="작물 종류"
                      :items="crop_viewlist"
                      @change="changedCrop(selected_crop)"
                    >
                    </v-select>
                  </v-flex>
                  <v-flex pa-3 xs4>
                    <v-select
                      v-model='selected_crop_variety'
                      placeholder="작물 상세명"
                      :items="crop_detail_viewlist"
                    >
                    </v-select>
                  </v-flex>
                  <v-flex pa-3 xs4>
                    <v-select
                      v-model='selected_blight'
                      placeholder="병증"
                      :items="blight_viewlist"
                    >
                    </v-select>
                  </v-flex>
                  <v-flex pa-3 xs4>
                    <v-select
                      v-model="selected_spray_material"
                      placeholder="희망 살포제"
                      :items="spray_material_viewlist"
                    >
                    </v-select>
                  </v-flex>
                  <v-flex pa-3 xs8>
                    <v-textarea
                      v-model="comment"
                      label="요청 코멘트"
                      value="문제 없이 잘~ 해주세요...
                              두번째줄...
                              세번째줄...
                              네번째줄...
                              마지막줄.">
                    </v-textarea>
                  </v-flex>
                </v-layout>
                <!------------------------ 화면에 채울 내용 ---------- END --------------->
              </div>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <template v-if="isValidMissionRequest">
            <template v-if="isCanceledMissionRequest">
              <v-btn @click="requestRetryMission()">재요청</v-btn>
            </template>
            <template v-else>
              <v-btn @click="modifyMissionRequest()">저장</v-btn>
              <v-btn @click="requestCancelMission()">요청취소</v-btn>
            </template>
          </template>
          <template v-else>
            <v-btn @click="requestConfirm()">요청</v-btn>
          </template>
          <v-btn @click="closePopup()">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isShowCancelDialog"
      max-width="290">
      <v-card>
        <v-card-title class="headline">요청 취소</v-card-title>

        <v-card-text>
          요청한 임무를 취소하시겠습니까?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="cancelRequestMission(true)">
            예
          </v-btn>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="cancelRequestMission(false)">
            아니요
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isShowConfirmDialog"
      max-width="290">
      <v-card>
        <v-card-title class="headline">임무 재요청</v-card-title>

        <v-card-text>
          임무를 재요청하시겠습니까?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="retryRequestMission(true)">
            예
          </v-btn>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="retryRequestMission(false)">
            아니요
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script>
  import StringUtil from '@/utils/utils/stringUtil'
  import AreaUtil from '@/utils/utils/areaUtil'
  import dbAPI from '@/utils/api/dbAPI'
  import Constants from '@/components/common/constants'
  import BaseMap from '@/components/map/BaseMap'
  import { mapMutations } from 'vuex'

  export default {
    name: 'RequestMissionDialog',
    components: { BaseMap },
    props: {
      mission_request: {
        type: Object
      }
    },
    data: () => ({
      selected_area: { id: -1, name: '' },
      selected_provider: '',
      selected_blight: '',
      selected_crop: '',
      selected_crop_variety: '',
      selected_spray_material: '',
      region_items: [],// '유곡리 가을배추', '동곡리 벼농지', '동곡리 콩' ],
      region_viewlist: [],
      provider_viewlist: [],
      crop_viewlist: [],
      crop_detail_viewlist: [],//[ '가을배추', '봄배추', '겨울-고랭지 배추' ],
      blight_viewlist: [],//[ '잎마름병', '게이름병', '콜라병', '사이다병' ],
      spray_material_viewlist: [],//[ '만병통치약', '잎마름병 치료제' ],
      provider_info: [],
      missionTypes: [],
      crop_info: [],
      blight_info: [],
      fertilizer_info: [],
      user_info: null,
      comment: '',
      wish_dat: '',
      dialog: false,
      missionRequestId: '',
      missionData: [],

      wishDateMenu: false,
      dates: [],
      wishDateCal: new Date(),
      wishMinDate: new Date(),

      isShowConfirmDialog: false,
      isShowCancelDialog: false,
    }),
    async created() {
      this.dialog = true
      // try {
      //   let result = await dbAPI.query('select.user.me', {})
      //   if (result.rowCount == 1) {
      //     this.user_info = result.rows[0]
      //     //alert(JSON.stringify(this.user_info))
      //   }
      // }
      // catch(err) {
      //     console.log(err)
      // }
      console.log('MISSION_REQUEST: ' + JSON.stringify(this.mission_request))

      //console.log('MISSIONS: '+JSON.stringify(this.mission_request.missions))
      console.log('\n')

      await this.presetData()
      this.getMissionRequest()

      this.getMissionRequestAll()
    },
    computed: {
      isValidMissionRequest: {
        get() {
          return this.mission_request !== null
        }
      },
      isCanceledMissionRequest: {
        get() {
          return this.mission_request.mr_state === 2
        }
      }
    },
    methods: {
      ...mapMutations([
        'setAreaList'
      ]),
      async getMissionRequestAll() {
        let result = await dbAPI.query('select.mission_request.mylist')

        console.log('[getMissionRequestAll] select.mission_request.mylist result :', result)
        if (result.rowCount >= 1) {
          console.log(result.rows)
          this.missionRequestData = result.rows

          let missionDataResult = await dbAPI.query('select.mission_request.myall')
          if (missionDataResult.rowCount >= 1) {
            this.missionData = missionDataResult.rows

            this.missionData.forEach((item) => {
              //alert(item.mission_type_name)
              // console.log(item.request_mission_type_id + ':'+item.mission_type_name+ "  " + item.full_name)
            })
          } else {
            //alert('There is no result..')
          }
        }
        this.setDateItem()
      },

      setMinDate() {
        var date = new Date()
        if (this.wish_dat !== '') {
          console.log('[setDateItem] setMinDate    wish_dat ' + this.wish_dat)
          var month = StringUtil.getConvertDateFormat(this.wish_dat, 'MM') - 1
          var year = StringUtil.getConvertDateFormat(this.wish_dat, 'YYYY')
          var day = StringUtil.getConvertDateFormat(this.wish_dat, 'DD')
          console.log('[setDateItem] setMinDate    ' + year + '-' + month + '-' + day)
          var wishdate = new Date(year, month, day)
          console.log('[setDateItem] cur : ' + date + ',    wishdate : ' + wishdate)

          if (date > wishdate)
            date = wishdate
        }
        console.log('[setDateItem] WishMinDate : ' + date)
        this.wishMinDate = date
        this.wishDateCal = date
        return date
      },

      formatDate(date) {
        if (!date) return null
        // console.log("[formatDate] ", date)
        var year = StringUtil.getConvertDateFormat(date, 'YYYY')
        var month = StringUtil.getConvertDateFormat(date, 'MM')
        var day = StringUtil.getConvertDateFormat(date, 'DD')
        // console.log(`${year}-${month}-${day}`)
        this.wish_dat = `${year}-${month}-${day}`
        return `${year}-${month}-${day}`
      },

      setDateItem() {
        var index = 0
        if (this.missionData.length > 0) {
          this.missionData.forEach((item) => {
            // console.log("setDateItem - original item : ", item)
            var datajs = new Object()
            index++
            datajs.key = item.mission_type_category + index

            var categorycolor = 'red'
            switch (item.mission_type_category) {
              case Constants.MISSION_CATEGORY_ANALYSIS:
                categorycolor = 'blue'
                break
              case Constants.MISSION_CATEGORY_MANURE:
                categorycolor = 'pink'
                break
              case Constants.MISSION_CATEGORY_SOWING:
                categorycolor = 'green'
                break
              case Constants.MISSION_CATEGORY_PHOTO:
                categorycolor = 'red'
                break
              case Constants.MISSION_CATEGORY_MAP:
                categorycolor = 'yellow'
                break
              case Constants.MISSION_CATEGORY_PESTICIDE:
                categorycolor = 'purple'
                break
            }

            var targetcomp = ''
            this.missionRequestData.forEach((mrd_item) => {
              if (mrd_item.mission_request_id === item.mission_request_id) {
                targetcomp = mrd_item.company_name
              }
            })

            //datajs.highlight = true
            datajs.bar = { color: categorycolor }
            //datajs.dot = { color:categorycolor }
            //datajs.bars = true
            var month = StringUtil.getConvertDateFormat(item.wish_dat, 'MM') - 1
            datajs.dates = new Date(StringUtil.getConvertDateFormat(item.wish_dat, 'YYYY'),
              month,
              StringUtil.getConvertDateFormat(item.wish_dat, 'DD'))
            var stateStr = item.state_name
            if (item.state_name == null)
              stateStr = ''
            datajs.popover = { label: item.area_name + ' ' + targetcomp + ' ' + item.mission_type_category + ' ' + stateStr }
            // console.log("setDateItem : ", datajs)
            this.dates.push(datajs)
          })
        }

        // console.log("setDateItem wish  date: ",this.widh_dat)
        // var month = StringUtil.getConvertDateFormat(this.widh_dat, "MM") - 1
        // this.wishDateCal = new Date( StringUtil.getConvertDateFormat(this.widh_dat, "YYYY"),
        //   month,
        //   StringUtil.getConvertDateFormat(this.widh_dat, "DD") )
      },

      getMissionRequest() {
        if (this.mission_request != null) {
          console.log('[getMissionRequest] this.mission_request : ', this.mission_request)
          this.missionRequestId = this.mission_request.mission_request_id
          this.selected_area = {
            id: this.mission_request.area_id,
            name: this.mission_request.area_name
          }
          this.mission_request.missions.forEach(mission => {
            this.missionTypes.push(String(mission.mission_type))
          })
          this.changedCheckBox()
          this.selected_provider = this.mission_request.company_name
          this.selected_blight = this.mission_request.blight_name
          this.selected_crop = this.mission_request.crop_name
          this.changedCrop(this.mission_request.crop_name)
          this.selected_crop_variety = this.mission_request.variety
          this.comment = this.mission_request.comment
          this.selected_spray_material = this.mission_request.wish_spray_material
          this.wish_dat = this.mission_request.wish_dat.substring(0, this.mission_request.wish_dat.indexOf('T'))

          this.setMinDate()
          this.setAreaBoundary(this.mission_request.area_boundary)

          console.log('[getMissionRequest] this.selected_area : ', this.selected_area)
          console.log('####### ' + JSON.stringify(this.missionTypes))
          console.log('####### ' + this.missionRequestId)
          console.log('####### ' + this.selected_provider)
          console.log('####### ' + this.selected_crop_variety)

// {"mission_request_id":30,
// "wish_dat":"2019-06-20T00:00:00.000Z",
// "wish_spray_material":"잎마름병 치료제",
// "company_name":"농부촌",
// "tel_num":"010-1234-5678",
// "comment":"잘 해주세요",
// "area_name":"테스트지역-배추",
// "area_size":100,
// "description":"배추농사"}
          // this.selected_spray_material: ''
        }
      },
      // load mission_request info
      async presetData() {
        // let areaListInfo = {
        //   account_id: this.user_info.account_id
        // }

        try {
          let result = await dbAPI.query('select.area.me')//, {})//, areaListInfo)
          console.log('select.area.me', result.rows)
          if (result.rowCount > 0) {
            result.rows.forEach(row => {
              let info = {
                area_id: row.area_id,
                area_name: row.area_name,
                area_boundary: row.area_boundary
              }
              this.region_items.push(info)
              this.region_viewlist.push({ id: info.area_id, name: info.area_name })
            })

            if (this.mission_request === null) {
              this.selected_area = {
                id: this.region_items[0].area_id,
                name: this.region_items[0].area_name
              }
              this.setAreaBoundary(this.region_items[0].area_boundary)
              console.log('[presetData] this.selected_area : ', this.selected_area)
            }

          }
        } catch (err) {
          console.log(err)
        }

        try {
          let result2 = await dbAPI.query('select.provider.all', {})
           console.log(result2.rows)
          if (result2.rowCount > 0) {
             result2.rows.forEach(row => {
              this.provider_info.push({
                provider_id: row.provider_id,
                user_id: row.user_id,
                company_name: row.company_name,
                services: row.services
              })
            })
          }
        } catch (err) {
          console.log(err)
        }

        try {
          let result3 = await dbAPI.query('select.crop.all', {})
          console.log(result3.rows)
          if (result3.rowCount > 0) {
            result3.rows.forEach(row => {
              this.crop_info.push({
                crop_id: row.crop_id,
                crop_name: row.crop_name,
                variety: row.variety
              })
            })
          }

          for (let i in this.crop_info) {
            let isExist = false
            for (let j in this.crop_viewlist) {
              if (this.crop_info[i].crop_name === this.crop_viewlist[j]) {
                isExist = true
              }
            }
            if (isExist === false) {
              this.crop_viewlist.push(this.crop_info[i].crop_name)
            }
          }
        } catch (err) {
          console.log(err)
        }

        try {
          let result4 = await dbAPI.query('select.blight_info.all', {})
          console.log('select.blight_info.all', result4.rows)
          if (result4.rowCount > 0) {
            result4.rows.forEach(row => {
              this.blight_info.push({
                blight_id: row.blight_id,
                name: row.blight_name,
                crop_name: row.crop_name
              })
            })
          }
        } catch (err) {
          console.log(err)
        }

        try {
          let result5 = await dbAPI.query('select.fertilizer_info.all', {})
          console.log('select.fertilizer_info.all', result5.rows)
          if (result5.rowCount > 0) {
            result5.rows.forEach(row => {
              this.fertilizer_info.push({
                fertilizer_id: row.fertilizer_id,
                product_name: row.product_name,
                section: row.section
              })
            })
          }
        } catch (err) {
          console.log(err)
        }
      },
      changedCrop(selected_crop) {
        while (this.crop_detail_viewlist.length) {
          this.crop_detail_viewlist.pop()
        }
        while (this.blight_viewlist.length) {
          this.blight_viewlist.pop()
        }
        while (this.spray_material_viewlist.length) {
          this.spray_material_viewlist.pop()
        }

        for (let i in this.crop_info) {
          if (selected_crop === this.crop_info[i].crop_name) {
            this.crop_detail_viewlist.push(this.crop_info[i].variety)
          }
        }

        for (let i in this.missionTypes) {
          if (this.missionTypes[i] === '10') {
            for (let m in this.blight_info) {
              if (this.blight_info[m].crop_name === this.selected_crop) {
                this.blight_viewlist.push(this.blight_info[m].name)
                console.log('병충해종류 #'+m+': '+this.blight_info[m].name)
              }
            }

            console.log('blight_info: '+JSON.stringify(this.blight_info))
            //this.blight_viewlist = [ '잎마름병', '게이름병', '콜라병', '사이다병' ]
            this.spray_material_viewlist = ['만병통치약', '잎마름병 치료제']
          }
        }
      },
      changedCheckBox() {
        while (this.provider_viewlist.length) {
          this.provider_viewlist.pop()
        }
        while (this.spray_material_viewlist.length) {
          this.spray_material_viewlist.pop()
        }
        while (this.blight_viewlist.length) {
          this.blight_viewlist.pop()
        }
        for (let i in this.provider_info) {
          if (this.provider_info[i].services) {
            let jbSplit = this.provider_info[i].services.split(',')
            let isListup = true
            for (let k in this.missionTypes) {
              let isSupport = false
              for (let j in jbSplit) {
                if (this.missionTypes[k] === jbSplit[j]) {
                  isSupport = true
                  break
                }
              }
              if (isSupport === false) {
                isListup = false
                break
              }
              if (this.missionTypes[k] === '7' || this.missionTypes[k] === '8') {
                for (let m in this.fertilizer_info) {
                  this.spray_material_viewlist.push(this.fertilizer_info[m].product_name)
                }
                //this.spray_material_viewlist = [ '질소질비료', '인산질비료', '복합비료', '무기질가리비료', '유기질비료' ]
              } else if (this.missionTypes[k] === '9') {
                this.spray_material_viewlist = ['볍씨', '배추씨']
              } else if (this.missionTypes[k] === '10') {
                for (let m in this.blight_info) {
                  if (this.blight_info[m].crop_name === this.selected_crop) {
                    this.blight_viewlist.push(this.blight_info[m].name)
                    console.log('*병충해종류 #'+m+': '+this.blight_info[m].name)
                  }
                }

                console.log('*blight_info: '+JSON.stringify(this.blight_info))
                //this.blight_viewlist = [ '잎마름병', '게이름병', '콜라병', '사이다병' ]
                this.spray_material_viewlist = ['만병통치약', '잎마름병 치료제']
              }
            }
            if (isListup === true) {
              this.provider_viewlist.push(this.provider_info[i].company_name)
              console.log('push provider view list ' + this.provider_info[i].company_name)
            }
          }
        }
      },
      closePopup() {
        this.dialog = false
        this.$emit('close')
      },

      requestCancelMission() {
        this.isShowCancelDialog = true
      },

      requestRetryMission() {
        this.isShowConfirmDialog = true
      },

      hiddenCancelDialog() {
        this.isShowCancelDialog = false
      },

      hiddenConfirmDialog() {
        this.isShowConfirmDialog = false
      },

      cancelRequestMission(condition) {
        if (condition == true) {
          this.updateMissionRequestState(2)
        }
        else {
          this.hiddenCancelDialog()
        }
      },

      retryRequestMission(condition) {
        if (condition == true) {
          this.updateMissionRequestState(1)
        }
        else {
          this.hiddenConfirmDialog()
        }
      },

      async updateMissionRequestState(mr_state) {
        //todo: 공급자가 이미 미션을 완료한 경우 경고 문구 띄우고 취소가 안되게 기능 추가 필요
        const missionRequestInfo = JSON.parse(JSON.stringify({
          'mission_request_id': this.missionRequestId,
          'mr_state': mr_state
        }))

        console.log('[cancelMissionRequest] missionRequestInfo : ', missionRequestInfo)

        try {
          let state = 0
          switch (mr_state) {
            case 1:
              state = 0
              break
            case 2:
              state = 4
              break
            default:
              break
          }
          const info = {
            mission_request_id: this.missionRequestId,
            state: state
          }

          console.log('[update.mission.state.by.mr_id] ', info)
          let result = await dbAPI.query('update.mission.state.by.mr_id', info)
          if (result.rowCount >= 1) {
            console.log('[update.mission.state.by.mr_id]', result.rows)
            // alert('성공입니다')
          }
        } catch (err) {
          console.log('[update.mission.state.by.mr_id]', err)
          // alert('실패입니다')
          // 실패하면 task id를 삭제 하십시오...
        }

        try {
          let result = await dbAPI.query('update.mission_request.state', missionRequestInfo)
          if (result.rowCount >= 1) {
            console.log(result.rows)
            console.log('[updateMissionRequestState] update.mission_request 성공입니다.')

            // this.successDialog()
            if (mr_state === 1) {
              alert('작업을 재요청하였습니다.')
            } else if (mr_state === 2) {
              alert('작업요청을 취소하였습니다.')
            }
          }
        } catch (err) {
          console.log(err)
          console.log('[updateMissionRequestState] update.mission_request 실패입니다')

          // this.failDialog()
        }



        this.closePopup()
      },
      async requestConfirm() {
        let _crop_id = -1
        for (let i in this.crop_info) {
          if (this.selected_crop_variety === this.crop_info[i].variety) {
            _crop_id = this.crop_info[i].crop_id
          }
        }
        let _area_id = this.selected_area.id
        let _provider_user_id = -1
        for (let i in this.provider_info) {
          if (this.selected_provider === this.provider_info[i].company_name) {
            _provider_user_id = this.provider_info[i].user_id
          }
        }
        let _blight_id = -1
        for (let i in this.blight_info) {
          if (this.selected_blight === this.blight_info[i].name) {
            _blight_id = this.blight_info[i].blight_id
          }
        }

        if (!this.wish_dat) {
          alert('희망일을 선택하세요')
          return
        }
        if (_area_id === -1) {
          alert('관리 영역을 선택하세요')
          return
        }
        if (_provider_user_id === -1) {
          alert('공급자를 선택하세요')
          return
        }

        let _req_dat = StringUtil.getConvertDateFormat(new Date(), 'YYYY-MM-DD')
        const missionRequestInfo = {
          req_dat: _req_dat,
          comment: this.comment,
          wish_dat: this.wish_dat,
          area_id: _area_id,
          crop_id: _crop_id,
          operator_id: _provider_user_id,
          blight_id: _blight_id,
          wish_spray_material: this.selected_spray_material,
          mr_state: 1
        }

        // alert(JSON.stringify(missionRequestInfo))
        console.log('[requestConfirm] missionRequestInfo : ', missionRequestInfo)

        let _mission_request_id = ''
        try {
          let result = await dbAPI.query('insert.mission_request', missionRequestInfo)
          if (result.rowCount >= 1) {
            console.log(result.rows)
            // alert("insert.mission_request 쿼리 성공입니다")
            result.rows.forEach(row => {
              _mission_request_id = row.mission_request_id
            })
          }
        } catch (err) {
          console.log(err)
          // alert("실패입니다")
        }

        //alert('### mission_request_id: '+_mission_request_id)

        for (let i in this.missionTypes) {
          let requestMissionType = {
            'mission_request_id': _mission_request_id,
            'mission_type': this.missionTypes[i],
            'description': ''
          }

          //(JSON.stringify('requestMissionType json>>> '+requestMissionType))
          try {
            // insert value (....), (....), (....), ... request_mission_type
            let result = await dbAPI.query('insert.request_mission_type', requestMissionType)
            if (result.rowCount >= 1) {
              console.log(JSON.stringify(result.rows))
              // alert("insert.request_mission_type 쿼리 성공입니다")
            }
          } catch (err) {
            console.log(err)
            alert('실패입니다')
          }
        }

        this.closePopup()
      },
      async modifyMissionRequest() {
        console.log('[modifyMissionRequest]')

        let _crop_id = -1
        for (let i in this.crop_info) {
          if (this.selected_crop === this.crop_info[i].crop_name) {
            _crop_id = this.crop_info[i].crop_id
          }
        }
        let _area_id = this.selected_area.id
        let _provider_user_id = -1
        for (let i in this.provider_info) {
          if (this.selected_provider === this.provider_info[i].company_name) {
            _provider_user_id = this.provider_info[i].user_id
          }
        }
        let _blight_id = -1
        for (let i in this.blight_info) {
          if (this.selected_blight === this.blight_info[i].name) {
            _blight_id = this.blight_info[i].blight_id
          }
        }

        if (!this.wish_dat) {
          alert('희망일을 선택하세요')
          return
        }
        if (_area_id === -1) {
          alert('관리 영역을 선택하세요')
          return
        }
        if (_provider_user_id === -1) {
          alert('공급자를 선택하세요')
          return
        }

        try {
          let info = {
            mission_request_id: this.missionRequestId
          }
          let result = await dbAPI.query('select.mission.count', info)
          console.log('result.rows[0].count', result.rows)
          if (result.rows[0].count > 0) {
            alert('요청한 임무를 공급자가 이미 수락하여 변경할 수 없습니다.')
            return
          }
        } catch (err) {
          console.log(err)
        }

        let isDiff = false
        for (let j in this.missionTypes) {
          let missionType = this.missionTypes[j]
          console.log('missionType: '+missionType)
          let isExist = false
          for (let i in this.mission_request.missions) {
            let mission = this.mission_request.missions[i]
            console.log('mission.mission_type: '+mission.mission_type)
            if (String(mission.mission_type) == missionType) {
              isExist = true
              break
            }
          }

          if (isExist == false) {
            isDiff = true
            break
          }
        }

        if (isDiff == true || (this.missionTypes.length !== this.mission_request.missions.length)) {
          //변경사항이 있으면 삭제하고 다시 추가
          try {
            let info = {
              mission_request_id: this.missionRequestId
            }
            let result = await dbAPI.query('delete.request_mission_type.me', info)
            console.log(JSON.stringify(result.rows))
          } catch (err) {
            console.log(err)
          }

          for (let i in this.missionTypes) {
            let requestMissionType = {
              'mission_request_id': this.missionRequestId,
              'mission_type': this.missionTypes[i],
              'description': ''
            }

            try {
              let result = await dbAPI.query('insert.request_mission_type', requestMissionType)
              if (result.rowCount > 0) {
                console.log(JSON.stringify(result.rows))
              }
            } catch (err) {
              console.log(err)
            }
          }
        }


        let _req_dat = StringUtil.getConvertDateFormat(new Date(), 'YYYY-MM-DD')
        const missionRequestInfo = {
          mission_request_id: this.missionRequestId,
          //req_dat: _req_dat,
          comment: this.comment,
          wish_dat: this.wish_dat,
          area_id: _area_id,
          crop_id: _crop_id,
          operator_id: _provider_user_id,
          blight_id: _blight_id,
          wish_spray_material: this.selected_spray_material,
          mr_state: 1
        }

        // alert(JSON.stringify(missionRequestInfo))
        try {
          let result = await dbAPI.query('update.mission_request.me', missionRequestInfo)
          if (result.rowCount >= 1) {
            console.log(result.rows)
            // alert("update.mission_request 쿼리 성공입니다")
          }
        } catch (err) {
          console.log(err)
          // alert("실패입니다")
        }

        //alert('### mission_request_id: '+_mission_request_id)

        //공급자에서 미션을 하나라도 생성하였으면 ReadOnly로 할지?

        // for (let i in missionData) {
        //   let rmt_id = missionData[i].request_mission_type_id
        //   for (let j in this.missionTypes) {
        //     let requestMissionType = {
        //       'mission_request_id':this.missionRequestId,
        //       'mission_type': this.missionTypes[j],
        //       'description': ''
        //     }

        //     //(JSON.stringify('requestMissionType json>>> '+requestMissionType))
        //     try {
        //       // insert value (....), (....), (....), ... request_mission_type
        //       let result = await dbAPI.query('insert.request_mission_type', requestMissionType)
        //       if (result.rowCount >= 1) {
        //         console.log(JSON.stringify(result.rows))
        //         alert("insert.request_mission_type 쿼리 성공입니다")
        //       }
        //     }
        //     catch(err) {
        //       console.log(err)
        //       alert("실패입니다")
        //     }
        //   }
        // }

        this.closePopup()
      },

      async reMissionRequest() {
        if (this.mission_request.mr_state === 2) {

        }
      },

      changeSelectArea(area) {
        console.log('[changeSelectArea] area id: ', area.id)
        let areaInfo = this.region_items.filter((data) => {
          return data.area_id === area.id
        })

        console.log('[changeSelectArea] areaInfo : ', areaInfo)
        this.setAreaBoundary(areaInfo[0].area_boundary)
      },

      setAreaBoundary(boundary) {
        console.log('[setAreaBoundary] boundary : ', boundary)
        let areaList = AreaUtil.getConvertDBToMapJson(boundary.area)
        this.setAreaList(areaList)
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@font-face {
  font-family: 'GmarketSansMedium';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
.font1{
  font-family: 'GmarketSansMedium';
}
</style>
