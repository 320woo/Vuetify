<template>
  <v-card class="task-status-card"
    :color="this.color">
    <v-container fluid wrap class="pa-2">
      <v-layout column
                wrap
                align-center
                justify-center>
        <img :src="this.icon">
        <v-layout class="white--text pt-1">
          {{ this.message }}
        </v-layout>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
  export default {
    props: ['status'],
    data() {
      return {
        message: '',
        icon: '',
        color: '',
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
        return require('@/assets/icon/complete.png')
      },
      getQueuedIcon() {
        return require('@/assets/icon/queued.png')
      },
      getWorkingIcon() {
        return require('@/assets/icon/working.png')
      },
    },
    methods: {
      _calStatus(status) {
        switch (status) {
          case 10:
            this.message = '대기중';
            this.icon = this.getQueuedIcon;
            this.color = 'cyan';
            break;
          case 20:
            this.message = '작업중';
            this.icon = this.getWorkingIcon;
            this.color = 'indigo';
            break;
          case 30:
            this.message = '실패';
            this.icon = this.getCompleteIcon;
            this.color = 'red';
            break;
          case 40:
            this.message = '완료';
            this.icon = this.getCompleteIcon;
            this.color = 'green';
            break;
          case 50:
            this.message = '취소됨';
            this.icon = this.getCompleteIcon;
            this.color = 'orange';
            break;
          default:
            this.message = '대기중';
            this.icon = this.getQueuedIcon;
            this.color = 'cyan';
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
