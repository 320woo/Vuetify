<template>
  <v-layout row justify-center>
    <v-dialog v-model="isShowDialog" persistent content content-class="centered-dialog" max-width="900">
      <v-card>
        <v-toolbar flat>
          <v-spacer/>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          />
        </v-toolbar>
        <v-data-table v-if="isShowComponent"
                      :headers="headers"
                      :items="_getFileList"
                      v-model="selected"
                      :search="search"
                      :pagination.sync="pagination"
                      select-all
                      class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>
              <v-checkbox
                v-model="props.selected"
                primary
                hide-details
              />
              <!-- <label class="form-checkbox">
                  <input type="checkbox" :value="props.item.id" v-model="selected">
                <i class="form-icon"></i>
                </label> -->
            </td>
            <td>
              <v-layout class="ma-1"
                        align-center
                        justify-center>
                <img :src="_getStorageFileIcon(props.item.org_nm, props.item.id)" width="48px">
              </v-layout>
            </td>
            <td class="text-xs-right">{{ props.item.org_nm}}</td>
            <td class="text-xs-right">{{ props.item.org_size }}</td>
            <td class="text-xs-right">{{ _formatDate(props.item.req_time) }}</td>
            <td class="text-xs-right">{{ props.item.comment }}</td>
            <td class="text-xs-right">{{ props.item.tag }}</td>

            <!-- <td class="text-xs-right">{{ props.item.gps_lat }}</td>
            <td class="text-xs-right">{{ props.item.gps_lng}}</td>
            <td class="text-xs-right">{{ props.item.gps_alt }}</td> -->
          </template>
          <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="warning">
              Your search for "{{ search }}" found no results.
            </v-alert>
          </template>
          <template slot="no-data">
            <v-alert :value="true" color="error" icon="warning">
              이미지가 존재하지 않습니다.
            </v-alert>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages" total-visible="11"/>
        </div>
        <v-spacer/>
        <v-layout row
                  fill-height
                  justify-end
                  mr-3>
          <v-btn class="header-menu mr-0"
                 color="blue"
                 @click="_onClickImageSelect"
                 dark ripple small>
            <v-icon class="pr-1">
              check_circle
            </v-icon>
            확인
          </v-btn>
          <v-btn class="header-menu mr-0"
                 color="blue"
                 @click="_onClickCancel"
                 dark ripple small>
            <v-icon class="pr-1">
              remove_circle
            </v-icon>
            취소
          </v-btn>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import taskAPI from '@/utils/api/taskAPI'
  import storageAPI from '@/utils/api/storageAPI'
  import StringUtil from '@/utils/utils/stringUtil'

  export default {
    name: 'SearchUploadedFile',
    props: {
      project_id: {
        type: String,
        default: null
      },
      task_id: {
        type: String,
        default: null
      },
      isShowDialog: {
        type: Boolean,
        default: false
      },
      FileList: {
        type: Array,
        default: []
      },
      algorithm: {
        type: String,
        default: null
      },
      mission_name: {
        type: String,
        default: null
      }
    },
    components: {},
    data: () => ({
      headers: [
        {
          text: '구분',
          align: 'center',
          value: 'image_thumbnail'
        },
        { text: '이름', align: 'right', sortable: false, value: 'org_nm' },
        { text: '용량', align: 'right', sortable: false, value: 'size' },
        { text: '등록일', align: 'right', value: 'req_time' },
        { text: '설명', align: 'right', value: 'comment' },
        { text: '태그', align: 'right', value: 'tag' }

        // {text: '위도', align: 'right', sortable: false, value: 'lat'},
        // {text: '경도', align: 'right', sortable: false, value: 'lon'},
        // {text: '고도', align: 'right', sortable: false, value: 'alt'},
        // {text: '동작', align: 'right', sortable: false, value: 'action'}
      ],
      isShowComponent: false,
      search: '',
      pagination: {},

      selected: [],
      selectAll: false
    }),
    // async updated() {
    //   console.log("[SearchUploadedFile] updated")
    //   try {
    //     const response = await storageAPI.searchFiles()
    //     console.log("[SearchUploadedFile] response : ", response.data.files)
    //     this.FileList = response.data.files
    //     this.isShowComponent = true
    //   } catch (err) {
    //     console.log(err)
    //   }
    // },
    async created() {
      console.log('[SearchUploadedFile] created')

      // try {
      //   const response = await storageAPI.searchFiles()
      //   console.log("[SearchUploadedFile] response : ", response.data.files)
      //   this.FileList = response.data.files
      //   this.isShowComponent = true
      // } catch (err) {
      //   console.log(err)
      // }
    },
    methods: {
      _getExtention(org_nm) {
        // console.log("_getExtention : ", org_nm)
        let last_dot = org_nm.lastIndexOf('.')
        let ext = org_nm.slice(last_dot + 1)
        let name = org_nm.slice(0, last_dot)
        return ext.toUpperCase()
      },
      _getStorageFileIcon(org_nm, fid) {
        var fileext = this._getExtention(org_nm)
        // console.log("_getExtention : ", fileext)
        if (fileext == 'PDF') {
          return require('@/assets/icon_pdf.svg')
        } else if (fileext == 'DOC' || fileext == 'DOCX') {
          return require('@/assets/icon_doc.svg')
        } else if (fileext == 'XLS' || fileext == 'XLSX') {
          return require('@/assets/icon_xls.svg')
        } else if (fileext == 'PPT' || fileext == 'PPTX') {
          return require('@/assets/icon_ppt.svg')
        } else if (fileext == 'JPG' || fileext == 'JPGE' || fileext == 'GIF' || fileext == 'PCX' || fileext == 'TIFF' || fileext == 'TIF' || fileext == 'PNG') {
          return this._getStorageFileUrl(fid)
          // return require("@/assets/icon_images.svg")
        }
        return require('@/assets/icon_none.svg')
      },
      _getStorageFileUrl(fid) {
        return storageAPI.downloadImageUrl(fid, 'thumb')
        // return FileAPI.FileManagerUrl(this.task, FileAPI.FileId(fid)).thumbnailUrl
      },

      _formatDate(paramdate) {
        return StringUtil.getConvertDateFormat(paramdate, 'YYYY-MM-DD')
      },

      async _onClickImageSelect() {
        // 선택된 이미지들에 대한 id 를 모아서 [ id, id, ... , id ] 배열화 하여
        var storageids = []
        console.log('[_onClickImageSelect] item ', item)
        for (var i = 0; i < this.selected.length; i++) {
          var item = this.selected[i]
          console.log('[_onClickImageSelect] item ', item)
          storageids.push(item.id)
        }
        console.log('[_onClickImageSelect] storageids : ', storageids)
        console.log('[_onClickImageSelect] project_id : ', this.project_id, ', task_id : ', this.task_id)
        // task 에 setimage 수행
        let setImageRequestParam = {
          project_id: this.project_id,
          task_id: this.task_id,
          storagefiles: storageids
        }
        const setImageResponse = await taskAPI.setImageInfoToTask(setImageRequestParam)
        console.log(
          '[_onClickImageSelect] setImageResponse : ',
          setImageResponse
        )

        //=============================================================================
        let resp = await storageAPI.searchImagesByStorageIds(storageids)
        //console.log('####### [searchImagesByStorageIds] response: ', resp)

        let images = resp.data.files//this.getUploadFiles
        console.log('[_onClickImageSelect]', images)
        if (images.length > 0) {
          if (images[0].gps_time) {
            let generatedDateTime = images[0].gps_time
            console.log('[_onClickImageSelect] generatedDateTime: ' + generatedDateTime)

            let payload = {
              project_id: this.project_id,
              task: {
                task_id: this.task_id,
                algorithm: this.algorithm,
                name: this.mission_name,
                base_date: generatedDateTime
              }
            }
            console.log('[_onClickImageSelect] updateTask info: ', payload)
            await taskAPI.updateTask(payload)
          } else {
            console.log('[_onClickImageSelect] there is no exif info')
          }
        } else {
          console.log('[_onClickImageSelect] there is no imageList')
        }
        //=============================================================================


        this.$emit('close')
      },
      _onClickCancel() {
        this.$emit('close')
      }

    },
    computed: {
      _getFileList() {
        return this.FileList
      },
      pages() {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
        ) return 0

        return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      }
    },
    watch: {
      FileList() {
        this.isShowComponent = true
      }
    }
  }
</script>

<style scoped>

</style>
