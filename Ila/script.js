
let audioCtx;
let source;
let filter;
let bitCrusher;
let audio = new Audio("pitbull.mp3");
let isEffectApplied = false;

function play() {
    audio.currentTime = 134;
    audio.play();
}

function pause() {
    audio.pause();
}

function setupAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    source = audioCtx.createMediaElementSource(audio);

    // Low-pass filter (removes high frequencies)
    filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 3000; // Adjust for more/less muffling

    // Bit crusher (reduces audio bit depth)
    bitCrusher = audioCtx.createWaveShaper();
    function createBitCrusherCurve(bits = 4) {
        const curve = new Float32Array(256);
        const step = Math.pow(0.5, bits);
        for (let i = 0; i < 256; i++) {
            curve[i] = Math.floor(i * step) / 256;
        }
        return curve;
    }
    bitCrusher.curve = createBitCrusherCurve(3);

    // Connect nodes: Source → Filter → BitCrusher → Output
    source.connect(filter);
    filter.connect(bitCrusher);
    bitCrusher.connect(audioCtx.destination);
}