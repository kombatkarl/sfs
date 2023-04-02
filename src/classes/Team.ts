import { Conference } from "./Conference";
import { Division } from "./Division";

export class Team {
    _id: number;
    conference: Conference;
    division: Division;
    name = '';
    teamsBeat: Team[] = [];
    teamsLost: Team[] = [];
    teamsTied: Team[] = [];
    winsString = '';
    lossesString = '';
    tiesString = '';

    _pointsScored = 0;
    _pointsAllowed = 0;
    _wins = 0;
    _losses = 0;
    _ties = 0;
    _homeWins = 0;
    _homeLosses = 0;
    _homeTies = 0;
    _awayWins = 0;
    _awayLosses = 0;
    _awayTies = 0;
    _divisionWins = 0;
    _divisionLosses = 0;
    _divisionTies = 0;
    _conferenceWins = 0;
    _conferenceLosses = 0;
    _conferenceTies = 0;
    confPSrank = 0;
    confPArank = 0;
    overallPSrank = 0;
    overallPArank = 0;
    currentSRS = 0;
    newSRS = 0;

    constructor(id: number, conference: Conference, division: Division) {
        this._id = id;
        this.conference = conference;
        this.division = division;
    }

    get id(): number {
        return this._id;
    }
    get record(): string {
        return `${this._wins}-${this._losses}-${this._ties}`;
    }

    get homeRecord(): string {
        return `${this._homeWins}-${this._homeLosses}-${this._homeTies}`;
    }

    get awayRecord(): string {
        return `${this._awayWins}-${this._awayLosses}-${this._awayTies}`;
    }

    get conferenceRecord(): string {
        return `${this._conferenceWins}-${this._conferenceLosses}-${this._conferenceTies}`;
    }

    get divisionRecord(): string {
        return `${this._divisionWins}-${this._divisionLosses}-${this._divisionTies}`;
    }

    get pointsScored(): number {
        return this._pointsScored;
    }

    get pointsAllowed(): number {
        return this._pointsAllowed;
    }

    get SRS(): string {
        return this.currentSRS.toFixed(1);
    }

    get strengthOfVictory(): string {
        let wins = 0;
        let losses = 0;
        this.teamsBeat.forEach(opponent => {
            wins += (opponent._wins + opponent._ties / 2);
            losses += (opponent._losses + opponent._ties / 2);
        });
        if (wins + losses === 0) {
            return '0.000';
        }
        return (wins / (wins + losses)).toFixed(3);
    }

    get strengthOfSchedule(): string {
        let wins = 0;
        let losses = 0;
        this.teamsBeat.forEach(opponent => {
            wins += (opponent._wins + opponent._ties / 2);
            losses += (opponent._losses + opponent._ties / 2);
        });
        this.teamsLost.forEach(opponent => {
            wins += (opponent._wins + opponent._ties / 2);
            losses += (opponent._losses + opponent._ties / 2);
        });
        this.teamsTied.forEach(opponent => {
            wins += (opponent._wins + opponent._ties / 2);
            losses += (opponent._losses + opponent._ties / 2);
        });
        if (wins + losses === 0) return '0.000';
        return (wins / (wins + losses)).toFixed(3);
    }

    get confPSPARank(): number {
        return this.confPSrank + this.confPArank;
    }

    get overallPSPARank(): number {
        return this.overallPSrank + this.overallPArank;
    }

    get pointDifferentialPerGame(): number {
        return (this.pointsScored - this.pointsAllowed) / this.gamesPlayed;
    }

    get gamesPlayed(): number {
        return this._wins + this._losses + this._ties
    }

    updateFromScore(opponent: Team, pointsScored: number, pointsAllowed: number, homeTeam: boolean, isDivisionGame: boolean, isConferenceGame: boolean): void {
        this._pointsScored += pointsScored;
        this._pointsAllowed += pointsAllowed;
        if (pointsScored > pointsAllowed) {
            this._wins++;
            homeTeam ? this._homeWins++ : this._awayWins++;
            if (isDivisionGame) this._divisionWins++;
            if (isConferenceGame) this._conferenceWins++;
            this.teamsBeat.push(opponent);
        } else if (pointsScored < pointsAllowed) {
            this._losses++;
            homeTeam ? this._homeLosses++ : this._awayLosses++;
            if (isDivisionGame) this._divisionLosses++;
            if (isConferenceGame) this._conferenceLosses++;
            this.teamsLost.push(opponent);
        } else {
            this._ties++;
            homeTeam ? this._homeTies++ : this._awayTies++;
            if (isDivisionGame) this._divisionTies++;
            if (isConferenceGame) this._conferenceTies++;
            this.teamsTied.push(opponent);
        }
    }

    getSOS(): number {
        let totalOpponentPD = 0;
        this.teamsBeat.forEach(opp => totalOpponentPD += opp.currentSRS);
        this.teamsLost.forEach(opp => totalOpponentPD += opp.currentSRS);
        this.teamsTied.forEach(opp => totalOpponentPD += opp.currentSRS);
        return totalOpponentPD / this.gamesPlayed;
    }

    getOpponents(): string[] {
        const opps: string[] = [];
        this.teamsBeat.forEach(opp => opps.push(opp.name));
        this.teamsLost.forEach(opp => opps.push(opp.name));
        this.teamsTied.forEach(opp => opps.push(opp.name));
        return opps;
    }
}