// Add event listener for keypresses to switch modes
// F for fullbody
// I for invisible
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