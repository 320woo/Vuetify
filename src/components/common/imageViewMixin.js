import Constants from "@/components/common/constants"
import ImageUtil from '@/utils/api/fileAPI'
import {mapGetters, mapMutations} from 'vuex'

const ENUM_IMAGE_TYPE = {
  ORIGINAL_IMAGE: {value: 1, name: "original_image"},
  THUMBNAIL_IMAGE: {value: 2, name: "thumbnail_image"}
}

export const imageViewMixin = {
  props: {
    detailViewType: {
      type: String,
      default: Constants.ENUM_DETAIL_IMAGE_VIEW_TYPE.TYPE_MAP
    },
    projectId: {
      type: String,
    },
    taskId: {
      type: String,
    },
    imageList: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    imageType: ENUM_IMAGE_TYPE.ORIGINAL_IMAGE,
    ENUM_IMAGE_TYPE
  }),

  methods: {
    ...mapMutations([
      'setCurrentIndex'
    ]),
  },

  computed: {
    ...mapGetters([
      'getCurrentIndex'
    ]),

    currentIndex: {
      get() {
        return this.getCurrentIndex
      },
      set(value) {
        this.setCurrentIndex({index: value})
      }
    },

    getTotalListSize() {
      return this.imageList.length
    },

    getCurrentImageInfo() {
      return (index) => {
        let _index = index === undefined ? this.currentIndex : index
        return this.imageList[_index]
      }
    },

    getCurrentImageUrl() {
      return (index) => {
        if (this.getCurrentImageInfo(index) !== undefined) {
          let url = "";
          switch (this.detailViewType) {
            case Constants.ENUM_DETAIL_IMAGE_VIEW_TYPE.TYPE_MAP: {
              let fileId = this.getCurrentImageInfo(index).file_id
              const fileManager = ImageUtil.FileManagerUrl({
                [ImageUtil.PROJECT_ID]: this.projectId,
                [ImageUtil.TASK_ID]: this.taskId
              }, {
                [ImageUtil.FILE_ID]: fileId
              })

              if (this.imageType === ENUM_IMAGE_TYPE.ORIGINAL_IMAGE) {
                url = fileManager.imageUrl
              } else {
                url = fileManager.thumbnailUrl
              }
            }
              break
            case Constants.ENUM_DETAIL_IMAGE_VIEW_TYPE.TYPE_IMAGE:
              url = `${Constants.API_SERVER}/api/informations/${this.getCurrentImageInfo(index).image_url}`
              break
            case Constants.ENUM_DETAIL_IMAGE_VIEW_TYPE.TYPE_PROVIDER_MAP: {
              let fileId = this.getCurrentImageInfo(index).id
              const fileManager = ImageUtil.FileManagerUrl({}, {
                [ImageUtil.FILE_ID]: fileId
              })

              if (this.imageType === ENUM_IMAGE_TYPE.ORIGINAL_IMAGE) {
                url = fileManager.storageImageUrl
              } else {
                url = fileManager.storageThumbnailUrl
              }
            }
              break
          }

          console.log("[getCurrentImageUrl] url : " + url)
          return url
        } else {
          return ""
        }
      }
    }
  },
}
