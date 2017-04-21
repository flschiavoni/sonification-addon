var instruments = [];

var initSynths = function() {
	context = new (window.AudioContext || window.webkitAudioContext)();

	instruments.push(new Pong(context));
	instruments.push(new Block(context));
	instruments.push(new Guitar(context));
	instruments.push(new Drum(context));
	instruments.push(new Harpsichord(context));
	instruments.push(new Maraca(context));
};

var startNote = function(synth, note) {
	instruments[synth].play(note);
};

var stopNote = function(synth) {
	instruments[synth].stop();
};
