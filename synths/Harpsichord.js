function Harpsichord(context){
   this.context = context;
   this.envelope = new Envelope(context, 100, 54, 3, 50, 0.5);
}

Harpsichord.prototype.play = function(note, dynamic) {
   var modulator_gain = 20000;
   var modulator_freq = 1;
   var carrier_freq = midi[note % midi.length];

   this.carrier = this.context.createOscillator();
   this.modulator = this.context.createOscillator();
   this.modulatorGain = this.context.createGain();
   this.dynamics = this.context.createGain();

   this.carrier.frequency.value = carrier_freq;
   this.modulator.frequency.value = (carrier_freq * modulator_freq);
   this.modulatorGain.gain.value = modulator_gain;
   this.dynamics.gain.value = (isNaN(dynamic))?1:dynamic;

   this.carrier.connect(this.envelope.node);
   this.modulator.connect(this.modulatorGain);
   this.modulatorGain.connect(this.carrier.frequency);
   this.envelope.connect(this.dynamics);
   this.dynamics.connect(this.context.destination);

   this.carrier.start(0);
   this.modulator.start(0);
   this.envelope.play(this);
};


Harpsichord.prototype.stop = function(){
   this.carrier.stop(0);
   this.modulator.stop(0);
   this.carrier.disconnect();
   this.modulator.disconnect();
   this.envelope.disconnect();
};
