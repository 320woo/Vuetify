<template>
  <div class="gcp-wrapper">
    <div v-if="visible">
      <v-layout wrap justify-space-between>
        <image-viewer :project_id="projectId"
                      :task_id="taskId"
                      :mappedGCPInfo="mappedGCPInfo"
                      :imageGCPInfo="imageViewerGCP"
                      :imageInfo="curImageInfo"
                      :imageWidth="curImageWidth"
                      :imageHeight="curImageHeight"></image-viewer>
        <map-viewer :imageInfo="curImageInfo"
                    :mappedGCPInfo="mappedGCPInfo"
                    :mapViewerGCP="mapViewerGCP"></map-viewer>
      </v-layout>
    </div>
    <v-layout column>
      <v-layout justify-end>
        <v-btn slot="activator"
               color="blue"
               @click="_onClickGCPUploadButton"
               dark ripple small>
          <v-icon class="pr-1">
            cloud_upload
          </v-icon>
          저장
        </v-btn>
        <v-btn class="mr-0"
               slot="activator"
               color="blue"
               @click="_onClickGCPExportButton"
               dark ripple small>
          <v-icon class="pr-1">
            cloud_upload
          </v-icon>
          내보내기
        </v-btn>
      </v-layout>
      <image-table class="pt-2"
                   :project_id="projectId"
                   :task_id="taskId"
                   :curImageInfo="curImageInfo"
                   :isGCP="true"
                   @onSetImageInfo="onSetImageInfo">
      </image-table>
    </v-layout>
  </div>
</template>

