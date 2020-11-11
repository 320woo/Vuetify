<template>
  <v-container v-if="this.isDataLoaded">
    <v-layout row>
      <h1 class="text-xs-left mb-2">{{ getFacility.name }}</h1>
    </v-layout>
    <v-card>
      <v-card-title>
        점검 내역
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="getCheckHistoryList"
        :search="search"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.checker }}</td>
          <td class="text-xs-center">{{ _convertDate(props.item.check_date) }}</td>
          <td class="text-xs-center">{{ props.item.check_type }}</td>
          <td class="text-xs-center justify-center">
            <v-icon
              @click="onClickImageView(props.item.infoimages)">
              collections
            </v-icon>
            {{ props.item.infoimages.length }}
          </td>
          <td class="text-xs-left">{{ props.item.check_detail }}</td>
          <!--<td v-if="isActiveCheckHistoryCustomField" class="text-xs-right">{{ _getCheckHistoryCustomInfoKey(props.item.custom_info) }}</td>-->
          <!--<td v-if="isActiveCheckHistoryCustomField" class="text-xs-right">{{ }}</td>-->
          <td v-if="isActiveCheckHistoryCustomField"
              v-for="i in getCheckHistoryCustomFieldList.length"
              class="text-xs-right">{{ props.item.custom_info[getCheckHistoryCustomFieldKeyList[i-1]]}}
          </td>
          <td class="justify-end layout px-0">
            <v-icon color="grey"
                    class="mr-1"
                    ripple
                    @click.prevent="_onClickEditButton(props.item)">
              edit
            </v-icon>
            <v-icon color="grey"
                    class="mr-2"
                    ripple
                    @click.prevent="_onClickDeleteButton(props.item)">
              delete
            </v-icon>
          </td>
        </template>
        <v-alert slot="no-data" :value="true" color="error" icon="warning">
          등록된 점검내역이 존재하지 않습니다.
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
    <v-dialog v-model="isOpenAddCheckHistoryModal"
              v-if="isOpenAddCheckHistoryModal"
              persistent
              max-width="500px">
      <check-history-add-modal/>
    </v-dialog>
    <v-dialog v-model="isOpenEditCheckHistoryModal"
              v-if="isOpenEditCheckHistoryModal"
              persistent
              max-width="500px">
      <check-history-edit-modal/>
    </v-dialog>
    <v-dialog v-model="isOpenRemoveCheckHistoryModal"
              v-if="isOpenRemoveCheckHistoryModal"
              persistent
              max-width="500px">
      <check-history-delete-modal/>
    </v-dialog>
    <DetailImageView
      v-if="enableDetailView"
      :image-list="imageList"
      :detailViewType="Constants.ENUM_DETAIL_IMAGE_VIEW_TYPE.TYPE_IMAGE"
      @close="enableDetailView = false"
    ></DetailImageView>
  </v-container>
</template>

