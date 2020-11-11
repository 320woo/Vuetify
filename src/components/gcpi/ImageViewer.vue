<template>
  <div id="imageViewer"></div>
</template>

<script>
  import Map from 'ol/Map';
  import View from 'ol/View';
  import {mapGetters, mapMutations} from 'vuex'
  import {getCenter} from 'ol/extent';
  import ImageLayer from 'ol/layer/Image';
  import {Vector as VectorSource} from 'ol/source';
  import {Vector as VectorLayer} from 'ol/layer';
  import Projection from 'ol/proj/Projection';
  import Static from 'ol/source/ImageStatic';
  import Feature from 'ol/Feature';
  import Point from "ol/geom/Point";
  import {Select, Translate} from 'ol/interaction.js';
  import {click, pointerMove} from 'ol/events/condition';
  import ContextMenu from 'ol-contextmenu';

  import ImageUtil from '@/utils/api/fileAPI'
  import Viewer from '@/components/gcpi/Viewer'

  export default {
    mixins: [Viewer],
    props: {
      project_id: {
        type: String,
        required: true
      },
      task_id: {
        type: String,
        required: true
      },
      mappedGCPInfo: {
        type: Object
      },
      imageGCPInfo: {
        type: Object
      },
      imageWidth: {
        type: Number
      },
      imageHeight: {
        type: Number
      }
    },
    data() {
      return {
        map: null,
        view: null,
        extent: [],
        projection: {},
        mapMinZoom: 0,
        mapMaxZoom: 25,

        vectorSource: null,
      }
    },

    beforeDestroy() {
    },

    watch: {
      imageInfo() {
        this._updateImageInfo()
      }
    },

    computed: {
      ...mapGetters([
        'gcpImageMap',
        'curSelectGCP',

        'gcpMap',
        'vectorSourceForMap',
      ]),
    },

    methods: {
      ...mapMutations([
        'SET_GCP_IMAGE_MAP',
        'SET_CURRENT_IMAGE_INFO',
        'SET_GCP_CURRENT_IMAGE_WIDTH',
        'SET_GCP_CURRENT_IMAGE_HEIGHT',
        'SET_CUR_SELECT_GCP',
        'SET_MAPPED_GCP_INFO'
      ]),

      initData() {
        this.extent = [0, 0, this.imageWidth, this.imageHeight]
        this.projection = new Projection({
          code: 'xkcd-image',
          units: 'pixels',
          extent: this.extent
        })
        this.view = new View({
          projection: this.projection,
          center: getCenter(this.extent),
          zoom: 2,
          minZoom: 1,
          maxZoom: 8,
          resolution: 1,
        })
      },

      initMap() {
        this.vectorSource = new VectorSource()
        const vectorLayer = new VectorLayer({
          source: this.vectorSource
        })

        this.view.on('change:resolution', this.constrainPan);
        this.view.on('change:center', this.constrainPan);

        const imageMap = new Map({
          layers: [
            new ImageLayer({
              source: new Static({
                attributions: '© <a href="http://xkcd.com/license.html">xkcd</a>',
                url: 'https://imgs.xkcd.com/comics/online_communities.png',
                projection: this.projection,
                imageExtent: this.extent,
                imageSize: [this.imageWidth, this.imageHeight]
              })
            }),
            vectorLayer
          ],
          target: 'imageViewer',
          view: this.view
        })

        this.SET_GCP_IMAGE_MAP(imageMap)

        const contextMenuItems = [
          {
            text: 'Add a GCP',
            icon: this.markerImage,
            callback: this.addGCP
          },
          '-'
        ]

        const removeMarkerItem = {
          text: 'Remove this GCP',
          callback: this.removeGCP
        };

        const mappingGCPItem = {
          text: 'Mapping a GCP',
          callback: this.mappingGCP
        };

        const unmappingGCPItem = {
          text: 'Unmapping a GCP',
          callback: this.unMappingGCP
        };

        const contextMenu = new ContextMenu({
          width: 170,
          defaultItems: true, // defaultItems are (for now) Zoom In/Zoom Out
          items: contextMenuItems
        })

        // contextmenu open Event
        contextMenu.on('open', (evt) => {
          const feature = imageMap.forEachFeatureAtPixel(evt.pixel, ft => ft);

          if (feature && feature.get('type') === 'removable') {
            contextMenu.clear();
            removeMarkerItem.data = {marker: feature};
            contextMenu.push(removeMarkerItem);
          } else {
            contextMenu.clear();
            contextMenu.extend(contextMenuItems);
            contextMenu.extend(contextMenu.getDefaultItems());
          }

          if (feature && feature.get('isMapped') === null) {
            // contextMenu.clear();
            mappingGCPItem.data = {marker: feature};
            contextMenu.push(mappingGCPItem)
          }
          if (feature && feature.get('isMapped')) {
            // contextMenu.clear();
            unmappingGCPItem.data = {marker: feature};
            contextMenu.push(unmappingGCPItem)
          }
        });

        const translate = new Translate({
          source: this.vectorSource,
        })
        const hover = new Select({
          source: this.vectorSource,
          condition: pointerMove,
        })

        imageMap.addInteraction(hover)
        imageMap.addInteraction(translate)

        // 마우스 Hover
        hover.on('select', this.onHover);

        imageMap.on('singleclick', (evt) => {
          contextMenu.close()
        })

        imageMap.on('moveend', (evt) => {
          const view = imageMap.getView()
          if (view.getZoom() < 1.5) {
            view.setZoom(2);
          }
        })

        imageMap.addControl(contextMenu)
      },

      onHover(evt) {
        const isHover = evt.selected.length !== 0
        if (isHover) {
          this.gcpImageMap.getViewport().style.cursor = 'pointer'

          const imageGCP = evt.selected[0]
          const mapGCP = evt.selected[0].get('isMapped')

          if (mapGCP) {
            imageGCP.setStyle(this.getHoverMappedIconStyle)
            mapGCP.setStyle(this.getHoverMappedIconStyle)
          } else {
            imageGCP.setStyle(this.getHoverIconStyle)
          }
        } else {
          this.gcpImageMap.getViewport().style.cursor = ''
          this.vectorSource.getFeatures().forEach((feature) => {
            const mapGCP = feature.get('isMapped')

            if (mapGCP) {
              feature.setStyle(this.getMappedIconStyle)
              mapGCP.setStyle(this.getMappedIconStyle)
            } else {
              feature.setStyle(this.getIconStyle)
            }
          })
        }
      },

      async updateGCP() {
        const imageId = await this.imageInfo.file_id

        this.imageGCPInfo[imageId] = await {
          features: this.vectorSource.getFeatures()
        }

        if (this.imageGCPInfo[imageId].features.length <= 0) {
          await delete this.imageGCPInfo[imageId]
        }

        console.log('updateGCP [imageGCPInfo]', this.imageGCPInfo)
      },

      addGCP(evt) {
        console.log(this.imageWidth, this.imageHeight)
        console.log(evt.coordinate)
        console.log([evt.coordinate[0], this.imageHeight - evt.coordinate[1]])
        const feature = new Feature({
          type: 'removable',
          isMapped: null,
          geometry: new Point(evt.coordinate),
          pixelInfo: evt.coordinate
        })

        console.log('Add GCP Coordinate ImageViewer', evt.coordinate[0], this.imageHeight - evt.coordinate[1])

        feature.setId(feature.ol_uid)
        feature.setStyle(this.getIconStyle)

        this.vectorSource.addFeature(feature)

        this.updateGCP()
      },

      removeGCP(obj) {
        if (obj.data.marker.get('isMapped')) {
          this.unMappingGCP(obj)
        }

        this.vectorSource.removeFeature(obj.data.marker)
        this.updateGCP()
      },

      mappingGCP(obj) {
        const select = new Select({
          source: this.vectorSourceForMap,
          condition: click
        })

        // MapViewer Add Interaction
        this.gcpMap.addInteraction(select)
        select.on('select', (evt) => {
          console.log('[imageGCPInfo]', this.imageGCPInfo)
          console.log(this.mappedGCPInfo)

          if (this.mappedGCPInfo[this.imageInfo.file_id] === undefined) {
            this.mappedGCPInfo[this.imageInfo.file_id] = [{
              imageName: this.imageInfo.org_nm,
              imageGCP: obj.data.marker,
              mapGCP: evt.selected[0]
            }]
          } else {
            this.mappedGCPInfo[this.imageInfo.file_id].push({
              imageName: this.imageInfo.org_nm,
              imageGCP: obj.data.marker,
              mapGCP: evt.selected[0]
            })
          }

          obj.data.marker.setProperties({
            isMapped: evt.selected[0]
          })
          obj.data.marker.setStyle(this.getMappedIconStyle)
          evt.selected[0].setProperties({mappedGCPCount: evt.selected[0].get('mappedGCPCount') + 1})
          evt.selected[0].setStyle(this.getMappedIconStyle)

          // MapViewer Remove Interaction
          this.gcpMap.removeInteraction(select)
          console.log('Mapped GCP!, [mappedGCPInfo]', this.mappedGCPInfo)
        })
      },

      unMappingGCP(obj) {
        console.log('unMappingGCP Object', obj)

        const gcpMarker =  obj.data.marker
        const mappedGCP = gcpMarker.get('isMapped')

        // image gcp unMapping
        gcpMarker.setProperties({
          isMapped: null
        })
        gcpMarker.setStyle(this.getIconStyle)

        // map gcp unMapping
        this.setUnMappingGCPFeature(mappedGCP)

        // mappedGCPInfo Update
        const index = this.mappedGCPInfo[this.imageInfo.file_id].findIndex(info => info.imageGCP.getId() === gcpMarker.getId())
        this.mappedGCPInfo[this.imageInfo.file_id].splice(index, 1)
        if (this.mappedGCPInfo[this.imageInfo.file_id].length === 0) {
          delete this.mappedGCPInfo[this.imageInfo.file_id]
        }

        console.log('unMapped!, [mappedGCPInfo]', this.mappedGCPInfo)
      },

      setUnMappingGCPFeature(mappedGCP) {
        if (mappedGCP.get('mappedGCPCount')) {
          mappedGCP.setProperties({mappedGCPCount: mappedGCP.get('mappedGCPCount') - 1})
          if (mappedGCP.get('mappedGCPCount') <= 0) {
            mappedGCP.setStyle(this.getIconStyle)
          }
        } else {
          mappedGCP.setStyle(this.getIconStyle)
        }
      },

      async _updateImageInfo() {
        console.log(this.imageInfo)
        await this.vectorSource.clear() // 초기화

        if (this.imageInfo !== null) {
          console.log('imageInfo Update [curImageInfo] : ', this.imageInfo, this.imageWidth, this.imageHeight)
          const fileManager = await ImageUtil.FileManagerUrl({
            [ImageUtil.PROJECT_ID]: this.project_id,
            [ImageUtil.TASK_ID]: this.task_id
          }, {
            [ImageUtil.FILE_ID]: this.imageInfo.file_id
          })
          const originImageURL = await fileManager.imageUrl;
          const imageViewExtent = await [0, 0, this.imageWidth, this.imageHeight]

          const imageViewProjection = await new Projection({
            code: 'xkcd-image',
            units: 'pixels',
            extent: imageViewExtent
          })

          const imageMapSource = await new Static({
            url: originImageURL,
            projection: imageViewProjection,
            imageExtent: imageViewExtent,
            imageSize: [this.imageWidth, this.imageHeight]
          })

          const view = await new View({
            projection: imageViewProjection,
            center: getCenter(imageViewExtent),
            zoom: 2,
            minZoom: 1,
            maxZoom: 8,
            resolution: 1,
          })

          // Image Viewer 이벤트 셋팅
          view.on('change:resolution', this.constrainPan);
          view.on('change:center', this.constrainPan);

          const imageMap = await this.gcpImageMap.getLayers().getArray()[0]
          await imageMap.setSource(imageMapSource)

          console.log('ImageViewer [imageInfo]', this.imageInfo)
          console.log('ImageViewer [mappedGCPInfo]', this.mappedGCPInfo)
          console.log('ImageViewer [imageGCPInfo]', this.imageGCPInfo)
          if (this.imageGCPInfo[this.imageInfo.file_id] !== undefined) {
            await this.vectorSource.addFeatures(this.imageGCPInfo[this.imageInfo.file_id].features)
          }

          await this.gcpImageMap.setView(view)
        }
      },

      constrainPan() {
        const view = this.gcpImageMap.getView()
        const extents = [0, 0, this.imageWidth, this.imageHeight];
        const visible = view.calculateExtent(this.gcpImageMap.getSize());
        const center = view.getCenter();
        let delta;
        let adjust = false;

        if ((delta = extents[0] - visible[0]) >= 0) {
          adjust = true;
          center[0] += delta;
        } else if ((delta = extents[2] - visible[2]) <= 0) {
          adjust = true;
          center[0] += delta;
        }
        if ((delta = extents[1] - visible[1]) >= 0) {
          adjust = true;
          center[1] += delta;
        } else if ((delta = extents[3] - visible[3]) <= 0) {
          adjust = true;
          center[1] += delta;
        }
        if (adjust) {
          view.setCenter(center);
        }
      },
    },
  }
</script>

<style scoped>
  #imageViewer {
    z-index: 0;
    width: 49%;
    height: 400px;
    display: inline-block !important;
  }
</style>
