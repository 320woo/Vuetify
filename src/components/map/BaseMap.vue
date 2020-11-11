<template>
  <div
    id="baseMap"
    tabindex="0"
    class="map"
    @resize="changeMapSize"
    @keyup="removeFeature"
  ></div>
</template>

<script>
  import Constant from '../common/constants'
  import * as types from '../../vuex/mutation-types'
  import StringUtil from '@/utils/utils/stringUtil'
  import { mapGetters, mapMutations } from 'vuex'

  import Map from 'ol/Map'
  import View from 'ol/View.js'
  import { Heatmap as HeatmapLayer, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
  import { Vector as VectorSource, XYZ } from 'ol/source'
  import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from 'ol/style'
  import { fromLonLat, toLonLat, transform, transformExtent } from 'ol/proj.js'
  import { Draw, Select } from 'ol/interaction'
  import { click, pointerMove } from 'ol/events/condition'
  import { toStringHDMS } from 'ol/coordinate'
  import Point from 'ol/geom/Point'
  import Polygon from 'ol/geom/Polygon'
  import LineString from 'ol/geom/LineString'
  import { defaults as defaultControls, ScaleLine } from 'ol/control.js'
  import { getArea, getLength } from 'ol/sphere.js'
  import { unByKey } from 'ol/Observable.js'
  import GeometryType from 'ol/geom/GeometryType'
  import GeoJSON from 'ol/format/GeoJSON.js'

  import Overlay from 'ol/Overlay'
  import Feature from 'ol/Feature'

  import OverlayPopup from './OverlayPopup'
  import Cookie from '@/utils/utils/cookieUtil'
  import LandPrice from '@/templateLandPriceStatistics'

  import 'ol/ol.css';
  import KML from 'ol/format/KML';

  import dbAPI from '@/utils/api/dbAPI'
  import AreaUtil from '@/utils/utils/areaUtil'


  const EnumDrawType = {
    NONE: { value: 0, name: 'None' },
    POLYGON: { value: 1, name: 'Polygon' },
    LINESTRING: { value: 2, name: 'LineString' },
    WAYPOINTPLAN: { value: 3, name: 'WAYPOINTPLAN' }
  }

  const EnumCityType = {
    PROVINCE: 'province',
    DISTRICT: 'district',
    NEIGHBORHOOD: 'neighborhood'
  }

  const MEDIA_PLATFORM_MAP = 'media_platform_map'

  // customLayer, vectorLayer, imagePointerLayer, geoJsonLayer, analysisBaseLayer, analysisLayer
  const EXTERNAL_LAYER_COUNT = 5

  export default {
    components: { overlay_popup: OverlayPopup },

    props: {
      selectedTaskId: {
        type: String
      },
      projectInfo: {
        type: Object
      },
      mapMode: {
        type: Object
      },
      transparency: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        name: 'BaseMap',
        markerLayer: null,
        map: null,
        mapBounds: null,
        currentZoom: -1,
        mapMinZoom: 7,
        mapDefaultZoom: 19,
        mapMaxZoom: 22, // 최대 : 25
        showTooltipZoomLevel: 20,
        geoJsonSource: null,
        geoJsonLayer: null,
        imagePointerSource: null,
        imagePointerLayer: null,
        vectorSource: null,
        vectorLayer: null,
        projection: null,
        displayProjection: null,
        showMenu: true,
        mapDrawContent: [],
        baseMapLayer: null,
        hybridLayer: null,
        currentTaskLayer: null,
        geoJsonImageStyle: null,
        sketch: null,
        helpTooltipElement: null,
        helpTooltip: null,
        measureTooltipElement: null,
        measureTooltip: null,
        measureTooltipList: [],
        geoDataTooltip: null,
        drawListener: null,
        selectClick: null,
        selectHover: null,
        selectedFeature: null,
        pointHover: false,
        features: [],
        visibleTransparencyPolygonStyle: null,
        visiblePolygonStyle: null,
        invisiblePolygonStyle: null,
        analysisBasePolygonStyle: null,
        analysisPolygonStyle: null,
        imagePointFeatures: [],
        levelOneOverlay: [],
        levelTwoOverlay: [],
        levelThreeOverlay: [],
        cityLevelTooltip: [],
        currentCityType: null,
        waypointLayer: null,
        defaultLat: 37.494864,
        defaultLng: 127.122385,
        areaPointArray: [],
        analysisAreaPointArray: [],
        analysisBaseVectorSource: null,
        analysisBaseVectorLayer: null,
        analysisVectorSource: null,
        analysisVectorLayer: null,
        waypointPlanArray: [],
        waypointPlanSource: null,
        waypointResultLayer: null,
        waypointResultArray: [],
        waypointResultSource: null,

        EnumDrawType,
        EnumCityType
      }
    },

    created() {
      console.log('[created] BaseMap')

      this.initData()

      console.log('[current ToolMode] ' + this.toolMode)
      // sample test
      // this.initLevelOverlay()
    },
    mounted() {
      console.log('[mounted] BaseMap')

      this.initMap()
      // this.initTooltip()
      this.changeToolMode()
      this.isShowTimeline = false

      // if (this.getWaypointList) {
      //   this.setWaypoints(this.getWaypointList)
      // }

      if (this.getAreaList) {
        this.setAreaPoints(this.getAreaList)
      }

      if (this.getAnalysisAreaList && this.getAnalysisAreaList.length > 0) {
        this.setAnalysisAreaPoints(this.getAnalysisAreaList)
      }

      if (this.getSprayPlanAreaList && this.getSprayPlanAreaList.length > 0) {
        this.setSprayPlanAreaPoints(this.getSprayPlanAreaList)
        this.addSprayResult()
      }

      if (this.getSprayResultList) {
        console.log('[BaseMap] call getSprayResultList')
        // this.getSprayResultList()
        this.addSprayResult()
      }
    },
    updated() {
      console.log('[updated] BaseMap')
    },

    destroyed() {
      console.log('[destroyed] ')

      this.clearAnalysisArea()
      if (this.projectInfo /*&& this.mapMode !== Constant.ENUM_MAP_MODE.TASK_MAP*/) {
        let cookie = Cookie.getCookie(MEDIA_PLATFORM_MAP)
        if (cookie) {
          let index = cookie.findIndex(item => {
            return item.projectId === this.projectInfo.projectId
          })

          if (index >= 0) {
            let point = transform(
              [
                this.map.getView().getCenter()[0],
                this.map.getView().getCenter()[1]
              ],
              this.projection,
              this.displayProjection
            )
            cookie[index].center[0] = point[0]
            cookie[index].center[1] = point[1]
            cookie[index].zoom = this.map.getView().getZoom()

            Cookie.setCookie(MEDIA_PLATFORM_MAP, cookie)
          }
        }
      }
    },

    methods: {
      ...mapMutations([
        'addAreaList',
        'addAreaSize',
        'setMapFeatureRemove',
        'removeAreaItem',
        'addWaypointList',
        'addWaypointResultList',
        'addAnalysisArea',
        'setCurrentSelectedArea',
        'clearAnalysisArea',
        'addSprayPlanArea',
        'setCurrentSelectedSprayPlanArea',
        'clearSprayPlanArea'
      ]),

      initData() {
        let image = new CircleStyle({
          radius: 5,
          fill: null,
          stroke: new Stroke({ color: 'red', width: 1 })
        })

        this.geoJsonImageStyle = {
          Point: new Style({
            image: image
          }),
          LineString: new Style({
            stroke: new Stroke({
              color: 'green',
              width: 1
            })
          }),
          MultiLineString: new Style({
            stroke: new Stroke({
              color: 'green',
              width: 1
            })
          }),
          MultiPoint: new Style({
            image: image
          }),
          MultiPolygon: new Style({
            stroke: new Stroke({
              color: 'rgb(244, 55, 66)',
              width: 3
            }),
            fill: new Fill({
              color: 'rgba(244, 55, 66, 0.3)'
            })
          }),
          Polygon: new Style({
            stroke: new Stroke({
              color: 'blue',
              lineDash: [4],
              width: 3
            }),
            fill: new Fill({
              color: 'rgba(0, 0, 255, 0.1)'
            })
          }),
          GeometryCollection: new Style({
            stroke: new Stroke({
              color: 'magenta',
              width: 2
            }),
            fill: new Fill({
              color: 'magenta'
            }),
            image: new CircleStyle({
              radius: 10,
              fill: null,
              stroke: new Stroke({
                color: 'magenta'
              })
            })
          }),
          Circle: new Style({
            stroke: new Stroke({
              color: 'red',
              width: 2
            }),
            fill: new Fill({
              color: 'rgba(255,0,0,0.2)'
            })
          })
        }

        this.visibleTransparencyPolygonStyle = new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.0)'
          }),
          stroke: new Stroke({
            color: 'rgba(184, 79, 190, 0.8)',
            width: 3
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: 'rgba(184, 79, 190, 0.8)'
            })
          })
        })

        this.visiblePolygonStyle = new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.4)'
          }),
          stroke: new Stroke({
            color: 'rgba(184, 79, 190, 0.8)',
            width: 3
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: 'rgba(184, 79, 190, 0.8)'
            })
          })
        })

        this.invisiblePolygonStyle = new Style({
          fill: new Fill({
            color: 'rgba(0, 0, 0, 0)'
          }),
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0)',
            width: 3
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: 'rgba(0, 0, 0, 0)'
            })
          })
        })

        this.analysisBasePolygonStyle = new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.0)'
          }),
          stroke: new Stroke({
            color: 'rgba(7, 189, 59, 0.8)',
            width: 3
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: 'rgba(7, 189, 59, 0.8)'
            })
          })
        })

        this.analysisPolygonStyle = new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.0)'
          }),
          stroke: new Stroke({
            color: 'rgba(218, 219, 150, 0.8)',
            width: 3
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: 'rgba(218, 219, 150, 0.8)'
            })
          })
        })

        this.analysisBaseVectorSource = new VectorSource()
        this.analysisVectorSource = new VectorSource()
        this.imagePointerSource = new VectorSource()
        this.vectorSource = new VectorSource()

        this.analysisBaseVectorLayer = new VectorLayer({
          name: 'analysisBaseVectorLayer',
          source: this.analysisBaseVectorSource,
          style: this.analysisBasePolygonStyle
        })
        this.analysisVectorLayer = new VectorLayer({
          name: 'analysisVectorLayer',
          source: this.analysisVectorSource,
          style: this.analysisPolygonStyle
        })
        this.imagePointerLayer = new VectorLayer({
          name: 'imagePointerLayer',
          source: this.imagePointerSource,
          style: this.visiblePolygonStyle
        })
        this.vectorLayer = new VectorLayer({
          name: 'vectorLayer',
          source: this.vectorSource,
          style: this.visiblePolygonStyle
        })
        this.projection = 'EPSG:3857'
        this.displayProjection = 'EPSG:4326'


        this.$store.commit(types.MAP_LAYER_LIST_CLEAR)
      },

      initMap() {
        let scaleLineControl = new ScaleLine()
        let currentLocation = this.getLocation()
        let lon = currentLocation.lng
        let lat = currentLocation.lat
        let zoom = this.mapDefaultZoom

        if (this.projectInfo /*&&
          this.mapMode !== Constant.ENUM_MAP_MODE.TASK_MAP*/) {
          console.log('[initMap] projectId : ' + this.projectInfo.projectId)
          let cookie = Cookie.getCookie(MEDIA_PLATFORM_MAP)
          if (cookie) {
            let index = cookie.findIndex(item => {
              return item.projectId === this.projectInfo.projectId
            })

            console.log('[initMap] index : ' + index)
            if (index >= 0) {
              lon = cookie[index].center[0]
              lat = cookie[index].center[1]
              zoom = cookie[index].zoom
              console.log('[initMap] lon : ' + lon)
              console.log('[initMap] lat : ' + lat)
              console.log('[initMap] zoom : ' + zoom)
            }
          }
        }

        this.map = new Map({
          controls: defaultControls({
            attributionOptions: {
              collapsible: false
            },
            zoom: false
          }).extend([scaleLineControl]),
          target: 'baseMap',
          layers: [
            (this.baseMapLayer = new TileLayer({
              // style: 'Aerial',
              name: 'baseLayer',
              source: new XYZ({
                //201612, 201710, 201802, 201808
                //Base(19), Satellite(18)
                //url: 'http://xdworld.vworld.kr:8080/2d/Satellite/201710/{z}/{x}/{y}.jpeg',
                //url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure', //Constant.BASE_SATELLITE_MAP_URL,
                url: Constant.BASE_SATELLITE_MAP_URL,
                // url: 'http://xdworld.vworld.kr:8080/2d/Base/201802/{z}/{x}/{y}.png',
                minZoom: this.mapMinZoom,
                maxZoom: 19
              })
            })),
            (this.hybridLayer = new TileLayer({
              name: 'hybridLayer',
              source: new XYZ({
                url: Constant.BASE_HYBRID_MAP_URL,
                // url: 'http://xdworld.vworld.kr:8080/2d/Hybrid/service/{z}/{x}/{y}.png',
                minZoom: this.mapMinZoom,
                maxZoom: 19
              })
            })),
            this.vectorLayer,
            this.imagePointerLayer,
            this.analysisBaseVectorLayer,
            this.analysisVectorLayer
          ],

          view: new View({
            center: fromLonLat([lon, lat]),
            zoom: zoom,
            minZoom: this.mapMinZoom,
            maxZoom: this.mapMaxZoom,
            extent: transformExtent(
              [124, 33, 130, 42],
              this.displayProjection,
              this.projection
            )
          })
        })

        this.map.on('click', this.onClick)

        // Polygon 변경
        // this.modify = new Modify({source: this.vectorSource})
        // this.map.addInteraction(this.modify)

        this.selectClick = new Select({
          source: this.vectorSource,
          condition: click
        })

        this.selectHover = new Select({
          source: this.vectorSource,
          condition: pointerMove,
          filter: (feature, layer) => {
            return layer && layer.get('name') === 'vectorLayer'
          }
        })

        this.map.addInteraction(this.selectClick)
        this.map.addInteraction(this.selectHover) // 깜빡임 현상 문제

        this.selectClick.on('select', event => {
          console.log('[selectClick] select', event)

          if (this.isShowContent) {
            if (event.deselected[0] && this.selectedFeature) {
              if (event.deselected[0].getGeometry() instanceof Point &&
                event.deselected[0].getId()) {
                this.selectedFeature.setStyle(this.getIconStyle())
                this.selectedFeature = null
                this.$store.commit(types.MAP_SELECTED_FEATURE, this.selectedFeature)
                this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, {
                  markerId: null
                })
              }
            }

            if (event.selected[0]) {
              if (event.selected[0].getGeometry() instanceof Point) {
                console.log('[selectClick] Point')
                if (event.selected[0].getId()) {
                  this.selectedFeature = event.selected[0]
                  this.$store.commit(types.MAP_SELECTED_FEATURE, this.selectedFeature)

                  this.selectedFeature.setStyle(this.getSelectIconStyle())
                  this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, {
                    markerId: event.selected[0].getId()
                  })
                  this.setCurrentSelectedArea({
                    id: null
                  })
                  this.setCurrentSelectedSprayPlanArea({
                    id: null
                  })
                }
              } else if (event.selected[0].getGeometry() instanceof LineString ||
                event.selected[0].getGeometry() instanceof Polygon) {
                console.log(
                  '[selectClick] event.selected[0].getId() : ' +
                  event.selected[0].getId()
                )
                if (event.selected[0].getId()) {
                  this.selectedFeature = event.selected[0]
                  this.$store.commit(types.MAP_SELECTED_FEATURE, this.selectedFeature)
                  this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, {
                    markerId: event.selected[0].getId()
                  })
                  this.setCurrentSelectedArea({
                    id: event.selected[0].getId()
                  })
                  this.setCurrentSelectedSprayPlanArea({
                    id: event.selected[0].getId()
                  })
                }
                console.log('[selectClick] LineString or Polygon')
              }
            } else if (this.selectedFeature) {
              this.selectedFeature = null
              this.$store.commit(types.MAP_SELECTED_FEATURE, this.selectedFeature)
              this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, {
                markerId: null
              })
              this.setCurrentSelectedArea({
                id: null
              })
              this.setCurrentSelectedSprayPlanArea({
                id: null
              })
            }
          }
        })

        this.map.on('pointermove', function(evt) {
          let hit = this.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
            return true
          })
          if (hit) {
            document.body.style.cursor = 'pointer'
          } else {
            document.body.style.cursor = ''
          }
        })

        if (this.projectInfo !== undefined) {
          this.initTaskMap()

          let mapTileMode = 1
          if (this.isEnableEoMap)
            mapTileMode = 2
          else if (this.isEnableDsmMap)
            mapTileMode = 3
          // else if (this.isEnableAiEoMap)
          //   mapTileMode = 5

          console.log('mapTileMode: '+mapTileMode)
          // this.$store.dispatch(types.MAP_LAYER_LIST, {
          //   projectId: this.projectInfo.projectId,
          //   tasksInfo: this.projectInfo.tasks,
          //   mapmode: mapMode
          // })
          this.$store.dispatch(types.MAP_LAYER_LIST, {
            projectId: this.projectInfo.projectId,
            tasksInfo: this.projectInfo.tasks,
            mapMode: mapTileMode
          })
        }

        let list = this.getMarkerList
        if (list) {
          this.refreshMarker(list)
        }

        this.map.on('moveend', event => {
          if (this.isShowContent) {
            this.showTooltip(this.isAvailableShowTooltip())
          }

          let zoomLevel = this.map.getView().getZoom()
          if (this.currentZoom !== zoomLevel) {
            this.currentZoom = zoomLevel
            this.changeZoomLevel(zoomLevel)
          }
        })

        this.goMyArea()
      },

      initTaskMap() {
        for (let i = 0; i < this.projectInfo.tasks.length; i++) {
          let key = this.projectInfo.tasks[i].task_id
          console.log('[initTaskMap] key : ' + key)
          this.mapDrawContent[key] = i
        }
      },

      initLevelOverlay() {
        let title = LandPrice.landPriceStatistics.title
        let date = LandPrice.landPriceStatistics.date

        let result = LandPrice.landPriceStatistics.result

        result.forEach((itemOne, index) => {
          this.levelOneOverlay[this.levelOneOverlay.length] = {
            message: this.getLevelPopupMessage(
              title,
              date,
              itemOne.province,
              itemOne.value
            ),
            lat: itemOne.lat,
            lng: itemOne.lng
          }

          itemOne.districts.forEach(itemTwo => {
            this.levelTwoOverlay[this.levelTwoOverlay.length] = {
              message: this.getLevelPopupMessage(
                title,
                date,
                itemTwo.district,
                itemTwo.value
              ),
              lat: itemTwo.lat,
              lng: itemTwo.lng
            }

            if (itemTwo.neighborhoods !== undefined) {
              itemTwo.neighborhoods.forEach(itemThree => {
                this.levelThreeOverlay[this.levelThreeOverlay.length] = {
                  message: this.getLevelPopupMessage(
                    title,
                    date,
                    itemThree.neighborhood,
                    itemThree.value
                  ),
                  lat: itemThree.lat,
                  lng: itemThree.lng
                }
              })
            }
          })
        })

        console.log('[initLevelOverlay] levelOneOverlay : ', this.levelOneOverlay)
        console.log('[initLevelOverlay] levelTwoOverlay : ', this.levelTwoOverlay)
        console.log('[initLevelOverlay] levelThreeOverlay : ', this.levelThreeOverlay)
      },

      getLevelPopupMessage(title, date, city, value) {
        return title + '(' + date + ')</br>' + city + '</br>' + value
      },

      onClick(event) {
        console.log('[BaseMap::onClick] current ToolMode: ' + this.toolMode)
        switch (this.toolMode) {
          case Constant.MODE_MAP_TOOL_MARKER:
            console.log('[BaseMap::onClick] Constant.MODE_MAP_TOOL_MARKER: ' + Constant.MODE_MAP_TOOL_MARKER)
            this.addMarker(event)
            break
          default:
            break
        }

        this.map.forEachFeatureAtPixel(event.pixel, feature => {
          console.log('[onClick] feature : ', feature)
          if (feature && feature.hasOwnProperty('metadata')) {
            let metadata = feature.metadata
            console.log('[onClick] metadata : ', metadata)

            let id = ''
            if (metadata.file_id !== undefined) {
              id = metadata.file_id
            } else if (metadata.id !== undefined) {
              id = metadata.id
            }

            this.$emit('detail-view', this.selectedTaskId, id)
          }
        })
      },

      getImagePointerIconStyle() {
        return new Style({
          image: new Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: this.imagePointerImage
          })
        })
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

        content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>'
        overlay.setPosition(coordinate)
      },

      addMarker(event) {
        console.log('[addMarker] this.pointHover : ' + this.pointHover)
        if (this.pointHover) return

        console.log('[addMarker] event : ' + event.coordinate)

        let alreadyFeature = null

        for (let index in this.features) {
          // console.log(this.features[index].getGeometry())
          let lon = this.features[index].getGeometry().flatCoordinates[0]
          let lat = this.features[index].getGeometry().flatCoordinates[1]

          let clickLon = event.coordinate[0]
          let clickLat = event.coordinate[1]

          if (clickLon === lon && clickLat === lat) {
            alreadyFeature = this.features[index]
            break
          }
        }

        if (alreadyFeature === null) {
          let coord = transform(
            event.coordinate,
            this.projection,
            this.displayProjection
          )

          console.log(
            '[addMarker] coord lat : ' + coord[0] + ', lng : ' + coord[1]
          )

          let iconFeature = new Feature(new Point(event.coordinate))

          iconFeature.setStyle(this.getIconStyle())

          // this.showMarkerContent(true)
          let gps = Constant.REQUEST_MARKER_PARAM_COORD
          gps.gps_x = coord[0]
          gps.gps_y = coord[1]

          this.requestAnnotationAddData(
            Constant.ENUM_ANNOTATION_TYPE.LOCATION,
            [gps],
            null,
            id => {
              console.log('[ADD_MARKER] id : ' + id, iconFeature)
              iconFeature.setId(id)

              this.features.push(iconFeature)
              this.vectorSource.addFeature(iconFeature)
            }
          )
        }
      },

      refreshMarker(data) {
        console.log('[refreshMarker] data : ', data)

        this.removeOverlayList()
        this.removeMarkerList()

        data.forEach(content => {
          switch (content.data.type) {
            case Constant.ENUM_ANNOTATION_TYPE.LOCATION: {
              console.log('[refreshMarker] content : ', content)
              if (
                !content.data.coordinate[0].gps_x ||
                !content.data.coordinate[0].gps_y
              )
                break
              let coord = transform(
                [
                  content.data.coordinate[0].gps_x,
                  content.data.coordinate[0].gps_y
                ],
                this.displayProjection,
                this.projection
              )

              let iconFeature = new Feature(new Point(coord))

              iconFeature.setStyle(this.getIconStyle())
              iconFeature.setId(content.marker_id)

              this.features.push(iconFeature)
              this.vectorSource.addFeature(iconFeature)
            }
              break
            case Constant.ENUM_ANNOTATION_TYPE.DISTANCE: {
              let distCoords = []

              for (let i = 0; i < content.data.coordinate.length; i++) {
                let gps = transform(
                  [
                    content.data.coordinate[i].gps_x,
                    content.data.coordinate[i].gps_y
                  ],
                  this.displayProjection,
                  this.projection
                )
                distCoords.push(gps)
              }

              let feature = new Feature(new LineString(distCoords))
              feature.setId(content.marker_id)

              this.features.push(feature)
              this.vectorSource.addFeature(feature)

              // console.log("[refreshMarker] feature.getLastCoordinate() : " , feature.getGeometry().getLastCoordinate())

              let output = content.data.metadata.description
              let position = feature.getGeometry().getLastCoordinate()
              this.createMeasureTooltip(content.marker_id, output, position)
            }
              break
            case Constant.ENUM_ANNOTATION_TYPE.METRIC:
            case Constant.ENUM_ANNOTATION_TYPE.VOLUME: {
              let metricCoords = []

              for (let i = 0; i < content.data.coordinate.length; i++) {
                let gps = transform(
                  [
                    content.data.coordinate[i].gps_x,
                    content.data.coordinate[i].gps_y
                  ],
                  this.displayProjection,
                  this.projection
                )
                metricCoords.push(gps)
              }

              // console.log("[refreshMarker] metricCoords : ", metricCoords)
              let feature = new Feature(new Polygon([metricCoords]))
              feature.setId(content.marker_id)

              this.features.push(feature)
              this.vectorSource.addFeature(feature)

              // console.log("[refreshMarker] feature.getLastCoordinate() : " , feature.getGeometry().getInteriorPoint().getCoordinates())

              let output = ''
              let description = content.data.metadata.description

              // Demo 용 코드
              if (typeof description === 'string') {
                output = description
              } else if (typeof description === 'object') {
                console.log('[description] description : ', description)
                if (description.hasOwnProperty('name')) {
                  output = output + '이름 : ' + description.name + '<\/br>'
                }
                if (description.hasOwnProperty('address')) {
                  output = output + '주소 : ' + description.address + '<\/br>'
                }
                if (description.hasOwnProperty('metric')) {
                  output = output + '면적 : ' + description.metric + '<\/br>'
                }
                if (description.hasOwnProperty('date')) {
                  output = output + '날짜 : ' + description.date + '<\/br>'
                }
                if (description.hasOwnProperty('manager')) {
                  output = output + '관리자 : ' + description.manager
                }
              }
              let position = feature
                .getGeometry()
                .getInteriorPoint()
                .getCoordinates()
              this.createMeasureTooltip(content.marker_id, output, position)
            }
              break
          }
        })

        if (!this.isShowContent) {
          this.isShowMarker(false)
        }
      },

      removeOverlayList() {
        console.log('[removeOverlayList] ')
        this.measureTooltipList.forEach(item => {
          let overlay = this.map.getOverlayById(item.getId())
          let removeOverlay = this.map.removeOverlay(overlay)

          let element = removeOverlay.getElement()
          if (element) {
            element.parentNode.removeChild(element)
          }
        })

        this.measureTooltipList.splice(0, this.measureTooltipList.length)
      },

      removeMarkerList() {
        console.log('[removeMarkerList] ')
        if (this.features) {
          this.features.forEach(item => {
            this.vectorSource.removeFeature(item)
          })

          this.features.splice(0, this.features.length)
          this.refresh()
        }
      },

      removeGeoDataOverlay() {
        console.log('[removeGeoDataOverlay] ')
        if (this.geoDataTooltip !== null) {
          let removeOverlay = this.map.removeOverlay(this.geoDataTooltip)

          let element = removeOverlay.getElement()
          if (element) {
            element.parentNode.removeChild(element)
          }

          this.geoDataTooltip = null
        }
      },

      removeCityLevelOverlay() {
        console.log('[removeCityLevelOverlay] ')
        this.cityLevelTooltip.forEach(item => {
          let removeOverlay = this.map.removeOverlay(item)

          let element = removeOverlay.getElement()
          if (element) {
            element.parentNode.removeChild(element)
          }
        })

        this.cityLevelTooltip.splice(0, this.cityLevelTooltip.length)
      },

      // 촬영 위치를 지도에 표시
      // lonLatArray: [ [lon, lat] ]
      addShotPoints(lonLatArray) {
        console.log('addShotPoints start.')
        if (this.shotPointsLayer !== undefined) {
          this.map.removeLayer(this.shotPointsLayer)
          console.log('previous shotPointsLayer removed.')
        }

        // 위경도 좌표를 projection coord로 변경
        let points = [] // projection coordinates array
        for (let i = 0; i < lonLatArray.length; i++) {
          points.push(fromLonLat(lonLatArray[i]))
        }

        // 좌표 연결선 feature 생성
        let featureLine = new Feature({
          geometry: new LineString(points)
        })
        // 좌표 점 feature 생성
        let featuresPoint = Array.map(
          points,
          (item, index) =>
            new Feature({
              geometry: new Point(item)
            })
        )

        // feature들을 표시할 레이어 생성
        let source = new VectorSource({})
        source.addFeature(featureLine)
        source.addFeatures(featuresPoint)

        let layer = new VectorLayer({
          source: source
          // style: new Style({
          //   fill: new Fill({color: '#3f79be'}),
          //   stroke: new Stroke({color: '#3f79be', width: 2}),
          //   image: new CircleStyle({
          //     radius: 7,
          //     fill: new Fill({color: '#3f79be'}),
          //     stroke: new Stroke({color: 'white', width: 3}),
          //   })
          // })
        })

        this.shotPointsLayer = layer
        console.log('new shotPointsLayer: ', this.shotPointsLayer)

        this.map.addLayer(layer)
        let extent = source.getExtent()
        let view = this.map.getView()
        view.fit(extent, { size: this.map.getSize(), maxZoom: 18 })
        console.log('addShotPoints ended.')
      },

      setWaypoints(lonLatArray) {
        console.log('[setWaypoints] lonLatArray :', lonLatArray)

        this.clearWaypoints()

        console.log(lonLatArray)
        this.addWaypointPlan(lonLatArray[0])

        // // 맵 가운데 위치 이동
        // let maxX = 0
        // let maxY = 0
        // let minX = 0
        // let minY = 0
        //
        // this.waypointPlanArray.forEach((data, index) => {
        //   let extent = data.getGeometry().getExtent()
        //   if (index === 0) {
        //     minX = extent[0]
        //     minY = extent[1]
        //     maxX = extent[2]
        //     maxY = extent[3]
        //   } else {
        //     if (minX > extent[0]) {
        //       minX = extent[0]
        //     }
        //     if (minY > extent[1]) {
        //       minY = extent[1]
        //     }
        //     if (maxX < extent[2]) {
        //       maxX = extent[2]
        //     }
        //     if (maxY < extent[3]) {
        //       maxY = extent[3]
        //     }
        //   }
        // })
        //
        // let view = this.map.getView()
        // view.fit([minX, minY, maxX, maxY], this.map.getSize())

        console.log('setWaypoints ended.')

      },

      setAnalysisAreaPoints(lonLatArray) {
        this.clearAnalysisAreaPoints()
        if (lonLatArray.length > 0) {
          lonLatArray.forEach(item => {
            this.addAnalysisAreaPoints(item)
          })
          // // 맵 가운데 위치 이동
          // let maxX = 0
          // let maxY = 0
          // let minX = 0
          // let minY = 0
          //
          // this.areaPointArray.forEach((data, index) => {
          //   let extent = data.getGeometry().getExtent()
          //   if (index === 0) {
          //     minX = extent[0]
          //     minY = extent[1]
          //     maxX = extent[2]
          //     maxY = extent[3]
          //   } else {
          //     if (minX > extent[0]) {
          //       minX = extent[0]
          //     }
          //     if (minY > extent[1]) {
          //       minY = extent[1]
          //     }
          //     if (maxX < extent[2]) {
          //       maxX = extent[2]
          //     }
          //     if (maxY < extent[3]) {
          //       maxY = extent[3]
          //     }
          //   }
          // })
          //
          // let view = this.map.getView()
          // view.fit([minX, minY, maxX, maxY], this.map.getSize())

          console.log('setAnalysisAreaPoints ended.')
        }
      },

      setSprayPlanAreaPoints(lonLatArray) {
        this.clearSprayPlanAreaPoints()
        if (lonLatArray.length > 0) {
          lonLatArray.forEach(item => {
            this.addSprayPlanAreaPoints(item)
          })

          this.setAreaCenter(this.analysisAreaPointArray)
          console.log('setSprayPlanAreaPoints ended.')
        }
      },

      setWaypointResult(lonLatArray) {
        console.log('[setWaypointResult] lonLatArray :', lonLatArray)

        // this.clearWaypointResult()

        console.log(lonLatArray)
        this.addWaypointResult(lonLatArray[0])

        console.log('[setWaypointResult] ended.')

      },

      setAreaPoints(lonLatArray) {
        console.log('[setAreaPoints] lonLatArray :', lonLatArray)

        if (lonLatArray.length > 0 && lonLatArray[0].id === undefined) {
          this.clearAreaPoints()

          lonLatArray.forEach(item => {
            this.addAreaPoints(item)
          })

          this.setAreaCenter(this.areaPointArray)
          console.log('setAreaPoints ended.')
        }
      },

      setAreaCenter(areaList) {
        // 맵 가운데 위치 이동
        let maxX = 0
        let maxY = 0
        let minX = 0
        let minY = 0

        areaList.forEach((data, index) => {
          let extent = data.getGeometry().getExtent()
          if (index === 0) {
            minX = extent[0]
            minY = extent[1]
            maxX = extent[2]
            maxY = extent[3]
          } else {
            if (minX > extent[0]) {
              minX = extent[0]
            }
            if (minY > extent[1]) {
              minY = extent[1]
            }
            if (maxX < extent[2]) {
              maxX = extent[2]
            }
            if (maxY < extent[3]) {
              maxY = extent[3]
            }
          }
        })

        let view = this.map.getView()
        view.fit([minX, minY, maxX, maxY], { size: this.map.getSize(), maxZoom: 18 })
      },

      addAreaPoints(lonLatArray) {
        // 위경도 좌표를 projection coord로 변경
        let points = [] // projection coordinates array
        console.log('[addAreaPoints] lonLatArray : ', lonLatArray)

        lonLatArray.area.forEach(item => {
          points.push(fromLonLat([item.lng, item.lat]))
        })

        let feature = null

        if (JSON.stringify(points[0]) === JSON.stringify(points[points.length - 1])) {
          // 영역인 경우
          // 좌표 연결선 feature 생성
          feature = new Feature({
            geometry: new Polygon([points])
          })
        } else {
          // 영역이 아닌 경우 (현재 : LineString, Waypoint Plan)
          const styleFunction = feature => {
            const geometry = feature.getGeometry()
            const styles = [
              // linestring
              new Style({
                stroke: new Stroke({
                  color: '#ff0012',
                  width: 4
                })
              })
            ]

            geometry.forEachSegment((start, end) => {
              styles.push(
                new Style({
                  geometry: new Point(end),
                  image: new Icon({
                    src: this.markerImage,
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction'
                  })
                })
              )
            })
            return styles
          }
          this.vectorLayer.setStyle(styleFunction)

          // 좌표 연결선 feature 생성
          feature = new Feature({
            geometry: new LineString(points)
          })
        }

        // // 좌표 연결선 feature 생성
        // let feature = new Feature({
        //   geometry: new Polygon([points])
        // })

        let size = this.formatArea(feature.getGeometry()).split(' ')[0]
        console.log('[addAreaPoints] size : ' + size)
        if (lonLatArray.id === undefined) lonLatArray.id = this.createFeatureId()
        if (lonLatArray.size === undefined) lonLatArray.size = Number(size)

        let id = lonLatArray.id

        feature.setId(id)
        this.areaPointArray.push(feature)
        this.vectorSource.addFeature(feature)

        if (this.transparency) {
          this.vectorLayer.setStyle(this.visibleTransparencyPolygonStyle)
        }
      },

      addAnalysisAreaPoints(lonLatArray) {
        // 위경도 좌표를 projection coord로 변경
        let points = [] // projection coordinates array
        console.log('[addAnalysisAreaPoints] lonLatArray : ', lonLatArray)

        lonLatArray.area.forEach(item => {
          points.push(fromLonLat([item.longitude, item.latitude]))
        })

        // 좌표 연결선 feature 생성
        let feature = new Feature({
          geometry: new Polygon([points])
        })

        let size = this.formatArea(feature.getGeometry()).split(' ')[0]
        console.log('[addAnalysisAreaPoints] size : ' + size)
        if (lonLatArray.id === undefined) lonLatArray.id = this.createFeatureId()
        if (lonLatArray.size === undefined) lonLatArray.size = Number(size)

        let id = lonLatArray.id

        feature.setId(id)
        this.analysisAreaPointArray.push(feature)

        if (lonLatArray.base) {
          this.analysisBaseVectorSource.addFeature(feature)
        } else {
          this.analysisVectorSource.addFeature(feature)
        }
      },

      addSprayPlanAreaPoints(lonLatArray) {
        // 위경도 좌표를 projection coord로 변경
        let points = [] // projection coordinates array
        console.log('[addSprayPlanAreaPoints] lonLatArray : ', lonLatArray)

        lonLatArray.area.forEach(item => {
          points.push(fromLonLat([item.longitude, item.latitude]))
        })

        // 좌표 연결선 feature 생성
        let feature = new Feature({
          geometry: new Polygon([points])
        })

        let size = this.formatArea(feature.getGeometry()).split(' ')[0]
        console.log('[addSprayPlanAreaPoints] size : ' + size)
        if (lonLatArray.id === undefined) lonLatArray.id = this.createFeatureId()
        if (lonLatArray.size === undefined) lonLatArray.size = Number(size)

        let id = lonLatArray.id

        feature.setId(id)
        this.analysisAreaPointArray.push(feature)

        if (lonLatArray.base) {
          this.analysisBaseVectorSource.addFeature(feature)
        } else {
          this.analysisVectorSource.addFeature(feature)
        }
      },

      clearAreaPoints() {
        if (this.areaPointArray.length > 0) {
          this.areaPointArray.forEach((data) => {
            this.vectorSource.removeFeature(data)
          })
          this.areaPointArray.splice(0, this.areaPointArray.length)
          this.refresh()
        }
      },

      clearAnalysisAreaPoints() {
        console.log('[clearAnalysisAreaPoints] this.analysisAreaPointArray : ', this.analysisAreaPointArray)
        if (this.analysisAreaPointArray.length > 0) {
          this.removeFeature()
          this.analysisBaseVectorSource.clear()
          this.analysisVectorSource.clear()
          this.analysisAreaPointArray.splice(0, this.analysisAreaPointArray.length)
          this.setCurrentSelectedArea({ id: null })
          this.refresh()
        }
      },

      clearSprayPlanAreaPoints() {
        console.log('[clearSprayPlanAreaPoints] this.analysisAreaPointArray : ', this.analysisAreaPointArray)
        if (this.analysisAreaPointArray.length > 0) {
          this.removeFeature()
          this.analysisBaseVectorSource.clear()
          this.analysisVectorSource.clear()
          this.analysisAreaPointArray.splice(0, this.analysisAreaPointArray.length)
          this.setCurrentSelectedSprayPlanArea({ id: null })
          this.refresh()
        }
      },

      clearWaypoints() {
        console.log('[clearWaypoints] this.waypointPlanArray : ', this.waypointPlanArray)
        if (this.waypointPlanArray.length > 0) {
          this.waypointPlanArray.forEach((data) => {
            this.waypointPlanSource.removeFeature(data)
          })
          this.waypointPlanArray.splice(0, this.waypointPlanArray.length)
        }
      },

      clearWaypointResult() {
        if (this.waypointResultArray.length > 0) {
          this.waypointResultArray.forEach((data) => {
            this.waypointResultSource.removeFeature(data)
          })
          this.waypointResultArray.splice(0, this.waypointResultArray.length)
        }
      },

      addSprayResult() {
        console.log('########################################### 001')
        console.log('[addSprayResult] Task ID: '+this.selectedTaskId)

        if (this.selectedTaskId === undefined) return
        // var styleCache = {};
        // var styleFunction = function(feature) {
        //   // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
        //   // standards-violating <magnitude> tag in each Placemark.  We extract it from
        //   // the Placemark's name instead.
        //   console.log('******************************')
        //   var name = feature.get('name');
        //   var magnitude = parseFloat(name.substr(2));
        //   var radius = 5 + 20 * (magnitude - 5);
        //   var style = styleCache[radius];
        //   if (!style) {
        //     style = new Style({
        //       image: new CircleStyle({
        //         radius: radius,
        //         fill: new Fill({
        //           color: 'rgba(255, 153, 0, 0.4)'
        //         }),
        //         stroke: new Stroke({
        //           color: 'rgba(255, 204, 0, 0.2)',
        //           width: 1
        //         })
        //       })
        //     });
        //     styleCache[radius] = style;
        //   }
        //   return style;
        // };
        var heatmapLayer = new HeatmapLayer({ //히트맵을 만들 레이어
          source: new VectorSource({  //벡터 소스
            // url: `${Constant.MISSION_SERVER_URL}/task/`+this.selectedTaskId+'/spray/',
            url: `${Constant.MISSION_SERVER_URL}/task/` + this.selectedTaskId + '/spray/',
            // url: `${Constant.MISSION_SERVER_URL}/task/`+'fa6ca599-004d-44e8-bb20-33e1f37724d1'+'/spray',
            format: new KML({  //형식 지정
              extractStyles: false
            })
          }),
          // style: styleFunction
          blur: 20,  //블러값이 낮을수록 번짐이 커진다. 번짐이 겹치는 곳은 붉은색으로 표기된다.
          radius: 20,  //원 넓이
          weight: function(feature) {
            // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
            // standards-violating <magnitude> tag in each Placemark.  We extract it from
            // the Placemark's name instead.
            var name = feature.get('name')
            var magnitude = parseFloat(name)
            let x = feature.get('geometry').getCoordinates()[0]
            let y = feature.get('geometry').getCoordinates()[1]
            console.log('# spray quantity [coord '+x+', '+y+'] : '+magnitude)
            return magnitude + 1
          }
        })

        this.map.addLayer(heatmapLayer)
      },

      addWaypointPlan(lonLatArray) {
        // 위경도 좌표를 projection coord로 변경
        let points = [] // projection coordinates array
        console.log('[addWaypointPlan] lonLatArray : ', lonLatArray)

        if (lonLatArray) {
          if (Object.keys(lonLatArray).includes('waypoint_plan_info')) {
            const waypointList = lonLatArray.waypoint_plan_info.waypointList
            // if (Object.keys(lonLatArray).includes('waypoint_info')) {
            //   const waypointList = lonLatArray.waypoint_info.waypointList
            console.log('### ' + JSON.stringify(waypointList))
            const convertWaypointList = { area: [] }
            convertWaypointList.area = waypointList.map(value => {
              const obj = {
                lat: value.latitude,
                lng: value.longitude
              }
              return obj
            })
            console.log(convertWaypointList)
            convertWaypointList.area.forEach(item => {
              points.push(fromLonLat([item.lng, item.lat]))
            })
          } else {
            lonLatArray.area.forEach(item => {
              points.push(fromLonLat([item.lng, item.lat]))
            })
          }
          let feature = null

          // 영역이 아닌 경우 (현재 : LineString, Waypoint Plan)
          const styleFunction = feature => {
            const geometry = feature.getGeometry()
            const styles = [
              // linestring
              new Style({
                stroke: new Stroke({
                  color: '#ff0012',
                  width: 4
                })
              })
            ]

            geometry.forEachSegment((start, end) => {
              styles.push(
                new Style({
                  geometry: new Point(end),
                  image: new Icon({
                    src: this.markerImage,
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction'
                  })
                })
              )
            })
            return styles
          }

          // 좌표 연결선 feature 생성
          feature = new Feature({
            geometry: new LineString(points)
          })

          // feature들을 표시할 레이어 생성
          if (lonLatArray.id === undefined) lonLatArray.id = this.createFeatureId()
          let id = lonLatArray.id

          feature.setId(id)
          this.waypointPlanArray.push(feature)

          this.waypointPlanSource = new VectorSource({})
          this.waypointPlanSource.addFeature(feature)

          let layer = new VectorLayer({
            source: this.waypointPlanSource
          })
          layer.setStyle(styleFunction)

          this.waypointLayer = layer
          console.log('new waypointLayer: ', this.waypointLayer)

          this.map.addLayer(layer)

          // let extent = this.waypointPlanSource.getExtent()
          // let view = this.map.getView()
          // view.fit(extent, this.map.getSize())
          console.log('addWayPoints ended.')
        }
      },

      addWaypointResult(lonLatArray) {
        // 위경도 좌표를 projection coord로 변경
        let points = [] // projection coordinates array
        console.log('[addWaypointResult] lonLatArray : ', lonLatArray)

        if (lonLatArray) {
          if (Object.keys(lonLatArray).includes('waypoint_info')) {
            const waypointList = lonLatArray.waypoint_info.waypointList
            const convertWaypointList = { area: [] }
            convertWaypointList.area = waypointList.map(value => {
              const obj = {
                lat: value.latitude,
                lng: value.longitude
              }
              return obj
            })
            console.log(convertWaypointList)
            convertWaypointList.area.forEach(item => {
              points.push(fromLonLat([item.lng, item.lat]))
            })
          } else {
            lonLatArray.area.forEach(item => {
              points.push(fromLonLat([item.lng, item.lat]))
            })
          }
          let feature = null

          // 영역이 아닌 경우 (현재 : LineString, Waypoint)
          const styleFunction = feature => {
            const geometry = feature.getGeometry()
            const styles = [
              // linestring
              new Style({
                stroke: new Stroke({
                  color: '#7a0012',
                  width: 4
                })
              })
            ]

            geometry.forEachSegment((start, end) => {
              styles.push(
                new Style({
                  geometry: new Point(end),
                  image: new Icon({
                    src: this.markerImage,
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction'
                  })
                })
              )
            })
            return styles
          }

          // 좌표 연결선 feature 생성
          feature = new Feature({
            geometry: new LineString(points)
          })

          // feature들을 표시할 레이어 생성
          if (lonLatArray.id === undefined) lonLatArray.id = this.createFeatureId()
          let id = lonLatArray.id

          feature.setId(id)
          this.waypointResultArray.push(feature)

          this.waypointResultSource = new VectorSource({})
          this.waypointResultSource.addFeature(feature)

          let layer = new VectorLayer({
            source: this.waypointResultSource
          })
          layer.setStyle(styleFunction)

          this.waypointResultLayer = layer
          console.log('new waypointResultLayer: ', this.waypointResultLayer)

          this.map.addLayer(layer)
        }
        console.log('[addWaypointResult] ended.')
      },

      showWaypointResult(enable) {
        this.waypointResultLayer.setVisible(enable)
      },

      changeToolMode() {
        console.log('[changeToolMode] ' + this.toolMode)

        switch (this.toolMode) {
          case Constant.MODE_MAP_TOOL_MARKER:
            this.changeInteraction(EnumDrawType.NONE.name)
            break
          case Constant.MODE_MAP_TOOL_METRIC:
            this.changeInteraction(EnumDrawType.POLYGON.name)
            break
          case Constant.MODE_MAP_TOOL_VOLUME:
            this.changeInteraction(EnumDrawType.POLYGON.name)
            break
          case Constant.MODE_MAP_TOOL_DISTANCE:
            this.changeInteraction(EnumDrawType.LINESTRING.name)
            break
          case Constant.MODE_MAP_TOOL_WAYPOINT_PLAN:
            console.log('MODE_MAP_TOOL_WAYPOINT_PLAN')
            this.changeInteraction(EnumDrawType.WAYPOINTPLAN.name)
            break
          case Constant.MODE_MAP_TOOL_ANALYSIS_SPAY_BASE_PLAN:
          case Constant.MODE_MAP_TOOL_ANALYSIS_SPAY_DIFFERENT_PLAN:
          case Constant.MODE_MAP_TOOL_SPAY_BASE_PLAN:
          case Constant.MODE_MAP_TOOL_SPAY_DIFFERENT_PLAN:
            this.changeInteraction(EnumDrawType.POLYGON.name)
            break
          default:
            this.changeInteraction(EnumDrawType.NONE.name)
            break
        }
      },

      changeInteraction(type) {
        this.removeInteraction()

        let toolType = null

        if (type !== EnumDrawType.NONE.name) {
          if (type === EnumDrawType.WAYPOINTPLAN.name) {
            this.removeOverlayList()
            this.removeMarkerList()

            // const styleFunction = feature => {
            //   const geometry = feature.getGeometry()
            //   const styles = [
            //     // linestring
            //     new Style({
            //       stroke: new Stroke({
            //         color: '#ff0012',
            //         width: 4
            //       })
            //     })
            //   ]
            //
            //   geometry.forEachSegment((start, end) => {
            //     styles.push(
            //       new Style({
            //         geometry: new Point(end),
            //         image: new Icon({
            //           src: this.markerImage,
            //           anchor: [0.5, 1],
            //           anchorXUnits: 'fraction',
            //           anchorYUnits: 'fraction'
            //         })
            //       })
            //     )
            //   })
            //   return styles
            // }
            // this.waypointLayer.setStyle(styleFunction)
            toolType = EnumDrawType.LINESTRING.name
          } else {
            toolType = type
          }

          this.draw = new Draw({
            source: this.vectorSource,
            type: toolType,
            style: new Style({
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
              }),
              stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                width: 2
              }),
              image: new CircleStyle({
                radius: 5,
                stroke: new Stroke({
                  color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new Fill({
                  color: 'rgba(255, 255, 255, 0.2)'
                })
              })
            })
          })

          this.map.addInteraction(this.draw)

          // this.snap = new Snap({source: this.vectorSource})
          // this.map.addInteraction(this.snap)

          this.draw.on('click', function(event) {
            console.log('[draw click] event :' + JSON.stringify(event))
          })

          // this.snap.on('click', function (event) {
          //   console.log("
          //   [snap click] event :" + JSON.stringify(event))
          //
          // })

          if (this.toolMode === Constant.MODE_MAP_TOOL_VOLUME) {
            this.draw.on('drawstart', this.drawVolumeStart, this)
            this.draw.on('drawend', this.drawVolumeEnd, this)
          } else {
            this.draw.on('drawstart', this.drawStart, this)
            this.draw.on('drawend', this.drawEnd, this)
          }
        }
      },

      removeInteraction() {
        const oldSelectedFeature = this.selectedFeature
        if (oldSelectedFeature != null) {
          this.selectedFeature = null
          this.$store.commit(types.MAP_SELECTED_FEATURE, this.selectedFeature)
        }
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
        console.log(layers)
        if (this.map !== null && layers.length > 0) {
          for (let index in layers) {
            let layer = layers[index]
            let taskId = this.getTaskId(layer.tiles[0])

            if (!(this.mapDrawContent[taskId] instanceof Object)) {
              console.log('[addTileLayer] add taskId :' + taskId)
              let tileLayer = new TileLayer({
                extent: transformExtent(
                  this.getExtent(layer),
                  this.displayProjection,
                  this.projection
                ),
                name: 'customLayer',
                source: new XYZ({
                  url: this.getTileUrl(layer),
                  minZoom: this.getTileMinZoom(layer),
                  maxZoom: this.getTileMaxZoom(layer),
                  crossOrigin: null /*'use-credentials'*/ /*"anonymous"*/
                }),
                visible: false,
                opacity: 1
              })

              this.mapDrawContent[taskId] = tileLayer

              let saveLayers = this.map.getLayers()
              saveLayers
                .getArray()
                .splice(
                  saveLayers.getArray().length - EXTERNAL_LAYER_COUNT,
                  0,
                  tileLayer
                )
            }
          }
          console.info(
            '[addTileLayer] length : ' +
            this.map.getLayers().getArray().length +
            ', layers : ',
            this.map.getLayers().getArray()[1]
          )

          let layer = layers[0]
          let extent = this.getExtent(layer)
          let lng = (extent[0] + extent[2]) / 2
          let lat = (extent[1] + extent[3]) / 2
          let index = -1
          let cookie = null

          // if (this.mapMode !== Constant.ENUM_MAP_MODE.TASK_MAP) {
            cookie = Cookie.getCookie(MEDIA_PLATFORM_MAP)
            if (cookie) {
              index = cookie.findIndex(item => {
                return item.projectId === this.projectInfo.projectId
              })

              console.log('[addTileLayer] index : ' + index)
              if (index < 0) {
                cookie.push(this.getCookieObjectData(lng, lat))
                Cookie.setCookie(MEDIA_PLATFORM_MAP, cookie)
              }
            } else {
              Cookie.setCookie(MEDIA_PLATFORM_MAP, [
                this.getCookieObjectData(lng, lat)
              ])
            }
          // }

          if (!cookie || index < 0) {
            this.setMapCenter(lng, lat)
            this.setMapZoom(this.mapDefaultZoom)
          }

          this.setSelectTask(this.selectedTaskId)
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

      setSelectTask(taskId) {
        console.log('[BaseMap::setSelectTask] taskId : ' + taskId)
        if (this.currentTaskLayer !== null) {
          this.currentTaskLayer.setVisible(false)
        }
        let layer = this.mapDrawContent[taskId]
        if (layer) {
          layer.setVisible(true)

          this.currentTaskLayer = layer
          // this.moveMyLocation()

          let index = this.projectInfo.tasks.findIndex(item => {
            return taskId === item.task_id
          })

          let available = false
          if (this.projectInfo.tasks[index].downloadasset['odm_dem/dsm.tif'] !== undefined) {
            available = true
          }
          this.$store.commit(types.AVAILABLE_DSM_TIFF, {
            availableDsmTiff: available
          })
        }
        else {
          console.log('2####### ')
        }
        this.clearImagePointer()
        this.showImagePointer(this.isEnableImagePosition)
        this.changeOpacity()
      },

      changeBaseMapEnable() {
        if (this.map !== null) {
          let isEnable = this.isEnableBaseMap
          this.baseMapLayer.setVisible(isEnable)
        }
      },

      changeHybridMapEnable() {
        if (this.map !== null) {
          let isEnable = this.isEnableHybridMap
          this.hybridLayer.setVisible(isEnable)
        }
      },

      // changeNdviMapEnable() {
      //   if (this.map !== null) {
      //     let isEnable = this.isEnableNdviMap

      //     if (this.projectInfo !== undefined) {
      //       this.initTaskMap()

      //       let mapTileMode = (isEnable)? 2 : 1

      //       console.log('mapTileMode: '+mapTileMode)
      //       this.$store.dispatch(types.MAP_LAYER_LIST, {
      //         projectId: this.projectInfo.projectId,
      //         tasksInfo: this.projectInfo.tasks,
      //         mapMode: mapTileMode
      //       })
      //     }
      //   }
      // },

      changeEoMapEnable() {
        if (this.map !== null) {
          let isEnable = this.isEnableEoMap

          if (this.projectInfo !== undefined) {
            this.initTaskMap()

            let mapTileMode = (isEnable)? 4 : 1

            console.log('mapTileMode: '+mapTileMode)
            this.$store.dispatch(types.MAP_LAYER_LIST, {
              projectId: this.projectInfo.projectId,
              tasksInfo: this.projectInfo.tasks,
              mapMode: mapTileMode
            })
          }
        }
      },

      changeDsmMapEnable() {
        if (this.map !== null) {
          let isEnable = this.isEnableDsmMap

          if (this.projectInfo !== undefined) {
            this.initTaskMap()

            let mapTileMode = (isEnable)? 3 : 1

            console.log('mapTileMode: '+mapTileMode)
            this.$store.dispatch(types.MAP_LAYER_LIST, {
              projectId: this.projectInfo.projectId,
              tasksInfo: this.projectInfo.tasks,
              mapMode: mapTileMode
            })
          }
        }
      },

      changeOpacity() {
        if (this.currentTaskLayer !== null) {
          let opacity = this.getOpacity
          this.currentTaskLayer.setOpacity(opacity / 100)
          this.refresh()
        }
      },

      changeZoomLevel(zoomLevel) {
        if (zoomLevel === undefined) {
          zoomLevel = this.map.getView().getZoom()
        }
        console.log('[changeZoomLevel] zoom level : ' + zoomLevel)

        switch (zoomLevel) {
          case 7:
          case 8:
          case 9:
          case 10:
            if (this.currentCityType == null ||
              this.currentCityType !== EnumCityType.PROVINCE) {
              this.removeCityLevelOverlay()
              this.refresh()
              this.levelOneOverlay.forEach(item => {
                let gps = [item.lng, item.lat]
                console.log(
                  '[levelOneOverlay] message : ' + item.message + ', gps : ',
                  gps
                )

                this.createCityLevelTooltip(
                  item.message,
                  transform(gps, this.displayProjection, this.projection)
                )
              })

              this.currentCityType = EnumCityType.PROVINCE
            }
            break
          case 11:
          case 12:
          case 13:
            if (this.currentCityType == null ||
              this.currentCityType !== EnumCityType.DISTRICT) {
              this.removeCityLevelOverlay()
              this.refresh()
              this.levelTwoOverlay.forEach(item => {
                let gps = [item.lng, item.lat]
                console.log(
                  '[levelTwoOverlay] message : ' + item.message + ', gps : ',
                  gps
                )
                this.createCityLevelTooltip(
                  item.message,
                  transform(gps, this.displayProjection, this.projection)
                )
              })

              this.currentCityType = EnumCityType.DISTRICT
            }
            break
          case 14:
          case 15:
          case 16:
          case 17:
          case 18:
          case 19:
          case 20:
          case 21:
            if (this.currentCityType == null ||
              this.currentCityType !== EnumCityType.NEIGHBORHOOD) {
              this.removeCityLevelOverlay()
              this.refresh()
              this.levelThreeOverlay.forEach(item => {
                let gps = [item.lng, item.lat]
                console.log(
                  '[levelThreeOverlay] message : ' + item.message + ', gps : ',
                  gps
                )
                this.createCityLevelTooltip(
                  item.message,
                  transform(gps, this.displayProjection, this.projection)
                )
              })

              this.currentCityType = EnumCityType.NEIGHBORHOOD
            }
            break
        }
      },

      getTaskId(layerTile) {
        let taskId = layerTile
          .toString()
          .split('tasks/')[1]
          .split('/')[0]
        console.log('[getTaskId] taskId : ' + taskId)
        return taskId
      },

      moveMyLocation() {
        console.log("####### moveMyLocation !!")
        this.setMapZoom(this.mapDefaultZoom)

        let extent = transformExtent(
          this.currentTaskLayer.getExtent(),
          this.projection,
          this.displayProjection
        )
        let lng = (extent[0] + extent[2]) / 2
        let lat = (extent[1] + extent[3]) / 2
        this.setMapCenter(lng, lat)
      },

      refresh() {
        console.log('[refresh]')
        this.baseMapLayer.changed()
        this.vectorSource.changed()
        this.analysisBaseVectorSource.changed()
        this.analysisVectorSource.changed()
        this.imagePointerSource.changed()
        this.selectClick.getFeatures().clear()
      },

      initMeasureTooltip() {
        if (this.measureTooltipElement) {
          this.measureTooltipElement.parentNode.removeChild(
            this.measureTooltipElement
          )
        }
        this.measureTooltipElement = document.createElement('div')
        this.measureTooltipElement.className = 'tooltip tooltip-measure'
        this.measureTooltip = new Overlay({
          id: this.createFeatureId(),
          element: this.measureTooltipElement,
          offset: [0, -15],
          positioning: 'bottom-center'
        })
        this.map.addOverlay(this.measureTooltip)
      },

      changeMeasureTooltipId(featureId) {
        if (featureId) {
          let mapOverlay = this.map.getOverlayById(this.measureTooltip['id'])
          this.measureTooltip['id'] = featureId
          mapOverlay['id'] = featureId

          console.log('[changeMeasureTooltipId] mapOverlay:', mapOverlay)
          this.map.removeOverlay(
            this.map.getOverlayById(this.measureTooltip['id'])
          )
          this.map.addOverlay(mapOverlay)
          this.measureTooltip['tag'] = this.measureTooltip.getPosition()
          if (!this.isShowContent || !this.isAvailableShowTooltip()) {
            this.measureTooltip.setPosition(undefined)
          }
          this.measureTooltipList.push(this.measureTooltip)
        }
        this.measureTooltipElement = null
      },

      createMeasureTooltip(featureId, output, position) {
        let measureTooltipElement = document.createElement('div')
        measureTooltipElement.className = 'tooltip tooltip-static'
        measureTooltipElement.innerHTML = output
        let measureTooltip = new Overlay({
          id: featureId,
          element: measureTooltipElement,
          offset: [0, -7],
          positioning: 'bottom-center'
        })
        if (this.isShowContent && this.isAvailableShowTooltip()) {
          measureTooltip.setPosition(position)
        } else {
          measureTooltip.setPosition(undefined)
        }

        measureTooltip['tag'] = position
        this.map.addOverlay(measureTooltip)
        this.measureTooltipList.push(measureTooltip)
      },

      createGeoDataTooltip(output, position) {
        let measureTooltipElement = document.createElement('div')
        measureTooltipElement.className = 'tooltip tooltip-static'
        measureTooltipElement.innerHTML = output
        let measureTooltip = new Overlay({
          element: measureTooltipElement,
          offset: [0, -7],
          positioning: 'bottom-center'
        })

        measureTooltip.setPosition(position)
        measureTooltip['tag'] = position

        this.map.addOverlay(measureTooltip)
        this.geoDataTooltip = measureTooltip
      },

      createCityLevelTooltip(output, position) {
        let measureTooltipElement = document.createElement('div')
        measureTooltipElement.className = 'tooltip tooltip-static'
        measureTooltipElement.innerHTML = output
        let measureTooltip = new Overlay({
          element: measureTooltipElement,
          offset: [0, -7],
          positioning: 'bottom-center'
        })

        measureTooltip.setPosition(position)
        measureTooltip['tag'] = position

        this.map.addOverlay(measureTooltip)
        this.cityLevelTooltip.push(measureTooltip)
      },

      formatLength(line) {
        let length = getLength(line)
        let output
        if (length > 100) {
          output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
        } else {
          output = Math.round(length * 100) / 100 + ' ' + 'm'
        }
        return output
      },

      formatArea(polygon) {
        let area = getArea(polygon)
        let output
        if (area > 10000) {
          output =
            Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>'
        } else {
          output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>'
        }
        return output
      },

      drawStart(event) {
        console.log('[drawStart] ')
        this.initMeasureTooltip()
        this.sketch = event.feature
        let tooltipCoord = event.coordinate
        this.drawListener = this.sketch.getGeometry().on('change', evt => {
          let geom = evt.target
          let output
          if (geom instanceof Polygon) {
            output = this.formatArea(geom)
            tooltipCoord = geom.getInteriorPoint().getCoordinates()
          } else if (geom instanceof LineString) {
            output = this.formatLength(geom)
            tooltipCoord = geom.getLastCoordinate()
          }
          this.measureTooltipElement.innerHTML = output
          this.measureTooltip.setPosition(tooltipCoord)
        })
      },

      drawEnd(event) {
        console.log('[drawEnd] event => ', event)
        this.measureTooltipElement.className = 'tooltip tooltip-static'
        this.measureTooltip.setOffset([0, -7])

        let type

        if (event.target.type_ === GeometryType.POLYGON) {
          type = Constant.ENUM_ANNOTATION_TYPE.METRIC
        } else if (event.target.type_ === GeometryType.LINE_STRING) {
          type = Constant.ENUM_ANNOTATION_TYPE.DISTANCE
        }

        let coords = event.feature.getGeometry().getFlatCoordinates()
        let polyCoords = []
        for (let i = 0; i < coords.length / 2; i++) {
          let extent = transform(
            [coords[i * 2], coords[i * 2 + 1]],
            this.projection,
            this.displayProjection
          )
          let gps = {
            gps_x: extent[0],
            gps_y: extent[1]
          }
          // console.log("[drawEnd] gps : ", gps)
          polyCoords.push(gps)
        }

        console.log('[drawEnd] polyCoords : ', polyCoords)
        let metadata = StringUtil.clone(Constant.ANNOTATION_METADATA)
        metadata.value = this.measureTooltipElement.innerHTML
        metadata.description = this.measureTooltipElement.innerHTML
        console.log('[drawEnd] metaData : ', metadata)

        switch (this.toolMode) {
          case Constant.MODE_MAP_TOOL_ANALYSIS_SPAY_DIFFERENT_PLAN:
          case Constant.MODE_MAP_TOOL_ANALYSIS_SPAY_BASE_PLAN: {
            let mode = this.toolMode
            this.requestAnalysisAddData(type, polyCoords, metadata, (id) => {
              console.log('[drawEnd] id : ' + id)

              event.feature.setId(id)
              this.changeMeasureTooltipId(id)
              this.releaseDraw(event.feature, mode)
            })
          }
            break
          case Constant.MODE_MAP_TOOL_SPAY_DIFFERENT_PLAN:
          case Constant.MODE_MAP_TOOL_SPAY_BASE_PLAN:
            let mode = this.toolMode
            this.requestSprayPlanAddData(type, polyCoords, metadata, (id) => {
              console.log('[drawEnd] id : ' + id)

              event.feature.setId(id)
              this.changeMeasureTooltipId(id)
              this.releaseDraw(event.feature, mode)
            })
            break
          default:
            this.requestAnnotationAddData(type, polyCoords, metadata, (id) => {
              console.log('[drawEnd] id : ' + id)

              event.feature.setId(id)
              this.changeMeasureTooltipId(id)
              this.releaseDraw(event.feature)
            })
            break
        }
      },

      drawVolumeStart(event) {
        console.log('[drawVolumeStart] ')
        this.initMeasureTooltip()
        this.sketch = event.feature
        this.measureTooltipElement.className = ''
        this.drawListener = this.sketch.getGeometry().on('change', evt => {
          let geom = evt.target
          this.measureTooltip.setPosition(
            geom.getInteriorPoint().getCoordinates()
          )
        })
      },

      drawVolumeEnd(event) {
        console.log('[drawVolumeEnd] ', event.feature)

        let coords = event.feature.getGeometry().getFlatCoordinates()
        let polyCoords = []
        for (let i = 0; i < coords.length / 2; i++) {
          let extent = transform(
            [coords[i * 2], coords[i * 2 + 1]],
            this.projection,
            this.displayProjection
          )
          console.log('[drawVolumeEnd] extent : ', extent)
          polyCoords.push(extent)
        }

        console.log('[drawVolumeEnd] polyCoords : ', polyCoords)

        this.measureTooltip.setOffset([0, -7])

        this.measureTooltipElement.innerHTML = '불러오는중...'
        this.measureTooltipElement.className = 'tooltip tooltip-static'

        let storagePath = ''
        this.projectInfo.tasks.forEach(item => {
          if (item.task_id === this.selectedTaskId) {
            storagePath = item.resultfiles.storagepath
          }
        })

        console.log('#################################')
        console.log('storagePath: '+storagePath)
        console.log('#################################')

        this.$store.dispatch(types.CALCULATE_VOLUME, {
          projectId: this.projectInfo.projectId,
          taskId: this.selectedTaskId,
          storage_path: storagePath,
          coordinates: polyCoords,
          callback: volume => {
            console.log('[callback] volume : ' + volume)
            if (volume === undefined) {
              this.measureTooltipElement.innerHTML = `${volume}`
              this.changeMeasureTooltipId(null)
              this.releaseDraw(event.feature)
            } else {
              this.measureTooltipElement.innerHTML = `${volume} m<sup>3</sup>`

              let metadata = StringUtil.clone(Constant.ANNOTATION_METADATA)
              metadata.value = this.measureTooltipElement.innerHTML
              metadata.description = this.measureTooltipElement.innerHTML

              let reqPolyCoords = []
              polyCoords.forEach(item => {
                let gps = {
                  gps_x: item[0],
                  gps_y: item[1]
                }

                reqPolyCoords.push(gps)
              })
              this.requestAnnotationAddData(
                Constant.ENUM_ANNOTATION_TYPE.VOLUME,
                reqPolyCoords,
                metadata,
                id => {
                  console.log('[drawVolumeEnd] id : ' + id)

                  event.feature.setId(id)
                  this.changeMeasureTooltipId(id)
                  this.releaseDraw(event.feature)
                }
              )
            }
          }
        })
      },

      releaseDraw(feature, mode = Constant.MODE_MAP_TOOL_NONE) {
        this.features.push(feature)
        switch (mode) {
          case Constant.MODE_MAP_TOOL_SPAY_BASE_PLAN:
            this.analysisBaseVectorSource.addFeature(feature)
            break
          case Constant.MODE_MAP_TOOL_SPAY_DIFFERENT_PLAN:
            this.analysisVectorSource.addFeature(feature)
            break
          default:
            this.vectorSource.addFeature(feature)
            break
        }
        this.selectedFeature = feature
        this.$store.commit(types.MAP_SELECTED_FEATURE, this.selectedFeature)
        this.sketch = null

        unByKey(this.drawListener)
      },

      isShowMarker(isShow) {
        // console.log(this.vectorSource)
        // console.log(this.vectorSource.getFeatures())
        let opacity = isShow ? 0.75 : 0
        this.vectorSource.getFeatures().forEach(feature => {
          // console.log(feature)
          if (feature.getGeometry() instanceof Point) {
            // console.log("[feature.getGeometry()] point opacity : " + feature.getStyle().getImage().getOpacity())
            // console.log("[feature.getGeometry()] point : " + opacity)
            if (this.selectedFeature) {
              this.selectedFeature.setStyle(this.getIconStyle())
              this.selectedFeature = null
              this.$store.commit(types.MAP_SELECTED_FEATURE, this.selectedFeature)
            }
            feature.getStyle().getImage().setOpacity(opacity)
          } else if (feature.getGeometry() instanceof LineString ||
            feature.getGeometry() instanceof Polygon) {
            if (isShow) {
              feature.setStyle(this.visiblePolygonStyle)
            } else {
              feature.setStyle(this.invisiblePolygonStyle)
            }
          }
        })

        this.showTooltip(isShow)

        // if (isShow) {
        //   this.map.addInteraction(this.modify)
        // } else {
        //   this.map.removeInteraction(this.modify)
        if (!isShow) {
          this.$store.commit(types.SET_CURRENT_MARKER_CONTENT, { markerId: null })
        }

        this.refresh()
      },

      showTooltip(isShow) {
        this.measureTooltipList.forEach(item => {
          if (isShow) {
            item.setPosition(item['tag'])
          } else {
            item.setPosition(undefined)
          }
        })
      },

      createFeatureId() {
        return Number(`${new Date().getTime()}${Math.round(Math.random() * 100)}`)
      },

      removeFeature() {
        console.log('[removeFeature] ')
        if (this.selectedFeature) {
          console.log('[removeFeature] ', this.selectedFeature)
          let featureId = this.selectedFeature.getId()
          let index = this.measureTooltipList.findIndex(item => {
            return featureId === item.getId()
          })

          // console.log("[removeFeature] index : " + index)
          let overlay = this.measureTooltipList[index]
          if (index >= 0) {
            this.measureTooltipList.splice(index, 1)
          } else {
            this.removeAreaItem({ id: featureId })
          }

          if (this.vectorSource.hasFeature(this.selectedFeature)) {
            this.vectorSource.removeFeature(this.selectedFeature)
          } else if (this.analysisVectorSource.hasFeature(this.selectedFeature)) {
            this.analysisVectorSource.removeFeature(this.selectedFeature)
          } else if (this.this.analysisBaseVectorSource.hasFeature(this.selectedFeature)) {
            this.analysisBaseVectorSource.removeFeature(this.selectedFeature)
          }

          // let overlay = this.map.getOverlayById(featureId)
          console.log('[removeFeature] overlay => ', overlay)
          this.map.removeOverlay(overlay)
          this.refresh()
        }
      },

      changeMapSize() {
        if (this.map) {
          console.log('[changeMapSize] change()')
          this.map.updateSize()
        }
      },

      getCookieObjectData(lng, lat) {
        return {
          projectId: this.projectInfo.projectId,
          center: [lng, lat],
          zoom: this.mapDefaultZoom
        }
      },

      requestAnnotationAddData(type, gpsPoints, metadata, callback) {
        let content = StringUtil.clone(Constant.REQUEST_MARKER_PARAM)

        console.log('[requestAnnotationAddData] gpsPoints : ', gpsPoints)
        content.data.type = type

        switch (type) {
          case Constant.ENUM_ANNOTATION_TYPE.DISTANCE:
          case Constant.ENUM_ANNOTATION_TYPE.METRIC:
          case Constant.ENUM_ANNOTATION_TYPE.VOLUME:
            content.data.metadata = metadata
            break
        }
        gpsPoints.forEach(item => {
          console.log('[gpsPoint] item : ', item)
          let gps = {
            gps_x: item.gps_x,
            gps_y: item.gps_y
          }
          content.data.coordinate.push(gps)
          console.log('[gpsPoint] gps : ', gps)
        })

        if (this.projectInfo) {
          this.$store.dispatch(types.ADD_MARKER, {
            project_id: this.projectInfo.projectId,
            task_id: this.selectedTaskId,
            content: content,
            callback: callback
          })
        } else {
          console.log('[requestAnnotationAddData] content.data : ', content.data)
          let featureId = this.createFeatureId()
          let size = 0
          if (content.data.metadata.value) {
            size = Number(content.data.metadata.value.split(' ')[0])
          }

          let area = content.data.coordinate.map(data => {
            return {
              lng: data.gps_x,
              lat: data.gps_y
            }
          })

          console.log('[requestAnnotationAddData] area : ', area)
          if (JSON.stringify(area[0]) === JSON.stringify(area[area.length - 1])) {
            this.addAreaList({
              id: featureId,
              area: area,
              size: size
            })
          } else {
            this.addWaypointList({
              id: featureId,
              area: area,
              size: size
            })
            // this.addWaypointResultList({
            //   id: featureId,
            //   area: area,
            //   size: size
            // })
          }

          callback(featureId)
        }

        this.$store.commit(types.MAP_TOOL_MODE, { mode: 0 })
      },

      requestAnalysisAddData(type, gpsPoints, metadata, callback) {
        let content = StringUtil.clone(Constant.REQUEST_SPRAY_AREA_PARAM)

        console.log('[requestAnalysisAddData] gpsPoints : ', gpsPoints)
        content.size = Number(metadata.value.split(' ')[0])
        content['id'] = this.createFeatureId()
        if (this.toolMode === Constant.MODE_MAP_TOOL_ANALYSIS_SPAY_BASE_PLAN) {
          content.base = true
        }
        gpsPoints.forEach(item => {
          console.log('[gpsPoint] item : ', item)
          let areaPosition = StringUtil.clone(Constant.AREA_POSITION)
          areaPosition.longitude = item.gps_x
          areaPosition.latitude = item.gps_y

          content.area.push(areaPosition)
          console.log('[gpsPoint] gps : ', areaPosition)
        })

        this.addAnalysisArea(content)
        this.setCurrentSelectedArea(content)
        callback(content.id)

        this.$store.commit(types.MAP_TOOL_MODE, { mode: 0 })
      },

      requestSprayPlanAddData(type, gpsPoints, metadata, callback) {
        let content = StringUtil.clone(Constant.REQUEST_SPRAY_AREA_PARAM)

        console.log('[requestSprayPlanAddData] gpsPoints : ', gpsPoints)
        content.size = Number(metadata.value.split(' ')[0])
        content['id'] = this.createFeatureId()
        if (this.toolMode === Constant.MODE_MAP_TOOL_SPAY_BASE_PLAN) {
          content.base = true
        }
        gpsPoints.forEach(item => {
          console.log('[gpsPoint] item : ', item)
          let areaPosition = StringUtil.clone(Constant.AREA_POSITION)
          areaPosition.longitude = item.gps_x
          areaPosition.latitude = item.gps_y

          content.area.push(areaPosition)
          console.log('[gpsPoint] gps : ', areaPosition)
        })

        this.addSprayPlanArea(content)
        this.setCurrentSelectedSprayPlanArea(content)
        callback(content.id)

        this.$store.commit(types.MAP_TOOL_MODE, { mode: 0 })
      },
      showImagePointer(isShow) {
        console.log('[showImagePointer] isShow ' + isShow)
        if (isShow) {
          let imagePosition = this.getImageInfoList //this.getProjectImageList
          let positionList = []

          if (imagePosition.hasOwnProperty(this.selectedTaskId)) {
            positionList = imagePosition[this.selectedTaskId]
          } else {
            positionList = this.getImageInfoList
          }

          positionList.forEach(item => {
            let lat = item['gps_lat']
            let lng = item['gps_lng']

            let coord = transform(
              [lng, lat],
              this.displayProjection,
              this.projection
            )

            // console.log("[showImagePointer] coord : ", coord)
            let iconFeature = new Feature(new Point(coord))

            iconFeature.setStyle(this.getImagePointerIconStyle())
            iconFeature['metadata'] = item
            this.imagePointFeatures.push(iconFeature)
            this.imagePointerSource.addFeature(iconFeature)
          })

          console.log(
            '[showImagePointer] this.imagePointFeatures length : ' +
            this.imagePointFeatures.length
          )
        } else {
          this.clearImagePointer()
        }

        this.refresh()
      },

      clearImagePointer() {
        console.log(
          '[clearImagePointer] this.imagePointFeatures length : ' +
          this.imagePointFeatures.length
        )
        this.imagePointFeatures.forEach(item => {
          this.imagePointerSource.removeFeature(item)
        })
        this.imagePointFeatures.splice(0, this.imagePointFeatures.length)
      },

      isAvailableShowTooltip() {
        return (
          this.map &&
          this.map.getView() &&
          this.map.getView().getZoom() >= this.showTooltipZoomLevel
        )
      },

      moveToLocation(location) {
        console.log('[moveToLocation] location: ', location)
        if (location.addressInfo !== null) {
          let lng = parseFloat(location.addressInfo.point.x)
          let lat = parseFloat(location.addressInfo.point.y)

          this.setMapCenter(lng, lat)
        }
      },

      addGeoJsonFeature(data) {
        let getJsonData = data.result.featureCollection

        console.log('[addGeoJsonFeature] getJsonData : ', getJsonData)
        this.geoJsonSource = new VectorSource({
          features: new GeoJSON().readFeatures(getJsonData)
        })

        this.geoJsonLayer = new VectorLayer({
          source: this.geoJsonSource,
          style: this.styleFunction(getJsonData.features[0])
        })

        let saveLayers = this.map.getLayers()
        saveLayers
          .getArray()
          .splice(
            saveLayers.getArray().length - EXTERNAL_LAYER_COUNT,
            0,
            this.geoJsonLayer
          )

        let lng = (Number(getJsonData.bbox[0]) + Number(getJsonData.bbox[2])) / 2
        let lat = (Number(getJsonData.bbox[1]) + Number(getJsonData.bbox[3])) / 2
        let gps = [lng, lat]

        // let gps = transform([Number(data.point.x), Number(data.point.y)], this.displayProjection, this.projection)
        // console.log("[addGeoJsonFeature] gps : " , gps)
        let message = getJsonData.features[0].properties.full_nm
        console.log('[addGeoJsonFeature] message : ' + message)
        this.createGeoDataTooltip(message, gps)
        this.refresh()
      },

      removeGeoJsonFeature() {
        if (this.geoJsonSource != null) {
          this.geoJsonSource = null
          this.geoJsonLayer = null

          let saveLayers = this.map.getLayers()
          saveLayers
            .getArray()
            .splice(saveLayers.getArray().length - EXTERNAL_LAYER_COUNT - 1, 1)

          this.removeGeoDataOverlay()
          this.refresh()
        }
      },

      styleFunction(feature) {
        return this.geoJsonImageStyle[feature.geometry.type]
      },

      setWaypoint(waypoint) {
      },

      getLocation() {
        let gps = { lat: this.defaultLat, lng: this.defaultLng }
        if (navigator.geolocation) {
          // GPS를 지원하면
          navigator.geolocation.getCurrentPosition(
            position => {
              gps.lat = position.coords.latitude
              gps.lng = position.coords.longitude
            },
            error => {
              console.error(error)
            },
            {
              enableHighAccuracy: false,
              maximumAge: 0,
              timeout: Infinity
            }
          )
        }
        return gps
      },

      getCenterOfExtent(extent) {
        let x = extent[0] + (extent[2] - extent[0]) / 2
        let y = extent[1] + (extent[3] - extent[1]) / 2
        return [x, y]
      },

      async goMyArea() {
        console.log("[requestGetArea] taskId : ", this.selectedTaskId)
        try {
          let result = await dbAPI.query("select.area.me.task_id", {
            task_id: this.selectedTaskId
          })
          console.log("[requestGetArea] result : ", result)

          if (result.rowCount > 0) {
            let areaList = AreaUtil.getConvertDBToMapJson(result.rows[0].area_boundary.area)
            console.log("[requestGetArea] areaList : ", areaList)

            let arrLat = areaList[0].area.map((data) => {
              return data.lat
            })

            let arrLng = areaList[0].area.map((data) => {
              return data.lng
            })
            let minLat = Math.min(...arrLat)
            let maxLat = Math.max(...arrLat)

            let minLng = Math.min(...arrLng)
            let maxLng = Math.max(...arrLng)

            this.setMapCenter((minLng + maxLng) / 2, (minLat + maxLat) / 2)
          }
        } catch (err) {
          console.log(err)
        }
      },

    },

    computed: {
      ...mapGetters([
        'getImageInfoList',
        'getProjectImageList',
        'isEnableImagePosition',
        'isShowContent',
        'getSelectedAddressInfo',
        'getAddressGeoData',
        'getAreaList',
        'isMapFeatureRemove',
        'getWaypointList',
        'getWaypointResultList',
        'getAnalysisAreaList',
        'getSprayPlanAreaList',
        'getSprayResultList'
      ]),

      toolMode() {
        return this.$store.getters.getToolMode
      },

      imagePointerImage() {
        return require('@/assets/icon/imagePoint.png')
      },

      markerImage() {
        return require('@/assets/marker.png')
      },

      selectMarkerImage() {
        return require('@/assets/markerSel.png')
      },

      // getHeatmapInfo() {
      //   return require('@/components/map/heatmap.kml')
      // },

      storeMapLayer() {
        return this.$store.getters.getLayerList
      },

      isMoveMyLocation() {
        return this.$store.getters.isMoveMyLocation
      },

      isEnableBaseMap() {
        return this.$store.getters.isEnableBaseMap
      },

      isEnableHybridMap() {
        return this.$store.getters.isEnableHybridMap
      },

      isEnable2DMap() {
        return this.$store.getters.isEnable2DMap
      },

      isEnableEoMap() {
        return this.$store.getters.isEnableEoMap
      },

      isEnableDsmMap() {
        return this.$store.getters.isEnableDsmMap
      },

      getOpacity() {
        return this.$store.getters.getOpacity
      },

      getMarkerList() {
        return this.$store.getters.getContentList
      },

      isShowTimeline: {
        get() {
          return this.$store.getters.isEnableTimeLayer
        },
        set(value) {
          this.$store.commit(types.MAP_TIMELINE, { isEnableTimeline: value })
        }
      }
    },

    watch: {
      toolMode(val, oldVal) {
        this.changeToolMode()
      },

      storeMapLayer(val, oldVal) {
        this.addTileLayer(val)
      },

      isMoveMyLocation(val, oldVal) {
        if (val) {
          this.moveMyLocation()
          this.$store.commit(types.MAP_MY_LOCATION, { isMoveMyLocation: false })
        }
      },

      isEnableBaseMap(val, oldVal) {
        this.changeBaseMapEnable()
      },

      isEnableHybridMap(val, oldVal) {
        this.changeHybridMapEnable()
      },

      isEnableEoMap(val, oldVal) {
        console.log('####### 111')
        // this.changeNdviMapEnable()
        this.changeEoMapEnable()
      },

      isEnableDsmMap(val, oldVal) {
        this.changeDsmMapEnable()
      },

      getOpacity(val, oldVal) {
        this.changeOpacity()
      },

      selectedTaskId: function(val, oldVal) {
        this.setSelectTask(val)
      },

      getMarkerList(val, oldVal) {
        this.refreshMarker(val)
      },

      isShowContent(val, oldVal) {
        this.isShowMarker(val)
      },

      isShowTimeline(val, oldVal) {
        this.changeMapSize()
      },

      isEnableImagePosition(val, oldVal) {
        this.showImagePointer(val)
      },

      getImageInfoList(val) {
        if (this.isEnableImagePosition) {
          this.showImagePointer(true)
        }
      },

      getSelectedAddressInfo(val, oldVal) {
        this.moveToLocation(val)
      },

      getAddressGeoData(val, oldVal) {
        // console.log("[getAddressGeoData] val : ", val)
        this.removeGeoJsonFeature()

        if (val) {
          this.addGeoJsonFeature(val)
        } else {
        }
      },

      // getWaypoint(val) {
      //   console.log('[getWaypoint] val : ', val)
      //   if (val) {
      //     this.addWayPoints(val)
      //   }
      // },

      getAreaList(val) {
        console.log('[getAreaList] val : ', val)
        if (val) {
          this.setAreaPoints(val)
        }
      },

      getWaypointList(val) {
        console.log('[getWaypointList] val : ', val)
        if (val) {
          this.setWaypoints(val)
        }
      },

      getSprayResultList(val) {
        console.log('[getSprayResultList] val : ', val)
        if (val) {
          this.addSprayResult()
        }
      },

      getWaypointResultList(val) {
        console.log('[getWaypointResultList] val : ', val)
        if (val) {
          this.setWaypointResult(val)
        }
      },

      isMapFeatureRemove(val) {
        console.log('[isMapFeatureRemove] val : ', val)
        if (val) {
          this.removeFeature()
          this.setMapFeatureRemove(false)
        }
      },
      getAnalysisAreaList(val) {
        console.log('[getAnalysisAreaList] val : ', val)
        if (val.length > 0) {
          this.setAnalysisAreaPoints(val)
        }
      },
      getSprayPlanAreaList(val) {
        console.log('[getSprayPlanAreaList] val : ', val)
        if (val.length > 0) {
          this.setSprayPlanAreaPoints(val)
        }
      }
    }
  }
</script>

<style>
  .tooltip {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    color: white;
    padding: 4px 8px;
    opacity: 0.7;
    white-space: nowrap;
    /*width: 100px*/
    text-align: center;
  }

  .tooltip-measure {
    opacity: 1;
    font-weight: bold;
  }

  .tooltip-static {
    background-color: #ffcc33;
    color: black;
    border: 1px solid white;
  }

  .tooltip-measure:before,
  .tooltip-static:before {
    border-top: 6px solid rgba(0, 0, 0, 0.5);
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    content: '';
    position: absolute;
    bottom: -6px;
    margin-left: -7px;
    left: 50%;
  }

  .tooltip-static:before {
    border-top-color: #ffcc33;
  }

  .tooltip-hidden {
    display: none;
  }
</style>
