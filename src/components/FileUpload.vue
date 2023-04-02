
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-sheet v-if="!showReport" :rounded="true" class="mx-auto" width="60%">
          <v-row class="text-center">
            <v-col cols="12"><h1>Select League Files</h1></v-col>
          </v-row>
          <v-row>
            <v-col cols="6" offset="3">
              <v-file-input
                chips
                id="standings"
                label="Standings Report"
                v-model="standingsFile"
              >
              </v-file-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" offset="3">
              <v-file-input
                chips
                id="schedule"
                label="Schedule Report"
                v-model="scheduleFile"
              >
              </v-file-input>
            </v-col>
          </v-row>
          <v-row class="text-center">
            <v-col cols="8" offset="2">
              <v-btn to="/" elevation="4">Start Over</v-btn>
              <v-btn color="primary" elevation="8" @click="submitFiles"
                >Submit</v-btn
              >
            </v-col>
          </v-row>
        </v-sheet>
        <standings-report
          :league="league"
          v-if="showReport"
          @newreport="showReport = false"
        ></standings-report>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import axios from "axios";
import Vue from "vue";
import { League } from "../classes/League";
import StandingsReport from "./StandingsReport.vue";

export default Vue.extend({
  name: "FileUpload",
  components: {
    StandingsReport,
  },
  data() {
    return {
      standingsFile: null,
      scheduleFile: null,
      showReport: false,
      league: {} as League,
    };
  },
  methods: {
    async submitFiles() {
      if (this.standingsFile && this.scheduleFile) {
        /*
        let formData = new FormData();
        formData.append("standingsFile", this.standingsFile);
        formData.append("scheduleFile", this.scheduleFile);
        axios
          .post("api/fileupload.php", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            this.league = new League(
              response.data.league,
              response.data.results
            );
            this.showReport = true;
            this.standingsFile = null;
            this.scheduleFile = null;
          });*/
        const leagueRows = await readFile(this.standingsFile);

        const resultsRows = await readFile(this.scheduleFile);

        this.league = new League(leagueRows, resultsRows);
        this.showReport = true;
      }
    },
  },
});

async function readFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      let file = reader.result as string;
      file = file.replace(/(\r\n|\n|\r)/gm, "");
      const regex = /(<TR>.+?<\/TR>)/g;
      const rows = file.match(regex);
      resolve(rows);
    };
  });
}
</script>

<style lang="scss" scoped>
.v-btn {
  margin: 8px;
}

div.v-sheet {
  margin-top: 40px;
  border: 1px solid black;
}
</style>


