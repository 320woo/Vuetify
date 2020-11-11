<template>
  <v-container v-if="this.isDataLoaded">
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
              <span class="ml-1">시설물 관리</span>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-text-field label="시설물 검색 키워드를 입력해주세요."
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
        :items="getFacilityList"
        :search="search"
        class="elevation-1">
        <template slot="items" slot-scope="props">
          <td class="text-xs-center px-0">
            <v-btn slot="activator"
                   ripple
                   class="default-action-button map-button"
                   @click.prevent="_gotoMap(props.item.relate_at.project_id)">
              <img :src="icons.map">
            </v-btn>
          </td>
          <td class="text-xs-center px-0">
            <v-icon @click="_gotoCheckHistory({basicId: props.item.basic_id, facilityName: props.item.name})">
              check_circle
            </v-icon>
          </td>
          <td nowrap class="text-xs-center">{{ props.item.name }}</td>
          <td nowrap class="text-xs-center">{{ props.item.position }}</td>
          <td nowrap class="text-xs-center">{{ props.item.admin }}</td>
          <td nowrap class="text-xs-center">{{ props.item.owner }}</td>
          <td nowrap class="text-xs-center">{{ _convertDate(props.item.install_date)}}</td>
          <td nowrap
              v-if="isActiveFacilityCustomField"
              v-for="i in getFacilityCustomFieldList.length"
              class="text-xs-center">{{ props.item.custom_info[getFacilityCustomFieldKeyList[i-1]]}}
          </td>
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
          등록된 시설물이 존재하지 않습니다.
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
    <v-dialog v-model="isOpenAddFacilityModal"
              persistent
              max-width="500px">
      <facility-add-modal/>
    </v-dialog>
    <v-dialog v-model="isOpenEditFacilityModal"
              persistent
              max-width="500px">
      <facility-edit-modal/>
    </v-dialog>
    <v-dialog v-model="isOpenRemoveFacilityModal"
              persistent
              max-width="500px">
      <facility-delete-modal/>
    </v-dialog>
  </v-container>
</template>

<script>
  import BaseComponent from '@/components/shared-components/BaseComponent.vue'
  import StringUtil from '@/utils/utils/stringUtil'
  import Constant from '@/components/common/constants'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import FacilityAddModal from '@/components/management/facility/FacilityAddModal'
  import FacilityEditModal from '@/components/management/facility/FacilityEditModal'
  import FacilityDeleteModal from '@/components/management/facility/FacilityDeleteModal'
  import ConfirmModal from '@/components/shared-components/ConfirmModal'
  import icons from '@/icons.js'

  export default {
    extends: BaseComponent,
    data: () => ({
      icons: icons,
      isDataLoaded: false,
      search: '',
      headers: [
        {text: '지도', align: 'center', sortable: false, value: 'map'},
        {text: '점검내역', align: 'center', sortable: false, value: 'checkhistory'},
        {text: '이름', align: 'center', sortable: false, value: 'name'},
        {text: '주소', align: 'center', sortable: false, value: 'position'},
        {text: '관리자', align: 'center', sortable: false, value: 'admin'},
        {text: '소유자', align: 'center', sortable: false, value: 'owner'},
        {text: '설치날짜', align: 'center', sortable: false, value: 'install_date'},
      ],

      isOpenConfirmModal: false,
      modalTitle: Constant.SESSION_EXPIRE_MODAL_TITLE,
      modalContent: Constant.SESSION_EXPIRE_MODAL_CONTENT
    }),
    async created() {
      console.log('Facility Manager created')
      await this.requestGetFacilityAll()
      await this.requestGetCustomFieldsFacility()
      if (this.isActiveFacilityCustomField) {
        const customFieldKeyList = await this.getFacilityCustomFieldKeyList
        await customFieldKeyList.forEach((key) => {
          this.headers.push({text: key, align: 'center', sortable: false, value: key})
        })
        // await this.headers.push({text: 'custom1', align: 'right', sortable: false, value: 'custom1'})
        // await this.headers.push({text: 'custom2', align: 'right', sortable: false, value: 'custom2'})
        // await this.headers.push({text: 'custom3', align: 'right', sortable: false, value: 'custom3'})
      }
      await this.headers.push({text: '동작', align: 'center', sortable: false, value: 'actions'})
      this.isDataLoaded = await true
    },
    computed: {
      ...mapGetters([
        'getFacilityList',
        'getFacilityCustomFieldList',
        'getFacilityCustomFieldKeyList',
        'isOpenAddFacilityModal',
        'isOpenEditFacilityModal',
        'isOpenRemoveFacilityModal',
        'isActiveFacilityCustomField'
      ]),
    },
    methods: {
      ...mapMutations([
        'OPEN_ADD_MODAL_FACILITY',
        'OPEN_EDIT_MODAL_FACILITY',
        'OPEN_REMOVE_MODAL_FACILITY',
        'CLOSE_MODAL_FACILITY',
        'SET_EDIT_FACILITY',
        'SET_REMOVE_FACILITY',
        'SET_IS_ACTIVE_CUSTOM_FIELD'
      ]),
      ...mapActions([
        'requestGetFacilityAll',
        'requestGetCustomFieldsFacility',
        'openGlobalModal'
      ]),
      async _onClickAddButton() {
        if (await this._validAccessToken() === true) {
          this.OPEN_ADD_MODAL_FACILITY()
        } else {
          this.openGlobalModal({})
        }
      },
      async _onClickEditButton(facility) {
        if (await this._validAccessToken() === true) {
          this.SET_EDIT_FACILITY(JSON.parse(JSON.stringify(facility)))
          this.OPEN_EDIT_MODAL_FACILITY()
        } else {
          this.openGlobalModal({})
        }
      },
      async _onClickDeleteButton(facility) {
        if (await this._validAccessToken() === true) {
          this.SET_REMOVE_FACILITY(JSON.parse(JSON.stringify(facility)))
          this.OPEN_REMOVE_MODAL_FACILITY()
        } else {
          this.openGlobalModal({})
        }
      },
      _convertDate(date) {
        return StringUtil.getConvertDateFormat(new Date(date), "YYYY년 MM월 DD일");
      },
      _gotoMap(projectId) {
        this.$router.push({
          name: 'projectMap',
          params: {
            "projectId": projectId,
          }
        })
      },
      _gotoCheckHistory({basicId, facilityName}) {
        this.$router.push({
          name: 'checkHistory',
          params: {
            "basicId": basicId,
            "facilityName": facilityName
          }
        })
      }
    },
    components: {
      'FacilityAddModal': FacilityAddModal,
      'FacilityEditModal': FacilityEditModal,
      'FacilityDeleteModal': FacilityDeleteModal,
      'ConfirmModal': ConfirmModal
    }
  }
</script>

<style scoped>
  >>> thead {
    background-color: #98A0AB !important;
  }

  >>> th {
    color: white !important;
    font-weight: bold !important;
  }

  .map-button {
    border: none;
    margin-right: 10px;
    background: linear-gradient(to top right, #5FC5ED 0%, #81EAED 100%);
  }

  .create-data-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
</style>
