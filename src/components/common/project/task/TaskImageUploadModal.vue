<template>
  <v-card class="content">
    <file-upload
      :post-action="actionUrl"
      :multiple="true"
      :drop="true"
      :drop-directory="true"
      @input="updateFiles"
      @input-file="inputFile"
      @input-filter="inputFilter"
      :accept="accept"
      v-model="files"
      ref="upload">
    </file-upload>
    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
      <h3>파일을 여기에 드래그 하세요</h3>
    </div>
    <v-toolbar flat color="white">
      <v-toolbar-title>파일 업로드</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-btn
        v-if="validGeoTiffAlgorithm()"
        color="primary"
        :disabled="disableFileUpload()"
        dark
        @click.prevent="$refs.upload.active == true"
        @click="addFiles()"
      >
        + 파일 추가
      </v-btn>
      <v-menu offset-y v-else>
        <v-btn
          slot="activator"
          color="primary"
          dark
          @click.prevent="$refs.upload.active == true"
          @click="addFiles"
        >
          + 파일 추가
        </v-btn>
        <!-- <v-list>
          <v-list-tile
            v-for="(item, index) in selectMenuItems"
            :key="index"
            @click="selectMenu(item)"
          >
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list> -->
      </v-menu>
      <v-btn v-if="files.length > 0" color="primary" dark @click="startUpload" @click.prevent="$refs.upload.active == true">
        업로드 시작
        <v-icon right dark>cloud_upload</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container fluid>
    <v-layout align-center justify-center row fill-height>
      <v-flex xs12>
        <center v-if="addingFiles">
        <label>파일 추가 중.. </label>
          <v-progress-circular
            indeterminate
            color="red"
          ></v-progress-circular>
        </center>
        <center v-else-if="files.length == 0">
          <label>업로드할 파일을 드래그 하세요</label>
        </center>
        <center v-else>
          <div v-if="$refs.upload && ($refs.upload.active == true || $refs.upload.uploaded)">
            <v-progress-circular
              :rotate="-90"
              :size="100"
              :width="15"
              :value="uploadingProgress"
              color="primary"
            >
            {{ uploadingProgress }}
            </v-progress-circular>
            <br>
            <label>{{ humanSize((uploadingProgress / 100) * totalSize) }} / {{ humanSize(totalSize) }}</label>
          </div>
          <div v-else>
            <label>업로드할 파일: {{ files.length }} 개 / {{ humanSize(totalSize) }} </label>
          </div>
        </center>
      </v-flex>
    </v-layout>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="_closeModal">닫기</v-btn>
    </v-card-actions>
    <!-- <v-data-table
      :headers="headers"
      :items="files"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-right">{{ humanSize(props.item.size) }}</td>
        <td class="text-xs-right">{{ props.item.gpslat }}</td>
        <td class="text-xs-right">{{ props.item.gpslng }}</td>
        <td class="text-xs-right">{{ props.item.gpsalt }}</td>
        <td class="align-center justify-center layout px-0">
          <v-progress-circular v-if="props.item.active || props.item.progress !== '0.00'"
                               :rotate="360"
                               :size="30"
                               :width="2"
                               :value="parseFloat(props.item.progress)"
                               color="teal"
          ></v-progress-circular>
          <v-icon v-else
                  small
                  @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-container fluid>
          <v-layout align-center justify-center row fill-height>
            <v-flex xs12>
              <label>업로드할 파일을 드래그 하세요</label>
            </v-flex>
          </v-layout>
        </v-container>
      </template>
    </v-data-table> -->
  </v-card>
</template>

