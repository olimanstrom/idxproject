/*
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('changeFileButton');
  let currentScript = 'sketch.js';
  let p5Instance;

  button.addEventListener('click', () => {
    // Remove the current script
    const oldScript = document.querySelector(`script[src="${currentScript}"]`);
    if (oldScript) {
      oldScript.remove();
    }

    // Stop the current p5.js instance if it exists
    if (p5Instance) {
      p5Instance.remove();
    }

    // Determine the new script to load
    currentScript = currentScript === 'sketch.js' ? 'sketch2.js' : 'sketch.js';

    // Create and append the new script
    const newScript = document.createElement('script');
    newScript.src = currentScript;
    newScript.onload = () => {
      // Initialize the new p5.js instance
      p5Instance = new p5();
    };
    document.body.appendChild(newScript);
  });
});
*/

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('changeFileButton');
  button.addEventListener('click', () => {
    const currentPage = window.location.pathname;
    if (currentPage.endsWith('index.html')) {
      window.location.href = 'page2.html';
    } else {
      window.location.href = 'index.html';
    }
  });
});