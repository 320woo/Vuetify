<template>
  <v-card class="task-status-card" :color="this.color">
    <v-container fluid wrap class="pa-2">
      <v-layout column wrap align-center justify-center>
        <img :src="this.icon" />
        <v-layout class="white--text pt-1">
          {{ this.message }}
        </v-layout>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: ["status"],
  data() {
    return {
      message: "",
      icon: "",
      color: ""
    }
  },
  watch: {
    status() {
      this._calStatus(this.status)
    }
  },
  mounted() {
    this._calStatus(this.status)
  },
  computed: {
    getCompleteIcon() {
      return require("@/assets/icon/complete.png")
    },
    getQueuedIcon() {
      return require("@/assets/icon/queued.png")
    },
    getWorkingIcon() {
      return require("@/assets/icon/working.png")
    }
  },
  // 0:요청/1:준비중/2:진행중/3:완료/4:취소
  methods: {
    _calStatus(status) {
      switch (status) {
        case 0:
          this.message = "요청"
          this.icon = this.getQueuedIcon
          this.color = "cyan"
          break
        case 1:
          this.message = "준비중"
          this.icon = this.getQueuedIcon
          this.color = "cyan"
          break
        case 2:
          this.message = "진행중"
          this.icon = this.getWorkingIcon
          this.color = "indigo"
          break
        case 3:
          this.message = "완료"
          this.icon = this.getCompleteIcon
          this.color = "green"
          break
        case 4:
          this.message = "취소"
          this.icon = this.getCompleteIcon
          this.color = "orange"
          break
        default:
          this.message = "준비중"
          this.icon = this.getQueuedIcon
          this.color = "cyan"
      }
    }
  }
}
</script>

<style scoped>
.task-status-card {
  border-radius: 5px 0 10px 10px;
}
</style>
