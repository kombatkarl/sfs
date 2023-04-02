<template>
  <v-app>
    <v-app-bar
      app
      color="orange"
      dark
    >
      <v-app-bar-title>Strat-O-Matic Football Utility</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn
        href="https://www.strat-o-matic.com/football-digital-games/"
        target="_blank"
        text
      >
        <span class="mr-2">SOM Web Page</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
});
</script>
