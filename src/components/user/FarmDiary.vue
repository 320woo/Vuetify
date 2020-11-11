<template>
  <v-container fluid>
    <v-layout column wrap class="ml-auto">
      <v-card class="task_header_card" color="#E6EDFF">
        <v-container fluid>
          <v-layout align-center justify-center row wrap>
            <v-flex class="card-header-title">
              <v-layout align-center jusify-center wrap>
                <img src="@/assets/prepand_title.png" />
                <span class="ml-1">영농 일지</span>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
      <v-card>
        <v-container fluid>
          <v-layout row>
            <v-flex shrink>
              <v-btn @click="openEditorDialog">글쓰기</v-btn>
              <v-btn @click="openOrthDialog">정사영상</v-btn>
            </v-flex>
            <v-flex xs6 px-3>
              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>영역:</v-list-tile-content>
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
                  <v-list-tile-content class="align-end">
                    {{ selected_area.crop_name }} ({{
                    selected_area.variety
                    }})
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <CropDiseaseInfo
                v-if="selected_area && selected_area.crop_name"
                :cropName="selected_area.crop_name"
              />
            </v-flex>
            <v-flex xs6 pa-3>
              <area-map class="areaMap" :areaId="selected_area.area_id"></area-map>
            </v-flex>
          </v-layout>

          <!------------------------ 영농 일지 화면에 채울 내용 ----------BEGIN--------------->
          <v-timeline align-top dense clipped v-if="diary_items.length > 0">
            <v-timeline-item
              color="pink"
              small
              v-for="(item, i) in diary_items"
              :key="i"
              :id="`diary_id_${item.diary_id}`"
            >
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
                      <v-layout column>
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
                      </v-layout>
                    </v-card-title>
                    <v-slide-y-transition>
                      <v-responsive max-width="100%">
                        <v-container>
                          <v-layout justify-center align-center>
                            <v-flex xs12>
                              <div
                                v-html="item.content"
                                :class="{'ql-editor': true, 'ql-editor-folded': !item.unfolded}"
                                style
                              ></div>
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
                      <v-spacer />
                      <v-btn
                        flat
                        @click="
                          modifyDiaryDialog(item)
                        "
                      >수정</v-btn>
                      <v-btn flat color="purple" @click="deleteDiary(item.diary_id)">삭제</v-btn>
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
                    <v-card-text>주기적인 작성이 필요함</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-layout>
          <diary-writing-dialog
            v-if="writingDialog"
            @close="closeDiaryWritingDialog()"
            :areaId="selected_area.area_id"
            :cropName="selected_area.crop_name"
            :area_boundary="selected_area.area_boundary"
            :diary="sel_diary"
          ></diary-writing-dialog>
        </v-container>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import DiaryWritingDialog from '@/components/user/dialog/DiaryWritingDialog'
import dbAPI from '@/utils/api/dbAPI'
import storageAPI from '@/utils/api/storageAPI'
import AreaMap from '@/components/common/AreaMap'
import CropDiseaseInfo from '@/components/common/CropDiseaseInfo'

export default {
  name: 'FarmDiary',
  components: {
    DiaryWritingDialog,
    AreaMap,
    CropDiseaseInfo
  },
  data: () => {
    return {
      writingDialog: false,
      region_infos: [],
      selected_area: { area_id: -1, area_name: '' },
      diary_items: [],
      sel_diary: null,
      missionId: null,
      area_images: null,
      scrollToDiaryId: null,
      pagination: {
        page: 1,
        pageLength: 0,
        pageLimit: 3
      },
      loading: false
    }
  },
  async created() {
    console.log('query:', this.$route.query)
    await this.loadAreaList(this.$route.query.diary_id)
  },
  computed: {},
  methods: {
    storageUrl(storage_id) {
      if (storage_id == null || storage_id == -1) return ''
      return storageAPI.downloadImageUrl(storage_id, 'thumb')
    },
    async loadAreaList(diaryId) {
      this.loading = true

      try {
        const result = await dbAPI.query('select.area.me.with.crop') //, {})//, areaListInfo)
        if (result.rowCount > 0) {
          console.log(result.rows)
          this.region_infos = result.rows
          if (diaryId) {
            await this.findDiary(diaryId)
          } else {
            this.selected_area = this.region_infos[0]
            await this.loadArea(this.selected_area)
          }

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
    async findDiary(diaryId) {
      console.log('find diary_id: ', diaryId)

      this.pagination.pageLength = 0
      this.pagination.page = 1
      this.loading = true

      try {
        const result = await dbAPI.query('select.farm_diary.me.find', {
          diary_id: diaryId
        })
        if (result.rowCount == 1) {
          const row = result.rows[0]
          this.pagination.pageLength = Math.ceil(
            row.count / this.pagination.pageLimit
          )
          console.log(
            `total pages: ${this.pagination.pageLength} / ${row.count}`
          )
          this.pagination.page = Math.ceil(
            row.row_number / this.pagination.pageLimit
          )

          this.selected_area =
            this.region_infos.find(region => region.area_id == row.area_id) ||
            this.region_infos[0]
          this.scrollToDiaryId = diaryId

          await this.loadDiaries()
        } else {
          this.selected_area = this.region_infos[0]
          await this.loadArea(this.selected_area)
        }
      } catch (err) {
        console.log(err)
      }

      this.loading = false
    },
    async loadArea(selected_area) {
      console.log('selected area: ', selected_area)
      this.pagination.pageLength = 0
      this.pagination.page = 1
      this.loading = true

      try {
        const result = await dbAPI.query('select.farm_diary.me.area_id.count', {
          area_id: selected_area.area_id
        })
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
        let result = await dbAPI.query('select.farm_diary.me.area_id.paging', {
          area_id: this.selected_area.area_id,
          limit: this.pagination.pageLimit,
          offset: this.pagination.pageLimit * (this.pagination.page - 1)
        })
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
            date: new Date(row.created_time),
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

        this.$nextTick(() => {
          if (this.scrollToDiaryId) {
            const elem = document.getElementById(
              `diary_id_${this.scrollToDiaryId}`
            )
            if (elem) {
              elem.scrollIntoView(true)
            }
            this.scrollToDiaryId = null
          }
        })
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
    async deleteDiary(diary_id) {
      let diaryInfo = {
        diary_id: diary_id
      }

      console.log('[deleteDiary] try to delete a diary:' + diary_id)
      await dbAPI.query('delete.farm_diary', diaryInfo)

      await this.loadDiaries()
    },
    openEditorDialog() {
      this.sel_diary = null

      // alert('글씨기 화면... 입력항목(제목, 내용, 이미지 파일 등) => HTML 에디터 연동 필요~')
      this.writingDialog = true
    },
    openOrthDialog() {
      alert('파일 업로드후 정사영상 제작 요청 화면..')
    },
    modifyDiaryDialog(diaryItem) {
      //alert('[modifyDiaryDialog] diary_id: '+diary_id + ', title: '+title)

      this.sel_diary = diaryItem

      // alert('글씨기 화면... 입력항목(제목, 내용, 이미지 파일 등) => HTML 에디터 연동 필요~')
      this.writingDialog = true
    },
    async closeDiaryWritingDialog() {
      this.writingDialog = false
      if (this.sel_diary == null) {
        // 첫 페이지로 이동
        this.pagination.page = 1
      }
      await this.loadDiaries()
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
