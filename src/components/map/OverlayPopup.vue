<template>
  <div class="text-xs-center">
    <v-menu
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
      :position-x="positionX"
      :position-y="positionY"
    >
      <v-card>
        <v-text-field
          label="Regular"
        ></v-text-field>

        <v-divider></v-divider>
        <v-text-field
          label="Regular"
        ></v-text-field>

        <!--<v-list>-->
        <!--<v-list-tile>-->
        <!--<v-list-tile-action>-->
        <!--<v-switch v-model="message" color="purple"></v-switch>-->
        <!--</v-list-tile-action>-->
        <!--<v-list-tile-title>Enable messages</v-list-tile-title>-->
        <!--</v-list-tile>-->

        <!--<v-list-tile>-->
        <!--<v-list-tile-action>-->
        <!--<v-switch v-model="hints" color="purple"></v-switch>-->
        <!--</v-list-tile-action>-->
        <!--<v-list-tile-title>Enable hints</v-list-tile-title>-->
        <!--</v-list-tile>-->
        <!--</v-list>-->

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn flat @click="showMenu = false">Cancel</v-btn>
          <v-btn color="primary" flat @click="showMenu = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  export default {
    data: () => ({
      fav: true,
      menu: false,
      message: false,
      hints: true
    }),


    props: {
      showMenu: false,
      positionX: 10,
      positionY: 10,
    },

    created() {
      console.log("[created] OverlayPopup showMenu : " + this.showMenu);
    },

    mounted() {
      console.log("[mounted] OverlayPopup showMenu : " + this.showMenu);
    }
  }
</script>

<style scoped>
</style>
