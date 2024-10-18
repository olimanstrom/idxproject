// Set up keypress events for starting and stopping recording
// S for start
// A for stop
document.addEventListener("keypress", function(event) {
    if (event.key === 's') {
      startRecording();
    } else if (event.key === 'a') {
      stopRecording();
    }
});