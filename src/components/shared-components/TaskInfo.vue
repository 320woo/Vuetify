<template>
  <v-layout v-if="address"
            column
            justify-center
            align-center
            pa-3>
    <p>
      {{ address.text }}
    </p>
    <p class="date">
      {{ _convertDate(created_at) }}
    </p>
    <v-divider inset></v-divider>
  </v-layout>
</template>

<script>
  import StringUtil from '@/utils/utils/stringUtil'

  export default {
    props: [
      'address',
      'created_at'
    ],
    methods: {
      _convertDate(date) {
        return StringUtil.getConvertDate(new Date(date));
      },
    }
  }
</script>

<style scoped>
  .date {
    color: #f0646d;
  }
</style>
