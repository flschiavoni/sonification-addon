var synth;

var initSynth = function(synthType) {
	var type;
	if (synthType == 0) {
		type = "sine";
	} else if (synthType == 1) {
		type = "square";
	} else if (synthType == 2) {
		type = "triangle";
	} else if (synthType == 3) {
		type = "sawtooth";
	}

	synth = new Tone.Synth({
		oscillator: {
			type: type
		}
	}).toMaster();
};

var startNote = function(freq) {
	synth.triggerAttack(freq);
};

var stopNote = function() {
	synth.triggerRelease();
};
