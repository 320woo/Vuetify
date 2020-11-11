<template>
  <v-app id="myPage" class="font1">
    <v-container fluid>
      <v-layout column wrap class="ml-auto">
        <v-card class="card-header"
                color="#E6EDFF">
          <v-container fluid>
            <v-layout align-center
                      justify-center
                      row
                      wrap>
              <v-flex class="card-header-title">
                <v-layout
                  align-center
                  jusify-center
                  wrap>
                  <img src="@/assets/prepand_title.png">
                  <span class="ml-1">내 정보 수정</span>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>

        <v-card>
          <v-container fluid>
            <v-layout>
              <v-flex xs1>
                <v-subheader class="bold" style="color:black">아이디 (수정불가)</v-subheader>
                <br/>
                <v-subheader class="bold" style="color:black; margin-top: 9px">이름</v-subheader>
                <br/>
                <v-subheader class="bold" style="color:black; margin-top: 9px">이메일</v-subheader>
                <br/>
                <v-subheader class="bold" style="color:black; margin-top: 9px">전화번호</v-subheader>
                <br/>
                <v-subheader class="bold" style="color:black; margin-top: 9px">우편번호</v-subheader>
                <br/>
                <v-subheader class="bold" style="color:black; margin-top: 9px">기본주소(도로명)</v-subheader>
                <br/>
                <v-subheader class="bold" style="color:black; margin-top: 9px">상세주소(직접입력)</v-subheader>
              </v-flex>
              <v-flex xs4>
                <v-flex xs6>
                  <v-text-field
                    label="아이디 (수정불가)"
                    readonly
                    :value="user.account_id"
                    solo
                    solo-inverted
                  ></v-text-field>
                </v-flex>
                <v-flex xs6><v-text-field
                  v-model="user.full_name"
                  solo
                ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="user.email"
                    solo
                  ></v-text-field></v-flex>
                <v-flex xs5>
                  <v-text-field
                    v-model="user.tel_num"
                    solo
                  ></v-text-field>
                </v-flex>
                <v-layout>
                  <v-flex xs2><v-text-field solo v-model="user.post_num" label="우편번호"/></v-flex>
                  <v-dialog v-model="dialog" width="500">
                    <template v-slot:activator="{ on }">
                      <v-btn color="light-blue lighten-1" dark v-on="on">
                        우편번호 검색
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="headline grey lighten-2" primary-title>
                        우편번호 검색
                      </v-card-title>
                      <v-card-text>
                        <DaumPostcode :on-complete="setDetailAddress"/>
                      </v-card-text>
                      <v-divider/>
                      <v-card-actions>
                        <v-btn color="taskButton" flat @click="dialog = false">
                          Close
                        </v-btn>
                      </v-card-actions>
                      <!--<v-card-actions>-->
                      <!--<v-spacer></v-spacer>-->
                      <!--<v-btn color="primary" flat @click="confirmDetailAddress">-->
                      <!--I accept-->
                      <!--</v-btn>-->
                      <!--</v-card-actions>-->
                    </v-card>
                  </v-dialog>
                </v-layout>
                <v-layout>
                  <v-flex xs12>
                  <v-text-field
                    v-model="user.address_basic"
                    readonly
                    solo
                    label="기본주소(도로명주소)"
                  /></v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12>
                  <v-text-field
                    v-model="user.address_detail"
                    solo
                    label="상세주소(직접입력)"
                  /></v-flex>
                </v-layout>
              </v-flex>
              <v-layout>
              <v-flex xs2></v-flex>
              <v-flex v-if="user.user_type === 'consumer'" xs2 pa-3>
                <!-- 일반 사용자용 입력항목 -->
                <h3>
                  나의 관심작물 설정
                </h3>
              </v-flex>
              <v-flex xs8>
                <v-select
                  v-for="(crop, i) in crop_interest"
                  :key="i"
                  v-model="crop_interest[i].crop_id"
                  placeholder="관심작물"
                  item-value="crop_id"
                  item-text="full_name"
                  :items="crops"
                  solo
                />
              </v-flex>
              </v-layout>
            </v-layout>
          </v-container>
        </v-card>
      </v-layout>
    </v-container>
    <v-layout v-if="user.user_type === 'provider'" row wrap>
      <!-- 공급자용 입력항목 -->
      서비스 종류 : &nbsp;&nbsp;
      <v-flex xs8>
        <div class="divTable blueTable">
          <div class="divTableHeading">
            <div class="divTableRow">
              <div class="divTableHead">
                촬영
              </div>
              <div class="divTableHead">
                영상처리
              </div>
              <div class="divTableHead">
                분석
              </div>
              <div class="divTableHead">
                시비
              </div>
              <div class="divTableHead">
                파종
              </div>
              <div class="divTableHead">
                방제
              </div>
            </div>
          </div>
          <div class="divTableBody">
            <div class="divTableRow">
              <div class="divTableCell">
                <v-checkbox v-model="services[0]" label="일반"/>
                <v-checkbox v-model="services[1]" label="특수"/>
              </div>
              <div class="divTableCell">
                <v-checkbox v-model="services[2]" label="정사영상"/>
                <v-checkbox v-model="services[3]" label="NDVI"/>
              </div>
              <div class="divTableCell">
                <v-checkbox v-model="services[4]" label="생육분석"/>
                <!-- <v-checkbox v-model="services[5]" label="피해분석"/>
                <v-checkbox v-model="services[6]" label="경사도분석"/> -->
              </div>
              <div class="divTableCell">
                <v-checkbox v-model="services[7]" label="일반시비"/>
                <v-checkbox v-model="services[8]" label="차등시비"/>
              </div>
              <div class="divTableCell">
                <v-checkbox v-model="services[9]" label="파종"/>
              </div>
              <div class="divTableCell">
                <v-checkbox v-model="services[10]" label="방제"/>
              </div>
            </div>
          </div>
        </div>
      </v-flex>
      <v-flex xs8>
        <v-select
          v-model="selected_region"
          label="서비스 지역"
          multiple
          item-text="province"
          item-value="region_id"
          :items="regions"
        />
      </v-flex>
      <v-flex xs8>
        <!--        <v-textarea-->
        <!--          v-model="company.introduction"-->
        <!--          label="회사소개"-->
        <!--        />-->
        <vue-editor v-model="company.introduction"/>
      </v-flex>
    </v-layout>
    <v-layout v-if="user.user_type === 'consumer'" row wrap>
      <v-container fluid pb-0>
        <v-layout column>
          <v-card class="card-header" color="#E6EDFF">
            <v-container fluid>
              <v-layout align-center jusify-center row wrap>
                <v-flex class="card-header-title">
                  <v-layout align-center jusify-center wrap>
                    <img src="@/assets/prepand_title.png"/>
                    <span class="ml-1">관리 영역</span>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn fab
                               @click="createArea"
                               v-on="on">
                          <v-icon>
                            note_add
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>관리영역 추가</span>
                    </v-tooltip>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
          <v-card>
            <v-container fluid>
              <v-layout>
                <v-flex d-flex xs12>
                  <v-layout column :height="1500">
                    <v-flex xs8>
                      <v-data-table
                        :headers="myAreaHeaders"
                        :items="areaInfo"
                        item-key="area_id"
                      >
                        <template v-slot:items="props">
                          <tr @click="onClickMyAreaItem(props.item.area_id)">
                            <td class="text-xs-center">{{ props.item.area_name }}</td>
                            <td class="text-xs-center">{{ props.item.post_num }}</td>
                            <td class="text-xs-center">{{ props.item.lot_address }}</td>
                            <td class="text-xs-center">{{ props.item.area_size }}</td>
                            <td class="text-xs-center">{{ props.item.description }}</td>
                            <td class="text-xs-center">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    icon
                                    small
                                    fab
                                    dark
                                    color="teal"
                                    @click="updateArea(props.item.area_id)"
                                    v-on="on">
                                    <v-icon
                                      dark>
                                      edit
                                    </v-icon>
                                  </v-btn>
                                </template>
                                <span>수정</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    icon
                                    small
                                    fab
                                    dark
                                    color="teal"
                                    @click="removeAreaConfirm(props.item.area_id)"
                                    v-on="on">
                                    <v-icon
                                      dark>
                                      delete
                                    </v-icon>
                                  </v-btn>
                                </template>
                                <span>삭제</span>
                              </v-tooltip>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-flex>
                    <v-flex xs4 pt-5>
                      <HomeMap
                        class="homeMap"
                        parent-name="UserMyPage"
                        :area-list="areaInfo"
                        @onClickMarker="onClickMarker"
                      />
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-layout>
      </v-container>
    </v-layout>
    <v-layout row wrap pt-5>
      <v-spacer></v-spacer>
      <v-btn @click="goToPrevPage()">
        취소
      </v-btn>
      <v-btn @click="updateInfo()">
        저장
      </v-btn>
    </v-layout>
    <my-area-map-dialog
      v-if="myAreaMapDialog"
      :area-id=area_id
      @close="refreshArea()"
    ></my-area-map-dialog>
    <v-dialog
      v-model="isShowConfirmDialog"
      max-width="290">
      <v-card>
        <v-card-title class="headline">관리 영역 삭제</v-card-title>

        <v-card-text>
          선택된 내용을 삭제하시겠습니까?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="hiddenConfirmDialog">
            취소
          </v-btn>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="requestInactiveArea">
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  /* eslint-disable no-console,no-unused-vars */

  import dbAPI from '@/utils/api/dbAPI'
  import userAPI from '@/utils/api/userAPI'
  import HomeMap from '@/components/common/HomeMap'
  import projectAPI from '@/utils/api/projectAPI'
  import MyAreaMapDialog from '@/components/common/MyAreaMapDialog'
  import { VueEditor } from 'vue2-editor'
  import { mapMutations } from 'vuex'
  import DaumPostcode from 'vuejs-daum-postcode' // https://github.com/mango-tree/vuejs-daum-postcode
  import Constants from '@/components/common/constants'

  export default {
    name: 'UserMyPage',
    components: {
      HomeMap,
      DaumPostcode,
      MyAreaMapDialog,
      VueEditor
    },
    data: () => {
      return {
        user: {},
        company: {},
        services: {},
        regions: [],
        selected_region: [],
        crops: [],
        crop_interest: [],
        dialog: false,
        isShowConfirmDialog: false,
        input_address: {
          fullAddress: '',
          jibunAddress: '',
          zonecode: ''
        },
        areaInfo: [],
        new_area: {
          group_id: 0,
          area_name: '',
          description: '',
          lot_address: '',
          post_num: '',
          area_size: 0,
          area_unit: 0,
          area_boundary:
            '{"area": [{"la": 128.47126655280587, "lu": 35.67145119286454}, {"la": 128.47130209207532, "lu": 35.671426134850876}, {"la": 128.47126521170134, "lu": 35.67139944261025}, {"la": 128.47122967243192, "lu": 35.67142450063231}, {"la": 128.47126655280587, "lu": 35.67145119286454}]}'
        },
        area_id: 0,
        myAreaHeaders: [
          { text: '영역이름', align: 'center', sortable: true, value: 'area_name' },
          { text: '우편번호', align: 'center', sortable: false, value: 'post_num' },
          { text: '주소', align: 'center', sortable: false, value: 'lot_address' },
          { text: '영역너비', align: 'center', sortable: false, value: 'email' },
          { text: '설명', align: 'center', sortable: false, value: 'area_size' },
          { text: '편집', align: 'center', sortable: false, value: 'description' }
        ],
        myAreaMapDialog: false
      }
    },
    async created() {
      // 사용자 정보 조회
      try {
        this.user = await userAPI.getUser(this.$session.get('account_id'))
        console.log(this.user)
      } catch (err) {
        console.log(err)
      }

      if (this.user.user_type === 'consumer') {
        try {
          let result = await dbAPI.query('select.crop.all', {})
          this.crops = result.rows
          console.log('this.crops', this.crops)
        } catch (err) {
          console.log(err)
        }

        try {
          let result = await dbAPI.query('select.crop_interest.me', {})
          if (result.rows.length === 5) {
            this.crop_interest = result.rows
          } else {
            // 5개가 아니면, 기존에 있어도 삭제하고 무조건 새로 5개 생성하여 5개로 맞춤. (UI 및 구현로직을 간결하게 하기 위해 5개로 고정)
            let result = await dbAPI.query('delete.crop_interest.me', {})
            for (let i = 0; i < 5; i++) {
              result = await dbAPI.query('insert.crop_interest.me', {})
            }
            result = await dbAPI.query('select.crop_interest.me', {})
            this.crop_interest = result.rows
          }
          console.log('this.crop_interest', this.crop_interest)
        } catch (err) {
          console.log(err)
        }

        this.requestGetArea()
      }
    },
    methods: {
      ...mapMutations([
        'clearAreaList'
      ]),

      async requestInactiveArea() {
        let areaId = this.area_id

        console.log('[requestInactiveArea] areaId : ', areaId)

        let result = await dbAPI.query('update.area.me.active', {
          area_id: areaId,
          active: Constants.ENUM_TABLE_ACTIVE_TYPE.INACTIVE
        })
        console.log('update.area.me.active ===>', result)

        // area 목록 다시 출력
        this.requestGetArea()
        this.isShowConfirmDialog = false
      },

      // 데이터 완전 삭체 함수
      // async requestRemoveArea() {
      //   let areaId = this.area_id;
      //
      //   console.log("[requestRemoveArea] areaId : ", areaId);
      //   // 관계된 여러 data를 삭제할 경우, transaction 처리 구현이 복잡하니.. 삭제 가능 여부 확인후 쭈~욱 삭제하도록 처리..
      //   let result = await dbAPI.query("sp.is_removable_area", {
      //     area_id: areaId
      //   });
      //   if (result.rows[0].is_removable_area === -1) {
      //     alert(
      //       "관련 자료(영농일지, 임무요청내역 등)가 등록되어 있어 삭제할 수 없습니다."
      //     );
      //     return;
      //   }
      //
      //   let projects_to_delete = [];
      //   projects_to_delete.length = 0;
      //   result = await dbAPI.query("select.area_project.all", {
      //     area_id: areaId
      //   });
      //   for (let i in result.rows) {
      //     console.log("project_id for delete", result.rows[i].project_id);
      //     projects_to_delete.push(result.rows[i].project_id);
      //   }
      //
      //   // project 삭제 제한 걸려 있어서, 먼저 area - project 연관 데이터 먼저 삭제처리.
      //   result = await dbAPI.query("delete.area_project", {
      //     area_id: areaId
      //   });
      //   console.log("delete.area_project", result);
      //
      //   for (let i in projects_to_delete) {
      //     result = await projectAPI.deleteProject(projects_to_delete[i]);
      //     console.log("deleteProject", result);
      //   }
      //
      //   result = await dbAPI.query("delete.area.me", {
      //     area_id: areaId
      //   });
      //   console.log("delete.area.me ===>", result);
      //
      //   // area 목록 다시 출력
      //   this.requestGetArea();
      //   this.isShowConfirmDialog = false;
      // },
      async requestGetArea() {
        try {
          this.areaInfo.length = 0
          let result = await dbAPI.query('select.area.me', {})
          this.areaInfo = result.rows

          // this.areaBoundaryList = this.areaInfo.map((data) => {
          //   return data.area_boundary.area
          // })
          console.log('[requestGetArea] this.areaInfo : ', this.areaInfo)
        } catch (err) {
          console.log(err)
        }
      },
      setDetailAddress(data) {
        this.dialog = false
        // 속성값은 Daum API 설명 참조할 것.
        // http://postcode.map.daum.net/guide#attributes

        // 전체 주소 설정
        let fullAddress = data.address
        let extraAddress = ''
        if (data.addressType === 'R') {
          // R : 도로명 주소, J : 지번 주소
          if (data.bname !== '') {
            extraAddress += data.bname
          }
          if (data.buildingName !== '') {
            extraAddress +=
              extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
          }
          fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
        }
        this.user.address_basic = fullAddress

        // 우편 번호 설정
        this.user.post_num = data.zonecode

        // 지번 주소 설정
        this.input_address.jibunAddress = data.jibunAddress
      },
      confirmDetailAddress() {
        this.dialog = false
        this.user.post_num = this.input_address.zonecode
        this.user.address_basic = this.input_address.fullAddress
        this.user.address_detail = '' // this.input_address.fullAddress
      },
      goToPrevPage() {
        this.$router.go(-1)
      },
      async updateInfo() {
        if (this.user.user_type === 'consumer') {
          for (let i in this.crop_interest) {
            let result = await dbAPI.query('update.crop_interest.me', {
              crop_id: this.crop_interest[i].crop_id,
              interest_id: this.crop_interest[i].interest_id // WHERE 절
            })
            console.log('update.crop_interest.me', result)
          }
        }
        if (this.user.user_type === 'provider') {
          let arrServices = []
          for (let i in this.services) {
            if (this.services[i] === true) {
              arrServices.push(i)
            }
          }
          // console.log('this.selected_region', this.selected_region)
          try {
            let result = await dbAPI.query('update.provider_info.me', {
              company_name: this.company.company_name,
              tel_number: this.company.tel_number,
              company_num: this.company.company_num,
              fax_number: this.company.fax_number,
              email: this.company.email,
              services: arrServices.join(),
              service_region: this.selected_region.join(),
              introduction: this.company.introduction,
              provider_id: this.company.provider_id // WHERE 절
            })
          } catch (err) {
            console.log(err)
          }
        }
        try {
          // todo: userAPI.updateUser()를 통해 변경해야 함. 민감한 사용자 정보 변경은 비밀번호 입력이 필요함
          let result = await dbAPI.query('update.user.me', {
            email: this.user.email,
            full_name: this.user.full_name,
            tel_num: this.user.tel_num,
            post_num: this.user.post_num,
            address_basic: this.user.address_basic,
            address_detail: this.user.address_detail
          })
        } catch (err) {
          console.log(err)
        }

        this.goToPrevPage()
      },

      onClickMyAreaItem(areaId) {

      },

      updateArea(areaId) {
        this.area_id = Number(areaId)
        this.myAreaMapDialog = true
      },

      refreshArea() {
        this.myAreaMapDialog = false
        this.clearAreaList()
        this.requestGetArea()
      },

      createArea() {
        this.clearAreaList()
        this.myAreaMapDialog = true
        this.area_id = null
      },

      removeAreaConfirm(areaId) {
        this.isShowConfirmDialog = true
        this.clearAreaList()
        this.area_id = areaId
      },

      hiddenConfirmDialog() {
        this.isShowConfirmDialog = false
      },

      onClickMarker(index) {
        console.log('[onClickMarker] index : ', this.areaInfo[index])

        this.updateArea(this.areaInfo[index].area_id)
      }
    }
  }
