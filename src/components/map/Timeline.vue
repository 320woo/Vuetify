<template>
  <div v-if="visible">
    <v-card-text>
      <v-layout>
        <v-flex xs12 sm10 offset-xs1 pl-5 mr-0>
          <v-layout row>
            <div class="customTimeline" style="left: 200px; right: 58px;">
              <div class="timeLayout">
                <v-layout column>
                  <div class="timeText">{{label[currentTick]}}</div>
                  <v-layout row>
                    <v-btn
                      style="top: 25px; background: white"
                      round
                      outline
                      icon
                      large
                      @click="timelinePlayLoop"
                    >
                      <v-icon v-if="timelinePlay">
                        pause
                      </v-icon>
                      <v-icon v-else>
                        play_arrow
                      </v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      style="top: 35px; background: white"
                      round
                      outline
                      icon
                      small
                      @click="setPlaySpeed(timeDelay - TERM_DELAY)"
                    >
                      <v-icon>
                        expand_more
                      </v-icon>
                    </v-btn>
                    <v-btn
                      style="top: 35px; background: white"
                      round
                      outline
                      icon
                      small
                      @click="setPlaySpeed(timeDelay + TERM_DELAY)"
                    >
                      <v-icon>
                        expand_less
                      </v-icon>
                    </v-btn>
                  </v-layout>
                </v-layout>
              </div>
              <div class="timeTextLeft" style="left: 1.51515%; top: 36px; margin-left: -32px; width: 70px;">
                {{ label[0]}}
              </div>
              <div class="timeTextRight" style="left: 98.4848%; top: 36px; margin-left: -32px;">
                {{ label[label.length - 1] }}
              </div>
              <div class="currentTimeTick" :style=currentTickStyle></div>
              <template v-for="(item, i) in label">
                <div class="timeTickContainer" :id="timelineContainerId+i" :style=timeTickContainerStyle(i)
                     @mousedown="timelineTickClick(i)"
                     @mouseover="timelineTickOver(i)"
                     @mouseout="timelineTickOut(i)">
                  <div class="timeTick" :id="timelineTickId+i"
                       style="margin-top: 7.5px; width: 2px; height: 15px;"></div>
                  <div class="timeTickClickRegion" :tabindex=i
                       style="top: 0px; left: 0px; width: 100%; height: 100%;"></div>
                  <div class="timeTextHover" :id="timelineTextId+i"
                       style="left: 50%; top: 43.5px; margin-left: -32px; display: none">{{item}}
                  </div>
                </div>
              </template>
            </div>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-layout
      v-if="isAvailableTiff"
      row
      wrap>
      <v-flex sm12 xs12 pt-3 mt-5>
        <v-layout column>
          <h2 class="pl-5 pt-2">체적 변화량</h2>
          <bar-chart
            :height="200"
            :data="getTimelineData"
            :options="timelineOptions">
          </bar-chart>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import BarChart from '@/components/common/BarCharts'
  import * as types from '@/vuex/mutation-types'

  const TIMELINE_SIDE_INTERVAL = 3.0303;
  const MAX_DELAY = 1200;
  const MIN_DELAY = 400;
  const TERM_DELAY = 200;

  export default {
    components: {
      BarChart
    },
    data: () => ({
      name: "Timeline",
      visible: false,
      stepSize: 1,
      max: 2,
      // progress: 8,
      // label: ['2018.09.01 12:22:21', '2018.09.02 12:22:21', '2018.09.03 12:22:21', '2018.09.04 12:22:21', '2018.09.05 12:22:21', '2018.09.06 12:22:21', '2018.09.07 12:22:21', '2018.09.08 12:22:21'],
      label: [],
      tasksId: [],
      timelineTextId: "timeMachine_customTimeline_timeText_",
      timelineTickId: "timeMachine_customTimeline_timeTick_",
      timelineContainerId: "timeMachine_customTimeline_timeTickContainer_",
      currentTick: 0,
      selectTaskId: "",
      timelinePlay: false,
      timeDelay: 600,
      runTimeout: null,
      TERM_DELAY,
      internalTimelineData: {
        // labels: ['2018.09.01', '2018.09.02', '2018.09.03', '2018.09.04', '2018.09.05', '2018.09.06', '2018.09.07', '2018.09.08'],
        labels: [],
        datasets: [
          {
            label: '체적량(㎥)',
            borderColor: '#e74c3c',
            pointBackgroundColor: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderWidth: 3,
            // data: [290, 450, 700, 670, 600, 545, 595, 655],
            data: [],
            type: 'line',
            yAxisID: 'volume'
          }
        ]
      },
      timelineOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: false,
              labelString: '날짜'
            },
            ticks: {
              autoSkip: false,
              maxRotation: 15,
              minRotation: 15
            }
          }],
          yAxes: [
            {
              display: true,
              id: 'volume',
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: '체적량(㎥)'
              },
              ticks: {
                beginAtZero: true,
                stepValue: 100,
                max: 800,
              }
            }]
        },
        title: {
          display: false,
          text: ''
        }
      }
    }),

    props: {
      timelineData: {
        type: Object
      },
    },

    created() {
      this.visible = false;

      this.initData();
    },

    destroyed() {
      if (this.runTimeout) {
        clearTimeout(this.runTimeout);
      }
    },

    methods: {
      initData() {
        console.log("[initData] ");

        if (!this.timelineData || !this.timelineData.data) return;
        this.max = this.timelineData.data.length;
        this.label = [];
        this.tasksId = [];
        this.internalTimelineData.labels = [];
        this.internalTimelineData.datasets[0].data = [];

        this.timelineData.data.forEach((item, index) => {
          console.log("[timelineData] data : ", item);
          this.label.push(item.date);
          this.tasksId.push(item.taskId);
          this.internalTimelineData.labels.push(item.date);
          this.internalTimelineData.datasets[0].data.push(item.value);

          if (this.selectTaskId) {
            if (this.selectTaskId === item.taskId) {
              this.currentTick = index;
              console.log("[currentTick] currentTick : " + this.currentTick);
            }
          }
        });
      },

      changeTimelineEnable() {
        this.visible = !this.visible;
      },

      getValue(val) {
        return this.label[val];
      },

      timeTickContainerStyle(index) {
        return "top: 0px; left: " + this.timelineLeftMargin(index) + "; width: 3.0303%; height: 59px;"
      },

      currentTickLeftMargin() {
        let lMargin;

        if (this.currentTick === 0) {
          lMargin = TIMELINE_SIDE_INTERVAL / 2;
        } else if (this.currentTick === this.label.length - 1) {
          lMargin = 100 - (TIMELINE_SIDE_INTERVAL / 2);
        } else {
          lMargin = ((this.currentTick / (this.label.length - 1)) * (100 - TIMELINE_SIDE_INTERVAL)) + (TIMELINE_SIDE_INTERVAL / 2);
        }
        // console.log("[currentTickLeftMargin] " + lMargin);
        return lMargin + "%";
      },

      timelineLeftMargin(index) {
        // (this.label.length / 100) * index;
        // console.log("[timelineLeftMargin] margin : " + (index / (this.label.length - 1)) * 100);
        let lMargin = (index / (this.label.length - 1)) * 100;
        let rMargin = (index / (this.label.length - 1)) * TIMELINE_SIDE_INTERVAL;

        if (lMargin > 0) {
          lMargin = lMargin - rMargin
        }
        // console.log("[timelineLeftMargin] margin : " + lMargin);
        return lMargin + "%"
      },

      timelineContainerOver(index) {
        console.log("[timelineContainerOver] event" + this.timelineContainerId + index);
        let div = document.getElementById(this.timelineContainerId + index);
        div.style.top = "0px";
        div.style.height = "31px";
      },

      timelineContainerOut(index) {
        console.log("[timelineContainerOut] event" + this.timelineContainerId + index);
        let div = document.getElementById(this.timelineContainerId + index);
        div.style.top = "7.5px";
        div.style.height = "15px";
      },

      timelineTickClick(index) {
        this.currentTick = index;
        this.$store.commit(types.SELECT_TASK_ID, {taskId: this.tasksId[this.currentTick]});
      },

      timelineTickOver(index) {
        // console.log("[timelineTickOver] event" + this.timelineTickId + index);
        let container = document.getElementById(this.timelineContainerId + index);
        let tick = document.getElementById(this.timelineTickId + index);
        let text = document.getElementById(this.timelineTextId + index);

        container.style.top = "-7.5px";
        // container.style.height = "31px";
        tick.style.top = "0px";
        tick.style.height = "31px";

        if (index !== 0 && index !== this.label.length - 1) {
          text.style.display = "block";
        }
      },

      timelineTickOut(index) {
        // console.log("[timelineTickOver] event" + this.timelineTickId + index);
        let container = document.getElementById(this.timelineContainerId + index);
        let tick = document.getElementById(this.timelineTickId + index);
        let text = document.getElementById(this.timelineTextId + index);

        container.style.top = "0px";
        // container.style.height = "15px";
        tick.style.top = "0px";
        tick.style.height = "15px";

        if (index !== 0 && index !== this.label.length - 1) {
          text.style.display = "none";
        }
      },

      timelinePlayLoop() {
        this.timelinePlay = !this.timelinePlay;

        if (this.timelinePlay) {
          this.play();
        } else {
          if (this.runTimeout) {
            clearTimeout(this.runTimeout);
          }
        }
      },

      play() {
        if (this.currentTick < this.label.length - 1) {
          this.currentTick++;
        } else {
          this.currentTick = 0;
        }
        this.timelineTickClick(this.currentTick);

        this.runTimeout = setTimeout(() => {
          if (this.timelinePlay) {
            this.play();
          }
        }, this.timeDelay);
      },

      setCurrentTick(taskId) {
        console.log("[setCurrentTick] taskId : " + taskId);
        if (this.tasksId.length > 0) {
          this.currentTick = this.tasksId.findIndex((a) => {
            return a === taskId;
          });

          console.log("[setCurrentTick] this.currentTick : " + this.currentTick);
        } else {
          this.selectTaskId = taskId;
          console.log("[setCurrentTick] this.selectTaskId : " + this.selectTaskId);
        }
      },

      setPlaySpeed(speed) {
        if (speed >= MIN_DELAY && speed <= MAX_DELAY) {
          this.timeDelay = speed;
        }
        console.log("[setPlaySpeed] this.timeDelay : " + this.timeDelay);
      }
    },

    computed: {
      isEnableTimeLayer() {
        console.log("[isEnableTimeLayer]");
        return this.$store.getters.isEnableTimeLayer;
      },

      getTimelineData() {
        return this.internalTimelineData
      },

      isAvailableTiff() {
        return this.$store.getters.isAvailableDsmTiff;
      },

      currentTickStyle() {
        return "top: 0px; left: " + this.currentTickLeftMargin() + "; width: 10px; height: 31px; margin-left: -5px;"
      },

      getSelectTaskId() {
        console.log("[getSelectTaskId] " + this.$store.getters.getSelectTaskId);
        this.setCurrentTick(this.$store.getters.getSelectTaskId);
        // return this.$store.getters.getSelectTaskId;
      },
    },

    watch: {
      isEnableTimeLayer() {
        console.log("[isEnableTimeLayer] watch");
        this.changeTimelineEnable();
      },

      getSelectTaskId(val, oldVal) {
        console.log("[getSelectTaskId] val : " + val);
        // this.setCurrentTick(val);
      },

      'timelineData.data': function (val, oldVal) {
        console.log("[timelineData] ", val);
        this.initData();
      },
    }

  }
