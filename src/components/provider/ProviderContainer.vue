<template>
  <v-app id="providerContainer">
    <v-navigation-drawer
      class="navigationDrawer white--text"
      :clipped="true"
      :mobile-break-point="800"
      v-model="drawer"
      touchless
      app
      dark
    >
      <v-list dense>
        <template v-for="(item, index) in items">
          <v-layout v-if="item.header" :key="index" row align-center></v-layout>
          <v-list-tile
            v-else
            :key="item.text"
            :to="item.url"
            ripple
            @click
            class="navigation-list"
            active-class="navigation-list-active"
            :style="{visibility: item.visible ? 'visible' : 'hidden' }"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="true" color="toolbar" dark app>
      <v-btn icon flat @click.stop="drawer = !drawer">
        <v-img :src="icons.menu"/>
      </v-btn>
      <!-- <v-btn slot="activator" icon flat @click.stop="_onClickToolbarMenu()">
        <v-img :src="icons.menu"></v-img>
      </v-btn> -->
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn slot="activator" flat icon @click.stop="_onClickLogout()">
          <v-img :src="icons.logout" aspect-ratio="1.7" contain></v-img>
        </v-btn>
        <span>로그아웃</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn slot="activator" flat icon to="/providerMypage">
          <v-icon>edit</v-icon>
        </v-btn>
        <span>My Page</span>
      </v-tooltip>
      <!--<v-btn flat icon>
        <v-img :src="icons.notification" aspect-ratio="1.7" contain></v-img>
      </v-btn>-->
    </v-toolbar>
    <v-content class="content_wrap">
      <router-view/>
      <v-dialog v-model="this.isOpenLogoutModal" persistent max-width="500px">
        <confirm-modal
          :title="modalTitle"
          :content="modalContent"
          @confirm="_logout()"
          @cancel="_cancel()"
        />
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
  import ConfirmModal from '@/components/shared-components/ConfirmModal'
  import authAPI from '@/utils/api/authAPI'
  import icons from '@/icons'
  import { mapGetters } from 'vuex'

  export default {
    name: 'ProviderContainer',
    components: {
      ConfirmModal
    },
    data: () => ({
      title: '공급자',
      icons: icons,
      modalTitle: '로그아웃',
      modalContent: '로그아웃 하시겠습니까?',
      isOpenLogoutModal: false,
      drawer: true,
      // items: [
      //   { text: '홈', url: '/providerHome', visible: true },
      //   { text: '대기 작업', url: '/waitingMissionList', visible: true },
      //   { text: '작업 목록', url: '/missionList', visible: true },
      //   { text: '고객 목록', url: '/userList', visible: true},
      //   { text: 'GCS 데이터 가져오기', url: '/gcsImport', visible: !this.isMobile }
      // ],
    }),
    updated() {
      this.isHome = this.$router.currentRoute.name === 'providerHome'
    },

    mounted() {
      this.isHome = this.$router.currentRoute.name === 'providerHome'
      this.title = this.$session.get('account_id') + ' (공급자)'
    },
    methods: {
      _onClickLogout() {
        this.isOpenLogoutModal = true
      },
      async _logout() {
        const response = await authAPI.logout(this.$session.get('account_id'))
        await console.log(response.code, response.message)
        await this.$session.destroy()
        console.log(this.$router.currentRoute.params)
        await this.$router.replace({
          name: 'intro'
        })
      },
      _cancel() {
        this.isOpenLogoutModal = false
      }
    },
    computed: {
      ...mapGetters([
        'isMobileBrowser'
      ]),
      isMobile() {
        console.log('[isMobile] this.isMobileBrowser:', this.isMobileBrowser)
        return this.isMobileBrowser
      },
      items: {
        get() {
          return [
            { text: '홈', url: '/providerHome', visible: true },
            { text: '대기 작업', url: '/waitingMissionList', visible: true },
            { text: '작업 목록', url: '/missionList', visible: true },
            { text: '고객 목록', url: '/userList', visible: true},
            { text: '주제도', url: '/thematicMap', visible: true},
            { text: '통계분석', url: '/statisticChart', visible: true},
            { text: '상관관계분석', url: '/correlationChart', visible: true},
            { text: 'GCS 데이터 가져오기', url: '/gcsImport', visible: !this.isMobile }
          ]
        }}
    }
  }
</script>

<style scoped>
  .content_wrap {
    background-color: #f3f6ff;
  }

  >>> .v-navigation-drawer {
    overflow-y: hidden !important;
  }

  >>> .navigation-list {
    padding: 5px 15px;
  }

  >>> .navigation-list-active {
    color: white !important;
    background-color: #131927 !important;
    border-radius: 5px;
  }
</style>
