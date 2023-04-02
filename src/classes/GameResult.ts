export class GameResult {
	home = '';
	visitor = '';
	isTie = false;
	winner: 'home' | 'visitor' | 'tie' = 'home';
	homeScore = 0;
	visitorScore = 0;


}