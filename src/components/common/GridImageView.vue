<template>
  <div id="GridImageView">
    <v-layout>
      <v-flex xs12 sm6 offset-sm1>
        <v-card>
          <v-container grid-list-sm fluid>
            <v-layout row wrap>
              <v-flex
                v-for="(item, index) in viewItemCount"
                :key="index"
                xs4
                d-flex
              >
                <v-card flat tile class="d-flex">
                  <v-img :src="getCurrentImageUrl(getIndex(index))"
                         :class="getClassName(index)"
                         aspect-ratio="1"
                         width="80px"
                         height="80px"
                         @click="selectImage(index)">
                    <v-layout
                      slot="placeholder"
                      fill-height
                      align-center
                      justify-center
                      ma-0
                    >
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                  </v-img>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          <div class="text-xs-center">
            <v-pagination
              v-model="viewPageNum"
              :length="getTotalPage"
              :total-visible="7"
              circle
            ></v-pagination>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import {imageViewMixin} from '@/components/common/imageViewMixin'

  export default {
    name: "GridImageView",
    mixins: [imageViewMixin],

    data() {
      return {
        viewItemCount: 9,
        viewPageNum: 1,
        totalPage: 1
      }
    },

    created() {
      this.imageType = this.ENUM_IMAGE_TYPE.THUMBNAIL_IMAGE
    },

    methods: {
      selectImage(index) {
        let _index = this.getIndex(index)
        if (this.getTotalListSize > _index) {
          this.currentIndex = _index
        }
      },

      getClassName(index) {
        let _index = this.getIndex(index)
        if (this.currentIndex === _index) {
          return "image"
        } else {
          return ""
        }
      },

      getIndex(index) {
        return (this.viewPageNum - 1) * this.viewItemCount + index
      },

      changeCurrentPage(index) {
        this.viewPageNum = Math.floor((index / this.viewItemCount)) + 1
      }
    },

    computed: {
      currentIndex: {
        get() {
          let index = this.getCurrentIndex;
          this.changeCurrentPage(index);
          return index;
        },
        set(value) {
          this.setCurrentIndex({index: value})
        }
      },

      getTotalPage() {
        return Math.ceil(this.getTotalListSize / this.viewItemCount)
      }
    }
  }

</script>

<style scoped>
  #GridImageView {
    position: absolute;
  }

  .image {
    outline: 4px solid #536DFE;
  }
</style>
