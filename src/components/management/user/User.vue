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
              <span class="ml-1">사용자 관리</span>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-text-field label="사용자 검색 키워드를 입력해주세요."
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
        :items="getUserList"
        :search="search"
        class="elevation-1">
        <template slot="items" slot-scope="props">
          <td nowrap :class="[!props.item.active ? 'striked-text' : '', 'text-xs-center']">{{ props.item.account_id }}</td>
          <td nowrap :class="[!props.item.active ? 'striked-text' : '', 'text-xs-center']">{{ props.item.name }}</td>
          <td nowrap :class="[!props.item.active ? 'striked-text' : '', 'text-xs-center']">{{ props.item.email }}</td>
          <td nowrap class="justify-center layout px-0">
            <v-btn class="default-action-button mr-0"
                   v-if="props.item.active"
                   ripple
                   @click.prevent="_onClickEditButton(props.item)">
              <img :src="icons.edit">
            </v-btn>
            <v-btn class="default-action-button"
                   v-if="_isActive(props.item.account_id) && props.item.active"
                   ripple
                   @click.prevent="_onClickDeleteButton(props.item)">
              <img :src="icons.delete">
            </v-btn>
          </td>
        </template>
        <v-alert slot="no-data" :value="true" color="error" icon="warning">
          등록된 사용자가 존재하지 않습니다.
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
    <v-dialog v-model="isOpenAddUserModal"
              persistent
              max-width="500px">
      <user-add-modal/>
    </v-dialog>
    <v-dialog v-model="isOpenEditUserModal"
              persistent
              max-width="500px">
      <user-edit-modal/>
    </v-dialog>
    <v-dialog v-model="isOpenRemoveUserModal"
              persistent
              max-width="500px">
      <user-delete-modal/>
    </v-dialog>
    <v-dialog v-model="isOpenEditPasswordUserModal"
              persistent
              max-width="500px">
      <user-edit-password-modal/>
    </v-dialog>
  </v-container>
</template>

<script>
  import BaseComponent from '@/components/shared-components/BaseComponent.vue'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import UserAddModal from '@/components/management/user/UserAddModal'
  import UserEditModal from '@/components/management/user/UserEditModal'
  import UserDeleteModal from '@/components/management/user/UserDeleteModal'
  import ConfirmModal from '@/components/shared-components/ConfirmModal'
  import UserEditPasswordModal from '@/components/management/user/UserEditPasswordModal'
  import icons from '@/icons.js'

  export default {
    extends: BaseComponent,
    data() {
      return {
        icons: icons,
        isDataLoaded: false,
        search: '',
        headers: [
          {text: '사용자 ID', align: 'center', sortable: false, value: 'account_id'},
          {text: '이름', align: 'center', sortable: false, value: 'name'},
          {text: '이메일', align: 'center', sortable: false, value: 'email'},
          {text: '동작', align: 'center', sortable: false, value: 'actions'},
        ],
      }
    },
    async created() {
      console.log('User Manager created')
      await this.requestGetUserAll()
      this.isDataLoaded = true
    },
    computed: {
      ...mapGetters([
        'getUserList',
        'isOpenAddUserModal',
        'isOpenEditUserModal',
        'isOpenEditPasswordUserModal',
        'isOpenRemoveUserModal'
      ]),
    },
    methods: {
      ...mapMutations([
        'OPEN_ADD_MODAL_USER',
        'OPEN_EDIT_MODAL_USER',
        'OPEN_REMOVE_MODAL_USER',
        'CLOSE_MODAL_USER',
        'SET_EDIT_USER',
        'SET_REMOVE_USER'
      ]),
      ...mapActions([
        'requestGetUserAll',
        'openGlobalModal'
      ]),
      _isActive(account_id) {
        return this.$session.get('account_id') !== account_id
      },
      async _onClickAddButton() {
        if (await this._validAccessToken() === true) {
          this.OPEN_ADD_MODAL_USER()
        } else {
          this.openGlobalModal({})
        }
      },
      async _onClickEditButton(user) {
        if (await this._validAccessToken() === true) {
          this.SET_EDIT_USER(JSON.parse(JSON.stringify(user)))
          this.OPEN_EDIT_MODAL_USER()
        } else {
          this.openGlobalModal({})
        }
      },
      async _onClickDeleteButton(user) {
        if (await this._validAccessToken() === true) {
          this.SET_REMOVE_USER(JSON.parse(JSON.stringify(user)))
          this.OPEN_REMOVE_MODAL_USER()
        } else {
          this.openGlobalModal({})
        }
      }
    },
    components: {
      'UserAddModal': UserAddModal,
      'UserEditModal': UserEditModal,
      'UserDeleteModal': UserDeleteModal,
      'ConfirmModal': ConfirmModal,
      'UserEditPasswordModal': UserEditPasswordModal
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
  .create-data-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
  .striked-text {
    text-decoration:line-through;
  }
</style>
