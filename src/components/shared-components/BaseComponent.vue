<template>

</template>

<script>
  import {mapActions} from 'vuex'
  import authAPI from '@/utils/api/authAPI.js'

  export default {
    name: "BaseComponent",
    computed: {

    },
    methods: {
      ...mapActions([
        'openGlobalModal',
        'closeGlobalModal'
      ]),
      async _validAccessToken() {
        const token = await this.$session.get('jwt')
        const account_id = await this.$session.get('account_id')
        const response = await authAPI.confirmAccessToken(token, account_id)

        return response.code !== 419;
      },
    }
  }
</script>

<style scoped>

</style>
