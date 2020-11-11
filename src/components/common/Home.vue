<template>
  <v-app id="home">
    <v-navigation-drawer
      v-model="drawer"
      class="navigationDrawer white--text"
      :clipped="true"
      :mobile-break-point="800"
      touchless
      app
      dark
    >
      <v-list dense>
        <template v-for="(item, index) in items">
          <v-layout
            v-if="item.header"
            :key="item.header"
            row
            align-center
          />
          <v-list-tile
            v-else
            :key="item.text"
            :to="item.url"
            ripple
            class="navigation-list"
            active-class="navigation-list-active"
            @click=""
          >
            <v-list-tile-action>
              <template v-if="item.customIcon">
                <img
                  class="img_size"
                  :src="item.icon"
                >
              </template>
              <template v-else>
                <v-icon large>
                  {{ item.icon }}
                </v-icon>
              </template>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="true"
      color="toolbar"
      dark
      app
    >
      <!--<v-btn-->
      <!--slot="activator"-->
      <!--icon-->
      <!--flat-->
      <!--@click.stop="_onClickToolbarMenu()"-->
      <!--&gt;-->
      <!--<img :src="icons.menu">-->
      <!--</v-btn>-->
      <v-btn
        icon
        flat
        @click.stop="_onClickToolbarMenu()"
      >
        <v-img :src="icons.menu"/>
      </v-btn>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
      <v-spacer/>
      <v-tooltip bottom>
        <v-btn
          slot="activator"
          flat
          icon
          @click.stop="_onClickLogout()"
        >
          <v-img
            :src="icons.logout"
            aspect-ratio="1.7"
            contain
          />
        </v-btn>
        <span>로그아웃</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          slot="activator"
          flat
          icon
          to="/mypage"
        >
          <v-icon>edit</v-icon>
        </v-btn>
        <span>My Page</span>
      </v-tooltip>
      <!--<v-btn
        flat
        icon
      >
        <v-img
          :src="icons.notification"
          aspect-ratio="1.7"
          contain
        />
      </v-btn>-->
    </v-toolbar>
    <v-content class="content_wrap">
      <v-container fluid>
        <template v-if="isHome">
          <v-layout column>
            <v-container pb-0>
              <v-layout column>
                <v-card
                  class="card-header"
                  color="#E6EDFF"
                >
                  <v-container fluid>
                    <v-layout
                      align-center
                      jusify-center
                      row
                      wrap
                    >
                      <v-flex class="card-header-title">
                        <v-layout
                          align-center
                          jusify-center
                          wrap
                        >
                          <img src="@/assets/prepand_title.png">
                          <span class="ml-1">실사지도 위치</span>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
                <v-card>
                  <v-container fluid>
                    <v-layout>
                      <v-flex
                        v-if="visible"
                        d-flex
                        xs12
                      >
                        <HomeMap class="homeMap" :test-view="true"/>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-layout>
            </v-container>
            <v-layout
              row
              wrap
            >
              <v-flex
                lg6
                md6
                sm12
                xs12
              >
                <v-container>
                  <v-layout column>
                    <v-card
                      class="card-header"
                      color="#E6EDFF"
                    >
                      <v-container fluid>
                        <v-layout
                          align-center
                          jusify-center
                          row
                          wrap
                        >
                          <v-flex class="card-header-title">
                            <v-layout
                              align-center
                              jusify-center
                              wrap
                            >
                              <img src="@/assets/prepand_title.png">
                              <span class="ml-1">발전량/소비량 현황</span>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card>
                    <v-card>
                      <v-container>
                        <bar-chart
                          :data="powerProductionData"
                          :options="powerOptions"
                        />
                      </v-container>
                    </v-card>
                  </v-layout>
                </v-container>
              </v-flex>

              <v-flex
                lg6
                md6
                sm12
                xs12
              >
                <v-container>
                  <v-layout column>
                    <v-card
                      class="card-header"
                      color="#E6EDFF"
                    >
                      <v-container fluid>
                        <v-layout
                          align-center
                          jusify-center
                          row
                          wrap
                        >
                          <v-flex class="card-header-title">
                            <v-layout
                              align-center
                              jusify-center
                              wrap
                            >
                              <img src="@/assets/prepand_title.png">
                              <span class="ml-1">일사량/발전량 현황</span>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card>
                    <v-card>
                      <v-container>
                        <bar-chart
                          :data="sunshineProductionData"
                          :options="sunshineOptions"
                        />
                      </v-container>
                    </v-card>
                  </v-layout>
                </v-container>
              </v-flex>
            </v-layout>
          </v-layout>
        </template>
        <router-view/>
      </v-container>
      <v-dialog
        v-model="this.isOpenLogoutModal"
        persistent
        max-width="500px"
      >
        <confirm-modal
          :title="modalTitle"
          :content="modalContent"
          @confirm="_logout()"
          @cancel="_cancel()"
        />
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
  import Constant from "@/components/common/constants";
  import HomeStatusCard from "./HomeStatusCard";
  import HomeRecentTask from "./HomeRecentTask";
  import HomeMap from "./HomeMap";
  import BarChart from "./BarCharts";
  import ConfirmModal from "@/components/shared-components/ConfirmModal";
  import icons from "@/icons.js";
  import authAPI from "@/utils/api/authAPI";

  export default {
    components: {
      HomeStatusCard: HomeStatusCard,
      HomeRecentTask: HomeRecentTask,
      HomeMap,
      BarChart: BarChart,
      ConfirmModal: ConfirmModal
    },
    data() {
      return {
        icons: icons,
        modalTitle: "로그아웃",
        modalContent: "로그아웃 하시겠습니까?",
        isOpenLogoutModal: false,

        projectList: null,
        title: Constant.MAIN_TITLE,
        dialog: false,
        drawer: null,
        items: [
          // {icon: 'access_time', text: 'Test', url: '/test'},
          { customIcon: true, icon: icons.home, text: "홈", url: "/home" },
          {
            customIcon: true,
            icon: icons.drone,
            text: "드론 실사지도 관리",
            url: "/project"
          },
          {
            customIcon: true,
            icon: icons.facility,
            text: "시설물 관리",
            url: "/facility"
          },
          // {icon: 'beenhere', text: '점검 내역', url: '/checklist'},
          {
            customIcon: true,
            icon: icons.user,
            text: "사용자 관리",
            url: "/user"
          },
          {
            customIcon: true,
            icon: icons.devices,
            text: "IoT 장치 관리",
            url: "/device"
          },
          {
            customIcon: true,
            icon: icons.preference,
            text: "환경 설정",
            url: "/preferences"
          },
          {
            customIcon: true,
            icon: icons.preference,
            text: "미션 생성",
            url: "/mission"
          }
          // {icon: 'access_time', text: 'TODO List', url: '/timeseries'}
          // {icon: icons.preference, text: 'GCP Interface', url: '/gcpi'},
        ],
        statusList: [10, 20, 30, 40, 50],
        isHome: true,
        visible: false,

        // Chart data
        powerProductionData: {
          labels: [
            "2018.09.01",
            "2018.09.02",
            "2018.09.03",
            "2018.09.04",
            "2018.09.05",
            "2018.09.06",
            "2018.09.07",
            "2018.09.08"
          ],
          datasets: [
            {
              label: "소비량",
              borderColor: "#e74c3c",
              pointBackgroundColor: "white",
              backgroundColor: "rgba(0, 0, 0, 0.0)",
              borderWidth: 3,
              data: [20, 18, 40, 20, 40, 20, 45, 41],
              type: "line"
            },
            {
              label: "발전량",
              borderColor: "black",
              backgroundColor: "#3498db",
              data: [40, 35, 50, 30, 50, 40, 60, 50],
              type: "bar"
            }
          ]
        },
        powerOptions: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "Month"
                },
                ticks: {
                  autoSkip: false,
                  maxRotation: 15,
                  minRotation: 15
                }
              }
            ],
            yAxes: [
              {
                display: true,
                ticks: {
                  beginAtZero: true,
                  steps: 10,
                  stepValue: 5,
                  max: 100
                }
              }
            ]
          },
          title: {
            display: false,
            text: "Chart.js Line Chart - Legend"
          }
        },
        sunshineProductionData: {
          labels: [
            "2018.09.01",
            "2018.09.02",
            "2018.09.03",
            "2018.09.04",
            "2018.09.05",
            "2018.09.06",
            "2018.09.07",
            "2018.09.08"
          ],
          datasets: [
            {
              label: "일사량(W/m^2)",
              borderColor: "#e74c3c",
              pointBackgroundColor: "white",
              backgroundColor: "rgba(0, 0, 0, 0.0)",
              borderWidth: 3,
              data: [90, 450, 850, 700, 600, 545, 595, 655],
              type: "line",
              yAxisID: "sunshine"
            },
            {
              label: "발전량(kWh)",
              borderColor: "#2980b9",
              pointBackgroundColor: "white",
              backgroundColor: "rgba(0, 0, 0, 0.0)",
              data: [5, 35, 60, 45, 39, 36, 37, 20],
              type: "line",
              yAxisID: "production"
            }
          ]
        },
        sunshineOptions: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "날짜"
                },
                ticks: {
                  autoSkip: false,
                  maxRotation: 15,
                  minRotation: 15
                }
              }
            ],
            yAxes: [
              {
                display: true,
                id: "sunshine",
                position: "left",
                scaleLabel: {
                  display: true,
                  labelString: "일사량(W/m^2)"
                },
                ticks: {
                  beginAtZero: true,
                  stepValue: 100,
                  max: 1000
                }
              },
              {
                display: true,
                id: "production",
                position: "right",
                scaleLabel: {
                  display: true,
                  labelString: "발전량(kWh)"
                },
                ticks: {
                  beginAtZero: true,
                  // steps: 10,
                  // stepValue: 5,
                  max: 70
                },
                gridLines: {
                  drawOnChartArea: false
                }
              }
            ]
          },
          title: {
            display: false,
            text: "Chart.js Line Chart - Legend"
          }
        }
      };
    },
    watch: {
      isHome() {
        if (this.isHome) {
          console.log("Current page : Home");
          // this._requestGetProjects()
        }
      }
    },
    created() {
      // this._requestGetProjects()
      console.log("home created");
    },
    updated() {
      this.isHome = this.$router.currentRoute.name === "home";
    },
    mounted() {
      this.visible = true;
      this.isHome = this.$router.currentRoute.name === "home";
    },
    methods: {
      _onClickToolbarMenu() {
        if (this.$session.get("solar")) {
          // goto home
          this.$router.push({
            name: "project"
          });
        } else {
          this.drawer = !this.drawer;
        }
      },
      _onClickLogout() {
        this.isOpenLogoutModal = true;
      },
      async _logout() {
        const response = await authAPI.logout(this.$session.get("account_id"));
        await console.log(response.code, response.message);
        await this.$session.destroy();
        console.log(this.$router.currentRoute.params);
        await this.$router.replace({
          // name: 'login',
          // params: this.$router.currentRoute.params,
          // query: {redirect: this.$router.currentRoute.fullPath}
          name: "intro"
        });
      },
      _cancel() {
        this.isOpenLogoutModal = false;
      }
    }
  };
</script>

<style scoped>
  .homeMap {
    z-index: 0;
    height: 400px;
    left: 0;
    top: 0;
  }

  .content_wrap {
    background-color: #f3f6ff;
  }

  .img_size {
    width: 26px;
  }

  >>> .v-navigation-drawer {
    overflow-y: hidden !important;
  }

  >>> .navigation-list {
    padding: 5px 15px;
  }

  >>> .navigation-list-active {
    color: white !important;
    background-color: #131927 !important;
    border-radius: 5px;
  }
</style>
