const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
function host(file, extra = {}) {
  const events = [];
  const ctx = { inlet: 0, post() {}, arrayfromargs: a => Array.from(a),
    outlet: (...args) => events.push(JSON.parse(JSON.stringify(args))), ...extra };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx);
  return { ctx, events };
}
test('bins remains callable and changes coordinates; invalid settings retain valid state', () => {
  const { ctx, events } = host('drawpeaks.js');
  ctx.bins(3); ctx.size(101, 51); ctx.scale(0);
  ctx.bins('bad'); ctx.size(-1, 0); ctx.scale(NaN);
  ctx.inlet = 1; ctx.msg_float(0.5); ctx.inlet = 0; ctx.msg_int(2);
  assert.deepEqual(events[1], [0, 'frgb', 255, 60, 60]);
  assert.ok(events.every(e => ['clear', 'frgb', 'paintoval', 'bang'].includes(e[1])));
  assert.deepEqual(events[2], [0, 'paintoval', 97, -3, 103, 3]);
  assert.equal(typeof ctx.bins, 'function');
});
test('peak detection preserves paired magnitudes, handles plateaus and clears silence', () => {
  const { ctx, events } = host('peakfinder.js');
  ctx.limit(2); ctx.list(0, 0.4, 0, 0.9, 0.9, 0, 0.6, 0);
  assert.deepEqual(events, [[1, [0.9, 0.6]], [0, [3, 6]]]);
  events.length = 0; ctx.list(0, 0, 0);
  assert.deepEqual(events, [[0, 'clear']]);
});
test('FFT buffer produces normalized spectrum, bounded pixels and working peak/draw pipeline', () => {
  let raw = Array(512).fill(0); raw[10] = 12.8;
  const pixels = [];
  const { ctx, events } = host('spectrogram.js', {
    Buffer: function () { this.framecount = () => raw.length; this.peek = () => raw; },
    JitterMatrix: function () { this.name = 'mock'; this.setall = () => {}; this.setcell2d = (...a) => pixels.push(a); }
  });
  ctx.bang();
  assert.equal(events[0][0], 1);
  assert.equal(events[0][1][10], 0.05);
  assert.deepEqual(events[1], [0, 'jit_matrix', 'mock']);
  assert.equal(pixels.length, 256);
  assert.ok(pixels.every(p => p.slice(2).every(v => Number.isFinite(v) && v >= 0 && v <= 255)));
  const peaks = host('peakfinder.js'), draw = host('drawpeaks.js');
  peaks.ctx.list(...events[0][1]);
  for (const [port, values] of peaks.events) { draw.ctx.inlet = port; draw.ctx.list(...values); }
  assert.equal(draw.events.filter(e => e[1] === 'paintoval').length, 1);
  assert.ok(draw.events.flat().every(v => typeof v !== 'number' || Number.isFinite(v)));
  for (let i = 0; i < 512; i++) ctx.bang();
  assert.equal(ctx.writeColumn, 1);
  ctx.clear(); assert.equal(ctx.writeColumn, 0);
  const count = events.length; raw = []; ctx.bang(); assert.equal(events.length, count);
});
test('patch dependencies exist, every connection uses a valid port and FFT reaches displays', () => {
  const main = JSON.parse(fs.readFileSync(path.join(root, 'SOUND-DESIGN.maxpat'))).patcher;
  const fft = JSON.parse(fs.readFileSync(path.join(root, 'pfft_pipe.maxpat'))).patcher;
  for (const p of [main, fft]) {
    const boxes = new Map(p.boxes.map(({ box }) => [box.id, box]));
    for (const { patchline: l } of p.lines) {
      assert.ok(boxes.has(l.source[0]) && boxes.has(l.destination[0]));
      assert.ok(l.source[1] >= 0 && l.source[1] < boxes.get(l.source[0]).numoutlets);
      assert.ok(l.destination[1] >= 0 && l.destination[1] < boxes.get(l.destination[0]).numinlets);
    }
    for (const { box: b } of p.boxes) {
      if (b.text?.startsWith('js ')) assert.ok(fs.existsSync(path.join(root, b.text.split(' ')[1])));
      if (b.text?.startsWith('pfft~ ')) assert.ok(fs.existsSync(path.join(root, b.text.split(' ')[1] + '.maxpat')));
    }
  }
  const edge = (a, ao, b, bi) => main.lines.some(({ patchline: l }) => l.source[0] === a && l.source[1] === ao && l.destination[0] === b && l.destination[1] === bi);
  assert.ok(edge('gain', 0, 'fft', 0));
  assert.ok(edge('spectrum', 1, 'peaks', 0));
  assert.ok(edge('peaks', 1, 'draw', 1) && edge('peaks', 0, 'draw', 0));
  assert.ok(edge('spectrum', 0, 'spectroview', 0) && edge('lcd', 0, 'peakview', 0));
  assert.equal(fs.readFileSync(path.join(root, 'Max补丁文稿'), 'utf8'), fs.readFileSync(path.join(root, 'SOUND-DESIGN.maxpat'), 'utf8'));
});
