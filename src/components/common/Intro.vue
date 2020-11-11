<template>
  <v-app class="intro">
    <v-layout column commonBackground align-center>
      <!-- Header -->
      <v-flex xs12 sm12 md12 :style="{width: '1248px'}">
        <v-layout row
                  align-center
                  justify-center
                  fill-height
                  :style="{ backgroundColor: 'rgba(8, 43, 71, 0.85)',
                      maxWidth: '1248px',
                      position: 'fixed',
                      width: '100%',
                      height: '59px',
                      zIndex: 10}"
                  px-3>
          <v-img :src="require('@/assets/visumy_logo.png')" max-width=224px max-height=19px contain/>
          <v-spacer></v-spacer>
          <v-btn class="header-button" :color="'rgb(0, 174, 239)'" to="/login">로그인</v-btn>
          <!-- <v-btn class="header-button" :color="'rgb(0, 174, 239)'" to="/selectAccountType">회원가입</v-btn> -->
        </v-layout>
        <!-- First page -->
        <v-layout column
                  align-center
                  justify-center
                  fill-height
                  :style="{ backgroundImage: `url('${introBackgroundFirstImage}')`,
                        marginTop: '59px',
                        maxWidth: '1248px',
                        width: '100%',
                        height: '720px',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover' }">
          <v-flex xs4 sm4 md4>
            <div class="first-page-title">ICT 기술을 적용한 다목적 정밀농업용</div>
            <div class="first-page-title first-page-title-large">자율비행 드론 플랫폼</div>
            <div class="first-page-subtitle">“ 정밀농업 육성을 통한 국가경제 혁신 ”</div>
          </v-flex>
        </v-layout>
        <!-- Second page -->
        <v-layout column
                  align-center
                  justify-center
                  fill-height
                  :style="{ backgroundColor: `rgb(236, 233, 222)`,
                        maxWidth: '1248px',
                        width: '100%',
                        height: '774px'}">
          <v-flex xs4 sm4 md4>
            <div class="second-page-title">정밀농업이란?</div>
            <div class="second-page-subtitle">토양 특성과 작물 생육 특성이 농경지 위치별 차이로 수확량과 품질에 차이가 있으므로 위치별 맞춤형 농경 관리를 통해 환경 보호 및
              생산량을 극대화 하기 위한 농업 기술.
            </div>
            <v-img :src="require('@/assets/intro_second_content_image.png')" max-width=1150px
                   max-height="490px" contain></v-img>
          </v-flex>
        </v-layout>

        <!-- Third page -->
        <v-layout column
                  align-center
                  justify-center
                  fill-height
                  :style="{ backgroundColor: `rgb(255, 255, 255)`,
                        maxWidth: '1248px',
                        width: '100%',
                        height: '1230px',
                        paddingTop: '12.344vw',
                        paddingBottom: '16.406vw'}">
          <v-layout row
                    align-center
                    justify-center
                    :style="{
                        maxWidth: '1248px',
                        width: '100%'}">
            <v-flex xs9 sm8 md6>
              <v-layout column
                        align-start
                        justify-center
                        class="third-page-first">
                <div class="third-page-title left-align">편리한 영농<br>자동화 플랫폼 제공</div>
                <div class="third-page-subtitle left-align">정밀농업의 도입으로 맞춤형 농경 관리를 통해 생산량을 극대화 하세요.</div>
                <div class="third-page-effect-content left-align">사용자는</div>
                <div class="third-page-content left-align">공급자에게 촬영, 생육분석, 시비/파종/방제 임무를 요청할 수 있습니다.<br>
                  주기적인 농지 촬영으로 시간의 흐름에 따른 생육 변화를 확인하고
                  전문가의 분석과 함께 드론을 통한 정밀 변량 파종/시비/방제가 가능합니다.
                </div>
                <v-btn class="third-button" :color="'rgb(185, 166, 18)'"
                       round
                       :style="{ marginTop: '39px' }"
                       to="/userHome">사용자 시작하기
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs3 sm4 md6>
              <v-layout align-end
                        justify-end>
                <v-img :src="require('@/assets/intro_third_page_image_1.png')" max-width=609px max-height="352px"
                       contain></v-img>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-spacer/>
          <v-layout row
                    fill-height
                    align-center
                    justify-center
                    :style="{
                        marginTop: '80px',
                        maxWidth: '1248px',
                        width: '100%'}">
            <v-flex xs3 sm4 md6>
              <v-layout align-start
                        justify-start>
                <v-img :src="require('@/assets/intro_third_page_image_2.png')" max-width=609px
                       max-height="405px" contain></v-img>
              </v-layout>
            </v-flex>
            <v-flex xs9 sm8 md6>
              <v-layout column
                        align-end
                        justify-center
                        fill-height
                        class="third-page-second">
                <div class="third-page-title right-align" :style="{marginBottom: '10px'}">정밀한 자율비행 드론<br>운영 시스템</div>
                <div class="third-page-effect-content right-align">드론을 보유한 공급자라면</div>
                <div class="third-page-content right-align">사용자가 요청한 농지 촬영을 수락하여 정밀지도를 제작할 수 있습니다.<br>
                  NIR이나 EO 카메라가 장착된 드론이라면 NDVI 분석 임무를 수행할 수 있습니다.<br>
                  전용 시비/파종/방제용 드론으로 정밀 변량 살포할 수 있습니다.
                </div>
                <v-btn class="third-button" :color="'rgb(47, 160, 162)'"
                       round
                       :style="{ marginTop: '39px' }"
                       to="/providerHome">공급자 시작하기
                </v-btn>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-layout>

        <!-- Fourth page -->
        <v-layout wrap
                  :style="{
                        maxWidth: '1248px',
                        width: '100%' }">
          <v-flex xs12 sm12 md12>
            <v-layout row
                      align-center
                      fill-height
                      :style="{
                        maxWidth: '1248px',
                        width: '100%', }">
              <v-flex xs6 sm6 md6>
                <v-layout :style="{
                        maxWidth: '624px',
                        maxHeight: '720px',
                        width: '100%',
                        height: '100%'}">
                  <v-img :src="require('@/assets/intro_fourth_page_image_1.png')"/>
                </v-layout>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <v-layout :style="{
                        maxWidth: '624px',
                        maxHeight: '720px',
                        width: '100%',
                        height: '100%'}">
                  <v-img :src="require('@/assets/intro_fourth_page_image_2.png')"/>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <div class="fourth-page-layout">
            <v-img :src="require('@/assets/transparent.png')"
                   max-width="1248px" max-height="720px" contain>
              <v-layout row
                        align-center
                        justify-space-between
                        fill-height>
                <v-layout row
                          align-center
                          justify-center
                          fill-height
                          class="fourth-page-side-layout">
                  <v-img :src="require('@/assets/intro_fourth_page_icon_1.png')" width="18px" height="12px"
                         max-width="18px" max-height="12px"/>
                  <div class="fourth-page-side-content">기존 지도</div>
                </v-layout>
                <v-layout column
                          fill-height
                          align-center
                          justify-center
                          :style="{ backgroundImage: `url('${introBackgroundFourthContentImage}')`,
                        width: '100%',
                        height: '100%',
                        maxWidth: '594px',
                        maxHeight: '149px',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover' }">
                  <div class="fourth-page-center-title">정밀 농지 지도 제작</div>
                  <div class="fourth-page-center-subtitle">드론 촬영 사진으로 일반 지도 대비 뚜렷한 화질의 지도 제작</div>
                </v-layout>
                <v-layout row
                          fill-height
                          align-center
                          justify-center
                          class="fourth-page-side-layout">
                  <v-img :src="require('@/assets/intro_fourth_page_icon_2.png')" width="18px" height="12px"
                         max-width="18px" max-height="12px"/>
                  <div class="fourth-page-side-content">드론 촬영 지도</div>
                </v-layout>
              </v-layout>
            </v-img>
          </div>
        </v-layout>

        <!-- Fifth page -->
        <v-layout row
                  align-center
                  justify-center
                  :style="{ backgroundColor: `rgb(221, 237, 247)`,
                        maxWidth: '1248px',
                        width: '100%',
                        height: '720px'}">
          <v-flex xs6 sm6 md4>
            <v-layout column
                      align-start
                      justify-center
                      :style="{ marginLeft: '9.219vw'}">
              <div class="fifth-page-title">NDVI<br>생육 분석</div>
              <div class="fifth-page-title fifth-page-subtitle">(식생지수)</div>
              <div class="fifth-page-content">GIS기반으로 NDVI값을 활용 농지내 작물 생<br>
                장상태 확인하고, 시간경과시 작물 생장 변<br>
                화를 감지하여 문제점을 식별합니다.
              </div>
              <div class="fifth-page-summary">- 작물 생장주기별 성장상태 파악<br>
                - 동일 작물에 대한 지역별 작황현황 비교분석<br>
                - 년도별 작황 비교 분석<br>
                • 생산량 판단<br>
                - 작물별 표준 생장모델 개발<br>
              </div>
            </v-layout>
          </v-flex>
          <v-flex xs6 sm6 md8>
            <v-layout fill-height
                      align-center
                      justify-end
                      :style="{
                        maxHeight: '620px',
                        width: '100%',
                        height: '620px'
                        }">
              <v-img :src="require('@/assets/intro_fifth_page_background.png')" contain>
                <v-layout align-center
                          justify-center
                          fill-height
                          :style="{
                            paddingLeft:'50px',
                            paddingRight:'20px'
                        }">
                  <v-img :src="require('@/assets/intro_fifth_page_image.png')" max-width=720px
                         max-height="562px" contain/>
                </v-layout>
              </v-img>
            </v-layout>
          </v-flex>
        </v-layout>

        <!-- Sixth page -->
        <v-layout row
                  align-end
                  justify-center
                  :style="{ backgroundColor: `rgb(221, 237, 247)`,
                        maxWidth: '1248px',
                        width: '100%'}">
          <v-flex xs12 sm12 md12>
            <v-layout column
                      align-center
                      justify-end
                      fill-height
                      :style="{ marginTop: '45px',
                          marginLeft: '20px',
                          marginRight: '20px'
                        }">
              <div class="fifth-page-title">정밀 변량 시비/방제</div>
              <div class="sixth-page-content">속도/고도에 따른 단위 면적당 살포량 분석, 살포량 편차 분석 → 표준 살포량 책정<br>
                농업전문가에 의한 NDVI 분석 후 농경지 위치별 살포량 결정 및 드론 변량 살포 수행
              </div>
            </v-layout>
            <v-layout row
                      align-end
                      justify-center
                      :style="{
                        maxWidth: '1248px',
                        maxHeight: '537px',
                        width: '100%',
                        height: '100%',
                        marginTop: '28px'}">
              <v-img :src="require('@/assets/intro_sixth_page_background.png')">
                <v-layout align-center
                          justify-center
                          fill-height
                          :style="{
                            margin: '20px'}">
                  <v-img :src="require('@/assets/intro_sixth_page_image.png')" max-width=1107px
                         max-height="386px"/>
                </v-layout>
              </v-img>
            </v-layout>
          </v-flex>
        </v-layout>

        <!-- Footer -->
        <v-layout column
                  align-center
                  justfy-center
                  fill-height
                  :style="{ backgroundColor: 'rgb(255, 255, 255)',
                      maxWidth: '1248px',
                      maxHeight: '137px',
                      width: '100%',
                      height: '137px'}">
          <v-layout align-center
                    justify-center
                    :style="{ maxWidth: '1248px',
                          width: '100%',
                          height: '2px',
                          paddingLeft: '15px',
                          paddingRight: '15px'}">
            <v-img :src="require('@/assets/footer_divider.png')" height=2px max-width=1218px max-height=2px
                   contain/>
          </v-layout>
          <v-layout row
                    align-start
                    justify-center
                    fill-height
                    :style="{ maxWidth: '1248px',
                          width: '100%',
                          marginTop: '16px'}">
            <v-img :src="require('@/assets/neighbor_logo.png')" max-width=269px max-height=35px
                   :style="{ marginLeft: '15px'}"
                   contain/>
            <v-img :src="require('@/assets/mafra_logo.png')" max-width=147px max-height=35px
                   :style="{ marginLeft: '40px'}"
                   contain/>
            <v-spacer></v-spacer>
            <div class="footer-content">Copyright © 2019 Neighbor System. All right Reserved<br>
              서울특별시 송파구 중대로 135 IT벤처타워 동관 16층 │TEL. 02-6258-1500│FAX.02-6258-0145
            </div>
          </v-layout>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
  export default {
    data: () => {
      return {
        regions: [],
        expand: false
      }
    },
    computed: {
      introBackgroundFirstImage() {
        return require('@/assets/intro_first_background.png')
      },
      introBackgroundFourthContentImage() {
        return require('@/assets/intro_fourth_page_content_background.png')
      }
    }
  }
