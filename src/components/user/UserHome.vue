/* eslint-disable vue/no-unused-vars */ /* eslint-disable vue/valid-v-on */
<template>
  <!------------------------ 사용자 홈화면에 채울 내용 ----------BEGIN--------------->
  <v-app>
    <v-container fluid id="back">
      <v-layout row wrap>
        <v-flex pa-3 xs6>
          <h3 style="text-align: center" class="font1">내 관리 영역 &nbsp;<v-icon color="black">desktop_mac</v-icon></h3>
          <br/>
          <HomeMap id="homeMap" parent-name="UserHome" :area-list="areaList"
                   @onClickMarker="onClickMarker"/>
          <div>
            <!-- 지도상에 Polygon 으로 영역 표시 (추가/삭제도 가능하도록). 여러개
            표시될 수 있음. -->
            <br/>
            <!-- 추후 기능 추가해야함... -->
<!--            <v-btn to="/areaMission">-->
<!--              영역중 하나를 클릭하면..해당 영역의 상세 목록이-->
<!--              펼쳐지도록..-->
<!--            </v-btn>-->
          </div>
        </v-flex>
        <v-flex pa-3 xs6 class="font1">
          <h3 style="text-align: center">현재 지역 날씨 &nbsp<v-icon color="light-blue lighten-1"> cloud</v-icon></h3>
          <br/>
          <WeatherWidget :longitude="weatherLongitude" :latitude="weatherLatitude" :address-name="addressName"/>
        </v-flex>
        <v-flex pa-3 xs6 class="font1">
          <h3 style="text-align: center">영농 일지&nbsp;<v-icon color="green darken-2">today</v-icon></h3>
          <br/>
          <v-data-table class="elevation-3 back"
            :headers="diary_headers"
            :items="farmDiary"
            :loading="diaryLoading"
            item-key="diary_id"
          >
            <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
            <template v-slot:items="props">
              <tr class="elevation-3 white--text" @click="$router.push(farmDiaryRoute(props.item))">
                <td class="white--text">{{ props.item.subject }}</td>
                <td class="text-xs-left elevation-3 white--text">{{ props.item.area_name }}</td>
                <td class="text-xs-right elevation-3 white--text">{{ convertDate(props.item.working_date) }}</td>
              </tr>
            </template>
          </v-data-table>
          <div class="text-xs-center pt-2">
            <v-pagination
              v-model="farmDiaryPagination.page"
              :length="farmDiaryPagination.pageLength"
              @input="farmDiaryPageChanged"
            ></v-pagination>
          </div>
        </v-flex>
        <v-flex pa-3 xs6 class="font1">
          <h3 style="text-align:center">나의 관심 작물 정보&nbsp<v-icon color="orange darken-2">search</v-icon></h3>
            <CropDiseaseList/>
        </v-flex>
        <v-flex pa-3 xs6>
          <div class="text-xs-center font1">
            <h3>농진청 제공 주간농사정보 &nbsp<v-icon color="blue">cloud_download</v-icon></h3>
            <br/>
            <WeekFarmInfoList/>
            <v-pagination
              class="text-center"
              v-model="page"
              :length="3"
              @input=""
            ></v-pagination>
          </div>
        </v-flex>
        <v-flex pa-3 xs6>
         <div class="text-xs-center font1">
          <h3>농진청 제공 병해충 발생정보 &nbsp<v-icon color="blue">cloud_download</v-icon></h3>
           <br/>
          <HarmfulInsectOccurInfoList/>
          <v-pagination
            class="text-center"
            v-model="page1"
            :length="3"
            @input=""
          ></v-pagination>
         </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
  <!------------------------ 사용자 홈화면에 채울 내용 -----------END---------------->
</template>

