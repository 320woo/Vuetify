<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">영역별 History</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <!-- 내용 넣기 -->
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closePopup()">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    name: "AreaHistoryDialog",
    data: () => ({
      dialog: false
    }),
    created() {
      console.log("[created] ")
      this.dialog = true
    },
    methods: {
      closePopup() {
        this.dialog = false
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>

</style>
