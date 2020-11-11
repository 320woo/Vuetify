<template>
  <v-hover>
    <v-card :to="{ name: 'task', params: {project_id: project.project_id}}"
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2}`">
      <v-container fluid>
        <v-layout row wrap align-center>
          <v-layout column>
            <v-layout align-center
                      wrap
                      row>
              <span class="project_name">{{ project.name }}</span>
              <v-divider
                class="ma-1"
                vertical>
              </v-divider>
              <span class="project_date">{{_convertDate(project.created_at)}}</span>
            </v-layout>
            <v-flex class="project_description">
              {{ project.description }}
            </v-flex>
          </v-layout>
          <v-layout row wrap align-center justify-end>
            <v-tooltip bottom>
              <v-btn slot="activator"
                     ripple
                     class="default-action-button map_button"
                     @click.prevent="moveMap(project.project_id)">
                <img :src="mapIcon">
              </v-btn>
              <span>지도</span>
            </v-tooltip>
            <v-divider vertical
            ></v-divider>
            <v-btn class="default-action-button"
                   ripple
                   @click.prevent="_onClickEditButton(project)">
              <img :src="editIcon">
            </v-btn>
            <v-btn class="ml-1 default-action-button"
                   ripple
                   @click.prevent="_onClickDeleteButton(project.project_id)">
              <img :src="deleteIcon">
            </v-btn>
          </v-layout>
        </v-layout>
      </v-container>
    </v-card>
  </v-hover>
</template>

<script>
  import {mapMutations} from 'vuex'
  import StringUtil from "@/utils/utils/stringUtil";
  import icon from '@/icons.js'

  export default {
    props: [
      'project'
    ],
    data: () => ({
      //View list
      viewList: ['View Map', 'etc']
    }),
    computed: {
      editIcon() {
        return icon.edit
      },
      deleteIcon() {
        return icon.delete
      },
      mapIcon() {
        return icon.map
      }
    },
    methods: {
      ...mapMutations([
        'SET_EDIT_PROJECT',
        'SET_REMOVE_PROJECT_ID',
        'OPEN_EDIT_MODAL_PROJECT',
        'OPEN_REMOVE_MODAL_PROJECT'
      ]),
      _onClickEditButton(project) {
        this.SET_EDIT_PROJECT(JSON.parse(JSON.stringify(project)))
        this.OPEN_EDIT_MODAL_PROJECT()
      },
      _onClickDeleteButton(project_id) {
        this.SET_REMOVE_PROJECT_ID(project_id)
        this.OPEN_REMOVE_MODAL_PROJECT()
      },
      _convertDate(date) {
        return StringUtil.getConvertDate(new Date(date));
      },
      _onClickMoveView(index, projectId) {
        console.log("[_onClickMoveView] index : " + index + ", proj id : " + projectId);
        switch (index) {
          case 0:
            this.moveMap(projectId);
            break;
          default:
            break;
        }
      },
      moveMap(projectId) {
        this.$router.push({
          name: 'projectMap',
          params: {
            "projectId": projectId,
          }
        })
      }
    }
  }
</script>

<style scoped>
  .projectList >>> .v-btn {
    padding: 10px;
    margin-left: 10px;
    min-width: 0 !important;
    min-height: 0 !important;
    border-radius: 10px !important;
    border: 1px solid #E1E2E4;
    background: linear-gradient(to top right, #E6EDFF 0%, #FFFFFF 100%);
  }

  .map_button {
    border: none;
    margin-right: 10px;
    background: linear-gradient(to top right, #5FC5ED 0%, #81EAED 100%);
  }

  .project_name {
    color: #374051;
    font-weight: bold;
  }

  .project_date {
    color: #B9B9B9;
    font-size: smaller;
    font-weight: lighter;
  }

  .project_description {
    color: #374051;
    font-size: small
  }

</style>