<script>
  import BaseComponent from '@/components/shared-components/BaseComponent'
  import StringUtil from '@/utils/utils/stringUtil'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import CheckHistoryAddModal from '@/components/management/checkhistory/CheckHistoryAddModal'
  import CheckHistoryEditModal from '@/components/management/checkhistory/CheckHistoryEditModal'
  import CheckHistoryDeleteModal from '@/components/management/checkhistory/CheckHistoryDeleteModal'
  import ConfirmModal from '@/components/shared-components/ConfirmModal'
  import DetailImageView from '@/components/common/DetailImageView'
  import Constants from '@/components/common/constants';

  export default {
    extends: BaseComponent,
    props: [
      'basicId'
    ],
    data: () => ({
      isDataLoaded: false,
      enableDetailView: false,
      search: '',
      headers: [
        {text: '점검자', align: 'center', sortable: false, value: 'checker', width: '8%'},
        {text: '점검일자', align: 'center', sortable: false, value: 'check_date', width: '17%'},
        {text: '점검종류', align: 'center', sortable: false, value: 'check_type', width: '20%'},
        {text: '이미지', align: 'center', sortable: false, value: 'infoimages', width: '2%'},
        {text: '비고', align: 'center', sortable: false, value: 'check_detail'},
      ],
      Constants,
    }),
    async created() {
      console.log('CheckHistory Manager created')
      await this.requestGetFacility(this.basicId)
      await this.requestGetCheckHistoryAll(this.basicId)
      await this.requestGetCustomFieldsCheckHistory()
      if (this.isActiveCheckHistoryCustomField) {
        const customFieldKeyList = await this.getCheckHistoryCustomFieldKeyList
        await customFieldKeyList.forEach((key) => {
          this.headers.push({text: key, align: 'right', sortable: false, value: key})
        })
        // await this.headers.push({text: 'custom1', align: 'right', sortable: false, value: 'custom1'})
        // await this.headers.push({text: 'custom2', align: 'right', sortable: false, value: 'custom2'})
        // await this.headers.push({text: 'custom3', align: 'right', sortable: false, value: 'custom3'})
      }
      await this.headers.push({text: '동작', align: 'right', sortable: false, value: 'actions'})
      this.isDataLoaded = await true
    },
    computed: {
      ...mapGetters([
        'getFacility',
        'getCheckHistoryList',
        'getCheckHistoryCustomFieldList',
        'getCheckHistoryCustomFieldKeyList',
        'isOpenAddCheckHistoryModal',
        'isOpenEditCheckHistoryModal',
        'isOpenRemoveCheckHistoryModal',
        'isActiveCheckHistoryCustomField'
      ]),
    },
    methods: {
      ...mapMutations([
        'OPEN_ADD_MODAL_CHECK_HISTORY',
        'OPEN_EDIT_MODAL_CHECK_HISTORY',
        'OPEN_REMOVE_MODAL_CHECK_HISTORY',
        'CLOSE_MODAL_CHECK_HISTORY',
        'SET_EDIT_CHECK_HISTORY',
        'SET_REMOVE_CHECK_HISTORY',
        'SET_IS_ACTIVE_CUSTOM_FIELD_CHECK_HISTORY'
      ]),
      ...mapActions([
        'requestGetFacility',
        'requestGetCheckHistoryAll',
        'requestGetCustomFieldsCheckHistory',
        'openGlobalModal'
      ]),
      async _onClickAddButton() {
        if (await this._validAccessToken() === true) {
          this.OPEN_ADD_MODAL_CHECK_HISTORY()
        } else {
          this.openGlobalModal({})
        }
      },
      async _onClickEditButton(checkHistory) {
        if (await this._validAccessToken() === true) {
          this.SET_EDIT_CHECK_HISTORY(JSON.parse(JSON.stringify(checkHistory)))
          this.OPEN_EDIT_MODAL_CHECK_HISTORY()
        } else {
          this.openGlobalModal({})
        }
      },
      async _onClickDeleteButton(checkHistory) {
        if (await this._validAccessToken() === true) {
          this.SET_REMOVE_CHECK_HISTORY(JSON.parse(JSON.stringify(checkHistory)))
          this.OPEN_REMOVE_MODAL_CHECK_HISTORY()
        } else {
          this.openGlobalModal({})
        }
      },
      _convertDate(date) {
        return StringUtil.getConvertDate(new Date(date));
      },
      _gotoMap(projectId) {
        this.$router.push({
          name: 'projectMap',
          params: {
            "projectId": projectId,
          }
        })
      },
      onClickImageView(imageList) {
        console.log("[onClickImageView] " + imageList);
        this.enableDetailView = true;
        this.imageList = imageList;

      }
    }
    ,
    components: {
      CheckHistoryAddModal,
      CheckHistoryEditModal,
      CheckHistoryDeleteModal,
      ConfirmModal,
      DetailImageView
    }
  }
</script>

<style scoped>
  .create-data-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
</style>
