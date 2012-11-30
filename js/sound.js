var audioContext = null;
if (typeof AudioContext == "function") {
    audioContext = new AudioContext();
} else if (typeof webkitAudioContext == "function") {
    audioContext = new webkitAudioContext();
}

function loadSound(url, name) {
    if(audioContext == null) return;
    
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
            game.sounds[name] = buffer;
        }, function() {
            console.log("Failed to load sound");
        });
    };
    request.send();
}

function playSound(name, offset) {
    if(!game.sound || audioContext == null) return;
    var source = audioContext.createBufferSource();
    source.buffer = game.sounds[name];
    source.connect(audioContext.destination); 
    source.noteOn(offset);
};
