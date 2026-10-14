// Max js: bang samples the FFT magnitude buffer; list accepts a spectrum.
// Outlet 0: scrolling Jitter matrix; outlet 1: normalized spectrum.
inlets = 1;
outlets = 2;
var spectrumBuffer = new Buffer("fft_magnitudes");
var columns = 512, rows = 256, binCount = 512;
var image = new JitterMatrix(4, "char", columns, rows);
image.setall(0);
var writeColumn = 0;

function bang() {
    if (spectrumBuffer.framecount() < binCount) return;
    render(spectrumBuffer.peek(1, 0, binCount));
}

function list() {
    render(arrayfromargs(arguments));
}

function render(raw) {
    if (!raw || raw.length < 2) return;
    var values = [], normalization = 4 / (raw.length * 2);
    for (var i = 0; i < raw.length; i++) {
        var v = Math.abs(Number(raw[i])) * normalization;
        values.push(isFinite(v) ? v : 0);
    }
    // Circular time axis: oldest columns are overwritten left to right.
    for (var y = 0; y < rows; y++) {
        var index = Math.round((1 - y / (rows - 1)) * (values.length - 1));
        var db = 20 * Math.log(Math.max(values[index], 0.000001)) / Math.LN10;
        var intensity = Math.round(255 * Math.max(0, Math.min(1, (db + 80) / 80)));
        image.setcell2d(writeColumn, y, 255, intensity, intensity, intensity);
    }
    writeColumn = (writeColumn + 1) % columns;
    outlet(1, values);
    outlet(0, "jit_matrix", image.name);
}

function clear() {
    image.setall(0);
    writeColumn = 0;
    outlet(0, "jit_matrix", image.name);
}
