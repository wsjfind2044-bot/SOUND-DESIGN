// drawpeaks.js
// inlet 0: indices list (integers 0..bins-1)
// inlet 1: magnitudes list (floats)
// outlet 0: messages to send to a jit.lcd object (e.g., "clear", "setcolor r g b a", "paintoval x1 y1 x2 y2")
// Config messages: "bins N", "size W H", "scale S", "clear"

inlets = 2;
outlets = 1;

var bins = 256;
var width = 512;
var height = 256;
var scaleVal = 10.0;
var lastMags = [];

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
    outlet(0, "setcolor", 255, 60, 60, 255);

    for (var k = 0; k < idxs.length; k++) {
        var idx = idxs[k];
        var mag = (k < lastMags.length) ? Math.abs(lastMags[k]) : 0;
        // map index -> x (time/frequency axis left->right)
        var x = Math.round((idx / Math.max(1, bins - 1)) * (width - 1));
        // map index -> y: low freq at bottom -> higher index up; invert for lcd coords
        var y = Math.round((1 - (idx / Math.max(1, bins - 1))) * (height - 1));
        var r = Math.max(3, Math.round(mag * scaleVal * 10)); // radius from mag
        outlet(0, "paintoval", x - r, y - r, x + r, y + r);
    }
    // flush / bang to ensure redraw (jit.lcd updates on messages)
    outlet(0, "bang");
}

function bins(v) {
    bins = parseInt(v);
    post("drawpeaks: bins set to " + bins + "\n");
}

function size(w,h) {
    width = parseInt(w); height = parseInt(h);
    post("drawpeaks: size set to " + width + "x" + height + "\n");
}

function scale(s) {
    scaleVal = parseFloat(s);
    post("drawpeaks: scale set to " + scaleVal + "\n");
}

function clear() {
    outlet(0, "clear");
    post("drawpeaks: cleared lcd\n");
}