<script>
  import FileUpload from 'vue-upload-component'
  import FileAPI from '@/utils/api/fileAPI'
  import Constant from '@/components/common/constants'

  // const exifjs = require('exif-js')
  import { EXIF } from "@/utils/utils/exifex";

  export default {
    components: {
      FileUpload,
    },

    props: {
      project_id: {
        type: String,
        required: true
      },
      task: {
        type: Object,
        required: true,
      }
    },

    data: () => ({
      headers: [
        // {
        //   text: '썸네일',
        //   align: 'center',
        //   sortable: false,
        //   value: 'thumb'
        // },
        {text: '파일명', align: 'left', value: 'name', sortable: false},
        {text: '크기', align: 'right', value: 'size', sortable: false},
        {text: '위도', align: 'right', value: 'gpslat', sortable: false},
        {text: '경도', align: 'right', value: 'gpslng', sortable: false},
        {text: '고도', align: 'right', value: 'gpsalt', sortable: false},
        {text: '상태', align: 'center', value: 'name', sortable: false}
      ],
      files: [],
      addingFiles: false,
      accept: 'image/tiff,image/jpeg',
      extensions: 'jpg,jpeg,tif,tiff',

      editedIndex: -1,
      editedItem: {
        thumb: '',
        name: '',
        size: 0,
        gpslat: 0,
        gpslng: 0,
        gpsalt: 0,
      },
      defaultItem: {
        thumb: '',
        name: '',
        size: 0,
        gpslat: 0,
        gpslng: 0,
        gpsalt: 0,
      },
      selectMenuItems: [
        {title: '파일 추가'},
        {title: '폴더 추가'},
      ]
    }),

    computed: {
      actionUrl: function () {
        return FileAPI.FileManagerUrl({
          [FileAPI.PROJECT_ID]: this.project_id,
          [FileAPI.TASK_ID]: this.task.task_id
        }).uploadUrl
      },
      totalSize() {
        let res = this.files.reduce((acc, curr) => acc + curr.size, 0)
        return res
      },
      uploadingProgress() {
        let acc = this.files.reduce((acc, curr) => acc + parseFloat(curr.progress), 0)
        let res = acc / this.files.length
        return parseInt(res)
      }
    },

    watch: {
      files(newValue) {
        if (this.files === newValue) {
          return
        }
        this.addingFiles = false
      }
    },

    created() {
      this.clearFiles()
    },
    mounted() {
      this.$refs.upload.$parent.$el.addEventListener('drop', this.onDrop, false)
    },
    beforeDestroy() {
      try {
        this.$refs.upload.$parent.$el.removeEventListener('drop', this.onDrop, false)
      }
      catch(e) {
      }
    },
    methods: {
      onDrop(e) {
        console.log('onDrop')
        e.preventDefault()
        this.addingFiles = true
      },
      validGeoTiffAlgorithm() {
        // console.log("[validGeoTiffAlgorithm] task.algorithm : " + this.task.algorithm);
        return this.task.algorithm === Constant.TASK_ALGORITHM_GEOTIFF;
      },

      disableFileUpload() {
        return this.validGeoTiffAlgorithm() && this.files.length > 0;
      },

      humanSize: function (size) {
        var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
      },

      deleteItem(item) {
        const index = this.files.indexOf(item);
        /*confirm('삭제할라요?') && */
        this.files.splice(index, 1)

        if (!this.fileUploadEnable) {
          this.fileUploadEnable = true;
        }
      },

      selectMenu(item) {
        console.log(item.title);
        if (item.title === '파일 추가') {
          this.addFiles();
        }
        if (item.title === '폴더 추가') {
          this.addFolder();
        }
      },

      addFiles() {
        console.log('add files');
        let input = this.$refs.upload.$el.querySelector('input');

        this.directory = false;
        input.directory = false;
        input.webkitdirectory = false;
        input.multiple = !this.validGeoTiffAlgorithm();

        let oldFocusFunc = document.body.onfocus
        document.body.onfocus = () => {
          console.log('onfocus body')
          this.addingFiles = false
          document.body.onfocus = oldFocusFunc
        }
        this.addingFiles = true

        input.onclick = null;
        this.$nextTick(function() {
          input.click()
        })
      },

      async addFolder() {
        console.log('add folder');
        if (await !this.$refs.upload.features.directory) {
          // this.alert('Your browser does not support');
          await this.$store.dispatch('openGlobalModal', {
            modalTitle: '오류',
            modalContent: 'Your browser does not support'
          })
          return
        }

        let input = this.$refs.upload.$el.querySelector('input');
        input.directory = true;
        input.webkitdirectory = true;
        this.directory = true;

        input.onclick = null;
        input.click();
        input.onclick = (e) => {
          this.directory = false;
          input.directory = false;
          input.webkitdirectory = false;
        }
      },

      updateFiles(value) {
        console.log('update files')
        this.addingFiles = false
      },
      inputFile: function (newFile, oldFile) {
        // console.log('input newfile', newFile);
        // console.log('input oldfile', oldFile);
        if (newFile && !oldFile) {
          // Add file

          console.log('input file.add file')
        }
        if (newFile && oldFile) {
          // Update file
          if (newFile.active && newFile.xhr ) {
            try { newFile.xhr.withCredentials = true }
            catch (e) { }
          }

          // 개별 업로드 시작
          if (newFile.active !== oldFile.active) {
            console.log('Start upload', newFile.active, newFile)
          }

          // 개별 업로드 진행률
          if (newFile.progress !== oldFile.progress) {
            console.log('progress', newFile.progress, newFile)
          }

          // 개별 업로드 오류
          if (newFile.error !== oldFile.error) {
            console.log('error', newFile.error, newFile)
          }

          // 개별 업로드 성공
          if (newFile.success !== oldFile.success) {
            console.log('success', newFile.success, newFile)
          }

          // 개별 업로드 완료?
          if (!newFile.active && oldFile.active) {
            // Get response data
            console.log('response', newFile.response)
            if (newFile.xhr) {
              //  Get the response status code
              console.log('status', newFile.xhr.status)
            }
          }

          // 전체 완료?
          if (this.$refs.upload && this.$refs.upload.uploaded) {
            this.$emit('updateState', {name: 'uploaded'})
          }
        }
        if (!newFile && oldFile) {
          // Remove file
        }
      },

      validExtension(file) {
        if (this.validGeoTiffAlgorithm()) {
          return /\.(tif|tiff)$/i.test(file.name)
        } else {
          return /\.(jpeg|jpe|jpg)$/i.test(file.name)
        }
      },

      inputFilter: function (newFile, oldFile, prevent) {
        // console.log('input filter');
        if (newFile && !oldFile) {
          // Filter non-image file
          if (!this.validExtension(newFile)) {
            return prevent()
          }

          // console.log('newfile size: ', newFile.size)
          return

          // Create a blob field
          newFile.blob = ''
          let URL = window.URL || window.webkitURL
          if (URL && URL.createObjectURL) {
            newFile.blob = URL.createObjectURL(newFile.file)
          }

          newFile.thumb = ''
          if (newFile.file && newFile.type.substr(0, 6) === 'image/') {
            // newFile.thumb = newFile.blob
            console.log("newFile: ", newFile);
            let slice = newFile.file;
            if (newFile.type.endsWith("jpeg") || newFile.type.endsWith("jpg")) {
              slice = newFile.file.slice(0, Math.min(65535, newFile.file.size));
              if (slice.size > 65535) {
                console.log("file is too big.");
                return;
              }
            } else if (newFile.type.endsWith("tiff")) {
              if (slice.size > 1024 * 1024 * 20) {
                // 20MB
                console.log("file is too big.");
                return;
              }
            } else {
              console.log("unknown image type");
              return;
            }

            console.log("slice: ", slice);

            const exifjs = EXIF;
            exifjs.getData(slice, () => {
              let allMetaData = exifjs.getAllTags(slice);
              // console.log(allMetaData)

              // console.log(JSON.stringify(allMetaData, null, "\t"));

              function convertMinToDegreeGPS(minArr) {
                let res = 0.0
                // console.log(minArr)
                if (Array.isArray(minArr)) {
                  for (let i = 0; i < minArr.length; i++) {
                    let val = minArr[i].valueOf()
                    res += val / Math.pow(60, i)
                  }
                  return res
                }
                else {
                  if (minArr === undefined) return minArr
                  else return minArr.valueOf()
                }
              }

              function humanGps(val) {
                let gps = convertMinToDegreeGPS(val)
                if (gps === undefined)
                  return "-"
                else
                  return parseFloat(gps).toFixed(8)
              }

              newFile.gpslat = humanGps(allMetaData['GPSLatitude']);
              newFile.gpslng = humanGps(allMetaData['GPSLongitude']);
              newFile.gpsalt = humanGps(allMetaData['GPSAltitude']);
              this.files.splice(this.files.indexOf(newFile), 1, newFile)
            })
          }
        }
      },

      // 업로드 시작
      startUpload() {
        console.log('start upload');
        this.$refs.upload.active = true
        this.$emit('updateState', {name: 'started'})
      },

      clearFiles() {
        // for (var i=this.files.length-1; i >= 0; i--) {
        //   if (this.files[i].progress == 100) {
        //     this.files.splice(i, 1)
        //   }
        // }
      },

      _closeModal() {
        this.$emit('updateState', {name: 'close'})
      }
    }
  }
</script>

<style scoped>
  .drop-active {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    position: fixed;
    z-index: 9999;
    opacity: .6;
    text-align: center;
    background: #000;
  }

  .drop-active h3 {
    margin: -.5em 0 0;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    font-size: 40px;
    color: #fff;
    padding: 0;
  }

  .loading-dialog {
    background-color: #303030;
  }

</style>