</script>

<style scoped>
@font-face {
  font-family: 'GmarketSansMedium';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
  .homeMap {
    z-index: 0;
    height: 400px;
    left: 0;
    top: 0;
  }

  /******************************** 임의로 만든 Table css 속성 값 ***************BEGIN***********************/
  div.blueTable {
    border: 1px solid #1c6ea4;
    background-color: #eeeeee;
    width: 100%;
    text-align: left;
    border-collapse: collapse;
  }

  .divTable.blueTable .divTableCell,
  .divTable.blueTable .divTableHead {
    border: 1px solid #aaaaaa;
    padding: 3px 2px;
  }

  .divTable.blueTable .divTableBody .divTableCell {
    font-size: 13px;
  }

  .divTable.blueTable .divTableHeading {
    background: #1c6ea4;
    background: -moz-linear-gradient(top, #5592bb 0%, #327cad 66%, #1c6ea4 100%);
    background: -webkit-linear-gradient(
      top,
      #5592bb 0%,
      #327cad 66%,
      #1c6ea4 100%
    );
    background: linear-gradient(to bottom, #5592bb 0%, #327cad 66%, #1c6ea4 100%);
    border-bottom: 2px solid #444444;
  }

  .divTable.blueTable .divTableHeading .divTableHead {
    font-size: 15px;
    font-weight: bold;
    color: #ffffff;
    border-left: 2px solid #d0e4f5;
  }

  .divTable.blueTable .divTableHeading .divTableHead:first-child {
    border-left: none;
  }

  .blueTable .tableFootStyle {
    font-size: 14px;
  }

  .blueTable .tableFootStyle .links {
    text-align: right;
  }

  .blueTable .tableFootStyle .links a {
    display: inline-block;
    background: #1c6ea4;
    color: #ffffff;
    padding: 2px 8px;
    border-radius: 5px;
  }

  .blueTable.outerTableFooter {
    border-top: none;
  }

  .blueTable.outerTableFooter .tableFootStyle {
    padding: 3px 5px;
  }

  /* DivTable.com */
  .divTable {
    display: table;
  }

  .divTableRow {
    display: table-row;
  }

  .divTableHeading {
    display: table-header-group;
  }

  .divTableCell,
  .divTableHead {
    display: table-cell;
  }

  .divTableHeading {
    display: table-header-group;
  }

  .divTableFoot {
    display: table-footer-group;
  }

  .divTableBody {
    display: table-row-group;
  }
.font1{
  font-family: 'GmarketSansMedium';
}

  /******************************** 임의로 만든 Table css 속성 값 *************** END ***********************/
</style>
