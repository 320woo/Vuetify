<template>
  <v-dialog v-model="dialog" persistent max-width="1000px">
  <v-card class="content">
    <vue-upload-component
      :post-action="actionUrl"
      :multiple="!isGeoTiffAlgorithm()"
      :drop="true"
      :drop-directory="!isGeoTiffAlgorithm()"
      @input="updateFiles"
      @input-file="inputFile"
      @input-filter="inputFilter"
      :accept="acceptType()"
      :extensions="fileExtensions()"
      v-model="files"
      ref="upload"
    >
    </vue-upload-component>
    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
      <h3>파일을 여기에 드래그 하세요</h3>
    </div>
    <v-toolbar flat color="white">
      <v-toolbar-title>파일 업로드</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!isGeoTiffAlgorithm()"
        color="primary"
        :disabled="disableFileUpload()"
        @click.prevent="$refs.upload.active === true"
        @click="addFolder()"
      >
        + 폴더 추가
      </v-btn>
      <v-btn
        color="primary"
        @click.prevent="$refs.upload.active === true"
        @click="addFiles"
      >
        + 파일 {{ isGeoTiffAlgorithm() ? '선택' : '추가' }}
      </v-btn>
      <v-btn
        color="primary"
        :disabled="files.length == 0"
        @click="startUpload"
        @click.prevent="$refs.upload.active === true"
      >
        업로드 시작
        <v-icon right>cloud_upload</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container fluid>
      <v-layout align-center justify-center row fill-height>
        <v-flex xs8>
          <div id="uploadMap">
          </div>
        </v-flex>
        <v-flex xs4>
          <div v-if="addingFiles" style="text-align: center;">
            <label>파일 추가 중.. </label>
            <v-progress-circular
              indeterminate
              color="red"
            ></v-progress-circular>
          </div>
          <div v-else-if="files.length === 0" style="text-align: center;">
            <label>업로드할 파일을 드래그 하세요</label>
          </div>
          <div v-else style="text-align: center;">
            <div
              v-if="
                $refs.upload &&
                  ($refs.upload.active === true || $refs.upload.uploaded)
              "
            >
              <v-progress-circular
                :rotate="-90"
                :size="100"
                :width="15"
                :value="uploadingProgress"
                color="primary"
              >
                {{ uploadingProgress }}
              </v-progress-circular>
              <br />
              <label
                >{{ humanSize((uploadingProgress / 100) * totalSize) }} /
                {{ humanSize(totalSize) }}</label
              >
            </div>
            <div v-else>
              <label
                >업로드할 파일: {{ files.length }} 개 /
                {{ humanSize(totalSize) }}
              </label>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="_closeModal">닫기</v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<script>
import VueUploadComponent from 'vue-upload-component'
import StorageAPI from '@/utils/api/storageAPI'
import Constant from '@/components/common/constants'

import 'ol/ol.css';
import {Map, View} from 'ol';
import {platformModifierKeyOnly} from 'ol/events/condition';
import TileLayer from 'ol/layer/Tile';
import {OSM, Vector, XYZ} from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import {Style, Icon} from 'ol/style';
import ExifReader from 'exifreader';
import {DragBox, Select} from 'ol/interaction'; 

