import { Conference } from "./Conference";
import { Division } from "./Division";
import { GameResult } from "./GameResult";
import { Team } from "./Team";

export class League {
    conferences: Conference[] = [];
    teamMap: Map<string, Team>;
    count = 0;
    constructor(filelines1: string[], filelines2: string[]) {
        this.teamMap = new Map();
        this.createLeagueFromFile(filelines1);
        const gameResults = this.parseResults(filelines2);
        console.log(this.conferences);
        this.generateReport(gameResults);
        this.calculateNetPoints();
        this.calculateSRS();
        this.getWinsString();
        this.getLossesString();
        this.getTiedString();
    }

    _addConference(conference: Conference): void {
        this.conferences.push(conference);
    }

    private createLeagueFromFile(lines: string[]) {
        let currConfID = 0;
        let currDivID = 0;
        let currTeamID = 0;
        const confDivRegex = /<B>(.*)<\/B>/;
        const teamRegex = /COLOR="000000">(.*?)<\/FONT>/;
        let conf = new Conference(0);
        let div = new Division(0);
        let team = new Team(0, conf, div);

        for (let i = 1; i < lines.length; i++) {
            const row = lines[i];
            if (row.indexOf('COLSPAN') !== -1) { // We have a division or conference
                // Peek at the next row
                const nextRow = lines[i + 1];
                let name: string | null;
                if (nextRow.indexOf('COLSPAN') !== -1) { // Current Row is a new conference. The next row is a new division
                    conf = new Conference(++currConfID);
                    name = row.match(confDivRegex)![1];
                    conf.name = name;
                    this._addConference(conf);
                    // Use next row to setup new division
                    div = new Division(++currDivID);
                    div.name = nextRow.match(confDivRegex)![1];
                    conf.addDivision(div);
                    // Next row was processed so advance counter by 2;
                    i += 2;
                } else { // New division
                    div = new Division(++currDivID);
                    div.name = row.match(confDivRegex)![1];
                    conf.addDivision(div);
                    i++;
                }
            } else {
                team = new Team(++currTeamID, conf, div);
                team.name = row.match(teamRegex)![1];
                div.teams.push(team);
                this.teamMap.set(team.name, team);
            }
        }
    }

    private parseResults(resultlines: string[]): GameResult[] {
        const regex =
            /.+0">(.+)\sat\s(.+)<\/FONT>.+.+>(.+)?(?:\swins|Tie)\s(\d+)-(\d+)/;
        const results: GameResult[] = [];

        for (let i = 2; i < resultlines.length; i++) {
            const row = resultlines[i];
            const result = new GameResult();
            const parsedRow = row.match(regex);

            if (parsedRow) {
                result.visitor = parsedRow[1];
                result.home = parsedRow[2];
                const winner = parsedRow[3];
                result.isTie = typeof winner === "undefined";
                const winnerScore = new Number(parsedRow[4]).valueOf();
                const loserScore = new Number(parsedRow[5]).valueOf();

                if (result.isTie) {
                    result.winner = "tie";
                    result.homeScore = winnerScore;
                    result.visitorScore = winnerScore;
                } else {
                    if (winner === result.visitor) {
                        result.winner = "visitor";
                        result.visitorScore = winnerScore;
                        result.homeScore = loserScore;
                    } else {
                        result.winner = "home";
                        result.homeScore = winnerScore;
                        result.visitorScore = loserScore;
                    }
                }
                results.push(result);
            }
        }

        return results;
    }

    private generateReport(gameResults: GameResult[]): void {
        gameResults.forEach(result => {
            let homeTeam = this.teamMap.get(result.home);
            // Handle nicknames
            if (!homeTeam) {
                for (const [key, value] of this.teamMap.entries()) {
                    if (key.startsWith(result.home)) {
                        this.teamMap.delete(key);
                        value.name = result.home;
                        this.teamMap.set(value.name, value);
                        homeTeam = value;
                        break;
                    }
                }
            }

            let visitingTeam = this.teamMap.get(result.visitor);
            // Handle nicknames
            if (!visitingTeam) {
                for (const [key, value] of this.teamMap.entries()) {
                    if (key.startsWith(result.visitor)) {
                        this.teamMap.delete(key);
                        value.name = result.visitor;
                        this.teamMap.set(value.name, value);
                        visitingTeam = value;
                        break;
                    }
                }
            }

            if (homeTeam && visitingTeam) {
                const isConfGame = homeTeam.conference.id === visitingTeam.conference.id;
                const isDivGame = homeTeam.division.id === visitingTeam.division.id;
                homeTeam.updateFromScore(visitingTeam, result.homeScore, result.visitorScore, true, isDivGame, isConfGame);
                visitingTeam.updateFromScore(homeTeam, result.visitorScore, result.homeScore, false, isDivGame, isConfGame);
            }
        });
    }

