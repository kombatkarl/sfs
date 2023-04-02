<template>
  <div>
    <b v-if="team.winsString" class="ml-2">W: </b>{{ team.winsString }}
    <b v-if="team.lossesString" class="ml-2">L: </b>{{ team.lossesString }}
    <b v-if="team.tiesString" class="ml-2">T: </b> {{ team.tiesString }}
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  name: "ExpandedItem",
  data() {
    return {};
  },
  props: {
    team: {
      type: Object,
    } as PropOptions,
  },
});
</script>

<style lang="scss" scoped>
b {
  font-size: 16px;
}
</style>

