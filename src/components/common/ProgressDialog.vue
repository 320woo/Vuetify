<template>
  <v-layout row justify-center>
    <v-dialog v-model="isShowDialog" persistent content content-class="centered-dialog" max-width="360">
      <v-card>
        <v-card-title>
          <v-container fill-height>
            <v-layout column justify-center align-center>
              <v-progress-circular v-if="!isPositiveButton" indeterminate :size="70" :width="7"
                                   color="purple"></v-progress-circular>
              <h1>{{message}}</h1>
            </v-layout>
          </v-container>
        </v-card-title>
        <v-card-actions
          v-if="isPositiveButton"
          align-center
          justify-center>
          <v-spacer></v-spacer>
          <v-btn flat color="orange" @click="close()">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    name: "ProgressDialog",
    props: {
      isShowDialog: {
        type: Boolean,
        default: false
      },

      message: {
        type: String,
        default: "요청중입니다."
      },

      isPositiveButton: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      close() {
        this.isShowDialog = false
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>
  .parent {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }

  .loading-dialog {
    background-color: #303030;
  }

  .dialog {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }

  .centered-dialog,
  .v-dialog.centered-dialog {
    background: #282c2dad;
    box-shadow: none;
    border-radius: 6px;
    width: 360px;
    color: whitesmoke;
  }

  /*.dialogBackground {*/
  /*  background: whitesmoke*/
  /*}*/
</style>
