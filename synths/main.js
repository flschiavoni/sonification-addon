var context;
var block;
// var drum;
var guitar;
var harpsichord;
// var maraca;
var pong;

var initSynths = function() {
	context = new (window.AudioContext || window.webkitAudioContext)();
	block = new Block(context);
	// drum = new Drum(context);
	guitar = new Guitar(context);
	harpsichord = new Harpsichord(context);
	// maraca = new Maraca(context);
	pong = new Pong(context);
};

var startNote = function(synth, note) {
	if (synth == 1) {
		guitar.play(note);
	} else if (synth == 2) {
		block.play(note);
	}
};

var stopNote = function(synth) {
	if (synth == 1) {
		guitar.stop();
	} else if (synth == 2) {
		block.stop();
	}
};
