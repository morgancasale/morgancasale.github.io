const soundEffect = new Audio();

let empty = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
let music = "pitbull.mp3";

soundEffect.src = empty;

soundEffect.autoplay = true;

// let audio = new Audio("pitbull.mp3");

function play() {
    //soundEffect.currentTime = 134;
    soundEffect.src = music;
}

function pause() {
    soundEffect.src = empty;
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