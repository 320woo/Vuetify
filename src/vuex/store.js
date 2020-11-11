import Vue from 'vue'
import Vuex from 'vuex'
import projectStore from './modules/projectStore'
import mapStore from './modules/mapStore'
import mapViewStateStore from './modules/mapViewStateStore'
import markerStore from './modules/markerStore'
import utilsStore from './modules/UtilsStore'
import taskStore from './modules/taskStore'
import imageDetailListStore from './modules/imageDetailListStore'
import UserManagerStore from './modules/UserManagerStore'
import FacilityStore from './modules/FacilityStore'
import CheckHistoryStore from '@/vuex/modules/CheckHistoryStore'
import GlobalStore from '@/vuex/modules/GlobalStore'
import GCPMapStore from '@/vuex/modules/GCPMapStore'
import GCPImageViewStore from '@/vuex/modules/GCPImageViewStore'
import GCPStore from '@/vuex/modules/GCPStore'
import fileStore from '@/vuex/modules/fileStore'
import deviceStore from '@/vuex/modules/deviceStore'
import containerManagerStore from './modules/containerManagerStore'
import addressStore from '@/vuex/modules/addressStore'
import waypointStore from '@/vuex/modules/waypointStore'
import areaMapStore from '@/vuex/modules/areaMapStore'
import storageStore from '@/vuex/modules/storageStore'
import analysisAreaStore from '@/vuex/modules/analysisAreaStore'
import missionFilterStore from '@/vuex/modules/missionFilterStore'
import sprayPlanAreaStore from '@/vuex/modules/sprayPlanAreaStore'
import scrollStore from '@/vuex/modules/scrollStore'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    projectStore,
    mapStore,
    mapViewStateStore,
    imageDetailListStore,
    taskStore,
    markerStore,
    UserManagerStore,
    FacilityStore,
    utilsStore,
    CheckHistoryStore,
    GlobalStore,
    GCPMapStore,
    GCPImageViewStore,
    GCPStore,
    fileStore,
    deviceStore,
    containerManagerStore,
    addressStore,
    waypointStore,
    areaMapStore,
    storageStore,
    analysisAreaStore,
    missionFilterStore,
    sprayPlanAreaStore,
    scrollStore
  }
})
