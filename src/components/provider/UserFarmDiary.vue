<template>
  <div>
    <!------------------------ 영농 일지 화면에 채울 내용 ----------BEGIN--------------->
    <v-container fluid>
      <v-layout column wrap class="ml-auto">
        <v-card class="card-header" color="#E6EDFF">
          <v-container fluid>
            <v-layout align-center justify-center row wrap>
              <v-flex class="card-header-title">
                <v-layout align-center jusify-center wrap>
                  <img src="@/assets/prepand_title.png" />
                  <span class="ml-1">고객 영농 일지</span>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <v-layout row>
          <!-- 현재 영역의 해상도 기반으로 동작하는데 여기선 md로 인식됨 12칸중 3칸 차지  xs sm md 등등..-->
          <v-flex xs12>
            <v-data-table
              :headers="userHeaders"
              :expand="true"
              :items="userData"
              item-key="id"
              ref="farmDiaryTable"
              hide-actions
            >
              <template v-slot:items="props">
                <tr @click="props.expanded = !props.expanded">
                  <td class="text-xs-center">{{ props.item.full_name }}</td>
                  <td class="text-xs-center">{{ props.item.tel_num }}</td>
                  <td class="text-xs-center">{{ props.item.address_basic }}</td>
                  <td class="text-xs-center">{{ props.item.email }}</td>
                  <td class="text-xs-center">{{ convertDate(props.item.req_dat) }}</td>
                </tr>
              </template>
              <template v-slot:expand="props">
                <v-container>
                <v-layout row>
                  <v-flex xs6 pa-3>
                    <v-list dense>
                      <v-list-tile>
                        <v-list-tile-content>관리 영역:</v-list-tile-content>
                        <v-list-tile-content class="align-end">
                          <v-select
                            placeholder="관리 영역을 선택하세요"
                            v-model="selected_area"
                            :items="region_infos"
                            item-text="area_name"
                            return-object
                            @change="loadArea"
                          ></v-select>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile v-if="selected_area && selected_area.crop_name">
                        <v-list-tile-content>작물:</v-list-tile-content>
                        <v-list-tile-content
                          class="align-end"
                        >{{ selected_area.crop_name }} ({{ selected_area.variety }})</v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                    <CropDiseaseInfo
                      v-if="selected_area && selected_area.crop_name"
                      :cropName="selected_area.crop_name"
                    />
                  </v-flex>
                  <v-flex xs6 pa-3>
                    <area-map class="areaMap" :areaId="selected_area.area_id" :userId="$route.params.user_id"></area-map>
                  </v-flex>
                </v-layout>
                </v-container>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-container>
    <v-timeline align-top dense clipped v-if="diary_items.length > 0">
      <v-timeline-item color="pink" small v-for="(item, i) in diary_items" :key="i">
        <v-layout pt-3>
          <v-flex xs3>
            <div>
              <strong>{{ item.date.toDateString() }}</strong>
            </div>
            <div>
              <strong>{{ item.date.toTimeString() }}</strong>
            </div>
            <div v-if="item.sunshine">일조량: {{ item.sunshine }}</div>
            <div v-if="item.rainfall">강수량: {{ item.rainfall }} mm</div>
            <div v-if="item.temperature">기온: {{ item.temperature }} ℃</div>
            <div v-if="item.number_of_persons">작업인원: {{ item.number_of_persons }} 명</div>
            <div v-if="item.number_of_employees">고용노동: {{ item.number_of_employees }} 명</div>
            <div v-if="item.number_of_persons">자가노동: {{ item.number_of_persons - item.number_of_employees }} 명</div>
            <div v-if="item.farming_tasks">작업내용: {{ Array.isArray(item.farming_tasks) ? item.farming_tasks.join(',') : item.farming_tasks }}</div>
            <div v-if="item.farming_task_other">기타작업: {{ item.farming_task_other }}</div>
          </v-flex>
          <v-flex xs9>
            <v-card ma-3>
              <v-card-title primary-title>
                <v-layout row>
                  <v-flex xs1 pa-1>
                    <v-layout justify-center align-center>
                      <v-flex v-show="item.first_storage_id">
                        <v-img
                          :src="storageUrl(item.first_storage_id)"
                          aspect-ratio="1.3333"
                          position="center center"
                          class="grey lighten-2"
                          max-width="64px"
                        ></v-img>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex grow pa-1>
                    <div>
                      <div class="headline">{{ item.subject }}</div>
                      <!-- <div class="grey--text">{{ item.date }}</div>
                      <v-spacer/>-->
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-slide-y-transition>
                <v-responsive max-width="100%">
                  <v-container>
                    <v-layout justify-center align-center>
                      <v-flex xs12>
                        <div v-html="item.content" :class="{'ql-editor': true, 'ql-editor-folded': !item.unfolded}" style></div>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-responsive>
              </v-slide-y-transition>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn icon @click="item.unfolded = !item.unfolded">
                  <v-icon>
                    {{
                    item.unfolded
                    ? 'keyboard_arrow_up'
                    : 'keyboard_arrow_down'
                    }}
                  </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-timeline-item>
      <v-timeline-item hide-dot>
        <v-layout pt-3>
          <v-flex xs2></v-flex>
          <v-flex>
            <div class="text-xs-center">
              <v-pagination
                v-model="pagination.page"
                :length="pagination.pageLength"
                @input="pageChanged"
              ></v-pagination>
            </div>
          </v-flex>
        </v-layout>
      </v-timeline-item>
    </v-timeline>
    <v-layout v-else>
      <v-container v-if="loading" class="text-xs-center">
        <v-layout>
          <v-flex text-xs-center>
            <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container v-else>
        <v-layout>
          <v-flex text-xs-center>
            <v-card>
              <v-card-text>작성된 일지가 없습니다.</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
  </div>
