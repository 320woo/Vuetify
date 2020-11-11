<template>
  <v-app id="myPage">
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
            <v-layout row wrap>
              <v-flex xs6 pa-3>
                <v-text-field
                  label="아이디 (수정불가)"
                  readonly
                  :value="user.account_id"
                />
                <v-text-field v-model="user.full_name" label="이름" />
                <v-text-field v-model="user.email" label="이메일" />
                <v-layout row wrap>
                  <v-text-field v-model="user.post_num" label="우편번호" />
                  <v-dialog v-model="dialog" width="500">
                    <template v-slot:activator="{ on }">
                      <v-btn color="red lighten-2" dark v-on="on">
                        우편번호 검색
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title class="headline grey lighten-2" primary-title>
                        우편번호 검색
                      </v-card-title>
                      <v-card-text>
                        <DaumPostcode :on-complete="setDetailAddress" />
                      </v-card-text>
                      <v-divider />
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
                <v-text-field v-model="user.tel_num" label="전화번호" />
                <v-text-field
                  v-model="user.address_basic"
                  readonly
                  label="기본주소(도로명주소)"
                />
                <v-text-field
                  v-model="user.address_detail"
                  label="상세주소(직접입력)"
                />
              </v-flex>
              <v-flex xs6 pa-3>
                <!-- 공급자용 입력항목 -->
                <v-text-field v-model="company.company_name" label="회사명" />
                <v-text-field v-model="company.company_num" label="사업자번호" />
                <v-text-field v-model="company.tel_number" label="대표번호" />
                <v-text-field v-model="company.email" label="회사 Email" />
                <v-text-field v-model="company.fax_number" label="Fax 번호" />
              </v-flex>
            </v-layout>
            <v-layout row wrap>
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
                        <v-checkbox v-model="services[0]" label="일반" />
                        <v-checkbox v-model="services[1]" label="특수" />
                      </div>
                      <div class="divTableCell">
                        <v-checkbox v-model="services[2]" label="정사영상" />
                        <v-checkbox v-model="services[3]" label="NDVI" />
                        <v-checkbox v-model="services[11]" label="GeoTIFF" />
                        <v-checkbox v-model="services[12]" label="AI도복검출" />
                      </div>
                      <div class="divTableCell">
                        <v-checkbox v-model="services[4]" label="생육분석" />
                        <!-- <v-checkbox v-model="services[5]" label="피해분석" />
                        <v-checkbox v-model="services[6]" label="경사도분석" /> -->
                      </div>
                      <div class="divTableCell">
                        <v-checkbox v-model="services[7]" label="일반시비" />
                        <v-checkbox v-model="services[8]" label="차등시비" />
                      </div>
                      <div class="divTableCell">
                        <v-checkbox v-model="services[9]" label="파종" />
                      </div>
                      <div class="divTableCell">
                        <v-checkbox v-model="services[10]" label="방제" />
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
              <v-flex xs12>
                <quill-editor
                  v-model="company.introduction"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"
                >
                </quill-editor>
              </v-flex>
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
              :area-id="area_id"
              @close="refreshArea()"
            ></my-area-map-dialog>
          </v-container>
        </v-card>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
/* eslint-disable no-console,no-unused-vars */

import dbAPI from "@/utils/api/dbAPI"
import userAPI from "@/utils/api/userAPI"
import HomeMap from "./HomeMap"
import DaumPostcode from "vuejs-daum-postcode" // https://github.com/mango-tree/vuejs-daum-postcode
import projectAPI from "@/utils/api/projectAPI"
import MyAreaMapDialog from "@/components/common/MyAreaMapDialog"
import { quillEditor } from "vue-quill-editor"
// import Quill from "quill"
// import { ImageDrop } from "quill-image-drop-module"
// import ImageResize from "quill-image-resize-module"
//
// Quill.register("modules/imageDrop", ImageDrop)
// Quill.register("modules/imageResize", ImageResize)

