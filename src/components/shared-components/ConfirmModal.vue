<template>
  <base-modal>
    <div slot="title"
         class="headline">{{ title }}
    </div>
    <div slot="content"> {{ content }}</div>
    <v-btn v-if="!notice"
           slot="negative-button"
           color="blue darken-1"
           flat
           @click="_onClickCancel()">
      닫기
    </v-btn>
    <v-btn slot="positive-button"
           color="blue darken-1"
           flat
           @click="_onClickConfirm()">
      확인
    </v-btn>
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/shared-components/BaseModal'

  export default {
    props: {
      title: {
        type: [String, Number]
      },
      content: {
        type: String
      },
      notice: {
        type: Boolean
      }
    },
    data: () => ({}),
    created:
      () => {
        console.log("ConfirmModal created!!")
      },
    methods:
      {
        _onClickCancel() {
          this.$emit('cancel')
        }
        ,
        _onClickConfirm() {
          this.$emit('confirm')
        }
      }
    ,
    components: {
      'BaseModal':
      BaseModal
    }
  }
</script>

<style scoped>

</style>