</script>

<style scoped>
  .customControl {
    position: absolute;
    background-color: rgba(255, 255, 255, 0);
    height: 60px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    width: auto;
    z-index: 19;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
  }

  .customTimeline {
    position: absolute;
    height: inherit;
    margin-top: 0px;
    width: auto;
  }

  .timeTextLeft {
    position: absolute;
    font-size: 10pt;
    text-shadow: -1px 0 #656565, 0 1px #656565, 1px 0 #656565, 0 -1px #656565, 2px 2px 3px rgba(0, 0, 0, 0.3);
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    color: white;
    font-weight: normal;
    cursor: default;
  }

  .timeTextRight {
    position: absolute;
    font-size: 10pt;
    text-shadow: -1px 0 #656565, 0 1px #656565, 1px 0 #656565, 0 -1px #656565, 2px 2px 3px rgba(0, 0, 0, 0.3);
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    color: white;
    font-weight: normal;
    cursor: default;
  }

  .currentTimeTick {
    position: absolute;
    border: 1px solid #656565;
    background-color: white;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    z-index: 5;
  }

  .timeTickContainer {
    position: absolute;
    border: 0px;
  }

  .timeTick {
    margin: 0px auto;
    border: 1px solid #656565;
    background-color: white;
    opacity: 1;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
  }

  .timeTickClickRegion {
    position: absolute;
    border: 0px;
    opacity: 0;
    cursor: pointer;
    z-index: 6;
  }

  .timeTextHover {
    position: absolute;
    font-size: 10pt;
    text-shadow: -1px 0 #656565, 0 1px #656565, 1px 0 #656565, 0 -1px #656565, 2px 2px 3px rgba(0, 0, 0, 0.3);
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    color: white;
    font-weight: normal;
    cursor: default;
    z-index: 1;
    opacity: 1;
    cursor: pointer;
    display: none;
  }

  .timeText {
    position: absolute;
    top: 0px;
    width: 158px;
    font-size: 14pt;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
    font-family: Arial, Helvetica, sans-serif;
    padding: 5px;
    color: #656565;
    font-weight: normal;
    background-color: white;
    border: 1px solid #656565;
    z-index: 9;
    border-radius: 3px;
    cursor: default;
    text-align: left;
  }

  .timeLayout {
    position: absolute;
    left: -180px;
  }
</style>
