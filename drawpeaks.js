// drawpeaks.js
// inlet 0: indices list (integers 0..bins-1)
// inlet 1: magnitudes list (floats)
// outlet 0: messages to send to a jit.lcd object (e.g., "clear", "frgb r g b", "paintoval x1 y1 x2 y2")
// Config messages: "bins N", "size W H", "scale S", "clear"

inlets = 2;
outlets = 1;

var binCount = 512;
var width = 512;
var height = 256;
var scaleVal = 10.0;
var lastMags = [];

// Max dispatches one-element numeric lists as int/float messages.
function msg_int(v) { list(v); }
function msg_float(v) { list(v); }

function list() {
    var args = arrayfromargs(arguments);
    if (inlet == 0) {
        // indices
        var idxs = args;
        draw(idxs);
    } else {
        // mags
        lastMags = args;
    }
}

function draw(idxs) {
    // clear first
    outlet(0, "clear");
    // set marker color (red)
    outlet(0, "frgb", 255, 60, 60);

    for (var k = 0; k < idxs.length; k++) {
        var idx = Number(idxs[k]);
        if (!isFinite(idx) || idx < 0 || idx >= binCount) continue;
        var mag = (k < lastMags.length) ? Math.abs(lastMags[k]) : 0;
        if (!isFinite(mag)) mag = 0;
        // map index -> x (time/frequency axis left->right)
        var x = Math.round((idx / Math.max(1, binCount - 1)) * (width - 1));
        // map index -> y: low freq at bottom -> higher index up; invert for lcd coords
        var y = Math.round((1 - (idx / Math.max(1, binCount - 1))) * (height - 1));
        var r = Math.max(3, Math.round(mag * scaleVal * 10)); // radius from mag
        outlet(0, "paintoval", x - r, y - r, x + r, y + r);
    }
    // flush / bang to ensure redraw (jit.lcd updates on messages)
    outlet(0, "bang");
}

function bins(v) {
    var n = parseInt(v, 10);
    if (isFinite(n) && n > 1) binCount = n;
    post("drawpeaks: bins set to " + binCount + "\n");
}

function size(w,h) {
    var nextWidth = parseInt(w, 10), nextHeight = parseInt(h, 10);
    if (isFinite(nextWidth) && nextWidth > 0) width = nextWidth;
    if (isFinite(nextHeight) && nextHeight > 0) height = nextHeight;
    post("drawpeaks: size set to " + width + "x" + height + "\n");
}

function scale(s) {
    var nextScale = parseFloat(s);
    if (isFinite(nextScale) && nextScale >= 0) scaleVal = nextScale;
    post("drawpeaks: scale set to " + scaleVal + "\n");
}

function clear() {
    outlet(0, "clear");
    post("drawpeaks: cleared lcd\n");
}
