// Shared validation for the local browser-to-Max bridge.
function parameters(frame) {
  if (!frame || frame.present !== true) return [220, 0];
  const { y, pinch } = frame;
  if (!Number.isFinite(y) || !Number.isFinite(pinch)) throw new Error('Invalid landmarks');
  const height = Math.max(0, Math.min(1, y));
  const opening = Math.max(0, Math.min(1, pinch));
  return [110 * Math.pow(8, 1 - height), 0.05 * opening];
}
module.exports = { parameters };
