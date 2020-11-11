<template>
  <v-container>
    <v-layout column wrap>
      <v-flex>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field
              label="날짜"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="시간"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field
              label="지역"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="영역"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-flex py3>
          <v-divider></v-divider>
        </v-flex>

        <v-btn color="blue darken-1" flat @click="">닫기</v-btn>
        <v-btn color="blue darken-1" flat @click="">가져오기</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    export default {
        name: "UploadHistory"
    }
</script>

<style scoped>

</style>
