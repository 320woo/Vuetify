<template>
  <v-card width="200">
    <v-layout>
      <task-status :status="status"
                   class="ma-3">
      </task-status>
      <v-layout align-center justify-center>
        1건
      </v-layout>
    </v-layout>
  </v-card>
</template>

<script>
  import TaskStatus from './project/task/TaskStatus'

  export default {
    props: [
      'status'
    ],
    components: {
      'TaskStatus': TaskStatus
    }
  }
</script>

<style scoped>

</style>
