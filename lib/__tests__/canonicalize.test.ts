import { describe, it, expect } from "vitest";
import { canonicalize, parseNumber } from "@/lib/engine/canonicalize";
import { gradeAnswer } from "@/lib/engine/grader";
import { hashAnswer } from "@/lib/banks/shared";

function accepts(reference: string, typed: string, normalization: Parameters<typeof canonicalize>[1], dp?: number) {
  const key = { hash: hashAnswer(reference, normalization, dp), normalization, decimalPlaces: dp };
  return gradeAnswer(typed, key).correct;
}

describe("canonicalize: exact", () => {
  it("accepts spaces around separators in ID lists", () => {
    expect(accepts("224,378,893", "224, 378, 893", "exact")).toBe(true);
    expect(accepts("224,378,893", " 224 ,378 , 893 ", "exact")).toBe(true);
    expect(accepts("0-3-6-1-2", "0 - 3 - 6 - 1 - 2", "exact")).toBe(true);
    expect(accepts("0,0,254,0", "0, 0, 254, 0", "exact")).toBe(true);
  });
  it("is case-insensitive for IDs and letter strings", () => {
    expect(accepts("TX_000145", "tx_000145", "exact")).toBe(true);
    expect(accepts("TX_000145", "Tx_ 000145", "exact")).toBe(true);
    expect(accepts("NNAAAVNVANNAVVANNNNA", "nnaaavnvannavvannnna", "exact")).toBe(true);
  });
  it("still rejects different content", () => {
    expect(accepts("224,378,893", "224,378,894", "exact")).toBe(false);
    expect(accepts("TX_000145", "TX_000146", "exact")).toBe(false);
    expect(accepts("0-3-6-1-2", "0-3-6-2-1", "exact")).toBe(false);
    expect(accepts("3", "4", "exact")).toBe(false);
  });
});

describe("canonicalize: hex-lowercase", () => {
  it("accepts case, 0x, and grouping", () => {
    expect(accepts("ED418DC0", "ed418dc0", "hex-lowercase")).toBe(true);
    expect(accepts("ED418DC0", "0xED418DC0", "hex-lowercase")).toBe(true);
    expect(accepts("ED418DC0", "ED 41 8D C0", "hex-lowercase")).toBe(true);
    expect(accepts("ED418DC0", "ed:41:8d:c0", "hex-lowercase")).toBe(true);
    expect(accepts("0350fd,05baff", "0350FD, 05BAFF", "hex-lowercase")).toBe(true);
  });
  it("rejects different hex", () => {
    expect(accepts("ED418DC0", "ED418DC1", "hex-lowercase")).toBe(false);
  });
});

describe("canonicalize: numeric-rounded", () => {
  it("accepts thousands separators, spaces and unicode minus", () => {
    expect(accepts("584368244.067120", "584,368,244.06712", "numeric-rounded", 6)).toBe(true);
    expect(accepts("584368244.067120", "584 368 244.06712", "numeric-rounded", 6)).toBe(true);
    expect(accepts("-4.000000", "−4", "numeric-rounded", 6)).toBe(true);
    expect(accepts("0.047210", "0,047210", "numeric-rounded", 6)).toBe(true);
    expect(accepts("0.125000", "0,125", "numeric-rounded", 6)).toBe(true);
    expect(accepts("-0.047000", "-0,047", "numeric-rounded", 6)).toBe(true);
    expect(accepts("3.141590", "3,14159", "numeric-rounded", 6)).toBe(true);
    expect(accepts("1500.000000", "1,500", "numeric-rounded", 6)).toBe(true);
    expect(accepts("0.047210", "+0.04721", "numeric-rounded", 6)).toBe(true);
    expect(accepts("0.109109", " 0.109109 ", "numeric-rounded", 6)).toBe(true);
  });
  it("normalizes negative zero", () => {
    expect(canonicalize("-0.0000001", "numeric-rounded", 6)).toBe("0.000000");
  });
  it("rejects wrong values", () => {
    expect(accepts("0.047210", "0.047211", "numeric-rounded", 6)).toBe(false);
    expect(accepts("0.047210", "abc", "numeric-rounded", 6)).toBe(false);
  });
});

describe("parseNumber", () => {
  it("parses common human formats", () => {
    expect(parseNumber("1,234,567.89")).toBe(1234567.89);
    expect(parseNumber("1 234")).toBe(1234);
    expect(parseNumber("0,5")).toBe(0.5);
    expect(parseNumber("-3.5e2")).toBe(-350);
    expect(parseNumber(".5")).toBe(0.5);
  });
  it("rejects non-numbers", () => {
    expect(parseNumber("")).toBeNull();
    expect(parseNumber("12abc")).toBeNull();
    expect(parseNumber("1,23,456")).toBeNull();
  });
});

describe("canonicalize: trimmed-lowercase", () => {
  it("folds case and collapses whitespace", () => {
    expect(accepts("apoqxbnl", "  APOQXBNL ", "trimmed-lowercase")).toBe(true);
    expect(canonicalize("Hello   World", "trimmed-lowercase")).toBe("hello world");
  });
});
