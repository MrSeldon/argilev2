// Unit tests for shelf merge/replay semantics. Run: node --test scripts/shelf/ops.test.mts
import { test } from "node:test";
import assert from "node:assert/strict";
import { applyOps, clean, type Op, type ShelfEntry } from "../../lib/shelf/ops.ts";

const e = (id: string, x: Partial<ShelfEntry> = {}): ShelfEntry => ({ id, added_at: "2026-10-01T00:00:00Z", ...x });
const ids = (l: ShelfEntry[]) => l.map((x) => x.id);

test("first sign-in merge is a union by id (cloud entries keep their data)", () => {
  const cloud = [e("silica", { amount: 10, unit: "kg" }), e("kaolin")];
  const local = [e("silica"), e("wood-ash")];
  const merged = applyOps(cloud, local.map((x): Op => ({ t: "add", e: x, overwrite: false })));
  assert.deepEqual(ids(merged), ["silica", "kaolin", "wood-ash"]);
  assert.equal(merged[0].amount, 10);
});

test("pending ops replay on a newer server copy without clobbering another device's edit", () => {
  const seen = [e("silica"), e("kaolin")];
  const pending: Op[] = [{ t: "add", e: e("whiting") }, { t: "remove", id: "kaolin" }];
  const newerServer = [...seen, e("talc")]; // laptop added talc meanwhile
  assert.deepEqual(ids(applyOps(newerServer, pending)), ["silica", "talc", "whiting"]);
});

test("confirmed photo updates amount on an existing entry (overwrite)", () => {
  const out = applyOps([e("whiting", { amount: 5, unit: "kg" })], [{ t: "add", e: e("whiting", { amount: 25, unit: "kg", source: "photo" }), overwrite: true }]);
  assert.equal(out.length, 1);
  assert.equal(out[0].amount, 25);
  assert.equal(out[0].source, "photo");
});

test("clear, then add", () => {
  assert.deepEqual(ids(applyOps([e("a"), e("b")], [{ t: "clear" }, { t: "add", e: e("c") }])), ["c"]);
});

test("v1 string ids and junk are cleaned, duplicates dropped", () => {
  assert.deepEqual(ids(clean(["silica", "silica", { id: "kaolin" }, null, 3, { x: 1 }])), ["silica", "kaolin"]);
  assert.deepEqual(clean("nope"), []);
});
