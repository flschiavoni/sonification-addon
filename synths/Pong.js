function Pong(context){
   this.context = context;
   this.oscillator = this.context.createOscillator();
   this.lfo = this.context.createOscillator();
   this.gain = this.context.createGain();
   this.lfo_gain = this.context.createGain();
   this.envelope = new Envelope(context, 10, 10, 10, 10, 0.5);
   this.playing = false;
   this.oscillator.start(0);
   this.lfo.start(0);
}

Pong.prototype.stop = function(time){
//   this.lfo.stop(0);
//   this.oscillator.stop(0);
   this.gain.disconnect();
   this.lfo_gain.disconnect();
   this.oscillator.disconnect();
   this.envelope.disconnect();
   this.playing = false;
}


Pong.prototype.play = function(note) {
   if(this.playing == true)
      return;
   this.playing = true;
   this.lfo_gain.gain.value = 1000;
   this.gain.gain.value = 1;
   this.lfo.frequency.value = 10; // value in hertz
   this.oscillator.type = 'sine';
   this.oscillator.frequency.value = midi[note]; // value in hertz
   this.oscillator.connect(this.envelope.node);
   this.envelope.connect(this.gain);
   this.gain.connect(this.context.destination);
   this.lfo.connect(this.lfo_gain);
   this.lfo_gain.connect(this.oscillator.frequency);
   this.envelope.play(this);
}
