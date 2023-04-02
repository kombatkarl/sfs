import { Team } from "./Team";

export class Division {
    private _id: number;
    name = '';
    teams: Team[] = [];

    constructor(id: number) {
        this._id = id;
    }

    get id(): number {
        return this._id;
    }
}