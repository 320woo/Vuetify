<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay>
    <v-card>
      <v-toolbar color="toolbar" dark>
        <v-btn icon dark @click="closePopup()">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ companyName }}</v-toolbar-title>
      </v-toolbar>
      <v-layout row>
        <v-card-text>
          <v-container>
            <v-layout column>
              <v-flex xs6>
                <div class="ql-editor" v-html="introduction" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ProviderPresentationModal",
  props: {
    introduction: {
      type: String,
      required: true
    },
    companyName: {
      type: String,
      required: true
    }
  },
  data: () => ({
    dialog: false
  }),
  created() {
    console.log("[created] ProviderPresentationModal")
    this.dialog = true
  },
  methods: {
    closePopup() {
      this.dialog = false
      this.$emit("close")
    }
  }
}
</script>

<style scoped></style>
