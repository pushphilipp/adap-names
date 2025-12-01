import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b04/names/Name";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";

describe("Design by contract: preconditions and invariants for Name", () => {
  it("rejects invalid delimiter characters", () => {
    expect(() => new StringName("oss", "##" as unknown as string)).toThrow(IllegalArgumentException);
    expect(() => new StringArrayName(["oss"], "")).toThrow(IllegalArgumentException);
  });

  it("guards component access bounds", () => {
    const name: Name = new StringName("oss.cs");
    expect(() => name.getComponent(-1)).toThrow(IllegalArgumentException);
    expect(() => name.setComponent(5, "oops")).toThrow(IllegalArgumentException);
    expect(() => name.insert(3, "oops")).toThrow(IllegalArgumentException);
    expect(() => name.remove(3)).toThrow(IllegalArgumentException);
  });

  it("ensures invariants are maintained after modifications", () => {
    const name = new StringName("oss.cs");
    name.append("fau");
    expect(name.getNoComponents()).toBe(3);
    (name as StringName)["name"] = "broken";
    expect(() => name.getComponent(2)).toThrow(InvalidStateException);
    (name as StringName)["noComponents"] = -1;
    expect(() => name.asString()).toThrow(InvalidStateException);
  });
});

describe("Functional parity with previous exercise", () => {
  it("supports building and manipulating StringName", () => {
    let n: Name = new StringName("oss.fau");
    n.append("de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.remove(2);
    expect(n.asString()).toBe("oss.cs.de");
  });

  it("supports building and manipulating StringArrayName", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    n.setComponent(1, "inf");
    expect(n.asString()).toBe("oss.inf.fau.de");
  });

  it("maintains equality and cloning behavior", () => {
    let original: Name = new StringName("oss.cs.fau.de");
    let clone = original.clone();

    expect(clone.isEqual(original)).toBe(true);
    clone.append("extra");
    expect(clone.isEqual(original)).toBe(false);
  });
});
