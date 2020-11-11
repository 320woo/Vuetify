<template>
  <v-data-table
    :headers="headers"
    :items="task.imagelist"
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.thumb_nm}}</td>
      <td class="text-xs-right">{{ props.item.org_nm}}</td>
      <td class="text-xs-right">{{ props.item.org_size }}</td>
      <td class="text-xs-right">{{ props.item.gps_lat }}</td>
      <td class="text-xs-right">{{ props.item.gps_lng }}</td>
      <td class="text-xs-right">{{ props.item.gps_alt }}</td>
    </template>
    <template slot="no-data">
      <v-alert :value="true" color="error" icon="warning">
        이미지가 존재하지 않습니다.
      </v-alert>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    props: [
      'projectList'
    ],
    data() {
      return {
        headers: [
          {
            text: '썸네일 이미지',
            align: 'left',
            sortable: false,
            value: 'image_thumbnail'
          },
          {text: 'info', align: 'right', sortable: false, value: 'name'},
          {text: '알고리즘', align: 'right', sortable: false, value: 'algorithm'},
          {text: '주소', align: 'right', sortable: false, value: 'address'},
          {text: '생성날짜', align: 'right', sortable: false, value: 'created_at'},
          {text: '열람날짜', align: 'right', sortable: false, value: 'touched_at'}
        ],
      }
    },
    updated() {
      const globalTasks = this.projectList.reduce((project, value) => {
        Object.assign({}, project, {
          [value.project_id]: {
            tasks: value.tasks
          }
        })
      }, {})
      console.log(globalTasks)
    },
    computed: {},
    methods: {
    }
  }
</script>

<style scoped>

</style>
