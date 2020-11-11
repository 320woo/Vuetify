<template>
  <v-container fluid>
    <v-flex xs12 sm12 md12>
      <v-layout column>
        <div class="headline">홍길동 - 유곡리 농지 - 가을 배추 - 촬영</div>
        <v-divider></v-divider>
        <v-card color="purple" class="white--text">
          <v-layout row>
            <v-layout column>
              <v-flex xs1>
                <v-card-title primary-title>
                  <v-layout wrap align-center justify-center>
                    <div class="headline">2019.03.08</div>
                    <div class="subheading">오전 11:10</div>
                  </v-layout>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-divider vertical></v-divider>
            <v-flex xs11>
              <v-card-text>
                <v-layout row>
                  <v-flex xs2>
                    <v-card flat tile class="d-flex">
                      <v-img
                        :src="`https://picsum.photos/500/300?image=10`"
                        aspect-ratio="1"
                        class="grey lighten-2"></v-img>
                    </v-card>
                  </v-flex>
                  <v-flex xs10 pl-3>
                    <v-layout column wrap align-start fill-height>
                      <v-layout row wrap align-center justify-center>
                        <div class="headline text-sm-left">2019.04.10</div>
                        <v-spacer></v-spacer>
                        <v-btn>history</v-btn>
                      </v-layout>
                      <v-layout row wrap align-center justify-center>
                        <v-btn>Waypoint plan</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn>Waypoint</v-btn>
                      </v-layout>
                      <v-layout row wrap align-center justify-center>
                        <v-btn>원본보기</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn>GCS에 내보내기</v-btn>
                      </v-layout>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-card>
      </v-layout>

      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
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
            ></v-checkbox>
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
          <!-- <td class="text-xs-right justify-end pr-3">
            <v-btn icon
                   class="ma-0"
                   ripple
                   @click.prevent="_onClickImage(props.item.id)">
              <v-icon color="grey"
                      dark
                      small>
                panorama
              </v-icon>
            </v-btn>
          </td> -->
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
        <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
      </div>



        <!-- <v-card>
          <v-toolbar flat>
            <v-btn icon>
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title>Albums</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>search</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container fluid grid-list-sm>
            <v-layout row wrap>
              <v-flex v-for="item in FileList" :key="item" xs1>
                <v-card>
                  <v-layout class="ma-1"
                      align-center
                      justify-center>
                    <img :src="_getStorageFileIcon(item.org_nm)" width="32px">
                  </v-layout>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          <v-subheader>May</v-subheader>
          <v-footer class="mt-5"></v-footer>
        </v-card> -->


    </v-flex>
  </v-container>
</template>

<script>
import storageAPI from '@/utils/api/storageAPI'
import StringUtil from '@/utils/utils/stringUtil'

export default {
  name: "MissionHistory",
  components: {  },
  data: () => ({
    headers: [
      {
        text: '구분',
        align: 'center',
        value: 'image_thumbnail'
      },
      {text: '이름', align: 'right', sortable: false, value: 'org_nm'},
      {text: '용량', align: 'right', sortable: false, value: 'size'},
      {text: '등록일', align: 'right', value: 'req_time'},
      {text: '설명', align: 'right', value: 'comment'},
      {text: '태그', align: 'right', value: 'tag'},

      // {text: '위도', align: 'right', sortable: false, value: 'lat'},
      // {text: '경도', align: 'right', sortable: false, value: 'lon'},
      // {text: '고도', align: 'right', sortable: false, value: 'alt'},
      // {text: '동작', align: 'right', sortable: false, value: 'action'}
    ],
    isShowComponent: false,
    search: "",
    pagination: {},

    selected: [],
    selectAll: false,
    FileList: [],
  }),
  async created() {
    console.log("[MissionHistory] created")
    try {
      const response = await storageAPI.searchFiles()
      console.log("[MissionHistory] response : ", response.data.files)
      this.FileList = response.data.files
      this.isShowComponent = true
    } catch (err) {
      console.log(err)
    }
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
      if (fileext == "PDF") {
        return require("@/assets/icon_pdf.svg")
      }
      else if (fileext == "DOC" || fileext == "DOCX") {
        return require("@/assets/icon_doc.svg")
      }
      else if (fileext == "XLS" || fileext == "XLSX") {
        return require("@/assets/icon_xls.svg")
      }
      else if (fileext == "PPT" || fileext == "PPTX") {
        return require("@/assets/icon_ppt.svg")
      }
      else if (fileext == "JPG" || fileext == "JPGE" || fileext == "GIF" || fileext == "PCX" || fileext == "TIFF" || fileext == "TIF" || fileext == "PNG") {
        return this._getStorageFileUrl(fid)
        // return require("@/assets/icon_images.svg")
      }
      return require("@/assets/icon_none.svg")
    },
    _getStorageFileUrl(fid) {
      return storageAPI.downloadImageUrl(fid, "thumb")
      // return FileAPI.FileManagerUrl(this.task, FileAPI.FileId(fid)).thumbnailUrl
    },

    _formatDate(paramdate)  {
      return StringUtil.getConvertDateFormat(paramdate, "YYYY-MM-DD");
    }
  },
  computed: {
    _getFileList() {
      return this.FileList
    },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }

  }

}
</script>

<style scoped>

</style>
