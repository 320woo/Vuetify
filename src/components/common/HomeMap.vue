<template>
  <div id="homeMap" tabindex="0" class="map elevation-3">
    <v-card ref="featureInfo" class="featureInfo" v-show="showFeatureInfo">
      <v-card-title>{{ featureInfoTitle }}</v-card-title>
      <v-card-text v-if="featureInfoText != null && featureInfoText.length > 0">{{ featureInfoText }}</v-card-text>
    </v-card>
  </div>
  <!--<OverlayPopup></OverlayPopup>-->
</template>

<script>
  import Constant from '../common/constants'
  import * as types from '../../vuex/mutation-types'

  import Map from 'ol/Map'
  import View from 'ol/View.js'
  import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
  import { Vector as VectorSource, XYZ } from 'ol/source'
  import { Circle, Fill, Icon, Stroke, Style, Text } from 'ol/style'
  import { fromLonLat, toLonLat, transform, transformExtent } from 'ol/proj.js'
  import { Draw, Select, Snap } from 'ol/interaction'
  import { click, pointerMove } from 'ol/events/condition'
  import { toStringHDMS } from 'ol/coordinate'
  import Point from 'ol/geom/Point'
  import { defaults as defaultControls } from 'ol/control.js'
  import MousePosition from 'ol/control/MousePosition.js'
  import { createStringXY } from 'ol/coordinate.js'
  import Polygon from 'ol/geom/Polygon'
  import Overlay from 'ol/Overlay'
  import Feature from 'ol/Feature'
  import AreaUtil from '@/utils/utils/areaUtil'

  import OverlayPopup from '../map/OverlayPopup'

  export default {
    name: 'HomeMap',
    components: { overlay_popup: OverlayPopup },

    props: {
      selectedTaskId: {
        type: String,
        required: false
      },
      projectInfo: {
        type: Object,
        required: false
      },
      testView: {
        type: Boolean,
        default: false
      },
      parentName: {
        type: String
      },
      areaList: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        name: 'HomeMap',
        markerLayer: null,
        map: null,
        mapBounds: null,
        mapMinZoom: 7,
        mapMaxZoom: 25,
        vectorSource: null,
        vectorLayer: null,
        areaVectorSource: null,
        areaVectorLayer: null,
        projection: null,
        displayProjection: null,
        showMenu: true,
        mapDrawContent: null,
        select: null,
        selectedFeature: null,
        showFeatureInfo: false,
        featureInfoTitle: 'Title',
        featureInfoText: 'Content'
      }
    },

    created() {
      console.log('[created] HomeMap')
      this.initData()
    },
    mounted() {
      console.log('[mounted] HomeMap')
      this.initMap()

      // this.changeToolMode();

      // this.setTestMarker(14162415.272872632, 4489670.737465396);
      if (this.testView) {
        this.setTestMarker([14298765.95, 4254294.42], 'test1')
        this.setTestMarker([14299099.91, 4254294.42], 'test2')
        this.setTestMarker([14298765.95, 4254609.56], 'test3')
        this.setTestMarker([14301326.30, 4255500.21], 'test4')
      }
    },
    updated() {
      console.log('[updated] HomeMap')
    },
    methods: {
      initData() {
        this.vectorSource = new VectorSource()
        this.vectorLayer = new VectorLayer({
          source: this.vectorSource,
          style: new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.4)'
            }),
            stroke: new Stroke({
              color: '#b84fbe',
              width: 3
            }),
            image: new Circle({
              radius: 7,
              fill: new Fill({
                color: '#b84fbe'
              })
            })
          })
        })

        this.areaVectorSource = new VectorSource({})
        this.areaVectorLayer = new VectorLayer({
          source: this.areaVectorSource,
          style: new Style({
            stroke: new Stroke({
              color: '#ff0012',
              width: 4
            }),
            fill: new Fill({
              color: 'rgba(255,255,255,0.7)'
            })
          })
        })

        this.projection = 'EPSG:3857'
        this.displayProjection = 'EPSG:4326'

        this.$store.commit(types.MAP_LAYER_LIST_CLEAR)

      },

      initMap() {
        // test 마우스 좌표 정보 표시
        // let mousePositionControl = new MousePosition({
        //   coordinateFormat: createStringXY(4),
        //   projection: 'EPSG:4326',
        //   // comment the following two lines to have the mouse position
        //   // be placed within the map.
        //   className: 'custom-mouse-position',
        //   target: document.getElementById('mouse-position'),
        //   undefinedHTML: '&nbsp;'
        // })

        this.map = new Map({
          controls: defaultControls({
            attributionOptions: {
              collapsible: false
            },
            zoom: false
          })/*.extend([mousePositionControl])*/,
          target: 'homeMap',
          layers: [
            new TileLayer({
              // style: 'Aerial',
              source: new XYZ({
                //201612, 201710, 201802, 201808
                //Base(19), Satellite(18)
                // url: 'http://xdworld.vworld.kr:8080/2d/Satellite/201710/{z}/{x}/{y}.jpeg',
                url: 'http://xdworld.vworld.kr:8080/2d/Base/201802/{z}/{x}/{y}.png',
                minZoom: this.mapMinZoom,
                maxZoom: 18
              }),
              opacity: this.getOpacity
            }),
            this.areaVectorLayer,
            this.vectorLayer
          ],

          view: new View({
            center: fromLonLat([128.44910729603248, 35.663777035907316]),
            zoom: 14,
            minZoom: this.mapMinZoom,
            maxZoom: this.mapMaxZoom
            // extent: transformExtent([128.44307554426888, 35.66741877663742, 128.4553321675001, 35.660654665029725], this.displayProjection, this.projection)
          })
        })

        this.select = new Select({
          source: this.vectorSource,
          condition: click
        })

        let selectPointerMove = new Select({
          source: this.vectorSource,
          condition: pointerMove
        })

        this.map.addInteraction(this.select)
        this.map.addInteraction(selectPointerMove)

        this.select.on('select', (e) => {
          console.log('[this.select.on] select', e)
          if (e.deselected[0] && this.selectedFeature) {
            if (e.deselected[0].getGeometry() instanceof Point) {
              this.selectedFeature.setStyle(this.getIconStyle())
              this.selectedFeature = null
            }
          }

          const feature = e.selected[0]
          if (feature && feature.getGeometry() instanceof Point) {
            if (feature.getId() !== undefined) {
              this.selectedFeature = feature
              this.selectedFeature.setStyle(this.getSelectIconStyle())
              this._onSelectFeature(feature.getId())
            }
          }

          // this.select.getFeatures().clear()
        })

        selectPointerMove.on('select', e => {
          console.log('selectPointerMove.on select', e.mapBrowserEvent)
          const feature = e.selected[0]
          if (feature) {
            console.log('pointer feature id: ', feature.getId())
            const customData = feature.get('customData')
            if (customData) {
              console.log('feature custom data: ', customData)
              this.featureInfoTitle = customData.area_name
              this.featureInfoText = customData.description
              this.displayFeatureInfo(feature.getId(), e.mapBrowserEvent.originalEvent)
            } else {
              this.hideFeatureInfo()
            }
          }
          else {
            this.hideFeatureInfo()
          }
        })

        this.map.on('pointermove', (e) => {
          let pixel = e.map.getEventPixel(e.originalEvent)
          let hit = e.map.hasFeatureAtPixel(pixel)
          // console.log('pixel: ', pixel, 'hit:', hit, 'evt:', e)
          this.map.getViewport().style.cursor = hit ? 'pointer' : ''
        })

        // this.map.on('click', this.onClick);
        //
        // this.modify = new Modify({source: this.vectorSource});
        // this.map.addInteraction(this.modify);

        //this.$store.dispatch(types.MAP_LAYER_LIST, {projectId: this.projectInfo.projectId, tasksInfo: this.projectInfo.tasks});

        // 이거 없어서 마우스 이벤트가 엉뚱하게 처리 되어 개고생함
        this.$nextTick(function() {this.map.updateSize()}.bind(this));
      },

      _onSelectFeature(id) {
        if (this.testView) {
          let projectId = '207c1639-3ce1-4071-879a-0343c992efc7'
          let taskId = 'null'
          switch (id) {
            case 'test1':
              taskId = '8aca7be3-c0c9-4ecb-8a57-f460eee0e806'
              break
            case 'test2':
              taskId = '70e78135-72cd-4479-ad2c-d7cbe32d08b1'
              break
            case 'test3':
              taskId = 'e108f589-a2d1-4de0-9dac-dac40665d4d8'
              break
            case 'test4':
              taskId = '8a8b42d8-d84b-430b-8ed9-dd92024a40a2'
              break
          }
          this.$router.push({
            name: 'map',
            params: {
              'projectId': projectId,
              'taskId': taskId
            }
          })
        } else {
          switch (this.getParentName()) {
            case 'UserMyPage':
            case 'UserHome':
            case 'ProviderHome':
              console.log('[_onSelectFeature] select id : ' + id)
              this.$emit('onClickMarker', id)
              break
            default:
              break

          }
        }
      },

      onClick(event) {
        // switch (this.toolMode) {
        //   case Constant.MODE_MAP_TOOL_MARKER:
        this.addMarker(event)
        //   break;
        // default:
        //   break;
        // }
      },

      getIconStyle() {
        return new Style({
          image: new Icon({
            anchor: [0.5, 30],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: this.markerImage
          })
        })
      },

      getSelectIconStyle() {
        return new Style({
          image: new Icon({
            anchor: [0.5, 30],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: this.selectMarkerImage
          })
        })
      },

      getFeatureHoverStyle() {
        return new Style({
          image: new Icon({
            anchor: [0.5, 30],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 1,
            src: this.markerImage
          })
        })
      },

      addOverlay(event) {
        let container = document.getElementById('popup')
        let content = document.getElementById('popup-content')
        let closer = document.getElementById('popup-closer')

        let overlay = new Overlay({
          element: container,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          }
        })
        this.map.addOverlay(overlay)

        let coordinate = event.coordinate
        console.log('[addOverlay] coordinate: ' + JSON.stringify(coordinate))
        let hdms = toStringHDMS(toLonLat(event.coordinate))

        content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
          '</code>'
        overlay.setPosition(coordinate)
      },

      setArea(areaInfo, id, data) {
        let areaBoundaryList = areaInfo.area_boundary.area
        // let points = areaBoundaryList.map(gpsCoord => fromLonLat([Number(gpsCoord[AreaUtil.DB_KEY_LONGITUDE]), Number(gpsCoord[AreaUtil.DB_KEY_LATITUDE])]))
        let points = areaBoundaryList.map(areaBoundary => areaBoundary.map(gpsCoord => fromLonLat([Number(gpsCoord[AreaUtil.DB_KEY_LONGITUDE]), Number(gpsCoord[AreaUtil.DB_KEY_LATITUDE])])))
        console.log('area points list: ', points)

        let feature = new Feature({
          geometry: new Polygon(points)
        })

        // feature들을 표시할 레이어 생성
        feature.setId(id)
        feature.set('customData', data)
        this.areaVectorSource.addFeature(feature)
      },

      setMarker(lngLat, id, data) {
        console.log('[setMarker] lngLat : ', lngLat, 'id:', id)

        let iconFeature = new Feature({
            geometry: new Point(lngLat)
          }
        )
        iconFeature.setId(id)

        iconFeature.setStyle(this.getIconStyle())

        iconFeature.set('customData', data)

        this.vectorSource.addFeature(iconFeature)
      },

      setTestMarker(latlng, id) {
        console.log(latlng)

        let iconFeature = new Feature({
            geometry: new Point(latlng)
          }
        )
        iconFeature.setId(id)

        iconFeature.setStyle(this.getIconStyle())

        this.vectorSource.addFeature(iconFeature)
      },

      addMarker(event) {
        console.log('[addMarker] event : ' + event.coordinate)

        let coord = transform(event.coordinate, this.projection, this.displayProjection)
        console.log('[addMarker] coord lat : ' + coord[0] + ', lng : ' + coord[1])

        let iconFeature = new Feature(
          new Point(event.coordinate)
        )

        iconFeature.setStyle(this.getIconStyle())

        this.vectorSource.addFeature(iconFeature)
        console.log('[addMarker] this.vectorSource size : ' + this.vectorSource.getFeatures().length)

        // let pos = fromLonLat([coord[0], coord[1]]);
        //
        // // let popup = document.createElement('overlay_popup');
        //
        // let popup = document.createElement('popup');
        // popup.innerText = "가나다";
        //
        // let overlay = new Overlay({
        //   position: pos,
        //   positioning: 'center-center',
        //   element: popup
        //   // element: document.getElementById('popup')
        // });
        // this.map.addOverlay(overlay)
      },

      changeToolMode() {
        console.log('[changeToolMode] ')

        switch (this.toolMode) {
          case Constant.MODE_MAP_TOOL_MARKER:
            this.changeInteraction('None')
            break
          case Constant.MODE_MAP_TOOL_METRIC:
            this.changeInteraction('Polygon')
            break
          case Constant.MODE_MAP_TOOL_VOLUME:
            this.changeInteraction('Polygon')
            break
          case Constant.MODE_MAP_TOOL_DISTANCE:
            this.changeInteraction('LineString')
            break
          default:
            this.changeInteraction('None')
            break
        }
      },

      changeInteraction(type) {
        this.removeInteraction()

        if (type !== 'None') {
          this.draw = new Draw({
            source: this.vectorSource,
            type: type
          })
          this.map.addInteraction(this.draw)

          this.snap = new Snap({ source: this.vectorSource })
          this.map.addInteraction(this.snap)

          this.select = new Select({
            source: this.vectorSource,
            condition: click
          })

          this.map.addInteraction(this.select)
          this.select.on('select', function(event) {
            console.info('[select click] event :' + event.selected[0])
            // that.addOverlay(event);
          })
          //
          // this.draw.on('click', function (event) {
          //   console.log("[draw click] event :" + JSON.stringify(event));
          //
          // });
          //
          // this.snap.on('click', function (event) {
          //   console.log("[snap click] event :" + JSON.stringify(event));
          //
          // });

          // let selectedFeatures = this.select.getFeatures();
          // selectedFeatures.on('select', (event) => {
          //   console.log("[select] event : " + JSON.stringify(event));
          // });

          // let that = this;

        }
      },

      removeInteraction() {
        if (this.draw !== null) {
          this.map.removeInteraction(this.draw)
        }
        if (this.snap !== null) {
          this.map.removeInteraction(this.snap)
        }
      },

      getExtent(layer) {
        let extent = []

        if (layer.hasOwnProperty('bounds')) {
          extent.push(Number(layer.bounds.minx))
          extent.push(Number(layer.bounds.miny))
          extent.push(Number(layer.bounds.maxx))
          extent.push(Number(layer.bounds.maxy))
        }
        console.log('[getExtent] extent : ' + extent.length)
        return extent
      },

      getTileUrl(layer) {
        let url = ''

        if (layer.hasOwnProperty('tiles')) {
          url = Constant.TMS_SERVER_URL + layer.tiles[0]

          url = url.replace('{y}', '{-y}')
        }
        console.log('[getTileUrl] url : ' + url)
        return url
      },

      getTileMinZoom(layer) {
        let zoomLevel = 0

        if (layer.hasOwnProperty('minzoom')) {
          zoomLevel = layer.minzoom
        }
        console.log('[getTileMinZoom] zoomLevel : ' + zoomLevel)
        return zoomLevel
      },

      getTileMaxZoom(layer) {
        let zoomLevel = 0

        if (layer.hasOwnProperty('maxzoom')) {
          zoomLevel = layer.maxzoom
        }

        console.log('[getTileMaxZoom] zoomLevel : ' + zoomLevel)
        return zoomLevel
      },

      addTileLayer(layers) {
        if (this.map !== null && layers.length > 0) {
          for (let index in layers) {
            let layer = layers[index]
            let tileLayer = new TileLayer({
              extent: transformExtent(this.getExtent(layer), this.displayProjection, this.projection),
              source: new XYZ({
                url: this.getTileUrl(layer),
                minZoom: this.getTileMinZoom(layer),
                maxZoom: this.getTileMaxZoom(layer)
              })
            })

            let saveLayers = this.map.getLayers()

            saveLayers.getArray().splice(saveLayers.getArray().length - 1, 0, tileLayer)
            console.log('[addTileLayer] visible : ' + saveLayers.getArray()[0].get('visible'))
          }
          console.info('[addTileLayer] length : ' + this.map.getLayers().getArray().length + ', layers : ' + this.map.getLayers().getArray()[1])

          let layer = layers[0]
          let extent = this.getExtent(layer)
          this.setMapCenter(extent[0], extent[1])
          this.setMapZoom(19)
        }
      },

      setMapCenter(lon, lat) {
        let view = this.map.getView()
        view.setCenter(fromLonLat([lon, lat]))
      },

      setMapZoom(level) {
        let view = this.map.getView()
        view.setZoom(level)
      },

      fitMapAreaPoints(points) {
        let geo = points.map(gpsCoord => fromLonLat([Number(gpsCoord[AreaUtil.DB_KEY_LONGITUDE]), Number(gpsCoord[AreaUtil.DB_KEY_LATITUDE])]))
        let pointPolygon = new Feature({
          geometry: new Polygon([geo])
        })

        let view = this.map.getView()
        view.fit(pointPolygon.getGeometry().getExtent(), { size: this.map.getSize(), maxZoom: 18 })

      },

      // changeHomeMapEnable() {
      //   if (this.map !== null) {
      //     let isEnable = this.isEnableHomeMap;
      //     this.map.getLayers().getArray()[0].setVisible(isEnable);
      //   }
      // },

      changeOpacity() {
        let opacity = this.getOpacity
        console.log('[getOpacity] this.opacity : ' + opacity / 100)
        this.map.getLayers().getArray()[0].setOpacity(opacity / 100)
        // return opacity / 100;
      },

      setAreaList(list) {
        console.log('[setAreaList] list : ', list)
        switch (this.getParentName()) {
          case 'UserMyPage':
          case 'UserHome':
          case 'ProviderHome':
            let areaList = list.map(data => data)
            for (let areaInfo of areaList) {
              // console.log("[setAreaList] data : ", areaInfo)
              let areaBoundaryList = areaInfo.area_boundary.area
              let points = areaBoundaryList[0].map(gpsCoord => fromLonLat([Number(gpsCoord[AreaUtil.DB_KEY_LONGITUDE]), Number(gpsCoord[AreaUtil.DB_KEY_LATITUDE])]))

              // console.log("[setAreaList] points : ", points)

              // 좌표 연결선 feature 생성
              let featurePolygon = new Feature({
                geometry: new Polygon([points])
              })

              areaInfo.centerPoint = this.getCenterOfExtent(featurePolygon.getGeometry().getExtent())
            }
            let centerPointList = areaList.map(areaInfo => areaInfo.centerPoint)

            // 영역의 중앙 점들을 이어 폴리곤 생성
            let pointPolygon = new Feature({
              geometry: new Polygon([centerPointList])
            })
            // let viewCenter = this.getCenterOfExtent(pointPolygon.getGeometry().getExtent())
            let view = this.map.getView()
            view.fit(pointPolygon.getGeometry().getExtent(), { size: this.map.getSize(), maxZoom: 18 })

            areaList.forEach((item, index) => {
              // console.log("[setAreaList] data : ", areaInfo)
              // 영역 생성
              this.setArea(item, index, item)
              // 마커 생성
              this.setMarker(item.centerPoint, index, item)
            })

            break
          default:
            break
        }
      },

      getCenterOfExtent(extent) {
        let x = extent[0] + (extent[2] - extent[0]) / 2
        let y = extent[1] + (extent[3] - extent[1]) / 2
        return [x, y]
      },

      getParentName() {
        console.log('[getParentName] parent name : ', this.parentName)
        return this.parentName
      },

      displayFeatureInfo(featureId, originalEvent) {
        console.log('displayFeatureInfo: ', featureId, originalEvent)
        let fi = this.$refs.featureInfo.$el
        console.log(fi, originalEvent.clientX, originalEvent.clientY)
        fi.style.left = `${originalEvent.clientX}px`
        fi.style.top = `${originalEvent.clientY}px`
        this.showFeatureInfo = true
      },

      hideFeatureInfo() {
        console.log('hideFeatureInfo')
        this.showFeatureInfo = false
      }
    },
    computed: {
      toolMode() {
        return this.$store.getters.getToolMode
      },
      markerImage() {
        return require('@/assets/marker.png')
      },
      selectMarkerImage() {
        return require('@/assets/markerSel.png')
      },
      storeMapLayer() {
        return this.$store.getters.getLayerList
      },
      isEnableHomeMap() {
        return this.$store.getters.isEnableHomeMap
      },
      isEnable2DMap() {
        return this.$store.getters.isEnable2DMap
      },
      getOpacity() {
        return this.$store.getters.getOpacity
      },
      getAreaBoundaryList() {
        return this.areaList
      }

    },
    watch: {
      // toolMode(val, oldVal) {
      //   console.log("[toolMode] val : " + val + ", oldVal : " + oldVal);
      //   this.changeToolMode();
      // },
      // storeMapLayer(val, oldVal) {
      //   console.log("[storeMapLayer] watch");
      //   this.addTileLayer(val)
      // },
      // isEnableHomeMap(val, oldVal) {
      //   console.log("[isEnableHomeMap] watch : " + val);
      //   this.changeHomeMapEnable()
      // },
      getOpacity(val, oldVal) {
        console.log('[getOpacity] watch')
        this.changeOpacity()
      },

      getAreaBoundaryList(val) {
        this.setAreaList(val)
      }
    }
  }
</script>

<style scoped>
  /*#baseMap {*/
  /*width: 100%;*/
  /*left: 0;*/
  /*top: 0;*/
  /*}*/
  .featureInfo {
    position: fixed;
    z-index: 100;
  }
</style>
