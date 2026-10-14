// Max js: spectrum list in; peak indices out 0, matching magnitudes out 1.
// Output magnitudes first so drawpeaks has them before indices trigger drawing.
inlets = 1;
outlets = 2;
var minimum = 0.001;
var maxPeaks = 16;

function list() {
    var values = arrayfromargs(arguments), peaks = [];
    for (var i = 1; i < values.length - 1; i++) {
        var v = Math.abs(Number(values[i]));
        if (isFinite(v) && v >= minimum &&
            v > Math.abs(Number(values[i - 1])) &&
            v >= Math.abs(Number(values[i + 1]))) {
            peaks.push({ index: i, magnitude: v });
        }
    }
    peaks.sort(function(a, b) { return b.magnitude - a.magnitude || a.index - b.index; });
    peaks = peaks.slice(0, maxPeaks);
    peaks.sort(function(a, b) { return a.index - b.index; });
    var indices = [], magnitudes = [];
    for (var k = 0; k < peaks.length; k++) {
        indices.push(peaks[k].index);
        magnitudes.push(peaks[k].magnitude);
    }
    if (indices.length) {
        outlet(1, magnitudes);
        outlet(0, indices);
    } else {
        outlet(0, "clear");
    }
}

function threshold(v) {
    v = Number(v);
    if (isFinite(v) && v >= 0) minimum = v;
}

function limit(v) {
    v = parseInt(v, 10);
    if (isFinite(v) && v > 0) maxPeaks = v;
}
