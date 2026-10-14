const test = require('node:test');
const assert = require('node:assert/strict');
const { parameters } = require('../gesture-control.cjs');
const { start } = require('../gesture-max.js');
test('hand mapping is bounded and absence mutes', () => {
  assert.deepEqual(parameters({present:false}),[220,0]);
  assert.deepEqual(parameters({present:true,y:0,pinch:1}),[880,0.05]);
  assert.deepEqual(parameters({present:true,y:1,pinch:0}),[110,0]);
  assert.deepEqual(parameters({present:true,y:-10,pinch:9}),[880,0.05]);
  assert.throws(()=>parameters({present:true,y:NaN,pinch:1}));
});
test('real HTTP bridge delivers controls and mutes when frames stop', async () => {
  const events=[];
  const server=start({outlet:(...args)=>events.push(args),post(){}},0);
  await new Promise(resolve=>server.once('listening',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  try {
    assert.match(await (await fetch(base)).text(),/开启摄像头/);
    assert.equal((await fetch(base+'/frame',{method:'POST',body:'{}'})).status,403);
    const response=await fetch(base+'/frame',{method:'POST',headers:{Origin:base},body:JSON.stringify({present:true,y:0.5,pinch:1})});
    assert.equal(response.status,204);
    assert.equal(events.at(-1)[2],0.05);
    await new Promise(resolve=>setTimeout(resolve,750));
    assert.deepEqual(events.at(-1),['gesture',220,0]);
    assert.equal((await fetch(base+'/frame',{method:'POST',headers:{Origin:base},body:'broken'})).status,400);
    assert.deepEqual(events.at(-1),['gesture',220,0]);
  } finally { await new Promise(resolve=>server.close(resolve)); }
});
