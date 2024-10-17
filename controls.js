// Toggle between modes and restart segmentation
/*
document.getElementById('toggleMode').addEventListener('click', function () {
    currentMode = currentMode === 'Invisble' ? 'fullBody' : 'Invisble';
    console.log(`Switching to ${currentMode} mode`);
    startSegmentation(currentMode);
  });
  
  // Hook up recording start/stop if needed
  document.getElementById('startRecording').addEventListener('click', startRecording);
  document.getElementById('stopRecording').addEventListener('click', stopRecording);
*/

// Add event listener for keypresses to switch modes
 document.addEventListener('keydown', function (event) {
    if (event.key === 'f' || event.key === 'F') {
      currentMode = 'fullBody';
      console.log('Switching to Full Body mode');
      startSegmentation(currentMode);  // Switch to Full Body mode
    } else if (event.key === 'i' || event.key === 'I') {
      currentMode = 'Invisible';
      console.log('Switching to Invisible mode');
      startSegmentation(currentMode);  // Switch to Better Performance mode
    }
  });