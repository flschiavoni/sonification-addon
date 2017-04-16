function Guitar(context){
   this.context = context;
   this.node = this.context.createScriptProcessor(4096, 0, 1);
   this.envelope = new Envelope(context, 300, 100, 300, 1000, 0.7);
   this.volume = this.context.createGain();
   this.distortion = this.context.createWaveShaper();
}

Guitar.prototype.stop = function(time){
   this.node.disconnect();
   this.envelope.disconnect();
}

Guitar.prototype.play = function(note) {

   var frequency = midi[note];
   var impulse = 0.0001 * this.context.sampleRate;

   var N = Math.round(this.context.sampleRate / frequency);
   var y = new Float32Array(N);
   var n = 0;
   this.node.onaudioprocess = function (e) {
     var output = e.outputBuffer.getChannelData(0);
     for (var i = 0; i < e.outputBuffer.length; ++i) {
       var xn = (--impulse >= 0) ? Math.random()-0.5 : 0;
       output[i] = y[n] = xn + (y[n] + y[(n + 1) % N]) / 2;
       if (++n >= N) n = 0;
     }
   }

   this.volume.gain.value = 2;

   this.distortion.curve = makeDistortionCurve(1000);

   this.volume.connect(context.destination);
   this.distortion.connect(this.volume);
   this.envelope.connect(this.distortion);
   this.node.connect(this.envelope.node);
   this.envelope.play(this);
}
