<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" scrollable persistent
              max-width="300px">
      <v-card>
        <v-card-title>작업 정보가 영구히 삭제됩니다. <br/><br/>정말로 삭제하시겠습니까?</v-card-title>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="deleteMission()">삭제</v-btn>
          <v-btn color="blue darken-1" flat @click="closePopup()">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import { mapActions } from 'vuex'
  import dbAPI from '@/utils/api/dbAPI'

  export default {
    name: "ConfirmDeleteMissionDialog",
    props: {
      mission: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      dialog: false
    }),
    created() {
      this.dialog = true
      console.log(this.mission)
    },
    methods: {
      ...mapActions(['requestDeleteTask']),

      closePopup() {
        this.dialog = false
        this.$emit('close')
      },
      async deleteMission() {
        console.log(
          '[deleteMission] this.mission_id : ' + this.mission.mission_id
        )

        //delete a task
        // http://211.189.132.21:8095/api/projects/35e24a36-3df7-4b71-885e-d7c646072880/tasks/5fbd803b-2d53-4392-97ea-bfdc25effe31/
        console.log('[deleteMission] requestDeleteTask - project_id:'
                                                      + this.mission.project_id
                                                      + ', task_id:'
                                                      + this.mission.task_id)

        let payload = {
          project_id: this.mission.project_id,
          task_id: this.mission.task_id
        }
        await this.requestDeleteTask(payload)

        let result = await dbAPI.query('delete.mission', {
          mission_id: this.mission.mission_id
        })

        try {
          let info = {
            request_mission_type_id: this.mission.request_mission_type_id,
            mission_id: null
          }
          let result = await dbAPI.query('update.request_mission_type', info)
          console.log(result.rows)
        } catch (err) {
          console.log(err)
        }
   
        this.$store.commit('setPosition', {
          pos: -2
        })

        this.closePopup()
      }
    },
    computed: {
    }
  }
</script>

<style scoped>

</style>
