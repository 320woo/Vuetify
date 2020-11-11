<template>
  <div class="font1">
    <!--<v-card color='white' height='300' elevation='24'>-->
    <!-- <v-card color='white'> -->
      <!-- <v-card-text class='px-0'> -->
    <v-card class="text-left elevation-3" height="150px">
      <v-card-title style="background-color:#E0E0E0; border: #2b2b2b">
        <div>
          위치 : (위도) {{ x_latitude.toFixed(6) }} (경도) {{ y_longitude.toFixed(6) }} <br/> 도시명 : {{ addressName }}</div>
      </v-card-title>
      <v-card-text>
        현재 날씨 : 온도 : {{ current_temparature }} ℃ / 습도 : {{ current_humidity }} % / 강수량 : {{ current_precipitation }} mm / 강수형태 : {{ current_precipitation_type }}
      </v-card-text>
    </v-card>
    <div style="color: #42A5F5; margin-top: 10px; margin-bottom: 10px">[예보]</div>
        <div class="divTable blueTable font1 elevation-2">
        <div class="divTableHeading font1 elevation-2" style="background-color:#81C784; border-left: #000000;">
        <div class="divTableRow font1 elevation-2" style="background-color:#81C784">
        <div class="divTableHead">날씨<br />강수확률</div>
        <div class="divTableHead">0시</div>
        <div class="divTableHead">3시</div>
        <div class="divTableHead">6시</div>
        <div class="divTableHead">9시</div>
        <div class="divTableHead">12시</div>
        <div class="divTableHead">15시</div>
        <div class="divTableHead">18시</div>
        <div class="divTableHead">21시</div>
        </div>
        </div>
        <div class="divTableBody font1 elevation-2" v-for="(day, i) in forecast" :key="i">
        <div class="divTableRow font1 elevation-2">
        <!-- TODO : image 중앙정렬 처리해야 함 -->
        <div class="divTableCell">{{ getConverterDateFormat(day.day) }}<br />{{ day.low }}℃~{{ day.high }}℃</div>
        <div class="divTableCell"><v-img :src="get_sky_image(0, day.sky[0])" class="weather_img"></v-img><br /> {{ day.rain[0] }} </div>
        <div class="divTableCell"><v-img :src="get_sky_image(0, day.sky[1])" class="weather_img"></v-img><br /> {{ day.rain[1] }} </div>
        <div class="divTableCell"><v-img :src="get_sky_image(1, day.sky[2])" class="weather_img"></v-img><br /> {{ day.rain[2] }} </div>
        <div class="divTableCell"><v-img :src="get_sky_image(1, day.sky[3])" class="weather_img"></v-img><br /> {{ day.rain[3] }} </div>
        <div class="divTableCell"><v-img :src="get_sky_image(1, day.sky[4])" class="weather_img"></v-img><br /> {{ day.rain[4] }} </div>
        <div class="divTableCell"><v-img :src="get_sky_image(1, day.sky[5])" class="weather_img"></v-img><br /> {{ day.rain[5] }} </div>
        <div class="divTableCell"><v-img :src="get_sky_image(1, day.sky[6])" class="weather_img"></v-img><br /> {{ day.rain[6] }} </div>
        <div class="divTableCell"><v-img :src="get_sky_image(0, day.sky[7])" class="weather_img"></v-img><br /> {{ day.rain[7] }} </div>
        </div>
        </div>
        </div>
    <!-- </v-card-text> -->
    <!-- </v-card> -->
  </div>
</template>

