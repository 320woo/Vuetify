<template>
  <div id="app">
    <router-view/>
    <v-dialog v-if="isOpenGlobalModal"
              v-model="isOpenGlobalModal"
              persistent
              max-width="500px">
      <confirm-modal :title="getGlobalModalTitle"
                     :content="getGlobalModalContent"
                     :notice="true"
                     @confirm="closeGlobalModal()"/>
    </v-dialog>
  </div>
</template>

<script>
  import ConfirmModal from '@/components/shared-components/ConfirmModal'
  import {mapActions, mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'App',
    created() {
      console.log('[created] navigator.platform : ', navigator.userAgent)
      let isMobile =  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      console.log('[created] isMobile: ', isMobile)
      this.IS_MOBILE_BROWSER(isMobile)
    },
    computed: {
      ...mapGetters([
        'isOpenGlobalModal',
        'getGlobalModalTitle',
        'getGlobalModalContent'
      ]),
    },
    methods: {
      ...mapMutations([
        'IS_MOBILE_BROWSER',
        'OPEN_GLOBAL_MODAL',
        'CLOSE_GLOBAL_MODAL',
        'SET_GLOBAL_MODAL_TITLE',
        'SET_GLOBAL_MODAL_CONTENT'
      ]),
      ...mapActions([
        'openGlobalModal',
        'closeGlobalModal'
      ]),
    },
    components: {
      'ConfirmModal': ConfirmModal
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  .application--wrap {
    background-color: #F3F6FF;
  }
  html {
    overflow-y: auto !important
  }
  .button-content-icon {
    padding-right: 5px;
  }
  .square-border-button {
    text-transform: none !important;
    border-radius: 5px !important;
    border: 1px solid #3459F0 !important;
  }
  .default-action-button {
    padding: 10px;
    margin-left: 10px;
    min-width: 0 !important;
    min-height: 0 !important;
    border-radius: 10px !important;
    border: 1px solid #E1E2E4;
    background: linear-gradient(to top right, #E6EDFF 0%, #FFFFFF 100%);
  }
  .card-header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .card-header-title {
    color: #191D5C;
    font-size: large;
    font-weight: bold;
  }

</style>