</script>

<style scoped>
  .header-button {
    border-radius: 10px;
    font-family: Nanum Gothic;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: -0.7px;
    text-align: center;
    color: #ffffff;
    cursor: pointer;
  }

  .first-page-title {
    padding: 0;
    font-family: Nanum Gothic;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.9px;
    text-align: center;
    color: #ffffff;
  }

  .first-page-title-large {
    font-size: 60px;
    font-weight: 800;
    letter-spacing: -3px;
  }

  .first-page-subtitle {
    max-height: 10px;
    font-family: Nanum Gothic;
    font-size: 30px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: -1.5px;
    text-align: center;
    color: #56ffdf;
  }

  .second-page-title {
    padding: 0;
    font-family: Nanum Gothic;
    font-size: 48px;
    font-weight: 800;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -1.2px;
    text-align: center;
    color: #000000;
    margin-bottom: 15px;
  }

  .second-page-subtitle {
    font-family: Nanum Gothic;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -1.6px;
    text-align: center;
    color: #4b584f;
    margin-bottom: 48px;
    margin-left: 30px;
    margin-right: 30px;
  }

  .third-page-first {
    max-width: 454px;
    margin-left: 9.375vw;
    margin-right: 5.156vw;
  }

  .third-page-second {
    margin-right: 9.375vw;
    margin-bottom: 2.031vw;
    max-width: 454px;
    float: right;
  }

  .third-page-title {
    font-family: Nanum Gothic;
    font-size: 48px;
    font-weight: 800;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: -1.2px;
    color: #000000;
  }

  .third-page-subtitle {
    margin-top: 10px;
    font-family: Nanum Gothic;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -1.6px;
    color: #000000;
  }

  .third-page-effect-content {
    margin-top: 20px;
    font-family: Nanum Gothic;
    font-size: 22px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: -2.2px;
    color: #5364b6;
  }

  .third-page-content {
    margin-top: 5px;
    font-family: Nanum Gothic;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -1.05px;
    color: #000000;
  }

  .left-align {
    text-align: left;
  }

  .right-align {
    text-align: right;
  }

  .third-button {
    font-family: Nanum Gothic;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.8px;
    text-align: center;
    color: #ffffff;
  }

  .intro >>> .v-btn {
    color: #ffffff
  }

  .fourth-page-layout {
    position: absolute;
    max-width: 1248px;
    max-height: 720px;
    width: 100%;
    height: 100%;
  }

  .fourth-page-side-layout {
    background-color: rgb(255, 255, 255);
    border-color: rgb(119, 119, 119);
    border-radius: 3px;
    border-style: solid;
    border-width: 1px;
    width: 178px;
    height: 35px;
    max-width: 178px;
    max-height: 35px;
    margin-left: 15px;
    margin-right: 15px;
  }

  .fourth-page-side-content {
    margin-left: 4px;
    font-family: Nanum Gothic;
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -1.05px;
    text-align: center;
    color: #444444;
  }

  .fourth-page-center-title {
    font-family: Nanum Gothic;
    font-size: 48px;
    font-weight: 800;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: -1.2px;
    text-align: left;
    color: #ffffff;
  }

  .fourth-page-center-subtitle {
    font-family: Nanum Gothic;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.38;
    letter-spacing: -1.2px;
    text-align: left;
    color: #ffffff;
  }

  .fifth-page-title {
    font-family: Nanum Gothic;
    font-size: 48px;
    font-weight: 800;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: -1.2px;
    text-align: left;
    color: #000000;
  }

  .fifth-page-subtitle {
    font-weight: 300;
  }

  .fifth-page-content {
    margin-top: 15px;
    font-family: Nanum Gothic;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: -1.6px;
    text-align: left;
    color: #4b584f;
  }

  .fifth-page-summary {
    margin-top: 25px;
    font-family: Nanum Gothic;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.57;
    letter-spacing: -1.05px;
    text-align: left;
    color: #4b584f;
  }

  .sixth-page-content {
    margin-top: 15px;
    font-family: Nanum Gothic;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: -1.6px;
    text-align: center;
    color: #4b584f;
  }

  .footer-content {
    margin-right: 49px;
    font-family: Nanum Gothic;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.57;
    letter-spacing: -0.35px;
    text-align: left;
    color: #444444;
  }
</style>
