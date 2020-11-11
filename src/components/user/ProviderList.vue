<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!-- <v-container fluid>
    <v-card class="card-header"> -->
      <v-container fluid>
        <v-layout column wrap class="ml-auto">
          <v-card class="card-header" color="#E6EDFF">
            <v-container fluid>
              <v-layout align-center justify-center row wrap>
                <v-flex class="card-header-title">
                  <v-layout align-center jusify-center wrap>
                    <img src="@/assets/prepand_title.png" />
                    <span class="ml-1">공급자 목록</span>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
          <v-card>
            <v-container fluid>
              <v-layout row>
                <v-flex>
                  <v-card-title>
                    <v-layout column>
                      <v-layout row>
                        <v-flex>
                          <v-data-table
                            :headers="company_headers"
                            :items="companies"
                            item-key="provider_id"
                            :rows-per-page-items="rowsPerPageItems"
                            :pagination.sync="pagination"
                          >
                            <template v-slot:items="props">
                              <tr
                                @click="
                                  _openProviderPresentationModal(
                                    props.item.introduction,
                                    props.item.company_name
                                  )
                                "
                              >
                                <td
                                  style="white-space: nowrap"
                                  class="text-xs-left"
                                >
                                  {{ props.item.company_name }}
                                </td>
                                <td class="text-xs-left">
                                  {{
                                    get_region_name(props.item.service_region)
                                  }}
                                </td>
                                <td class="text-xs-left">
                                  {{ get_service_name(props.item.services) }}
                                </td>
                                <!--                                <td class="justify-center layout px-0">-->
                                <!--                                  <v-icon-->
                                <!--                                    small-->
                                <!--                                    class="mr-2"-->
                                <!--                                    @click="editItem(props.item)"-->
                                <!--                                  >-->
                                <!--                                    edit-->
                                <!--                                  </v-icon>-->
                                <!--                                  <v-icon-->
                                <!--                                    small-->
                                <!--                                    @click="deleteItem(props.item)"-->
                                <!--                                  >-->
                                <!--                                    delete-->
                                <!--                                  </v-icon>-->
                                <!--                                </td>-->
                              </tr>
                            </template>
                            <!--                            <template v-slot:expand="props">-->
                            <!--                              <v-card>-->
                            <!--                                <v-card-text>-->
                            <!--                                  <h3>[회사 소개]</h3>-->
                            <!--                                  {{ props.item.introduction }}-->
                            <!--                                </v-card-text>-->
                            <!--                              </v-card>-->
                            <!--                            </template>-->
                          </v-data-table>
                        </v-flex>
                      </v-layout>
                    </v-layout>
                  </v-card-title>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-layout>
        <provider-presentation-modal
          v-if="modal"
          @close="closeDiaryWritingDialog()"
          :introduction="introduction"
          :company-name="companyName"
        >
        </provider-presentation-modal>
      </v-container>
    <!-- </v-card> -->
  <!-- </v-container> -->
</template>

<script>
import dbAPI from "@/utils/api/dbAPI"
import StringUtil from "@/utils/utils/stringUtil"
import ProviderPresentationModal from "@/components/user/dialog/ProviderPresentationModal"

export default {
  name: "ProviderList",
  components: { ProviderPresentationModal },
  data: () => ({
    company_headers: [
      { text: "회사명", align: "left", sortable: true, value: "company_name" },
      {
        text: "서비스지역",
        align: "left",
        sortable: false,
        value: "service_region"
      },
      { text: "제공 서비스", align: "left", sortable: false, value: "services" }
      // { text: "비고", align: "left", sortable: false, value: "action" }
    ],
    companies: [], // { company: '', address: '', services: '' }
    regions: [],
    expand: false,
    rowsPerPageItems: [
      5,
      10,
      25,
      { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 }
    ],
    pagination: {
      rowsPerPage: 10
    },
    introduction: "",
    companyName: "",
    modal: false
  }),

  async created() {
    try {
      let result = await dbAPI.publicQuery("select.region.all", {})
      if (result.rowCount >= 1) {
        this.regions = result.rows
        console.log(this.regions)
      }
    } catch (err) {
      console.log(err)
    }
    try {
      let result = await dbAPI.publicQuery("select.provider.all", {})
      if (result.rowCount >= 1) {
        this.companies = result.rows
        console.log("companies: ", this.companies)
      }
    } catch (err) {
      console.log(err)
    }
  },

  methods: {
    get_region_name: function(regions) {
      let str = ""
      if (regions == null) {
        return ""
      }
      let array_regions = regions.split(",")
      for (let i in array_regions) {
        for (let j in this.regions) {
          if (this.regions[j].region_id === parseInt(array_regions[i])) {
            str += this.regions[j].province + "/"
          }
        }
      }
      if (str !== "") {
        str = str.replace(/\/$/, "")
      }
      return str
    },
    get_service_name: function(services) {
      if (services == null) {
        return ""
      }
      const service_names = [
        "일반촬영",
        "특수촬영",
        "정사영상(DSM포함)",
        "NDVI",
        "생육분석",
        // "피해분석",
        // "경사도분석",
        "일반시비",
        "차등시비",
        "파종",
        "방제"
      ]
      let str = ""
      let array_services = services.split(",")
      for (let i in array_services) {
        str += service_names[parseInt(array_services[i])] + "/"
      }
      if (str !== "") {
        str = str.replace(/\/$/, "")
      }
      return str
    },
    getIntroImages: function(index) {
      return require("@/assets/" + this.introImages[index].src)
    },
    _openProviderPresentationModal(introduction, companyName) {
      this.introduction = introduction
      this.companyName = companyName
      this.modal = true
    },
    closeDiaryWritingDialog() {
      this.modal = false
    }
  },

  computed: {}
}
</script>

<style scoped></style>
