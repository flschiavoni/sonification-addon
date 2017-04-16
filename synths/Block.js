function Block(context){
   this.context = context;
   this.envelope = new Envelope(context, 2, 10, 30, 100, 0.5);
}

Block.prototype.play = function(note) {
   this.oscillator = this.context.createOscillator();
   this.oscillator.type = 'sine';
   this.oscillator.frequency.value = midi[note];
	this.oscillator.connect(this.envelope.node);
   this.envelope.connect(this.context.destination);
   this.oscillator.start(0);
   this.envelope.play(this);
};

Block.prototype.stop = function(){
	this.oscillator.stop(0);
	this.oscillator.disconnect();
   this.envelope.disconnect();
};
