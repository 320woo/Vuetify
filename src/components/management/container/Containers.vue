<template>
    <v-container v-if="this.isDataLoaded" class="containers">
    <v-card class="card-header"
            color="#E6EDFF">
      <v-container fluid>
        <v-layout align-center
                  jusify-center
                  row
                  wrap>
          <v-flex class="card-header-title">
            <v-layout
              align-center
              jusify-center
              wrap>
              <img src="@/assets/prepand_title.png">
              <span class="ml-1">컨테이너 관리</span>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-text-field label="검색 키워드를 입력해주세요."
                          single-line
                          hide-details
                          solo
                          v-model="search"
                          append-icon="search">
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="getContainerList"
        :search="search"
        class="elevation-1">
        <template slot="items" slot-scope="props">
          <td nowrap class="text-xs-center">{{ props.item.id }}</td>
          <td nowrap class="text-xs-center">{{ props.item.server_type }}</td>
          <td nowrap class="text-xs-center">{{ props.item.hostname }}</td>
          <td nowrap class="text-xs-center">{{ props.item.port }}</td>
          <td nowrap class="justify-center layout px-0">
            <v-btn class="default-action-button mr-0"
                   ripple
                   @click.prevent="_onClickEditButton(props.item)">
              <img :src="icons.edit">
            </v-btn>
            <v-btn class="default-action-button"
                   ripple
                   @click.prevent="_onClickDeleteButton(props.item)">
              <img :src="icons.delete">
            </v-btn>
          </td>
        </template>
        <v-alert slot="no-data" :value="true" color="error" icon="warning">
          등록된 컨테이너가 존재하지 않습니다.
        </v-alert>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
    <v-layout class="create-data-button">
      <v-btn fab
             dark
             color="indigo"
             @click="_onClickAddButton()">
        <v-icon dark>
          add
        </v-icon>
      </v-btn>
    </v-layout>
    <v-dialog v-model="isOpenAddContainerModal"
              persistent
              max-width="500px">
      <container-add-modal/>
    </v-dialog>
    <v-dialog v-model="isOpenEditContainerModal"
              persistent
              max-width="500px">
      <container-edit-modal/>
    </v-dialog>
    <v-dialog v-model="isOpenRemoveContainerModal"
              persistent
              max-width="500px">
      <container-delete-modal/>
    </v-dialog>
  </v-container>
</template>

<script>
  import BaseComponent from '@/components/shared-components/BaseComponent.vue'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import ContainerAddModal from '@/components/management/container/ContainerAddModal'
  import ContainerEditModal from '@/components/management/container/ContainerEditModal'
  import ContainerDeleteModal from '@/components/management/container/ContainerDeleteModal'
  import ConfirmModal from '@/components/shared-components/ConfirmModal'
  import icons from '@/icons.js'

  export default {
		name: "Container",
    extends: BaseComponent,
    data() {
      return {
        icons: icons,
        isDataLoaded: false,
        search: '',
        headers: [
          {text: 'ID', align: 'center', sortable: false, value: 'id'},
          {text: '타입', align: 'center', sortable: false, value: 'server_type'},
          {text: '호스트', align: 'center', sortable: false, value: 'hostname'},
          {text: '포트', align: 'center', sortable: false, value: 'port'},
          {text: '동작', align: 'center', sortable: false, value: 'actions'},
        ],
      }
    },
    async created() {
      console.log('Container Manager created')
      await this.requestGetContainerAll()
      this.isDataLoaded = true
    },
    computed: {
      ...mapGetters([
        'getContainerList',
        'isOpenAddContainerModal',
        'isOpenEditContainerModal',
        'isOpenRemoveContainerModal'
      ]),
    },
    methods: {
      ...mapMutations([
        'OPEN_ADD_MODAL_CONTAINER',
        'OPEN_EDIT_MODAL_CONTAINER',
        'OPEN_REMOVE_MODAL_CONTAINER',
        'CLOSE_MODAL_CONTAINER',
        'SET_EDIT_CONTAINER',
        'SET_REMOVE_CONTAINER'
      ]),
      ...mapActions([
        'requestGetContainerAll',
        'openGlobalModal'
      ]),
      async _onClickAddButton() {
        if (await this._validAccessToken() === true) {
          this.OPEN_ADD_MODAL_CONTAINER()
        } else {
          this.openGlobalModal({})
        }
      },
      async _onClickEditButton(container) {
        if (await this._validAccessToken() === true) {
          this.SET_EDIT_CONTAINER(JSON.parse(JSON.stringify(container)))
          this.OPEN_EDIT_MODAL_CONTAINER()
        } else {
          this.openGlobalModal({})
        }
      },
      async _onClickDeleteButton(container) {
        if (await this._validAccessToken() === true) {
          this.SET_REMOVE_CONTAINER(JSON.parse(JSON.stringify(container)))
          this.OPEN_REMOVE_MODAL_CONTAINER()
        } else {
          this.openGlobalModal({})
        }
      }
    },
    components: {
      'ContainerAddModal': ContainerAddModal,
      'ContainerEditModal': ContainerEditModal,
      'ContainerDeleteModal': ContainerDeleteModal,
      'ConfirmModal': ConfirmModal
    }
  }
</script>

<style scoped>
  .containers >>> thead {
    background-color: #98A0AB !important;
  }

  .containers >>> th {
    color: white !important;
    font-weight: bold !important;
  }
  .create-data-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }

</style>