<script>
  import ImageViewer from '@/components/gcpi/ImageViewer'
  import MapViewer from '@/components/gcpi/MapViewer'
  import ImageTable from '@/components/gcpi/ImageTable'

  import Feature from 'ol/Feature';
  import Point from "ol/geom/Point";
  import {transform} from 'ol/proj.js';
  import {Icon, Style} from 'ol/style';

  import {saveAs} from 'file-saver'
  import {mapActions, mapGetters} from 'vuex'

  export default {
    components: {
      'ImageViewer': ImageViewer,
      'MapViewer': MapViewer,
      'ImageTable': ImageTable
    },
    data() {
      return {
        projectId: this.$route.query.projectId,
        taskId: this.$route.query.taskId,
        visible: false,

        mapViewerGCP: [],
        imageViewerGCP: {},
        mappedGCPInfo: {},
        curImageInfo: {},
        curImageWidth: 1024,
        curImageHeight: 968,
        imageList: []
      }
    },
    async created() {
      console.log(this.$route.query)

      const gcpMetaInfo = await this.requestGetAllGCPInfo({
        projectId: this.projectId,
        taskId: this.taskId
      })

      console.log('GCPInterface Created [getMetaInfo]', gcpMetaInfo)
      console.log('GCPInterface Created [imageList]', this.getImageList)

      // 저장된 GCP Mapping 정보가 있는 경우
      if (gcpMetaInfo.length) {
        console.log(gcpMetaInfo)

        let preGPS = {}

        gcpMetaInfo.forEach((info, index, arr) => {
          const pixelInfo = [info.pixel_x, info.pixel_y]
          const gpsInfo = transform([info.gps_lat, info.gps_lng], 'EPSG:4326', 'EPSG:3857')
          const orgImage = this.getImageList.find(image => image.file_id.toString() === info.file_id.toString())
          const orgImgResolution = [orgImage.exif_info.ImageWidth, orgImage.exif_info.ImageHeight]

          const mapGCPFeature = this.checkMapGCPFeature(preGPS, gpsInfo)
          const imageGCPFeature = this.getCalImageGCPFeature(mapGCPFeature, pixelInfo, orgImgResolution)
          this.setImageViewerGCP(info.file_id, imageGCPFeature)
          // Mapping 후 map GCP에 mappedCount를 증가시켜 줌
          mapGCPFeature.setProperties({mappedGCPCount: mapGCPFeature.get('mappedGCPCount') + 1})

          this.setMappedGCPInfo(info.file_id, info.file_name, imageGCPFeature, mapGCPFeature)
        })
      }

      await console.log('GCPInterface created, [mappedGCPInfo]', this.mappedGCPInfo)
      this.visible = await true
    },
    mounted() {
      console.log(this.$router.currentRoute)
    },
    computed: {
      ...mapGetters([
        'getImageList'
      ]),
      markerImage() {
        return require('@/assets/gcp_round.png')
      },

      selectMarkerImage() {
        return require('@/assets/gcp_round_select.png')
      },

      mappedMarkerImage() {
        return require('@/assets/gcp_round_mapped.png')
      },

      getIconStyle() {
        return new Style({
          image: new Icon({
            opacity: 0.8,
            scale: 0.8,
            anchor: [0.5, 16],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: this.markerImage
          })
        });
      },

      getMappedIconStyle() {
        return new Style({
          image: new Icon({
            opacity: 0.8,
            scale: 0.8,
            anchor: [0.5, 16],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: this.mappedMarkerImage
          })
        });
      },

      getHoverIconStyle() {
        return new Style({
          image: new Icon({
            opacity: 0.8,
            anchor: [0.5, 16],
            scale: 1.3,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: this.markerImage
          })
        });
      },

      getHoverMappedIconStyle() {
        return new Style({
          image: new Icon({
            opacity: 0.8,
            anchor: [0.5, 16],
            scale: 1.3,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: this.mappedMarkerImage
          })
        });
      }
    },
    methods: {
      ...mapActions([
        'requestGetAllGCPInfo',
        'requestAddGCPInfo',
        'requestDeleteGCPInfo'
      ]),

      // Todo: 새로고침 시 imageInfo 못 가져오는 현상 해결 필요
      onSetImageInfo(imageInfo) {
        this.curImageInfo = imageInfo
        this.curImageWidth = imageInfo.exif_info.ImageWidth
        this.curImageHeight = imageInfo.exif_info.ImageHeight
      },

      checkMapGCPFeature(preGPS, gpsInfo)  {
        // 만들어 지지 않은 map GCP 일 때
        if (preGPS[`${gpsInfo[0]}, ${gpsInfo[1]}`] === undefined) {
          // map GCP create
          const mapGCPFeature = this.getMapGCPFeature(gpsInfo)

          // 만든 GCP를 preGPS에 추가후 mapViewerGCP의 push
          preGPS[`${gpsInfo[0]}, ${gpsInfo[1]}`] = {
            gcpFeature: mapGCPFeature
          }
          this.mapViewerGCP.push(mapGCPFeature)

          return mapGCPFeature
        }
        else {
          return preGPS[`${gpsInfo[0]}, ${gpsInfo[1]}`].gcpFeature
        }
      },

      getMapGCPFeature(gpsInfo) {
        const feature = new Feature({
          type: 'removable',
          mappedGCPCount: 0,
          geometry: new Point(gpsInfo)
        })
        feature.setId(feature.ol_uid)
        feature.setStyle(this.getMappedIconStyle)

        return feature
      },

      getCalImageGCPFeature(mapGCPFeature, pixelInfo, orgImgResolution) {
        // Image GCP Create, isMapped 속성에 Map GCP를 등록
        const imageGCPFeature = new Feature({
          type: 'removable',
          isMapped: mapGCPFeature,
          geometry: new Point([pixelInfo[0], orgImgResolution[1] - pixelInfo[1]]),
          pixelInfo: [pixelInfo[0], orgImgResolution[1] - pixelInfo[1]]
        })
        imageGCPFeature.setId(imageGCPFeature.ol_uid)
        imageGCPFeature.setStyle(this.getMappedIconStyle)

        return imageGCPFeature
      },

      setImageViewerGCP(fileId, imageGCPFeature) {
        if (this.imageViewerGCP[fileId] === undefined) {
          this.imageViewerGCP[fileId] = {features: [imageGCPFeature]}
        } else {
          this.imageViewerGCP[fileId].features.push(imageGCPFeature)
        }
      },

      setMappedGCPInfo(fileId, fileName, imageGCPFeature, mapGCPFeature) {
        // Mapping GCP here....
        if (this.mappedGCPInfo[fileId] === undefined) {
          this.mappedGCPInfo[fileId] = [{
            imageName: fileName,
            imageGCP: imageGCPFeature,
            mapGCP: mapGCPFeature
          }]
        } else {
          this.mappedGCPInfo[fileId].push({
            imageName: fileName,
            imageGCP: imageGCPFeature,
            mapGCP: mapGCPFeature
          })
        }
      },

      getConvertMappedGCPInfo() {
        let mappedGCPInfoArr = []

        Object.entries(this.mappedGCPInfo).forEach((info) => {
          info[1].forEach((mapped) => {
            const mapCoordinates = transform(mapped.mapGCP.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326')
            const imagePixels = mapped.imageGCP.getGeometry().getCoordinates()

            mappedGCPInfoArr.push({
              pixel_x: imagePixels[0],
              pixel_y: this.curImageHeight - imagePixels[1],
              gps_lat: mapCoordinates[0],
              gps_lng: mapCoordinates[1],
              gps_alt: 0,
              file_id: info[0]
            })
          })
        })

        return mappedGCPInfoArr
      },

      async _onClickGCPUploadButton() {
        console.log('[onClickGCPUploadButton], mappedGCPInfo : ', this.mappedGCPInfo)
        const mappedGCPInfoArr = await this.getConvertMappedGCPInfo()

        await this.requestDeleteGCPInfo({
          projectId: this.projectId,
          taskId: this.taskId,
        })

        await this.requestAddGCPInfo({
          projectId: this.projectId,
          taskId: this.taskId,
          mappedGCPInfoArr
        })
      },

      _onClickGCPExportButton() {
        console.log('[onClickGCPExportButton], mappedGCPInfo : ', this.mappedGCPInfo)

        let content = []
        const separator = '\u0020\u0020\u0020\u0020'

        content.push('EPSG:4326')
        content.push('\n')

        console.log(Object.entries(this.mappedGCPInfo))

        Object.entries(this.mappedGCPInfo).forEach((info) => {
          info[1].forEach((mapped) => {
            // const mapCoordinates = transform(mapped.mapGCP.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326')
            const mapCoordinates = mapped.mapGCP.getGeometry().getCoordinates()
            const imagePixels = mapped.imageGCP.get('pixelInfo')
            console.log(mapCoordinates, imagePixels)

            content.push(mapCoordinates[0])
            content.push(separator)
            content.push(mapCoordinates[1])
            content.push(separator)
            content.push(0.0)
            content.push(separator)
            content.push(imagePixels[0])
            content.push(separator)
            content.push(this.curImageHeight - imagePixels[1])
            content.push(separator)
            content.push(mapped.imageName)
            content.push('\n')
          })
        })

        content.pop()
        const blob = new Blob(content, {type: "text/plain;charset=utf-8"})
        console.log(blob)
        saveAs(blob, "GCPs.txt")
      }
    },
  }

</script>

<style scoped>
  .gcp-wrapper {
    display: inline !important;
  }
</style>