    private calculateNetPoints() {
        let allTeams: Team[] = [];
        this.conferences.forEach(conf => {
            let confTeams: Team[] = [];
            conf.divisions.forEach(div => {
                allTeams = allTeams.concat(div.teams);
                confTeams = confTeams.concat(div.teams);
            });
            confTeams.sort((t1, t2): number => {
                if (t1.pointsScored === t2.pointsScored) return 0;
                return t1.pointsScored > t2.pointsScored ? -1 : 1;
            });
            confTeams.forEach((t, i) => t.confPSrank = i + 1);

            confTeams.sort((t1, t2): number => {
                if (t1.pointsAllowed === t2.pointsAllowed) return 0;
                return t1.pointsAllowed < t2.pointsAllowed ? -1 : 1;
            });
            confTeams.forEach((t, i) => t.confPArank = i + 1);
        });
        allTeams.sort((t1, t2): number => {
            if (t1.pointsScored === t2.pointsScored) return 0;
            return t1.pointsScored > t2.pointsScored ? -1 : 1;
        });
        allTeams.forEach((t, i) => t.overallPSrank = i + 1);

        allTeams.sort((t1, t2): number => {
            if (t1.pointsAllowed === t2.pointsAllowed) return 0;
            return t1.pointsAllowed < t2.pointsAllowed ? -1 : 1;
        });
        allTeams.forEach((t, i) => t.overallPArank = i + 1);

    }

    private calculateSRS() {
        const solution: SRSData[] = Array.from(this.teamMap.values()).map(t => {
            return {
                teamName: t.name,
                rating: t.pointDifferentialPerGame,
                originalRating: t.pointDifferentialPerGame,
                sos: t.getSOS(),
                opponents: t.getOpponents()
            } as SRSData;
        });
        let needToRecalc = false;
        do {
            const oldRatings: number[] = solution.map(s => s.rating);
            solution.forEach(s => s.rating = s.originalRating + s.sos);
            solution.forEach(s => {
                let totalOppRatings = 0;
                s.opponents.forEach(oppName => {
                    const opp: SRSData | undefined = solution.find(s1 => s1.teamName === oppName);
                    if (opp) {
                        totalOppRatings += opp.rating;
                    }
                });
                const avgOppRating = totalOppRatings / s.opponents.length;
                s.sos = avgOppRating;
            });
            const newRatings: number[] = solution.map(s => s.rating);
            needToRecalc = false;
            for (let i = 0; i < solution.length; i++) {
                if (oldRatings[i] !== newRatings[i]) {
                    needToRecalc = true;
                }
            }
        } while (needToRecalc);

        solution.forEach(s => this.teamMap.get(s.teamName)!.currentSRS = s.rating);
    }

    private getWinsString(): void {

        Array.from(this.teamMap.values()).forEach(team => {
            team.teamsBeat.sort((a, b) => {
                return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
            });

            let prevTeam = '';
            let winStr = '';
            team.teamsBeat.forEach(t => {
                if (t.name === prevTeam) {
                    winStr = winStr.slice(0, -2) + '(2), ';
                } else {
                    winStr += t.name + ', ';
                }
                prevTeam = t.name;
            });
            team.winsString = winStr.slice(0, -2);
        });

    }

    private getLossesString(): void {

        Array.from(this.teamMap.values()).forEach(team => {
            team.teamsLost.sort((a, b) => {
                return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
            });

            let prevTeam = '';
            let winStr = '';
            team.teamsLost.forEach(t => {
                if (t.name === prevTeam) {
                    winStr = winStr.slice(0, -2) + '(2), ';
                } else {
                    winStr += t.name + ', ';
                }
                prevTeam = t.name;
            });
            team.lossesString = winStr.slice(0, -2);
        });

    }

    private getTiedString(): void {

        Array.from(this.teamMap.values()).forEach(team => {
            team.teamsTied.sort((a, b) => {
                return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
            });

            let prevTeam = '';
            let winStr = '';
            team.teamsTied.forEach(t => {
                if (t.name === prevTeam) {
                    winStr = winStr.slice(0, -2) + '(2), ';
                } else {
                    winStr += t.name + ', ';
                }
                prevTeam = t.name;
            });
            team.tiesString = winStr.slice(0, -2);
        });

    }

}
interface SRSData {
    teamName: string,
    rating: number;
    originalRating: number;
    sos: number;
    opponents: string[]
}