<template>
  <v-layout pl-2 row wrap align-center justify-start>
    <v-tooltip bottom>
      <v-flex slot="activator" class="task_name">
        {{ getSmallString(mission.mission_name, 22) }}
      </v-flex>
      <span>{{ mission.mission_name }}</span>
    </v-tooltip>
    <v-divider class="ma-1" vertical/>
    <v-flex class="task_date" mx-2 my-1>
      <v-layout align-center justify-start>
        <v-icon small>calendar_today</v-icon>
        {{ getDateLabel() }}
      </v-layout>
      <v-layout align-center justify-start>
        {{ getDateString() }}
      </v-layout>
    </v-flex>
    <!-- for user -->
    <v-divider class="ma-1" vertical v-if="isuser()"/>
    <v-flex class="task_date" mx-2 my-1 v-if="isuser()">
      <v-tooltip bottom>
        <v-layout slot="activator" align-center justify-start>
            <v-icon small>domain</v-icon>
            {{ mission.company_name }}
        </v-layout>
        <span>{{ mission.address_basic }} {{ mission.address_detail }}</span>
      </v-tooltip>
      <v-layout align-center justify-start>
        <v-icon small>phone</v-icon>
        {{ mission.tel_number }}
      </v-layout>
    </v-flex>
    <!-- for provider -->
    <v-divider class="ma-1" vertical v-if="!isuser()"/>
    <v-flex class="task_date" mx-2 my-1 v-if="!isuser()">
      <v-tooltip bottom>
        <v-layout slot="activator" align-center justify-start>
            <v-icon small>location_city</v-icon>
            {{ getAddressString() }}
        </v-layout>
        <span>{{ mission.address_basic }} {{ mission.address_detail }}</span>
      </v-tooltip>
      <v-layout align-center justify-start>
        <v-icon small>phone</v-icon>
        {{ mission.tel_num }}
      </v-layout>
    </v-flex>
    <!-- for all  -->
    <v-divider class="ma-1" vertical/>
    <v-flex class="task_date" mx-2 my-1>
      <v-tooltip bottom>
        <v-layout v-if="mission.comment" slot="activator" align-center justify-start>
            <v-icon small>comment</v-icon>
            {{ getSmallString(mission.comment, 13) }}
        </v-layout>
        <v-layout v-else-if="mission.wish_comment" slot="activator" align-center justify-start>
            <v-icon small>comment</v-icon>
            {{ getSmallString(mission.wish_comment, 13) }}
        </v-layout>
        <span v-if="mission.comment">{{ mission.comment }}</span>
        <span v-else-if="mission.wish_comment">{{ mission.wish_comment }}</span>
      </v-tooltip>
      <v-layout v-if="isuser()" align-center justify-start>
          <v-icon small v-if="mission.spray_material">blur_on</v-icon>
          {{ mission.spray_material }}
      </v-layout>
      <v-layout v-else-if="(mission.wish_spray_material || mission.spray_material) && _has_category_spray_material(mission.mission_type_category)" align-center justify-start>
          <v-icon small>blur_on</v-icon>
          {{ mission.spray_material ? mission.spray_material : mission.wish_spray_material }}
      </v-layout>
     </v-flex>
    <v-spacer v-if="isuser() && !mission.comment && !mission.spray_material"/>
    <v-spacer v-else-if="!isuser() && (!mission.comment && !mission.wish_comment) && !((mission.wish_spray_material || mission.spray_material) && _has_category_spray_material(mission.mission_type_category))"/>
    <v-divider class="ma-1" vertical/>
  </v-layout>
</template>

<script>
import StringUtil from '@/utils/utils/stringUtil'
import Constants from '@/components/common/constants'

export default {
  props: {
    missioninfo: {
      type: Object,
      default: {}
    },
  },

  data() {
    return {
      missionItem: {},
    }
  },

  async created() {
    // console.log('[Mission Information created] ')
    this.missionItem = await this.missioninfo
    // console.log('[Mission Information] missionItem ', this.missionItem)
  },

  computed: {
    mission() {
      return this.missionItem
    }
  },

  methods: {
    isuser() {
      if (this.$session.get('user_type') == "consumer") {
        return true
      }
      return false
    },

    getDate(date) {
      return StringUtil.getConvertDateFormat(
        date,
        StringUtil.REQUEST_DATE_FORMAT
      )
    },

    _has_category_spray_material(category) {
      switch (category) {
        case Constants.MISSION_CATEGORY_MAP:
        case Constants.MISSION_CATEGORY_PHOTO:
        case Constants.MISSION_CATEGORY_ANALYSIS:
          return false
        case Constants.MISSION_CATEGORY_PESTICIDE:
        case Constants.MISSION_CATEGORY_SOWING:
        case Constants.MISSION_CATEGORY_MANURE:
          return true
      }
      return false
    },

    getDateLabel() {
      var label = "예정일"
      var date = undefined
      if (this.mission.mission_end_dat != undefined && this.mission.mission_end_dat != null) {
        label = "완료일"
        date = this.mission.mission_end_dat
      }
      else if (this.mission.mission_dat != undefined && this.mission.mission_dat != null) {
        label = "예정일"
        date = this.mission.mission_dat
      }
      else if (this.mission.wish_dat != undefined && this.mission.wish_dat != null) {
        label = "희망일"
        date = this.mission.wish_dat
      }
      return label
    },

    getDateString() {
      var label = "예정일"
      var date = undefined
      if (this.mission.mission_end_dat != undefined && this.mission.mission_end_dat != null) {
        switch (this.mission.status) {
          case 4:
            label = "취소일"
            break
          case 3:
            label = "완료일"
            break
          case 2:
            label = "종료예정일"
            break
        }
        date = this.mission.mission_end_dat
      }
      else if (this.mission.mission_dat != undefined && this.mission.mission_dat != null) {
        label = "예정일"
        date = this.mission.mission_dat
      }
      else if (this.mission.wish_dat != undefined && this.mission.wish_dat != null) {
        label = "희망일"
        date = this.mission.wish_dat
      }
      var datestring = StringUtil.getConvertDateFormat(
        date,
        StringUtil.REQUEST_DATE_FORMAT
      )
      return datestring
    },

    getAddressString() {
      if (this.mission.address_basic == undefined || this.mission.address_detail == undefined)
        return ""

      var address = this.mission.address_basic + ' ' + this.mission.address_detail
      // console.log(address + ' ' + address.length)
      // console.log(typeof(address))
      // console.log(address.substr(0, 12))
      // console.log(address.length > 12 ? '...':'')
      var shortaddress = address.substr(0, 12)
      var postfix = address.length > 12 ? '...':''
      var result = shortaddress + postfix
      return result
    },

    getSmallString(targetString, length) {
      if (targetString == undefined)
        return ""

      var shortaddress = targetString.substr(0, length)
      var postfix = targetString.length > length ? '...':''
      var result = shortaddress + postfix
      return result
    },
  }
}
</script>

<style scoped>
@import "../../../assets/css/mission.scss";
</style>
