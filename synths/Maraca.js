function Maraca(context){
   this.context = context;
   this.envelope = new Envelope(context, 40, 0, 60, 80, 0.5);
}

Maraca.prototype.stop = function(time){
   this.lfo.stop(0);
   this.envelope.disconnect();
   this.whiteNoise.stop(0);
}


Maraca.prototype.play = function(note) {
   this.whiteNoise = new WhiteNoise(this.context);
   this.filter = context.createBiquadFilter();
   this.lfo = context.createOscillator();
   this.lfo_gain = context.createGain();

   this.lfo.frequency.value = 1;
   this.lfo.connect(this.lfo_gain);
   this.lfo.start(0);

   this.lfo_gain.gain.value = 2000;
   this.lfo_gain.connect(this.filter.frequency);

   this.filter.type = 'bandpass';
   this.filter.frequency.value = 200;
   this.filter.gain.value = 20;
   this.filter.Q.value = 0.2;
   this.filter.connect(this.envelope.node);

   this.envelope.connect(this.context.destination);
   this.envelope.play(this);

   this.whiteNoise.connect(this.filter);
}
