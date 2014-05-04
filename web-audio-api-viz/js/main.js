var app = app || {};

app.main = (function() {
	var audioContext = null;
	var isPlaying = false;
	var sourceNode = null;
	var analyser = null;
	var theBuffer = null;
	var detectorElem = document.getElementById( "detector" );
		pitchElem = document.getElementById( "pitch" );
		noteElem = document.getElementById( "note" );
		detuneElem = document.getElementById( "detune" );
		detuneAmount = document.getElementById( "detune_amt" );
		canvasContext = document.getElementById( "output" ).getContext("2d");
	var WIDTH=300;
	var CENTER=150;
	var HEIGHT=42;
	var confidence = 0;
	var currentPitch = 0;

	// initialize audio context in a way that supports both 
	// current webkit and future stable versions of the API
	var contextClass = (window.AudioContext || 
	  window.webkitAudioContext || 
	  window.mozAudioContext || 
	  window.oAudioContext || 
	  window.msAudioContext);

	if (contextClass) {
	  // Web Audio API is available.
	  audioContext = new contextClass();
	} else {
	  // Web Audio API is not available. Ask the user to use a supported browser.
	  alert("Web Audio is not supported in this browser");
	}

	// window.requestAnimationFrame = (function(){
	// 	return window.requestAnimationFrame ||
	// 		window.webkitRequestAnimationFrame ||
	// 		window.mozRequestAnimationFrame ||
	// 		window.oRequestAnimationFrame ||
	// 		window.msRequestAnimationFrame ||
	// 		function(callback){
	// 			window.setTimeout(callback, 1000 / 60);
	// 		};
	// })();

	function getUserMedia(dict, callback) {
		try {
			navigator.getUserMedia = 
				navigator.getUserMedia || 
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia;
			navigator.getUserMedia(dict, callback, onStreamError);
		} catch (e) {
			console.log(e);
		}
	}

	function getLiveInput() {
		console.log("getLiveInput called");
		// only get the audio stream
		getUserMedia({audio: true}, onStream);
	};

	function onStream(stream) {
		// wrap a mediaStreamSourceNode around the live input stream
		var input = audioContext.createMediaStreamSource(stream);
		// connect the input to a filter
		// var filter = context.createBiquadFilter();
		// filter.frequency.value = 60.0;
		// filter.type = filter.NOTCH;
		// filter.Q = 10.0;

		analyser = audioContext.createAnalyser();
		analyser.fftSize = 2048;
		input.connect(analyser);
		updatePitch();

		// connect graph
		// input.connect(filter);
		// filter.connect(analyser);

		//set up an animation
		//requestAnimationFrame(render);
	};

	function onStreamError(e) {
		console.error(e);
	};

	function render() {
		// visualize the live audio input
		requestAnimationFrame(render);
	};


	var rafID = null;
	var tracks = null;
	var buflen = 2048;
	var buf = new Uint8Array( buflen );
	var MINVAL = 134;  // 128 == zero.  MINVAL is the "minimum detected signal" level.

	var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

	function noteFromPitch( frequency ) {
		var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
		return Math.round( noteNum ) + 69;
	}

	function frequencyFromNoteNumber( note ) {
		return 440 * Math.pow(2,(note-69)/12);
	}

	function centsOffFromPitch( frequency, note ) {
		return ( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
	}

	function autoCorrelate( buf, sampleRate ) {
		var MIN_SAMPLES = 4;	// corresponds to an 11kHz signal
		var MAX_SAMPLES = 1000; // corresponds to a 44Hz signal
		var SIZE = 1000;
		var best_offset = -1;
		var best_correlation = 0;
		var rms = 0;

		confidence = 0;
		currentPitch = 0;

		if (buf.length < (SIZE + MAX_SAMPLES - MIN_SAMPLES))
			return;  // Not enough data

		for (var i=0;i<SIZE;i++) {
			var val = (buf[i] - 128)/128;
			rms += val*val;
		}
		rms = Math.sqrt(rms/SIZE);

		for (var offset = MIN_SAMPLES; offset <= MAX_SAMPLES; offset++) {
			var correlation = 0;

			for (var i=0; i<SIZE; i++) {
				correlation += Math.abs(((buf[i] - 128)/128)-((buf[i+offset] - 128)/128));
			}
			correlation = 1 - (correlation/SIZE);
			if (correlation > best_correlation) {
				best_correlation = correlation;
				best_offset = offset;
			}
		}
		if ((rms>0.01)&&(best_correlation > 0.01)) {
			confidence = best_correlation * rms * 10000;
			currentPitch = sampleRate/best_offset;
			// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
		}
	//	var best_frequency = sampleRate/best_offset;
	}

	function updatePitch( time ) {
		var cycles = new Array;
		analyser.getByteTimeDomainData( buf );

		// possible other approach to confidence: sort the array, take the median; go through the array and compute the average deviation
		autoCorrelate( buf, audioContext.sampleRate );

		canvasContext.clearRect(0,0,WIDTH,HEIGHT);

	 	if (confidence <10) {
	 		detectorElem.className = "vague";
		 	pitchElem.innerText = "--";
			noteElem.innerText = "-";
			detuneElem.className = "";
			detuneAmount.innerText = "--";
	 	} else {
		 	detectorElem.className = "confident";
		 	pitchElem.innerText = Math.floor( currentPitch ) ;
		 	var note =  noteFromPitch( currentPitch );
			noteElem.innerHTML = noteStrings[note%12];
			var detune = centsOffFromPitch( currentPitch, note );
			if (detune == 0 ) {
				detuneElem.className = "";
				detuneAmount.innerHTML = "--";

				// TODO: draw a line.
			} else {
				if (Math.abs(detune)<10)
					canvasContext.fillStyle = "green";
				else
					canvasContext.fillStyle = "red";

				if (detune < 0) {
		  			detuneElem.className = "flat";
				}
				else {
					detuneElem.className = "sharp";
				}
	  			canvasContext.fillRect(CENTER, 0, (detune*3), HEIGHT);
				detuneAmount.innerHTML = Math.abs( Math.floor( detune ) );
			}
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = window.webkitRequestAnimationFrame;
		rafID = window.requestAnimationFrame( updatePitch );
	}

	return {
		getLiveInput : getLiveInput
	}

})();