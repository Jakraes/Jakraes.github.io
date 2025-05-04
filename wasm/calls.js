let initialDistance = null;
let pinchZooming = false;

function getDistance(touches) {
  const [touch1, touch2] = touches;
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

document.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    initialDistance = getDistance(e.touches);
    pinchZooming = true;
  }
});

document.addEventListener('touchmove', (e) => {
  if (pinchZooming && e.touches.length === 2) {
    const currentDistance = getDistance(e.touches);
    const scale = currentDistance / initialDistance;

    // Call the C function with the pinch scale
    if (Module.ccall) {
      Module.ccall('onPinch', 'void', ['number'], [scale]);
    }
  }
});

document.addEventListener('touchend', (e) => {
  if (e.touches.length < 2) {
    pinchZooming = false;
    initialDistance = null;
  }
});