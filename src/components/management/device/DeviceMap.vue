<template>
  <div id="deviceMap" tabindex="0" class="map"></div>
</template>

<script>
  import * as types from '@/vuex/mutation-types'

  import Map from 'ol/Map';
  import View from 'ol/View.js';
  import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
  import {Vector as VectorSource, XYZ} from 'ol/source';
  import {Circle, Fill, Icon, Stroke, Style} from 'ol/style';
  import {fromLonLat, transform} from 'ol/proj.js';
  import {Select} from 'ol/interaction';
  import {click} from 'ol/events/condition';
  import Point from "ol/geom/Point";
  import LineString from "ol/geom/LineString";
  import Polygon from "ol/geom/Polygon";
  import {defaults as defaultControls} from 'ol/control.js';
  import MousePosition from 'ol/control/MousePosition.js';
  import {createStringXY} from 'ol/coordinate.js';
  import Feature from 'ol/Feature';

  import OverlayPopup from "@/components/map/OverlayPopup";
  import BaseMap from "@/components/map/BaseMap";
  import SensorUtil from "@/utils/utils/sensorUtil";
  import icons from '@/icons.js'

  export default {
    components: {
      overlay_popup: OverlayPopup,
      BaseMap
    },

    props: {},

    data() {
      return {
        name: "DeviceMap",
        icons: icons,

        dummyPoint: [
          [14151238.031076238, 4508323.877498214],
          [14151193.270559296, 4508390.943423269],
          [14151144.019020585, 4508364.146993392],
          [14151073.360278117, 4508315.94335976],
          [14151004.64764508, 4508294.835557454],
          [14150911.6834945, 4508241.691799878],
          [14150877.25232762, 4508287.649922628],
          [14150829.048693987, 4508317.290666291],
          [14150941.473938892, 4508369.9853216885],
          [14151016.324301673, 4508415.943444439],
          [14151109.288452255, 4508346.3326070495],
          [14151228.150828352, 4508357.111059291]
        ],

        markerLayer: null,
        map: null,
        mapBounds: null,
        mapMinZoom: 7,
        mapMaxZoom: 25,
        vectorSource: null,
        vectorLayer: null,
        projection: null,
        displayProjection: null,
        showMenu: true,
        mapDrawContent: null,
        lineFeature: null,

        defaultLat: 37.494864,
        defaultLng: 127.122385
      }
    },

    created() {
      console.log("[created] deviceMap");
      this.initData();
    },
    mounted() {
      console.log("[mounted] deviceMap");
      this.initMap();
    },
    updated() {
      console.log("[updated] deviceMap");
    },
    methods: {
      initData() {
        this.vectorSource = new VectorSource();
        this.vectorLayer = new VectorLayer({
          source: this.vectorSource,
          style: this.styleFunction
          // style: new Style({
          //   fill: new Fill({
          //     color: 'rgba(255, 255, 255, 0.4)'
          //   }),
          //   stroke: new Stroke({
          //     color: '#b84fbe',
          //     width: 3
          //   }),
          //   image: new Circle({
          //     radius: 7,
          //     fill: new Fill({
          //       color: '#b84fbe'
          //     })
          //   })
          // })
        });
        this.projection = "EPSG:3857";
        this.displayProjection = "EPSG:4326";

        this.$store.commit(types.MAP_LAYER_LIST_CLEAR);

      },

      initMap() {
        let mousePositionControl = new MousePosition({
          coordinateFormat: createStringXY(4),
          projection: 'EPSG:4326',
          // comment the following two lines to have the mouse position
          // be placed within the map.
          className: 'custom-mouse-position',
          target: document.getElementById('mouse-position'),
          undefinedHTML: '&nbsp;'
        });


        let currentGps = this.getLocation();
        console.log("[initMap] currentGps : ", currentGps);
        this.map = new Map({
          controls: defaultControls({
            attributionOptions: {
              collapsible: false
            },
            zoom: false
          }).extend([mousePositionControl]),
          target: 'deviceMap',
          layers: [
            new TileLayer({
              // style: 'Aerial',
              source: new XYZ({
                //201612, 201710, 201802, 201808
                //Base(19), Satellite(18)
                // url: 'http://xdworld.vworld.kr:8080/2d/Satellite/201710/{z}/{x}/{y}.jpeg',
                url: 'http://xdworld.vworld.kr:8080/2d/Base/201802/{z}/{x}/{y}.png',
                minZoom: this.mapMinZoom,
                maxZoom: 18,
              }),
              opacity: this.getOpacity
            }),
            this.vectorLayer
          ],

          view: new View({
            center: fromLonLat([currentGps.lng, currentGps.lat]),
            zoom: 14,
            minZoom: this.mapMinZoom,
            maxZoom: this.mapMaxZoom,
            // extent: transformExtent([128.44307554426888, 35.66741877663742, 128.4553321675001, 35.660654665029725], this.displayProjection, this.projection)
          })
        });

        this.select = new Select({
          source: this.vectorSource,
          condition: click
        });

        this.map.addInteraction(this.select);
        this.select.on('select', (e) => {
          // const feature = e.target.getFeatures().item(0)
          // this._onSelectFeature(feature.getId())
        });

        this.map.on('pointermove', (e) => {
          let pixel = this.map.getEventPixel(e.originalEvent);
          let hit = this.map.hasFeatureAtPixel(pixel);
          this.map.getViewport().style.cursor = hit ? 'pointer' : ''
        });
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
        });
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
        });
      },

      setMarker(latlng, id) {
        console.log(latlng);

        let iconFeature = new Feature({
          geometry: new Point(latlng)
        });

        iconFeature.setId(id);
        iconFeature.setStyle(this.getIconStyle());

        this.vectorSource.addFeature(iconFeature);
      },

      setMapCenter(lon, lat) {
        let view = this.map.getView();
        view.setCenter(fromLonLat([lon, lat]))
      },

      setMapZoom(level) {
        let view = this.map.getView();
        view.setZoom(level)
      },

      setGPSMarker(sensorInfoList) {
        if (this.lineFeature) {
          this.vectorSource.removeFeature(this.lineFeature);
          this.lineFeature = null;
        }

        if (sensorInfoList.length > 0) {
          let gpsPoints = [];
          sensorInfoList.forEach((sensorData) => {
            let infoData = sensorData.info;
            console.log("[setGPSMarker] infoData " + infoData);

            let gpsData = SensorUtil.getGPSInfo(infoData);
            if (gpsData.lat !== 0.0 || gpsData.lon !== 0.0) {
              // this.setMarker(transform([gpsData.lon, gpsData.lat], this.displayProjection, this.projection), infoData.id);
              let point = transform([gpsData.lon, gpsData.lat], this.displayProjection, this.projection);
              console.log("[setGPSMarker] point : ", point);
              gpsPoints.push(point);
            }
          });

          // Test
          // this.dummyPoint.forEach((point, index) => {
          //   this.setMarker([point[0], point[1]], index);
          // });

          this.lineFeature = new Feature({
            // Test
            // geometry: new LineString(this.dummyPoint)
            geometry: new LineString(gpsPoints)
          });
          this.vectorSource.addFeature(this.lineFeature);
        }
      },

      styleFunction(feature) {
        let geometry = feature.getGeometry();
        let styles = [
          // linestring
          new Style({
            stroke: new Stroke({
              color: '#b84fbe',
              width: 2
            })
          })
        ];

        geometry.forEachSegment((start, end) => {
          let dx = end[0] - start[0];
          let dy = end[1] - start[1];
          let rotation = Math.atan2(dy, dx);
          // arrows
          styles.push(new Style({
            geometry: new Point(end),
            image: new Icon({
              src: icons.arrow,
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -rotation
            })
          }));
        });

        return styles;
      },

      getLocation() {
        let gps = {"lat": this.defaultLat, "lng": this.defaultLng};
        if (navigator.geolocation) { // GPS를 지원하면
          navigator.geolocation.getCurrentPosition((position) => {
            gps.lat = position.coords.latitude;
            gps.lng = position.coords.longitude;
          }, (error) => {
            console.error(error);
          }, {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: Infinity
          });
        }
        return gps;
      }
    },
    computed: {
      markerImage() {
        return require('@/assets/marker.png')
      }
      ,

      getSensorList() {
        return this.$store.getters.getSensorInfoList;
      }

    }
    ,
    watch: {
      getSensorList(val, oldVal) {
        console.log("[getSensorList] val ", val);
        this.setGPSMarker(val);
      }
      ,

    }
  }

</script>

<style scoped>

</style>
