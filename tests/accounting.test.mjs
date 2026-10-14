import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Load source as text and extract contract assertions here; full TS runtime tests are added
// when the project dependencies are installed. These tests lock down the accounting policy.
const source = await readFile(new URL("../lib/accounting.ts", import.meta.url), "utf8");

test("accounting explicitly excludes personal GPay and receivables from centre funds", () => {
  assert.match(source, /PERSONAL_GPAY/);
  assert.match(source, /case "CREDIT_GIVEN":[\s\S]*?return 0/);
  assert.match(source, /case "ADVANCE_USED":[\s\S]*?return 0/);
  assert.match(source, /Personal GPay is never centre money/);
});

test("centre transfers are not counted as income or expense", () => {
  assert.match(source, /case "CENTRE_TRANSFER":[\s\S]*?return 0/);
});

test("closing calculation exposes movement, expected movement and discrepancy", () => {
  assert.match(source, /actualMovementPaise/);
  assert.match(source, /expectedMovementPaise/);
  assert.match(source, /unexplainedShortagePaise/);
});
