function Drum(context){
   this.context = context;
   this.gain = this.context.createGain();
   this.envelope = new Envelope(context, 2, 1, 3, 10, 0.5);
}

Drum.prototype.stop = function(time){
   this.oscillator.stop(0);
   this.gain.disconnect();
   this.oscillator.disconnect();
   this.envelope.disconnect();
}


Drum.prototype.play = function(note) {
   this.oscillator = this.context.createOscillator();
   this.gain.gain.value = 2;
   this.oscillator.type = 'sine';
   this.oscillator.frequency.value = midi[note]; // value in hertz
   this.oscillator.connect(this.envelope.node);
   this.envelope.connect(this.gain);
   this.gain.connect(this.context.destination);
   this.oscillator.start(0);
   this.envelope.play(this);
}
