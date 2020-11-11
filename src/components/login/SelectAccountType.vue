<template>
  <v-app id="selectAccountType">
    <v-container>
      <v-layout row justify-center ma-5>
          <h1>회원 가입</h1>
      </v-layout>
      <v-layout row justify-center wrap>
        <v-flex xs12>
          <iframe 
            src="/static/terms_policy_user.html"
            width="45%"
            height="400"
          >
          </iframe>
          <span style="margin-left:5%"></span>
          <iframe 
            src="/static/terms_policy_provider.html"
            width="45%"
            height="400"
          >
          </iframe>
        </v-flex>
        <v-flex xs6>
          <v-checkbox label="사용자 약관 동의" v-model="agree_user"></v-checkbox>
        </v-flex>
        <v-flex xs6>
          <v-checkbox label="공급자 약관 동의" v-model="agree_policy"></v-checkbox>
        </v-flex>
      </v-layout>
      <v-layout justify-center row>
        <v-btn to="/createUserAccount" :disabled="!agree_user">사용자</v-btn>
        <v-btn to="/createProviderAccount" :disabled="!agree_policy">공급자</v-btn>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
  export default {
    name: "SelectAccountType",
    data: () => {
      return {
        agree_user: false,
        agree_policy: false
      }
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>