</template>

<script>
import dbAPI from '@/utils/api/dbAPI'
import storageAPI from '@/utils/api/storageAPI'
import StringUtil from '@/utils/utils/stringUtil'
import AreaMap from '@/components/common/AreaMap'
import CropDiseaseInfo from '@/components/common/CropDiseaseInfo'

export default {
  name: 'UserFarmDiary',
  components: {
    AreaMap,
    CropDiseaseInfo
  },
  data: () => {
    return {
      userHeaders: [
        { text: '이름', align: 'center', sortable: false, value: 'full_name' },
        {
          text: '전화번호',
          align: 'center',
          sortable: false,
          value: 'tel_num'
        },
        {
          text: '주소',
          align: 'center',
          sortable: false,
          value: 'address_basic'
        },
        { text: '이메일', align: 'center', sortable: false, value: 'email' },
        {
          text: '최근 요청일',
          align: 'center',
          sortable: false,
          value: 'req_dat'
        }
      ],

      userData: [],

      region_infos: [],
      selected_area: { area_id: -1, area_name: '' },
      diary_items: [],
      area_images: null,
      pagination: {
        page: 1,
        pageLength: 0,
        pageLimit: 3
      },
      loading: false
    }
  },
  async created() {
    this.loadMissionUserInfo()
    this.loadAreaList()
  },
  computed: {},
  methods: {
    storageUrl(storage_id) {
      if (storage_id == null || storage_id == -1) return ''
      return storageAPI.downloadImageUrl(storage_id, 'thumb')
    },
    async loadMissionUserInfo() {
      try {
        let result = await dbAPI.query(
          'select.user.mission_request.operator_id',
          { user_id: this.$route.params.user_id }
        )
        if (result.rowCount > 0) {
          console.log(result.rows)
          this.userData = result.rows
          this.$nextTick(() => {
            for (let i = 0; i < this.userData.length; i += 1) {
              this.$set(
                this.$refs.farmDiaryTable.expanded,
                this.userData[i].id,
                true
              )
            }
          })

        }
      } catch (err) {
        console.log(err)
      }
    },
    async loadAreaList() {
      this.loading = true

      try {
        let result = await dbAPI.query('select.area.user.with.crop', {
          user_id: this.$route.params.user_id
        })
        if (result.rowCount > 0) {
          console.log(result.rows)
          this.region_infos = result.rows
          this.selected_area = this.region_infos[0]
          await this.loadArea(this.selected_area)

          //alert('selected area:'+this.selected_area+', area_id: '+this.selected_area_id)
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    // area_id 연관 파일 이미지 목록 받아오기
    async loadAreaImages() {
      try {
        const tagPattern = `area:${this.selected_area.area_id}, diary:%`
        console.log('[search tag] ', tagPattern)
        let response = await storageAPI.searchImagesByTagPattern(tagPattern)
        console.log(JSON.stringify(response))
        if (response.message.indexOf('OK') > -1) {
          this.area_images = response.files
        }
      } catch (err) {
        console.log(err)
      }
    },
    async loadArea(selected_area) {
      console.log('selected area: ', selected_area)
      this.pagination.pageLength = 0
      this.pagination.page = 1
      this.loading = true

      try {
        const result = await dbAPI.query(
          'select.farm_diary.user.area_id.count',
          {
            user_id: this.$route.params.user_id,
            area_id: selected_area.area_id
          }
        )
        if (result.rowCount == 1) {
          this.pagination.pageLength = Math.ceil(
            result.rows[0].count / this.pagination.pageLimit
          )
          console.log(
            `total pages: ${this.pagination.pageLength} / ${result.rows[0].count}`
          )
          await this.loadDiaries()
        }
      } catch (err) {
        console.log(err)
      }

      this.loading = false
    },
    async loadDiaries() {
      this.diary_items = []
      this.loading = true

      await this.loadAreaImages()

      // area_id 연관 일지 받아오기
      try {
        let result = await dbAPI.query(
          'select.farm_diary.user.area_id.paging',
          {
            user_id: this.$route.params.user_id,
            area_id: this.selected_area.area_id,
            limit: this.pagination.pageLimit,
            offset: this.pagination.pageLimit * (this.pagination.page - 1)
          }
        )
        if (result.rowCount == 0) {
          return
        }

        for (let i in result.rows) {
          let row = result.rows[i]

          //alert('selected_area_id: '+ this.selected_area_id + ' => row.area_id: '+info.area_id)
          const diary_images = this.area_images.filter(v =>
            v.tag.endsWith(`diary:${row.diary_id}`)
          )
          const first_storage_id =
            diary_images.length > 0 ? diary_images[0].id : null

          let diary = {
            diary_id: row.diary_id,
            date: new Date(row.working_date),
            subject: row.subject,
            content: row.content,
            sunshine: row.sunshine,
            rainfall: row.rainfall_mm,
            temperature: row.temperature_c,
            number_of_persons: row.number_of_persons,
            number_of_employees: row.number_of_employees,
            farming_tasks: row.farming_tasks,
            farming_task_other: row.farming_task_other,
            working_date: new Date(row.working_date),
            diary_images: diary_images,
            first_storage_id: first_storage_id,
            unfolded: false
          }

          this.diary_items.push(diary)
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    async pageChanged(page) {
      console.log('new page: ', page)
      await this.loadDiaries()
    },
    convertDate(date) {
      return StringUtil.getConvertDateFormat(date, 'YYYY.MM.DD')
    }
  }
}
</script>

<style scoped>
.ql-editor-folded {
  height: 100px;
}
.ql-editor >>> img {
  max-width: 100%;
}
</style>