<script>
  import dbAPI from '@/utils/api/dbAPI'
  import HomeMap from '@/components/common/HomeMap'
  import WeatherWidget from '@/components/common/WeatherWidget'
  import CropDiseaseList from '@/components/common/CropDiseaseList'
  import WeekFarmInfoList from '@/components/common/WeekFarmInfoList'
  import HarmfulInsectOccurInfoList from '@/components/common/HarmfulInsectOccurInfoList'
  import AddressAPI from '@/utils/api/addressAPI/'
  import StringUtils from '@/utils/utils/stringUtil'

  export default {
    name: 'UserHome',
    components: {
      HomeMap,
      WeatherWidget,
      CropDiseaseList,
      WeekFarmInfoList,
      HarmfulInsectOccurInfoList
    },
    data: () => ({
      page: 1,
      page1: 1,
      items: [
        { text: '홈', url: '/userHome' },
        { text: '작업 요청 내역', url: '/schedule_user' },
        { text: '영역별 임무', url: '/areaMission' },
        { text: '영농 일지', url: '/farmDiary' },
        { text: '공급자 목록', url: '/providerList' }
      ],
      areaList: [],
      farm_diary: [],
      // filter_farm_diary: [],
      expand: true,
      diaryLoading: false,
      diary_headers: [
        { text: 'Subject', align: 'left', sortable: false, value: 'subject' },
        { text: 'Area', value: 'area_name', sortable: false },
        { text: 'Time', value: 'working_date', sortable: false}
      ],
      farmDiaryPagination: {
        page: 1,
        pageLength: 0,
        pageLimit: 3,
        rowsPerPage: -1
      },
      weatherLatitude: 35.672914,
      weatherLongitude: 128.471841,
      addressName: '',
      areaId: -1
    }),
    async created() {
      this.farmDiaryPagination.pageLength = 0
      this.farmDiaryPagination.page = 1

      await this.loadArea()
    },
    methods: {
      async farmDiaryPageChanged(page) {
        console.log('new page: ', page)
        await this.loadDiaries()
      },
      farmDiaryRoute(item) {
        return {
          name: 'farmDiary',
          query: { diary_id: item.diary_id }
        }
      },
      async loadAreaFarmDiaryCount() {
        try {
          const result = await dbAPI.query('select.farm_diary.me.count.area', {
            area_id: this.areaId
          })
          console.log('[loadAreaFarmDiaryCount] result.rowCount : ' + result.rowCount)
          console.log('[loadAreaFarmDiaryCount] result.[0].rowCount : ' + result.rows[0].count)

          if (result.rowCount === 1) {
            this.farmDiaryPagination.pageLength = Math.ceil(
              result.rows[0].count / this.farmDiaryPagination.pageLimit
            )
            console.log(
              `total pages: ${this.farmDiaryPagination.pageLength} / ${result.rows[0].count}`
            )
          }
        } catch (err) {
          console.log(err)
        }
      },
      async loadArea() {
        try {
          let result = await dbAPI.query('select.area.me', {})
          this.areaList = result.rows
          // this.areaBoundaryList = this.areaInfo.map((data) => {
          //   return data.area_boundary.area
          // })

          await this.onClickMarker(0)
          console.log('[loadArea] this.areaList : ', this.areaList)
        } catch (err) {
          console.log(err)
        }
      },
      async loadDiaries() {
        this.diaryLoading = true

        let result = await dbAPI.query('select.farm_diary.me.paging.area', {
          area_id: this.areaId,
          limit: this.farmDiaryPagination.pageLimit,
          offset:
            this.farmDiaryPagination.pageLimit *
            (this.farmDiaryPagination.page - 1)
        })
        this.farmDiary = result.rows
        this.loadAreaFarmDiaryCount()
        this.setDiaries()
        console.log('this.farm_diary', this.farmDiary)
      },

      setDiaries() {
        console.log('[setDiaries] this.farm_diary : ', this.farmDiary)

        this.farmDiaryPagination.pageLength = Math.ceil(
          this.farmDiary.length / this.farmDiaryPagination.pageLimit
        )
        this.diaryLoading = false
      },

      async onClickMarker(markerId) {
        console.log('[onClickMarker] markerId : ' + markerId)

        let area = this.areaList[markerId]
        this.areaId = area.area_id
        console.log('[onClickMarker] area : ', area)

        let longitude = area.area_boundary.area[0][0].longitude
        let latitude = area.area_boundary.area[0][0].latitude

        this.weatherLongitude = longitude
        this.weatherLatitude = latitude
        await AddressAPI.requestGetReverseGeoData(longitude, latitude,
          (success) => {
            console.log('[requestGetReverseGeoData] success : ', success)
            this.addressName = success.result[0].text
          },
          () => {
            console.log('[requestGetReverseGeoData] fail')
          }
        )

        if (this.areaId >= 0) {
          this.loadDiaries()
        }
      },

      convertDate(date) {
        return StringUtils.getConvertDate(date)
      }
    },
    computed: {
      farmDiary: ({
        get() {
          return this.farm_diary
        },
        set(val) {
          this.farm_diary = val
        }
      })
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
  .content_wrap {
    background-color: #f3f6ff;
  }

  .img_size {
    width: 26px;
  }
  .white--text{
    color: #FFFFFF;
    font-size: 13px
  }

  .ql-editor >>> img {
    max-width: 100%;
  }
  #homeMap{
    height: 420px;
  }
  #back{
    background-color: #f3f6ff;
  }
  .font1{
    font-family: 'GmarketSansMedium';
  }
  .back >>> .theme--light.v-table thead tr:first-child{
    background: #81C784;
  }
  .back >>> .theme--light.v-table thead th {
    color: #FFFFFF;
    font-size: 15px;
  }
</style>
