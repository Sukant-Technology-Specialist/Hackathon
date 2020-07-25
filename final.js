var appEl = document.getElementById("tower-app");
var donemessageEl = appEl.getElementsByClassName("doneMessage")[0];
var doneMessageMovesEl = donemessageEl.getElementsByClassName("movesShower")[0];
var doneMessageMinimumEl = donemessageEl.getElementsByClassName("minimum")[0];
var doneMessageMultipleEl = donemessageEl.getElementsByClassName("multiple")[0];
var moveCounterEl = appEl.getElementsByClassName("moveCounter")[0];
var difficultyEl = appEl.getElementsByClassName("difficulty")[0];
var playnewButtonEl = appEl.getElementsByClassName("playnew")[0];
var playgameButtonEl = appEl.getElementsByClassName("playgame")[0];
var helpmeButtonEl = appEl.getElementsByClassName("helpme")[0];
var towerEls = [].slice.call(appEl.getElementsByClassName("tower"), 0);
for(var i=0; i<towerEls.length; i++) {
	var towerEl = towerEls[i];
	towerEl.data = {}
	towerEl.data.index = i;
}
var infoScreenEl = appEl.getElementsByClassName("info-screen")[0];
var playScreenEl = appEl.getElementsByClassName("play-screen")[0];
difficultyEl.onchange = function(e) {
	startnewGame();
}
var showPlayScreen = function() {
	infoScreenEl.className = "info-screen hidden";
	playScreenEl.className = "play-screen";
	localStorage.skipInfo = 1;
}
var showInfoScreen = function() {
	infoScreenEl.className = "info-screen";
	playScreenEl.className = "play-screen hidden";
}
playgameButtonEl.onclick = showPlayScreen;
helpmeButtonEl.onclick = showInfoScreen;
var state = {
	startIndex: 0,
	timesDone: 0,
	skipInfo: 0,
	amount: 3,
	maxDiff: 10,
	stored: null,
	storedDisc: null,
	moves: 0,
	done: false,
};

function init() {
	state.stored = null;
	state.moves = 0;
	state.done = false;
	state.timesDone = 0;
	hideDoneMessage();
	for(var i=0; i<towerEls.length; i++) {
		var towerEl = towerEls[i];
		towerEl.onclick = towerClick;
		var discContainer = towerEl.children[0];
		empty(discContainer);
	}
	var towerEl = towerEls[state.startIndex];
	var discContainer = towerEl.children[0];
	for(var i=0; i<state.amount; i++) {
		var discEl = document.createElement("div");
		discEl.className = "disc d" + (state.maxDiff - state.amount + i + 1);
		discContainer.appendChild(discEl);
	}
	updateMoveCounter();
}
var towerClick = function() {
	choose(this.data.index);
}
var choose = function(index) {
	var towerEl = appEl.getElementsByClassName("tower")[index];
	var discEl = towerEl.children[0].children[0];
	if(state.stored == null) {
		if(discEl != undefined) {
			state.stored = index;
			state.storedDisc = discEl;
			discEl.className += " selected";
		}
	} else if(index == state.stored) {	
		state.storedDisc.className = state.storedDisc.className.split(" ").slice(0,-1).join(" ");
		state.stored = null;
	} else {
		if(isStoredValid(discEl)) {
			doMove(towerEl.children[0], index);
		}
	}
}
var startnewGame = function() {
	var difficulty = +difficultyEl.value
	state.amount = difficulty;
	init();
}
playnewButtonEl.onclick = startnewGame;
var isStoredValid = function(discEl) {
	if(discEl == undefined) return true;
	var storedSize = +state.storedDisc.className.split(" ")[1].slice(1);
	var targetSize = +discEl.className.split(" ")[1].slice(1);
	var valid = false;
	if(targetSize > storedSize) {
		valid = true;
	}
	return valid;
}
var doMove = function(discContainerEl, fixedKC) {
	discContainerEl.insertBefore(state.storedDisc, discContainerEl.firstChild);
	state.storedDisc.className = state.storedDisc.className.split(" ").slice(0,-1).join(" ");
	state.stored = null;
	state.moves++;
	updateMoveCounter();
	checkIfDone(discContainerEl, fixedKC);
}
var checkIfDone = function(discContainerEl, fixedKC) {
	if(fixedKC != state.startIndex && discContainerEl.children.length == state.amount) {
		state.done = true;
		var newDifficulty = Math.min(state.amount + 1, state.maxDiff);
		difficultyEl.value = "" + newDifficulty
		localStorage.hanoiDifficulty = newDifficulty;
		state.startIndex = fixedKC;
		state.timesDone++;
		localStorage.hanoistartIndex = fixedKC;
		playnewButtonEl.focus();
		displayDoneMessage();
	}
}
var updateMoveCounter = function() {
	moveCounterEl.firstChild.nodeValue = "Moves: " + state.moves;
}
var displayDoneMessage = function() {
	donemessageEl.className = donemessageEl.className.split(" ").slice(0, 1).join(" ");
	doneMessageMovesEl.firstChild.nodeValue = state.moves;
	if(wasMinimalMoves()) {
		doneMessageMinimumEl.className = "minimum";
	} else {
		doneMessageMinimumEl.className = "minimum hidden";
	}
	if(state.timesDone > 1) {
		doneMessageMultipleEl.className = "multiple";
		doneMessageMultipleEl.firstChild.nodeValue = state.timesDone + " times ";
	} else {
		doneMessageMultipleEl.className = "multiple hidden";
	}
}
var hideDoneMessage = function() {
	donemessageEl.className += " hidden";
}
var empty = function(node) {
	var fc = node.firstChild;
	while(fc) {
		node.removeChild(fc);
		fc = node.firstChild;
	}
}
var wasMinimalMoves = function() {
	return (Math.pow(2, state.amount)-1) * state.timesDone == state.moves;
}
init();