<script>
  import weatherAPI from '@/utils/api/weatherAPI';

  export default {
    name: 'WeatherWidget',
    components: {},
    props: [
      'latitude',
      'longitude',
      'addressName'
    ],
    data: () => ({
      x_latitude: '',
      y_longitude: '',
      city: '', // 도시명
      current_temparature: '', // 온도
      current_precipitation: '', // 강수량
      current_precipitation_type: '', // 강수형태 : 없음(0), 비(1), 비/눈(2), 눈(3)
      current_humidity: '', // 습도
      forecast: [
        {
          day: '',
          low: '',
          high: '',
          sky: [], // 0시, 3시, 6시, 9시, 12시, 15시, 18시, 21시
          rain: [] // 0시, 3시, 6시, 9시, 12시, 15시, 18시, 21시
        },
        {
          day: '',
          low: '',
          high: '',
          sky: [], // 0시, 3시, 6시, 9시, 12시, 15시, 18시, 21시
          rain: [] // 0시, 3시, 6시, 9시, 12시, 15시, 18시, 21시
        }
      ]
    }),
    created() {
      if (this.latitude === undefined || this.longitude == undefined) {
        this.getLocation();
      } else {
        this.x_latitude = this.latitude;
        this.y_longitude = this.longitude;
        console.log('latitude==>', this.latitude, ", longitude==>", this.longitude)
        this.getWeather_KMS();
      }
    },
    methods: {
      get_precipitation_type: function (type) {
        if (type == 1) return '비';
        else if (type == 2) return '비/눈';
        else if (type == 3) return '눈';
        return '없음';
      },
      get_sky_status: function (value) {
        if (value == 1) return '맑음';
        else if (value == 2) return '구름조금';
        else if (value == 3) return '구름많음';
        else if (value == 4) return '흐림';
      },
      get_sky_image: function (ampm, value) {
        if (value === undefined) return ''

        let img_src = new String()
        if (ampm == 0) {
          // 밤 ( for moon )
          img_src = `sky-moon-0${value}.png`
        } else {
          img_src = `sky-sun-0${value}.png`
        }
        console.log(img_src)
        return require('@/assets/' + img_src)
      },
      date2str: function (x, y) {
        let z = {
          M: x.getMonth() + 1,
          d: x.getDate(),
          h: x.getHours(),
          m: x.getMinutes(),
          s: x.getSeconds()
        };
        y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
          return ((v.length > 1 ? '0' : '') + eval('z.' + v.slice(-1))).slice(-2);
        });

        return y.replace(/(y+)/g, function (v) {
          return x
            .getFullYear()
            .toString()
            .slice(-v.length);
        });
      },
      getWeather_KMS: async function () {
        //for (let try_cnt = 0; try_cnt < 10; try_cnt++)
        {
          const ONE_HOUR = 1 * 60 * 60 * 1000; // ms
          let now = new Date();
          let query_time = new Date(now.getTime() - ONE_HOUR);
          let is_success = false;

          try {
            // 초단기실황조회.
            let result = await weatherAPI.getWeatherInfo(
              'ForecastGrib',
              this.date2str(query_time, 'yyyyMMdd'),
              this.date2str(query_time, 'hh00'),
              this.y_longitude,
              this.x_latitude
            );
            if (result.response.header.resultCode == '00') {
              for (let i in result.response.body.items.item) {
                if (result.response.body.items.item[i].category == 'T1H') {
                  this.current_temparature =
                    result.response.body.items.item[i].obsrValue;
                  is_success = true;
                }
                if (result.response.body.items.item[i].category == 'RN1') {
                  this.current_precipitation =
                    result.response.body.items.item[i].obsrValue;
                }
                if (result.response.body.items.item[i].category == 'PTY') {
                  this.current_precipitation_type = this.get_precipitation_type(
                    result.response.body.items.item[i].obsrValue
                  );
                }
                if (result.response.body.items.item[i].category == 'REH') {
                  this.current_humidity =
                    result.response.body.items.item[i].obsrValue;
                }
              }
            }
            // if (is_success) {
            //   break;
            // }
          } catch (err) {
            console.warn(err);
          }
        }

        // for (let try_cnt = 0; try_cnt < 1; try_cnt++)
        {
          // 동네예보 조회.
          // 02시,05시,08시,11시,14시,17시,20시,23시 에 발표됨.

          const ONE_HOUR = 1 * 60 * 60 * 1000; // ms
          let now = new Date();
          let query_time = new Date(now.getTime());  // 현재새간
          let is_success = false;

          let hour = query_time.getHours()
          let hhmm = ''
          let yyyyMMdd = ''
          // 조회 기준시간을 발표시간인 02시,05시,08시,11시,14시,17시,20시,23시 로 맞추기 위해
          if (hour < 2) {
            query_time = new Date(now.getTime() - 2 * ONE_HOUR);  // 2시간 전 (하루 전 날짜로 세팅)
            hhmm = "2300"
          } else {
            hour = Math.floor(hour / 3) * 3 - 1
            if (hour < 10) {
              hhmm = "0" + hour + "00"
            } else {
              hhmm = hour + "00"
            }
          }
          yyyyMMdd = this.date2str(query_time, 'yyyyMMdd')

          try {
            // 동네예보 조회.
            let result = await weatherAPI.getWeatherInfo(
              'ForecastSpaceData',
              yyyyMMdd,
              hhmm,
              this.y_longitude,
              this.x_latitude
            );
            // console.log('weather_result ==> ', result);
            if (result.response.header.resultCode == '00') {
              // category에 따라 조회되는 날짜, 시간, 갯수가 모두 다름...
              let day_cnt = 0;
              for (let i in result.response.body.items.item) {
                  if (result.response.body.items.item[i].category == 'TMN') {
                  // 아침 최저기온 (2일분량의 data가 수신되는 것을 가정하여 구현. TODO: data 수신 문제에 대한 예외처리 구현 필요)
                  day_cnt++;
                  this.forecast[day_cnt - 1].day = result.response.body.items.item[i].fcstDate;
                  this.forecast[day_cnt - 1].low = result.response.body.items.item[i].fcstValue;
                  is_success = true;
                }
              }
              day_cnt = 0;
              for (let i in result.response.body.items.item) {
                  if (result.response.body.items.item[i].category == 'TMX') {
                  // 낮 최고 기온 (2일분량의 data가 수신되는 것을 가정하여 구현. TODO: data 수신 문제에 대한 예외처리 구현 필요)
                  day_cnt++;
                  if(day_cnt < 3) { // 2건만 처리
                      this.forecast[day_cnt - 1].high = result.response.body.items.item[i].fcstValue;
                  }
                }
              }
              day_cnt = 0;
              let hour_cnt = 0;
              for (let i in result.response.body.items.item) {
                if (result.response.body.items.item[i].category == 'POP') {
                  // 강수확률 (3시간마다. 2일분량의 data가 수신되는 것을 가정하여 구현. TODO: data 수신 문제에 대한 예외처리 구현 필요)
                  hour_cnt++;
                  if (hour_cnt <= 8) {
                    day_cnt = 1;
                    this.forecast[day_cnt - 1].rain[hour_cnt - 1] = result.response.body.items.item[i].fcstValue + '%';
                  } else {
                    day_cnt = 2;
                    if (hour_cnt <= 16) {
                      this.forecast[day_cnt - 1].rain[hour_cnt - 9] = result.response.body.items.item[i].fcstValue + '%';
                    }
                  }
                }
              }
              day_cnt = 0;
              hour_cnt = 0;
              for (let i in result.response.body.items.item) {
                if (result.response.body.items.item[i].category == 'SKY') {
                  // 하늘상태 (3시간마다. 2일분량의 data가 수신되는 것을 가정하여 구현. TODO: data 수신 문제에 대한 예외처리 구현 필요)
                  hour_cnt++;
                  if (hour_cnt <= 8) {
                    day_cnt = 1;
                    // this.forecast[day_cnt - 1].sky[hour_cnt - 1] = this.get_sky_status(result.response.body.items.item[i].fcstValue);
                    this.forecast[day_cnt - 1].sky[hour_cnt - 1] = result.response.body.items.item[i].fcstValue;
                  } else {
                    day_cnt = 2;
                    if (hour_cnt <= 16) {
                      // this.forecast[day_cnt - 1].sky[hour_cnt - 9] = this.get_sky_status(result.response.body.items.item[i].fcstValue);
                      this.forecast[day_cnt - 1].sky[hour_cnt - 9] = result.response.body.items.item[i].fcstValue;
                    }
                  }
                }
              }
            }
            // if (is_success) {
            //   break;
            // }
          } catch (err) {
            console.warn(err);
          }
        }
      },
      getLocation_backup: function () {
        // browser location 정보 조회 실패시 외부 API로 2차 시도..
        const http = require('http');

        http
          .get('http://ip-api.com/json', resp => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', chunk => {
              data += chunk;
            });

            // The whole response has been received.
            resp.on('end', () => {
              let oData = JSON.parse(data);
              this.x_latitude = parseFloat(oData.lat).toFixed(4);
              this.y_longitude = parseFloat(oData.lon).toFixed(4);
              this.city = oData.city;

              this.getWeather_KMS();
            });
          })
          .on('error', err => {
            console.warn('Error: ' + err.message);
          });
      },
      getLocation: function () {
        if (!navigator.geolocation) {
          this.errorMsg = 'Geolocation is not supported by your browser';
          console.warn(this.errorMsg);

          this.getLocation_backup();
          return;
        }
        let options = {timeout: 10000};
        navigator.geolocation.getCurrentPosition(
          this.getLocation_success,
          this.getLocation_error,
          options
        );
      },
      getLocation_success: function (position) {
        console.log(position);
        this.x_latitude = position.coords.latitude;
        this.y_longitude = position.coords.longitude;
        this.x_latitude = parseFloat(this.x_latitude).toFixed(4);
        this.y_longitude = parseFloat(this.y_longitude).toFixed(4);

        this.getWeather_KMS();
      },
      getLocation_error: function (err) {
        this.errorMsg = 'Unable to retrieve your location';
        console.warn(this.errorMsg);

        this.getLocation_backup();
      },
      getIntroImages: function (index) {
        return require('@/assets/' + this.introImages[index].src);
      },
      getConverterDateFormat(date) {
        let strDate = new String(date)
        let year = strDate.substring(0, 4)
        let month = strDate.substring(4, 6)
        let day = strDate.substring(6, 8)

        return `${year}.${month}.${day}`
      }
    },
    computed: {},
    watch: {
      latitude(val) {
        console.log('[latitude] val ; ', val)
        if (val) {
          this.x_latitude = val
        }
      },

      longitude(val) {
        console.log('[longitude] val ; ', val)
        if (val) {
          this.y_longitude = val
          this.getWeather_KMS();
        }
      }
    }
  };