export default {
  components: {
    HomeMap,
    DaumPostcode,
    MyAreaMapDialog,
    quillEditor
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
      input_address: {
        fullAddress: "",
        jibunAddress: "",
        zonecode: ""
      },
      areas: [],
      new_area: {
        group_id: 0,
        area_name: "",
        description: "",
        lot_address: "",
        post_num: "",
        area_size: 0,
        area_unit: 0,
        area_boundary:
          '{"area": [{"la": 128.47126655280587, "lu": 35.67145119286454}, {"la": 128.47130209207532, "lu": 35.671426134850876}, {"la": 128.47126521170134, "lu": 35.67139944261025}, {"la": 128.47122967243192, "lu": 35.67142450063231}, {"la": 128.47126655280587, "lu": 35.67145119286454}]}'
      },
      area_id: 0,
      myAreaHeaders: [
        {
          text: "영역이름",
          align: "center",
          sortable: true,
          value: "area_name"
        },
        {
          text: "주소",
          align: "center",
          sortable: false,
          value: "lot_address"
        },
        {
          text: "우편번호",
          align: "center",
          sortable: false,
          value: "post_num"
        },
        { text: "영역너비", align: "center", sortable: false, value: "email" },
        { text: "설명", align: "center", sortable: false, value: "area_size" },
        { text: "편집", align: "center", sortable: false, value: "description" }
      ],
      myAreaMapDialog: false,

      // HTML Editor 요소
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image", "video"]
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          // imageDrop: true,
          // imageResize: {
          //   displayStyles: {
          //     backgroundColor: "black",
          //     border: "none",
          //     color: "white"
          //   },
          //   modules: ["Resize", "DisplaySize", "Toolbar"]
          // }
        }
      }
    }
  },
  async created() {
    // 사용자 정보 조회
    try {
      this.user = await userAPI.getUser(this.$session.get("account_id"))
      console.log(this.user)
    } catch (err) {
      console.log(err)
    }
    // 서비스 지역 코드 조회
    try {
      let result = await dbAPI.publicQuery("select.region.all", {})
      this.regions = result.rows
    } catch (err) {
      console.log(err)
    }

    // 공급자 정보 조회
    try {
      let result = await dbAPI.query("select.provider_info.me", {})
      console.log("select.provider_info.me", result)
      if (result.rowCount === 1) {
        this.company = result.rows[0]

        this.services.length = 0
        let support_services = this.company.services.split(",")
        for (var i in support_services) {
          this.services[parseInt(support_services[i])] = true
        }
        console.log("this.company.service_region", this.company.service_region)
        this.selected_region = this.company.service_region
          .split(",")
          .map(Number)
      } else {
        // 없다고 보고, 없으면 빈 정보를 insert 시킨다.
        let result = await dbAPI.query("insert.provider_info.me.dummy", {})
        console.log("insert.provider_info.me.dummy", result)
      }
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    async update_area() {
      let result = await dbAPI.query("update.area.me", {
        // group_id: 0,  // TODO : 일단, 고정. group_id에 대해 어떻게 처리할지??
        area_name: this.new_area.area_name,
        description: this.new_area.description,
        lot_address: this.new_area.lot_address,
        post_num: this.new_area.post_num,
        area_size: 100, // TODO : 입력한 영역에 따라 자동 계산
        area_unit: 0, // 고정
        area_boundary:
          '{"area": [{"la": 128.47126655280587, "lu": 35.67145119286454}, {"la": 128.47130209207532, "lu": 35.671426134850876}]}',
        area_id: this.area_id
      })
      console.log("result ====> ", result)
      this.get_area()
    },
    async remove_area(areaId) {
      // 관계된 여러 data를 삭제할 경우, transaction 처리 구현이 복잡하니.. 삭제 가능 여부 확인후 쭈~욱 삭제하도록 처리..
      let result = await dbAPI.query("sp.is_removable_area", {
        area_id: areaId
      })
      if (result.rows[0].is_removable_area === -1) {
        alert(
          "관련 자료(영농일지, 임무요청내역 등)가 등록되어 있어 삭제할 수 없습니다."
        )
        return
      }

      let projects_to_delete = []
      projects_to_delete.length = 0
      result = await dbAPI.query("select.area_project.all", {
        area_id: areaId
      })
      for (var i in result.rows) {
        console.log("project_id for delete", result.rows[i].project_id)
        projects_to_delete.push(result.rows[i].project_id)
      }

      // project 삭제 제한 걸려 있어서, 먼저 area - project 연관 데이터 먼저 삭제처리.
      result = await dbAPI.query("delete.area_project", {
        area_id: areaId
      })
      console.log("delete.area_project", result)

      for (var i in projects_to_delete) {
        result = await projectAPI.deleteProject(projects_to_delete[i])
        console.log("deleteProject", result)
      }

      result = await dbAPI.query("delete.area.me", {
        area_id: areaId
      })
      console.log("delete.area.me ===>", result)

      // area 목록 다시 출력
      this.get_area()
    },
    async get_area() {
      try {
        this.areas.length = 0
        let result = await dbAPI.query("select.area.me", {})
        this.areas = result.rows
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
      let extraAddress = ""
      if (data.addressType === "R") {
        // R : 도로명 주소, J : 지번 주소
        if (data.bname !== "") {
          extraAddress += data.bname
        }
        if (data.buildingName !== "") {
          extraAddress +=
            extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName
        }
        fullAddress += extraAddress !== "" ? ` (${extraAddress})` : ""
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
      this.user.address_detail = "" // this.input_address.fullAddress
    },
    goToPrevPage() {
      this.$router.go(-1)
    },
    async updateInfo() {
      let arrServices = []
      for (let i in this.services) {
        if (this.services[i] === true) {
          arrServices.push(i)
        }
      }
      // console.log('this.selected_region', this.selected_region)
      try {
        let result = await dbAPI.query("update.provider_info.me", {
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
      try {
        // todo: userAPI.updateUser()를 통해 변경해야 함. 민감한 사용자 정보 변경은 비밀번호 입력이 필요함
        let result = await dbAPI.query("update.user.me", {
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

    onClickMyAreaItem(areaId) {},

    updateArea(areaId) {
      this.area_id = Number(areaId)
      this.myAreaMapDialog = true
    },

    refreshArea() {
      this.myAreaMapDialog = false
      this.get_area()
    },
    onEditorBlur(editor) {
      console.log("editor blur!", editor)
    },
    onEditorFocus(editor) {
      console.log("editor focus!", editor)
    },
    onEditorReady(editor) {
      console.log("editor ready!", editor)
    }
  }
}
</script>

<style scoped>
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

/******************************** 임의로 만든 Table css 속성 값 *************** END ***********************/
</style>
