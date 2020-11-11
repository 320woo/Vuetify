<template>
  <containers />
</template>

<script>
  import BaseComponent from '@/components/shared-components/BaseComponent.vue'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import ConfirmModal from '@/components/shared-components/ConfirmModal'
  import Containers from './container/Containers.vue'
  import icons from '@/icons.js'

  export default {
		name: "Preferences",
    extends: BaseComponent,
    data() {
      return {
        icons: icons,
        isDataLoaded: false,
      }
    },
    async created() {
      console.log('Preferences created')
      this.isDataLoaded = true
    },
    computed: {
      ...mapGetters([
      ]),
    },
    methods: {
      ...mapMutations([
      ]),
      ...mapActions([
      ]),
    },
    components: {
      'containers': Containers
    }
  }
</script>

<style scoped>
  .preferences >>> thead {
    background-color: #98A0AB !important;
  }

  .preferences >>> th {
    color: white !important;
    font-weight: bold !important;
  }
  .create-data-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }

</style>
