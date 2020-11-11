<template>
  <v-container fluid>
    <v-layout column wrap class="ml-auto">
      <v-flex xs12 md12 sm12>
        <v-card class="card-header"
                color="#E6EDFF">
          <v-container fluid>
            <v-layout wrap>
              <v-flex xs12 md12 class="card-header-title">
                <v-layout
                  align-center
                  jusify-center
                  wrap>
                  <img src="@/assets/prepand_title.png">
                  <span class="ml-1">고객 목록</span>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
      <v-container fluid ma-0 pa-0>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card>
              <!-- 현재 영역의 해상도 기반으로 동작하는데 여기선 md로 인식됨 12칸중 3칸 차지  xs sm md 등등..-->
              <v-data-table
                :headers="headers"
                :items="userData"
                item-key="mission_request_id"
                :pagination.sync="pagination"
              >
                <template slot="items" slot-scope="props">
                  <tr @click="onClickUserInfoItem(props.item.id)">
                    <td class="text-xs-center">{{ props.item.full_name }}</td>
                    <td class="text-xs-center">{{ props.item.tel_num }}</td>
                    <td class="text-xs-center address-width">{{ props.item.address_basic }}</td>
                    <td class="text-xs-center">{{ props.item.email }}</td>
                    <td class="text-xs-center">{{ convertDate(props.item.date_joined) }}</td>
                    <td class="text-xs-center">{{ convertDate(props.item.req_dat) }}</td>
                    <td class="text-xs-center">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            icon
                            small
                            fab
                            dark
                            color="teal"
                            :to="farmDiaryRoute(props.item)"
                            v-on="on">
                            <v-icon
                              dark>
                              note
                            </v-icon>
                          </v-btn>
                        </template>
                        <span>영농일지</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            icon
                            small
                            fab
                            dark
                            color="teal"
                            :to="userMissionListRoute(props.item)"
                            v-on="on">
                            <v-icon
                              dark>
                              list_alt
                            </v-icon>
                          </v-btn>
                        </template>
                        <span>사용자 작업목록</span>
                      </v-tooltip>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
  import UserInfoItem from '@/components/provider/UserInfoItem'
  import dbAPI from '@/utils/api/dbAPI'
  import StringUtil from '@/utils/utils/stringUtil'

  export default {
    name: 'UserList',
    components: {
      UserInfoItem
    },
    data: () => ({
      headers: [
        { text: '이름', align: 'center', sortable: true, value: 'full_name' },
        { text: '전화번호', align: 'center', sortable: false, value: 'tel_num' },
        { text: '주소', align: 'center', sortable: false, value: 'address_basic' },
        { text: '이메일', align: 'center', sortable: false, value: 'email' },
        { text: '가입일', align: 'center', sortable: false, value: 'date_joined' },
        { text: '최근 요청일', align: 'center', sortable: false, value: 'req_dat' },
        { text: '편집', align: 'center', sortable: false, value: 'edit' }
      ],
      pagination: {
        rowsPerPage: 5,
        sortBy: 'full_name',
        descending: false
      },
      userData: []
    }),
    created() {
      this.getUserListRequestAll()
    },
    methods: {
      async getUserListRequestAll() {
        let result = await dbAPI.query('select.user.list.all')

        console.log('[getUserListRequestAll] select.user.list.all result :', result)
        if (result.rowCount >= 1) {
          console.log(result.rows)
          this.userData = result.rows
        }
      },

      convertDate(date) {
        return StringUtil.getConvertDateFormat(date, 'YYYY.MM.DD')
      },

      onClickUserInfoItem(userId) {
        console.log('[onClickUserInfoItem] userId : ' + userId)
      },

      farmDiaryRoute(item) {
        return {
          name: 'userFarmDiary',
          params: { user_id: item.id }
        }
      },

      userMissionListRoute(item) {
        return {
          name: 'userMissionList',
          params: { user_id: item.id }
        }
      }
    }
  }
</script>

<style scoped>
  .table-scroll {
    overflow-x: auto;
  }

  .address-width {
    min-width: 150px;
  }
</style>