</script>

<style scoped>
@font-face {
  font-family: 'TmoneyRoundWindExtraBold';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-07@1.0/TmoneyRoundWindExtraBold.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
div.blueTable {
  font-family: 굴림;
  background-color: #FFFFFF;
  width: 100%;
  text-align: center;
  border-collapse: collapse;
  border-left: #000000;
}
.divTable.blueTable .divTableCell, .divTable.blueTable .divTableHead {
  border: 1px solid #000000;
  padding: 9px 1px;
}
.divTable.blueTable .divTableBody .divTableCell {
  font-size: 12px;
}
.divTable.blueTable .divTableRow:nth-child(even) {
  background: #D0E4F5;
}
.divTable.blueTable .divTableHeading {
  background: #81C784;
  border-bottom: 1px solid #444444;
}
.divTable.blueTable .divTableHeading .divTableHead {
  text-align: center;
  color: #FFFFFF;
  align: center;
}

.blueTable .tableFootStyle {
  font-size: 14px;
}
.blueTable .tableFootStyle .links {
	 text-align: right;
}
.blueTable .tableFootStyle .links a{
  display: inline-block;
  background: #81C784;
  color: #FFFFFF;
  padding: 2px;
  border-radius: 10px;
}
.blueTable.outerTableFooter {
  border-top: none;
}
.blueTable.outerTableFooter .tableFootStyle {
  padding: 3px 5px;
}
/* DivTable.com */
.divTable{ display: table; }
.divTableRow { display: table-row; }
.divTableHeading { display: table-header-group;}
.divTableCell, .divTableHead { display: table-cell;}
.divTableHeading { display: table-header-group;}
.divTableFoot { display: table-footer-group;}
.divTableBody { display: table-row-group;}

.weather_img{
  margin:0 auto;
  max-width: 30px;
  color: #65ec00;
}
.font1{
  font-family: 'GmarketSansMedium';
}
.text-left{
  text-align: left;
}
</style>
