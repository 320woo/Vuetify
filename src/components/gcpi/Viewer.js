import {Icon, Style} from 'ol/style';

export default {
  props: {
    imageInfo: {
      type: Object
    },
  },
  data() {
    return {}
  },
  created() {
    console.log('Viewer Mixin created')
    this.initData()
  },
  mounted() {
    console.log('Viewer Mixin mounted')
    this.initMap()
  },

  computed: {
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

    // getSelectIconStyle() {
    //   return new Style({
    //     image: new Icon({
    //       anchor: [0.5, 16],
    //       anchorXUnits: 'fraction',
    //       anchorYUnits: 'pixels',
    //       src: this.selectMarkerImage
    //     })
    //   });
    // },

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
    initData() {
      console.log('Viewer Mixin initData')
    },
    initMap() {
      console.log('Viewer Mixin initMap')
    }
  }
}