export default {
  components: {
    VueUploadComponent
  },

  props: {
    task_algorithm: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    files: [],
    filesName: [],
    addingFiles: false,
    accept: 'image/tiff,image/jpeg',
    extensions: 'jpg,jpeg,tif,tiff',
    dialog: false,
    map: null,
    points: [],
    iconFeatures: [],
    vectorSource: null,
    select: null,
    dragBox: null,
    selectedFeatures: null
  }),

  computed: {
    actionUrl: function() {
      return StorageAPI.uploadUrl()
    },
    totalSize() {
      let res = this.files.reduce((acc, curr) => acc + curr.size, 0)
      return res
    },
    uploadingProgress() {
      let acc = this.files.reduce(
        (acc, curr) => acc + parseFloat(curr.progress),
        0
      )
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
    this.dialog = true
  },
  mounted() {
    this.$refs.upload.$parent.$el.addEventListener('drop', this.onDrop, false)
    this.initMap()
  },
  beforeDestroy() {
    try {
      this.$refs.upload.$parent.$el.removeEventListener(
        'drop',
        this.onDrop,
        false
      )
    } catch (e) {}
  },
  methods: {
    getPointStyle() {
      return new Style({
        image: new Icon({
          opacity: 0.8,
          scale: 1.0,
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: require('@/assets/icon/shotPoint.png')
        })
      });
    },    
    getSelectedStyle() {
      return new Style({
        image: new Icon({
          opacity: 0.8,
          scale: 1.0,
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: require('@/assets/icon/shotPointSelected.png')
        })
      });
    },    
    initMap() {
      const view = new View({
        center: (new point([128.4, 35.6]).transform('EPSG:4326', 'EPSG:3857')).getCoordinates(),
        zoom: 8
      });

      this.map = new Map({
        target: 'uploadMap',
        layers: [
          // new TileLayer({
          //   source: new OSM()
          // })
          new TileLayer({
            name: 'baseLayer',
            source: new XYZ({
              url: 'http://xdworld.vworld.kr:8080/2d/Satellite/201710/{z}/{x}/{y}.jpeg',
              minZoom: 8,
              maxZoom: 19
            })
          }),
          new TileLayer({
            name: 'hybridLayer',
            source: new XYZ({
              url: 'http://xdworld.vworld.kr:8080/2d/Hybrid/service/{z}/{x}/{y}.png',
              minZoom: 8,
              maxZoom: 19
            })
          })

        ],
        view: view
      });

      var self = this;
      this.select = new Select();
      this.map.addInteraction(this.select);
      this.selectedFeatures = this.select.getFeatures(); 
      this.dragBox = new DragBox({
        condition: platformModifierKeyOnly
      });
      this.map.addInteraction(this.dragBox);
      this.dragBox.on('boxend', function() {
        // features that intersect the box geometry are added to the
        // collection of selected features

        // if the view is not obliquely rotated the box geometry and
        // its extent are equalivalent so intersecting features can
        // be added directly to the collection
        var rotation = self.map.getView().getRotation();
        var oblique = rotation % (Math.PI / 2) !== 0;
        var candidateFeatures = oblique ? [] : self.selectedFeatures;
        var extent = self.dragBox.getGeometry().getExtent();
        self.vectorSource.forEachFeatureIntersectingExtent(extent, function(feature) {
          candidateFeatures.push(feature);
        });

        // when the view is obliquely rotated the box extent will
        // exceed its geometry so both the box and the candidate
        // feature geometries are rotated around a common anchor
        // to confirm that, with the box geometry aligned with its
        // extent, the geometries intersect
        if (oblique) {
          var anchor = [0, 0];
          var geometry = self.dragBox.getGeometry().clone();
          geometry.rotate(-rotation, anchor);
          var extent$1 = geometry.getExtent();
          console.log('before=>', self.selectedFeatures);
          candidateFeatures.forEach(function(feature) {
            var geometry = feature.getGeometry().clone();
            geometry.rotate(-rotation, anchor);
            if (geometry.intersectsExtent(extent$1)) {
              console.log('after=>', self.selectedFeatures);
              self.selectedFeatures.push(feature);
            }
          });
        }

        console.log('Selected End =>', self.selectedFeatures, self.selectedFeatures.getArray().length);
        self.vectorSource.getFeatures().forEach((feature) => {
          feature.setStyle(self.getPointStyle());
        })
        self.filesName = [];
        self.selectedFeatures.forEach((feature) => {
          console.log(feature);
          feature.setStyle(self.getSelectedStyle());

          self.filesName.push(feature.get('name'));
        });
      });
      this.dragBox.on('boxstart', function() {
        self.selectedFeatures.forEach((feature) => {
          console.log(feature);
          feature.setStyle(self.getPointStyle());
        });      
        self.selectedFeatures.clear();
        }
      );
      this.selectedFeatures.on(['add', 'remove'], function() {
        var names = self.selectedFeatures.getArray().map(function(feature) {
          return feature.get('name');
        });
      });
      this.map.on('click', function(evt) {
        var feature = self.map.forEachFeatureAtPixel(evt.pixel,
          function(feature) {
            return feature;
          });
        if (feature) {
          alert(feature.get('name') + '\n' + feature.get('lon') + '\n' + feature.get('lat'));
        }
      });
      console.log('map added..');
    },
    onDrop(e) {
      console.log('onDrop')
      e.preventDefault()
      if (!this.isGeoTiffAlgorithm()) {
        this.addingFiles = true
      }
    },
    isGeoTiffAlgorithm() {
      return this.task_algorithm === Constant.TASK_ALGORITHM_GEOTIFF
    },
    isOtherImageAlgorithm() {
      return (
        !this.isNoAlgorithm() &&
        (this.task_algorithm !== Constant.TASK_ALGORITHM_GEOTIFF 
          && this.task_algorithm !== Constant.TASK_ALGORITHM_AI)
      )
    },
    isNoAlgorithm() {
      return this.task_algorithm == null || this.task_algorithm === ''
    },

    disableFileUpload() {
      return this.isGeoTiffAlgorithm() && this.files.length > 0
    },

    humanSize: function(size) {
      const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
      return (
        (size / Math.pow(1024, i)).toFixed(2) * 1 +
        ' ' +
        ['B', 'KB', 'MB', 'GB', 'TB'][i]
      )
    },

    addFiles() {
      console.log('add files')
      let input = this.$refs.upload.$el.querySelector('input')

      input.directory = false
      input.webkitdirectory = false

      let oldFocusFunc = document.body.onfocus
      document.body.onfocus = () => {
        console.log('onfocus body')
        this.addingFiles = false
        document.body.onfocus = oldFocusFunc
      }
      this.addingFiles = true

      input.onclick = null
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

      input.onclick = null;
      input.click();
      input.onclick = (e) => {
        input.directory = false;
        input.webkitdirectory = false;
      }
    },

    updateFiles(value) {
      console.log('update files', value)
      this.addingFiles = false
    },
    inputFile: function(newFile, oldFile) {
      // console.log('input newfile', newFile);
      // console.log('input oldfile', oldFile);
      if (newFile && !oldFile) {
        // Add file

        console.log('input file.add file')

        var self = this;
        var reader = new FileReader();  
        reader.onload = function(e) {
          var bin = e.target.result;
          var tags = ExifReader.load(bin);
          // console.log(tags.GPSLatitude.description, tags.GPSLongitude.description);
          var p1 = (new point([tags.GPSLongitude.description, tags.GPSLatitude.description]).transform('EPSG:4326', 'EPSG:3857')).getCoordinates();
          self.points.push(p1);

          console.log("Position =>", e.target.fileName, p1, self.points.length);
          var p2 = (new point(p1).transform('EPSG:3857', 'EPSG:4326')).getCoordinates();
          var iconFeature = new Feature({
            geometry: new point(p1),
            name: e.target.fileName,
            lon: p2[0], 
            lat: p2[1]
          });
          iconFeature.setStyle(self.getSelectedStyle());
          self.iconFeatures.push(iconFeature);  

          if(self.files.length == self.points.length) {
            console.log('+++++++++++DONE++++++++++++');
            self.vectorSource = new Vector({
              features: self.iconFeatures
            });
            
            var vectorLayer = new VectorLayer({
              source: self.vectorSource
            });
      
            self.map.addLayer(vectorLayer);
      
            self.map.getView().animate({center:self.points[0], zoom:17});
          }
        };
        reader.fileName = newFile.name;
        reader.readAsArrayBuffer(newFile.file);

      }
      if (newFile && oldFile) {
        // Update file
        if (newFile.active && newFile.xhr) {
          try {
            newFile.xhr.withCredentials = true
          } catch (e) {}
        }

        // 개별 업로드 시작
        if (newFile.active !== oldFile.active) {
          console.log('Start upload', newFile.active, newFile)
        }

        // 개별 업로드 진행률
        if (newFile.progress !== oldFile.progress) {
          console.log('progress', newFile.progress, newFile)

          // 일단, 단순하게 Feature를 뒤져서 이름이 newFile.name 이면 스타일 변경한다.
          if(newFile.progress >= 99) {
            this.vectorSource.getFeatures().forEach((feature) => {
              if(feature.get('name') == newFile.name) {
                feature.setStyle(this.getPointStyle());
              }
            })
          }
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
          this.$emit('uploadState', { name: 'uploaded', files: this.files })
          this.files = []
        }
      }
      if (!newFile && oldFile) {
        // Remove file
      }
    },

    validExtension(file) {
      if (this.isGeoTiffAlgorithm()) {
        return /\.(tif|tiff)$/i.test(file.name)
      } else if (this.isOtherImageAlgorithm()) {
        return /\.(jpeg|jpe|jpg|tif|tiff)$/i.test(file.name)
      } else {
        return true
      }
    },
    acceptType() {
      if (this.isGeoTiffAlgorithm()) {
        return 'image/tiff'
      } else if (this.isOtherImageAlgorithm()) {
        return 'image/tiff,image/jpeg'
      } else {
        return undefined
      }
    },
    fileExtensions() {
      if (this.isGeoTiffAlgorithm()) {
        return 'tif,tiff'
      } else if (this.isOtherImageAlgorithm()) {
        return 'jpeg,jpe,jpg,tif,tiff'
      } else {
        return undefined
      }
    },

    inputFilter: function(newFile, oldFile, prevent) {
      // console.log('input filter');
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!this.validExtension(newFile)) {
          return prevent()
        }

        // console.log('newfile size: ', newFile.size)
      }
    },

    // 업로드 시작
    startUpload() {
      console.log('start upload')

      // 일단, 단순하게 선택한 파일명 리스트를 가져와서 files 객체에서 해당 파일을 제외한 목록을 삭제한다.
      this.files.forEach((file) => {
        var count = 0;
        this.filesName.forEach((exfile) => {
          if(file.name == exfile) count++;
        });
        if(this.filesName.length !=0 && count == 0) {
          this.$refs.upload.remove(file);
        }
      });

      console.log('removed???', this.files);

      this.$refs.upload.active = true
      this.$emit('uploadState', { name: 'started' })
    },

    clearFiles() {
      // for (var i=this.files.length-1; i >= 0; i--) {
      //   if (this.files[i].progress == 100) {
      //     this.files.splice(i, 1)
      //   }
      // }
    },

    _closeModal() {
      this.dialog = false
      this.$emit('uploadState', { name: 'close' })
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
  opacity: 0.6;
  text-align: center;
  background: #000;
}

.drop-active h3 {
  margin: -0.5em 0 0;
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
