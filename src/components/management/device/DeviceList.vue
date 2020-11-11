<template>
  <div>
    <v-hover>
      <v-card
        slot-scope="{ hover }"
        :class="`elevation-${hover ? 5 : 1}`">
        <v-container fluid @click="selectedItem()">
          <v-layout row wrap align-center>
            <v-layout column>
              <v-layout align-center
                        wrap
                        row>
                <span class="device_name">{{ deviceInfo.name }}</span>
              </v-layout>
              <v-flex class="device_description">
                {{ deviceInfo.deviceid }}
              </v-flex>
            </v-layout>
            <v-spacer></v-spacer>
            <v-btn class="ml-1 default-action-button"
                   ripple
                   @click="isShowDialog = true">
              <img :src="deleteIcon">
            </v-btn>
          </v-layout>
        </v-container>
      </v-card>
    </v-hover>
    <v-dialog
      v-model="isShowDialog"
      class="position: absolute"
      max-width="290">
      <v-card>
        <v-card-title class="headline">삭제</v-card-title>

        <v-card-text>
          {{ "디바이스 정보를 삭제하시겠습니까?" }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="isShowDialog = false">
            취소
          </v-btn>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="deleteItem">
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import icon from '@/icons.js'
  import * as types from '@/vuex/mutation-types'

  export default {
    name: "DeviceList",
    props: {
      deviceInfo: {
        type: Object,
        required: true
      }
    },

    data: () => ({
      isShowDialog: false
    }),

    methods: {
      deleteItem() {
        console.log("[deleteItem] ID : " + this.deviceInfo.id + ", Device ID : " + this.deviceInfo.deviceid);
        this.$store.dispatch(types.DELETE_IOT_DEVICE, {
          deviceid: this.deviceInfo.id,
          callback: (result) => {
            console.log("[deleteItem callback] result : " + result);
            this.isShowDialog = false;
          }
        })
      },

      selectedItem() {
        console.log("[selectedItem] " + this.deviceInfo.deviceid);
        this.$emit('selected-device', this.deviceInfo.deviceid);
      }
    },
    computed: {
      getDeviceInfo() {
        console.log("[getDeviceInfo] ", this.deviceInfo);
      },

      deleteIcon() {
        return icon.delete
      },
    }
  }
</script>

<style scoped>
  .device_name {
    color: #374051;
    font-weight: bold;
  }

  .device_description {
    color: #374051;
    font-size: small
  }
</style>
