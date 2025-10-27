import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b01/names/Name";

describe("Basic initialization tests", () => {
  it("test construction 1", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Basic function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    // Original name string = "oss.cs.fau.de"
    let n: Name = new Name(["oss.cs.fau.de"], '#');
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("Advanced escaping and delimiter behavior", () => {
  it("asDataString escapes dots and backslashes in components (default delimiter)", () => {
    // components: ["a.b", "c\\d", "e"]
    const n = new Name(["a.b", "c\\d", "e"]);
    // Expected: a\.b.c\\d.e
    expect(n.asDataString()).toBe("a\\.b.c\\\\d.e");
  });

  it("asDataString uses default delimiter '.' even if instance delimiter is '#'", () => {
    const n = new Name(["oss.cs", "fa#u", "de"], '#');
    // Only dots are special in data string; '#" remains as-is
    expect(n.asDataString()).toBe("oss\\.cs.fa#u.de");
  });

  it("asString joins with provided delimiter argument, overriding instance delimiter", () => {
    const n = new Name(["a", "b"], '#');
    expect(n.asString('/')).toBe("a/b");
    expect(n.asString('#')).toBe("a#b");
  });

  it("supports empty components with custom delimiter (human readable)", () => {
    const n = new Name(["", "", "", ""], '/');
    expect(n.asString()).toBe("///"); // four empty components = three delimiters
  });

  it("empty components produce adjacent dots in asDataString (machine readable)", () => {
    const n = new Name(["", "", "", ""], '/');
    expect(n.asDataString()).toBe("...");
  });

  it("insert/append with escaping interplay", () => {
    const n = new Name(["a.b"], '#');
    n.append("c");
    n.insert(1, "d.e");
    // Human readable with '#'
    expect(n.asString()).toBe("a.b#d.e#c");
    // Machine readable with default '.' and escaped dots in components
    expect(n.asDataString()).toBe("a\\.b.d\\.e.c");
  });

  it("get/set component with special characters reflects in outputs", () => {
    const n = new Name(["x", "y", "z"], '.');
    n.setComponent(1, "p.q\\r"); // contains dot and backslash
    expect(n.getComponent(1)).toBe("p.q\\r");
    // Human readable with '.' shows the raw component
    expect(n.asString()).toBe("x.p.q\\r.z");
    // Machine readable escapes both dot and backslash
    expect(n.asDataString()).toBe("x.p\\.q\\\\r.z");
  });
});
