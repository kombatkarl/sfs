<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn elevation="4" @click="$emit('newreport')">New Report</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4" v-for="conf in league.conferences" :key="conf.id">
          <v-card-title>
            {{ conf.name }}
          </v-card-title>
          <div v-for="div in conf.divisions" :key="div.id">
            <h4 class="ml-4">{{ div.name }}</h4>
            <v-data-table
              class="mb-2"
              :headers="reportHeaders"
              :items="div.teams"
              dense
              hide-default-footer
              show-expand
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <expanded-item :team="item"></expanded-item>
                </td>
              </template>
            </v-data-table>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { DataTableHeader } from "vuetify";
import ExpandedItem from "./ExpandedItem.vue";

export default Vue.extend({
  name: "StandingsReport",
  components: {
    ExpandedItem,
  },
  props: {
    league: {
      type: Object,
      required: true,
    } as PropOptions,
  },
  data() {
    return {
      reportHeaders: [
        { text: "", value: "data-table-expand" },
        {
          text: "Team",
          align: "start",
          sortable: false,
          value: "name",
          width: "130px",
        },
        {
          text: "W-L-T",
          value: "record",
          sortable: false,
        },
        {
          text: "PS",
          value: "pointsScored",
          sortable: false,
        },
        {
          text: "PA",
          value: "pointsAllowed",
          sortable: false,
        },
        {
          text: "Home",
          value: "homeRecord",
          sortable: false,
        },
        {
          text: "Away",
          value: "awayRecord",
          sortable: false,
        },
        {
          text: "Div",
          value: "divisionRecord",
          sortable: false,
        },
        {
          text: "Conf",
          value: "conferenceRecord",
          sortable: false,
        },
        {
          text: "SOV",
          value: "strengthOfVictory",
          sortable: false,
        },
        {
          text: "SOS",
          value: "strengthOfSchedule",
          sortable: false,
        },
        {
          text: "Conf PS+PA",
          value: "confPSPARank",
          sortable: false,
          align: "center",
        },
        {
          text: "Overall PS+PA",
          value: "overallPSPARank",
          sortable: false,
          align: "center",
        },
        {
          text: "SRS",
          value: "SRS",
        },
      ] as DataTableHeader[],
    };
  },
});
</script>

<style lang="scss" scoped>
</style>

