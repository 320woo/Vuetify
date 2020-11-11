<template>
  <div id="mapViewer"></div>
</template>

<script>
  import Constant from '@/components/common/constants'
  import {mapGetters, mapMutations} from 'vuex'
  import Map from 'ol/Map';
  import View from 'ol/View';
  import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
  import {Vector as VectorSource, XYZ} from 'ol/source';
  import {fromLonLat, transform, transformExtent} from 'ol/proj.js';
  import Feature from 'ol/Feature';
  import Point from "ol/geom/Point";
  import {Select, Translate} from 'ol/interaction.js';
  import {pointerMove} from 'ol/events/condition';
  import ContextMenu from 'ol-contextmenu';

  import Viewer from '@/components/gcpi/Viewer'

  export default {
    mixins: [Viewer],
    props: {
      mappedGCPInfo: {
        type: Object
      },
      mapViewerGCP: {
        type: Array
      }
    },
    data() {
      return {
        projection: 'EPSG:3857',
        displayProjection: 'EPSG:4326',
        mapMinZoom: 7,
        mapMaxZoom: 25,
      }
    },

    created() {
      console.log('MapViewer created!!')
    },

    mounted() {
      console.log('MapViewer mounted!!')
      console.log(this.mapViewerGCP)
      if (this.mapViewerGCP.length) {
        this.vectorSourceForMap.addFeatures(this.mapViewerGCP)
      }
    },

    watch: {
      async imageInfo() {
        if (this.imageInfo !== null) {
          const mapView = this.gcpMap.getView()
          mapView.setCenter(transform([this.imageInfo.gps_lng, this.imageInfo.gps_lat], 'EPSG:4326', 'EPSG:3857'))

          if (mapView.getZoom() >= 18) {
            mapView.setZoom(mapView.getZoom())
          } else {
            mapView.setZoom(18)
          }

        }
      },
    },

    computed: {
      ...mapGetters([
        'gcpMap',
        'vectorSourceForMap'
      ]),
    },

    methods: {
      ...mapMutations([
        'SET_GCP_MAP',
        'SET_VECTOR_SOURCE_FOR_MAP'
      ]),

      initData() {
        console.log('MapViewer initData')
        this.projection = "EPSG:3857"
        this.displayProjection = "EPSG:4326"
        this.mapMinZoom = 7
        this.mapMaxZoom = 25
      },

      initMap() {
        console.log('MapViewer initMap')
        const vectorSource = new VectorSource()
        const vectorLayer = new VectorLayer({
          source: vectorSource
        })

        const map = new Map({
          layers: [
            new TileLayer({
              source: new XYZ({
                url: Constant.BASE_SATELLITE_MAP_URL,
                minZoom: this.mapMinZoom,
                maxZoom: 19,
              })
            }),
            vectorLayer
          ],
          target: 'mapViewer',
          view: new View({
            center: fromLonLat([128.471, 35.6714]),
            zoom: 0,
            minZoom: this.mapMinZoom,
            maxZoom: this.mapMaxZoom,
            extent: transformExtent([120, 32, 137, 43], this.displayProjection, this.projection)
          })
        });

        const contextMenuItems = [
          {
            text: 'Add a GCP',
            icon: this.markerImage,
            callback: (evt) => {
              console.log(evt)
              const feature = new Feature({
                type: 'removable',
                mappedGCPCount: 0,
                geometry: new Point(evt.coordinate)
              })
              console.log(evt.coordinate[0], evt.coordinate[1])
              console.log(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'))

              feature.setId(feature.ol_uid)
              feature.setStyle(this.getIconStyle)

              vectorSource.addFeature(feature)
            }
          },
          '-'
        ]

        const removeGCPItem = {
          text: 'Remove this GCP',
          callback: (obj) => {
            console.log('Remove this GCP', obj)

            this.mappedGCPInfo[this.imageInfo.file_id] = this.mappedGCPInfo[this.imageInfo.file_id].filter((info) => {
              if (info.mapGCP.getId() === obj.data.marker.getId()) {
                // mappedGCPInfo를 지우기 전에 mapping되어 있는 imageGCP들의 속성들을 설정
                info.imageGCP.setProperties({isMapped: null})
                info.imageGCP.setStyle(this.getIconStyle)
              }
              return info.mapGCP.getId() !== obj.data.marker.getId()
            })

            console.log('Remove Map GCP mappedGCPInfo : ', this.mappedGCPInfo)

            vectorSource.removeFeature(obj.data.marker)
          }
        };

        const contextMenu = new ContextMenu({
          width: 170,
          defaultItems: true, // defaultItems are (for now) Zoom In/Zoom Out
          items: contextMenuItems
        })

        contextMenu.on('open', function (evt) {
          const feature = map.forEachFeatureAtPixel(evt.pixel, ft => ft);

          if (feature && feature.get('type') === 'removable') {
            contextMenu.clear();
            removeGCPItem.data = {marker: feature};
            contextMenu.push(removeGCPItem);
          } else {
            contextMenu.clear();
            contextMenu.extend(contextMenuItems);
            contextMenu.extend(contextMenu.getDefaultItems());
          }
        });

        const translate = new Translate({
          source: vectorSource
        })
        const hover = new Select({
          source: vectorSource,
          condition: pointerMove,
        })

        map.addInteraction(hover)
        map.addInteraction(translate)

        // 마우스 Hover
        hover.on('select', (evt) => {
          const isHover = evt.selected.length !== 0
          if (isHover) {
            map.getViewport().style.cursor = 'pointer'
          } else {
            map.getViewport().style.cursor = ''
          }
        });

        map.on('singleclick', (evt) => {
          contextMenu.close()
        })

        map.addControl(contextMenu)

        this.SET_VECTOR_SOURCE_FOR_MAP(vectorSource)
        this.SET_GCP_MAP(map)
      },
    },
  }

</script>

<style scoped>
  #mapViewer {
    z-index: 0;
    width: 49%;
    height: 400px;
    display: inline-block !important;
  }

</style>
