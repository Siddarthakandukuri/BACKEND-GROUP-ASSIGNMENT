// Automated check of the 3 twist tests (Part 5). Run with: npm test
process.env.DB_FILE = ':memory:';

const { before, after, test } = require('node:test');
const assert = require('node:assert');
const app = require('../app');

let server;
let base;

before(async () => {
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  base = `http://127.0.0.1:${server.address().port}`;
  for (const name of ['Mango', 'apple', 'Zebra Shelf', 'Banana']) {
    const r = await fetch(`${base}/shelves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, temperature: -18 }),
    });
    assert.strictEqual(r.status, 201);
  }
});

after(() => server.close());

test('Test 1: sort=name&order=asc -> 200, A to Z', async () => {
  const res = await fetch(`${base}/shelves?sort=name&order=asc`);
  assert.strictEqual(res.status, 200);
  const names = (await res.json()).map((s) => s.name);
  assert.deepStrictEqual(names, ['apple', 'Banana', 'Mango', 'Zebra Shelf']);
});

test('Test 2: sort=name&order=desc -> 200, Z to A', async () => {
  const res = await fetch(`${base}/shelves?sort=name&order=desc`);
  assert.strictEqual(res.status, 200);
  const names = (await res.json()).map((s) => s.name);
  assert.deepStrictEqual(names, ['Zebra Shelf', 'Mango', 'Banana', 'apple']);
});

test('Test 3: sort=colour -> 400 "Cannot sort by that field"', async () => {
  const res = await fetch(`${base}/shelves?sort=colour`);
  assert.strictEqual(res.status, 400);
  assert.strictEqual((await res.json()).error, 'Cannot sort by that field');
});
