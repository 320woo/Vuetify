<template>
  <base-modal>
    <div slot="title" class="headline">컨테이너 삭제</div>
    <v-container slot="content" grid-list-md>
      <v-layout wrap>
        <v-flex xs12>
          <div>삭제하시겠습니까?</div>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn slot="negative-button" color="blue darken-1" flat @click="CLOSE_MODAL_CONTAINER">취소</v-btn>
    <v-btn slot="positive-button" color="blue darken-1" flat @click="onClickConfirm()">확인</v-btn>
  </base-modal>
</template>

<script>
import BaseModal from "@/components/shared-components/BaseModal";
import BaseComponent from "@/components/shared-components/BaseComponent.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  extends: BaseComponent,
  props: [],
  data: () => ({
    showText: false,
    rules: {
      required: value => !!value || "필수 입력",
      min: v => v.length >= 4 || "Min 4 characters",
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "이메일 형식이 올바르지 않습니다.";
      }
    }
  }),
  computed: {
    ...mapGetters(["getRemoveContainer"])
  },
  methods: {
    ...mapMutations(["CLOSE_MODAL_CONTAINER"]),
    ...mapActions(["requestDeleteContainer", "openGlobalModal"]),
    async onClickConfirm() {
      if ((await this._validAccessToken()) === true) {
        this._deleteContainer();
      } else {
        this.openGlobalModal({});
      }
    },
    // DeleteContainer
    _deleteContainer() {
      this.requestDeleteContainer(this.getRemoveContainer);
      this.CLOSE_MODAL_CONTAINER();
    }
  },
  components: {
    BaseModal: BaseModal
  }
};
</script>

<style scoped>
</style>
