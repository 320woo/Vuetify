<template>
  <v-app id="createUserAccount">
    <v-container>
      <v-layout column align-center>
        <v-flex>
          <h1>사용자 회원가입</h1>
        </v-flex>
      </v-layout>
      <v-form ref="form"
              v-model="valid"
              lazy-validation>
        <v-layout row
                  justify-center>
          <v-flex xs8>
            <v-layout row wrap>
              <v-text-field v-model="user.account_id"
                            :rules="[rules.required]"
                            label="아이디"
                            placeholder="아이디"
                            required>
              </v-text-field>
              <v-btn :disabled="!user.account_id" @click="checkDuplicate(user.account_id)">중복확인</v-btn>
            </v-layout>
            <v-text-field v-model="user.password"
                          :rules="[rules.required, rules.min]"
                          label="비밀번호"
                          placeholder="비밀번호"
                          hint="4글자 이상 입력해주세요."
                          type="password"
                          required>
            </v-text-field>
            <v-text-field v-model="user.full_name"
                          :rules="[rules.required]"
                          label="성명"
                          placeholder="성명"
                          required>
            </v-text-field>
            <v-text-field v-model="user.email"
                          :rules="[rules.required, rules.email]"
                          label="이메일"
                          placeholder="이메일"
                          required>
            </v-text-field>
            <v-text-field v-model="user.tel_num"
                          :rules="[]"
                          label="전화번호"
                          placeholder="전화번호"
                          required>
            </v-text-field>
            <v-layout row wrap>
              <v-text-field v-model="user.post_num"
                            :rules="[]"
                            label="우편번호"
                            placeholder="우편번호"
                            readonly>
              </v-text-field>
              <v-dialog v-model="dialog"
                        scrollable
                        width="500">
                <template v-slot:activator="{ on }">
                  <v-btn color="red lighten-2"
                         dark
                         v-on="on">
                    우편번호 검색
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title>
                    우편번호 검색
                  </v-card-title>
                  <v-card-text>
                    <DaumPostcode :on-complete="setDetailAddress" />
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn color="taskButton"
                           flat
                           @click="dialog = false">
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-layout>

            <v-text-field v-model="user.address_basic"
                          :rules="[]"
                          label="주소"
                          placeholder="주소"
                          readonly>
            </v-text-field>
            <v-text-field v-model="user.address_detail"
                          :rules="[]"
                          label="상세주소"
                          placeholder="상세주소">
            </v-text-field>
            <!-- <v-text-field placeholder="관심 작물 등록 => 데시보드에 관련 정보 제공"></v-text-field> -->
          </v-flex>
        </v-layout>
      </v-form>
      <v-layout row justify-center>
        <v-btn :disabled="!valid"
               dark
               color="taskButton"
               @click="signUpConfirm">
          가입
        </v-btn>
        <v-btn to="/"
               dark
               color="taskButton">
          취소
        </v-btn>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
  import userAPI from '@/utils/api/userAPI'
  import DaumPostcode from 'vuejs-daum-postcode'    // https://github.com/mango-tree/vuejs-daum-postcode
  import dbAPI from '@/utils/api/dbAPI'

  export default {
    name: "CreateUserAccount",
    data() {
      return {
        user: {
          account_id: '',
          password: '',
          email: '',
          full_name: '',
          user_type: 'consumer',
          tel_num: '',
          post_num: '',
          address_basic: '',
          address_detail: ''
        },
        confirmed_account_id: '',
        input_address: {
          fullAddress: '',
          jibunAddress: '',
          zonecode: ''
        },
        valid: false,
        dialog: false,
        rules: {
          required: value => !!value || '필수 입력란입니다.',
          min: v => v.length >= 4 || 'Min 4 characters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || '이메일 형식이 올바르지 않습니다.'
          }
        },
      }
    },
    methods: {
      async checkDuplicate(account_id) {
        let result = await dbAPI.publicQuery('select.exist.user', { account_id: account_id })
        console.log('result.rows[0].count', result.rows)
        if (result.rows[0].count == 0) {
          alert('사용 가능한 ID입니다.')
          this.confirmed_account_id = account_id
        } else {
          alert('이미 사용중인 ID입니다.')
          this.user.account_id = ''
        }
      },
      async signUpConfirm() {
        if (!this.$refs.form.validate()) {
          return
        }
        if (this.confirmed_account_id != this.user.account_id) {
          alert('사용자 중복 확인이 필요합니다.')
          return
        }
        try {
          const data = await userAPI.addUser(this.user)
          if (data.code != 200) {
            console.log(data)
            alert(data.message)
          }
          else {
            alert('회원 가입되었습니다. 로그인 페이지로 이동합니다.')
            this.$router.replace('/login')
          }
        }
        catch (err) {
          alert(err)
        }
      },
      setDetailAddress(data) {
        this.dialog = false
        // this.user.post_num = this.input_address.zonecode
        // this.user.address_basic = this.input_address.fullAddress
        // this.user.address_detail = '' // this.input_address.fullAddress

        // 전체 주소 설정
        let fullAddress = data.address
        let extraAddress = ''
        if (data.addressType === 'R') { // R : 도로명 주소, J : 지번 주소
          if (data.bname !== '') {
            extraAddress += data.bname
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName)
          }
          fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '')
        }

        this.user.address_basic = fullAddress

        // 우편 번호 설정
        this.user.post_num = data.zonecode

        // 지번 주소 설정
        // this.input_address.jibunAddress = data.jibunAddress
      }
    },
    components: {
      DaumPostcode
    }
  }
</script>

<style scoped>
</style>
