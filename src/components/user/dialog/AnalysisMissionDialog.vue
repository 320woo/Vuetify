<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">분석</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout column wrap justify-center fill-height>
              <v-flex xs12>
                <v-layout row wrap>
                  <v-flex xs3 sm3>
                    <p>분석 소스</p>
                    <div>
                      {{ analysisData.areaName }}
                      <br>
                      {{ analysisData.wishDate }}
                    </div>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-divider vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-flex xs8 sm8>
                    <base-map
                      class="pa-1"
                      style="width: 100%">
                    </base-map>
                  </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout column wrap>
                  <v-spacer></v-spacer>
                  <p>분석 소견</p>
                  <v-textarea
                    v-model="analysisContent"
                    outline
                  ></v-textarea>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="closePopup()">닫기</v-btn>
          <v-btn color="blue darken-1" flat @click="saveAnalysisContent()">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import BaseMap from '@/components/map/BaseMap'

  export default {
    name: "AnalysisMissionDialog",
    components: {
      BaseMap
    },
    props: {
      analysisData: {
        type: Object,
        default: {}
      }
    },
    data: () => ({
      dialog: false,
      analysisContent: ""
    }),
    created() {
      this.dialog = true
    },
    methods: {
      saveAnalysisContent() {
        console.log("[saveAnalysisContent] analysisContent: " + this.analysisContent)
        this.closePopup()
      },
      closePopup() {
        this.dialog = false
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>

</style>
