import { Division } from "./Division";

export class Conference {
    private _id: number;
    name = '';
    divisions: Division[] = [];

    constructor(id: number) {
        this._id = id;
    }

    get id(): number {
        return this._id;
    }

    addDivision(division: Division): void {
        this.divisions.push(division);
    }

}