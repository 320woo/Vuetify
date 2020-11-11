<template>
  <v-app id="userContainer" class="font1">
    <v-navigation-drawer
      v-model="drawer"
      class="navigationDrawer white--text"
      :clipped="true"
      :mobile-break-point="800"
      touchless
      app
      dark
    >
      <p>
        <br/>
      </p>

      <v-list dense>
        <template v-for="(item, index) in items">
          <v-layout v-if="item.header" :key="item.header" row align-center />
          <v-list-tile
            v-else
            :key="item.text"
            :to="item.url"
            ripple
            class="navigation-list"
            active-class="navigation-list-active"

            @click
          >
            <v-list-tile-content>
              <v-list-tile-title style="font-size: 18px">{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="true" color="toolbar" dark app>
      <!--<v-toolbar-side-icon @click="drawer = !drawer"/>-->
      <v-btn icon flat @click.stop="drawer = !drawer">
        <v-icon>format_list_bulleted</v-icon>
      </v-btn>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-tooltip bottom>
        <v-btn slot="activator" flat icon @click.stop="_onClickLogout()">
          <v-img :src="icons.logout" aspect-ratio="1.7" contain />
        </v-btn>
        <span>로그아웃</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn slot="activator" flat icon to="/userMypage">
          <v-icon>edit</v-icon>
        </v-btn>
        <span>My Page</span>
      </v-tooltip>
      <!--<v-btn flat icon>
        <v-img :src="icons.notification" aspect-ratio="1.7" contain />
      </v-btn>-->
    </v-toolbar>
    <v-content class="content_wrap">
      <router-view />
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

export default {
  name: 'UserContainer',
  components: {
    ConfirmModal
  },
  data: () => ({
    title: '사용자',
    icons: icons,
    modalTitle: '로그아웃',
    modalContent: '로그아웃 하시겠습니까?',
    isOpenLogoutModal: false,
    drawer: true,
    items: [
      { text: '홈', url: '/userHome' },
      { text: '작업 요청 내역', url: '/schedule_user' },
      { text: '영역별 임무', url: '/areaMission' },
      { text: '영농 일지', url: '/farmDiary' },
      { text: '공급자 목록', url: '/providerList' }
    ]
  }),
  mounted() {
    this.title = this.$session.get('account_id') + ' (사용자)'
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
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'TmoneyRoundWindExtraBold';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-07@1.0/TmoneyRoundWindExtraBold.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
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
.font1{
  font-family: 'GmarketSansMedium';
}
</style>
