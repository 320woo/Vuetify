<template>
  <v-layout row>
    <v-menu
      v-model="addressListMenu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-y
    >
      <v-text-field
        v-model="address"
        slot="activator"
        flat
        label="주소 검색"
        prepend-inner-icon="search"
        clearable
        @click:prepend-inner="onClickSearch"
        @click:clear="clearAddressName"
        @keydown.enter="onClickSearch"
        solo-inverted
        single-line
        type="text"
      ></v-text-field>
      <v-card
        v-if="getAddressData"
        style="max-height: 400px"
        class="scroll-y">
        <v-list
          two-line
          subheader
          v-for="(item, index) in getAddressData.result.items" :key="index">
          <v-list-tile
            @click="onClickAddressInfo(item)">
            <v-list-tile-content>
              <v-list-tile-title>{{item.title}}</v-list-tile-title>
              <v-list-tile-sub-title>{{item.address.road}}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{item.category}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="getAddressData.result.items.length !== index"></v-divider>
        </v-list>
      </v-card>
    </v-menu>
  </v-layout>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import Constants from '@/components/common/constants'

  export default {
    name: "AddressSearch",
    data: () => ({
      address: "",
      addressListMenu: false,
    }),
    created() {
      this.clearSearchData()
    },
    computed: {
      ...mapGetters([
        'getAddressData'
      ])
    },
    methods: {
      ...mapMutations([
        'clearSearchData',
        'clearGeoJsonData',
        'setSelectedAddressInfo'
      ]),

      ...mapActions([
        'requestGetAddressCoordinate',
        'requestGetAddressGeoData'
      ]),

      async onClickSearch() {
        console.log("[onClickSearch] address : " + this.address)
        if (this.address !== null && this.address.trim().length !== 0) {
          this.addressListMenu = true

          await this.requestGetAddressCoordinate({
            addressName: this.address
          })
        }
      },

      onClickAddressInfo(addressInfo) {
        console.log("[onClickAddressInfo] addressInfo : ", addressInfo)
        this.clearGeoJsonData()
        this.setSelectedAddressInfo({addressInfo})

        let strParcel = addressInfo.address['parcel']
        let localName = strParcel.replace(/[0-9]|산\w+[0-9\-]/gi, "").trimEnd()
        console.log("[onClickAddressInfo] replace : ", localName)

        this.requestGetAddressGeoData({
          addressName: addressInfo.title,
          serviceCode: this.getGeoDataCode(localName).value,
          point: addressInfo.point
        })
      },

      getGeoDataCode(localName) {
        let splitLocalName = localName.split(" ")

        let serviceCode = Constants.ENUM_LOCAL_AREA.SIGG

        if (splitLocalName.length > 0) {
          let lastName = splitLocalName[splitLocalName.length - 1]
          console.log("[getGeoDataCode] splitLocalName : " + lastName)

          if (splitLocalName.length === 1 &&
            (lastName.includes("도") || lastName.includes("광역시") || lastName.includes("특별시"))) {
            serviceCode = Constants.ENUM_LOCAL_AREA.SIDO
          } else if (splitLocalName.length === 2 &&
            (lastName.includes("시") || lastName.includes("군") || lastName.includes("구"))) {
            serviceCode = Constants.ENUM_LOCAL_AREA.SIGG
          } else if (splitLocalName.length === 3 &&
            (lastName.includes("읍") || lastName.includes("면") || lastName.includes("동"))) {
            serviceCode = Constants.ENUM_LOCAL_AREA.EMD
          } else {
            serviceCode = Constants.ENUM_LOCAL_AREA.RI
          }
        }

        return serviceCode
      },

      clearAddressName() {
        this.clearSearchData()
        this.clearGeoJsonData()
      }
    }

  }
</script>

<style scoped>

</style>
