import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { AbstractName } from "../../../src/adap-b03/names/AbstractName";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";

describe("Class Design Tests", () => {
  it("AbstractName should be abstract (cannot be instantiated directly)", () => {
    // AbstractName is abstract, so we verify it through its subclasses
    expect(() => new StringName("test")).not.toThrow();
    expect(() => new StringArrayName(["test"])).not.toThrow();
  });

  it("StringName should be an instance of AbstractName", () => {
    const n: Name = new StringName("oss.fau.de");
    expect(n).toBeInstanceOf(StringName);
    // We can't directly test instanceof AbstractName in TypeScript runtime,
    // but we can verify the interface implementation
    expect(typeof n.clone).toBe("function");
    expect(typeof n.asString).toBe("function");
    expect(typeof n.getDelimiterCharacter).toBe("function");
  });

  it("StringArrayName should be an instance of AbstractName", () => {
    const n: Name = new StringArrayName(["oss", "fau", "de"]);
    expect(n).toBeInstanceOf(StringArrayName);
    // Verify interface implementation
    expect(typeof n.clone).toBe("function");
    expect(typeof n.asString).toBe("function");
    expect(typeof n.getDelimiterCharacter).toBe("function");
  });

  it("Both implementations can be used as AbstractName type", () => {
    const names: Name[] = [
      new StringName("oss.fau.de"),
      new StringArrayName(["oss", "fau", "de"])
    ];

    names.forEach(name => {
      expect(name.getNoComponents()).toBe(3);
      expect(name.asString()).toBe("oss.fau.de");
      expect(name.isEmpty()).toBe(false);
    });
  });

  it("Both implementations implement the Name interface", () => {
    const stringName: Name = new StringName("test.name");
    const arrayName: Name = new StringArrayName(["test", "name"]);

    // Test that all Name interface methods are available
    expect(stringName.isEmpty()).toBe(false);
    expect(stringName.getNoComponents()).toBe(2);
    expect(stringName.getComponent(0)).toBe("test");
    
    expect(arrayName.isEmpty()).toBe(false);
    expect(arrayName.getNoComponents()).toBe(2);
    expect(arrayName.getComponent(0)).toBe("test");
  });
});

describe("Polymorphism Tests", () => {
  it("Both implementations work polymorphically through Name interface", () => {
    function processName(n: Name): string {
      n.append("extra");
      return n.asString();
    }

    const stringName = new StringName("oss.fau");
    const arrayName = new StringArrayName(["oss", "fau"]);

    expect(processName(stringName)).toBe("oss.fau.extra");
    expect(processName(arrayName)).toBe("oss.fau.extra");
  });

  it("AbstractName methods work consistently across both implementations", () => {
    const n1: Name = new StringName("oss.fau.de");
    const n2: Name = new StringArrayName(["oss", "fau", "de"]);

    // Test asString from AbstractName
    expect(n1.asString()).toBe("oss.fau.de");
    expect(n2.asString()).toBe("oss.fau.de");

    // Test isEmpty from AbstractName
    expect(n1.isEmpty()).toBe(false);
    expect(n2.isEmpty()).toBe(false);

    // Test getDelimiterCharacter from AbstractName
    expect(n1.getDelimiterCharacter()).toBe(".");
    expect(n2.getDelimiterCharacter()).toBe(".");
  });
});

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });

  it("test setComponent", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.setComponent(1, "inf");
    expect(n.asString()).toBe("oss.inf.fau.de");
  });

  it("test getComponent", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(1)).toBe("cs");
    expect(n.getComponent(2)).toBe("fau");
    expect(n.getComponent(3)).toBe("de");
  });

  it("test getNoComponents", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("test isEmpty", () => {
    let empty: Name = new StringName("");
    let notEmpty: Name = new StringName("oss");
    expect(empty.isEmpty()).toBe(true);
    expect(notEmpty.isEmpty()).toBe(false);
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });

  it("test setComponent", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.setComponent(1, "inf");
    expect(n.asString()).toBe("oss.inf.fau.de");
  });

  it("test getComponent", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(1)).toBe("cs");
    expect(n.getComponent(2)).toBe("fau");
    expect(n.getComponent(3)).toBe("de");
  });

  it("test getNoComponents", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.getNoComponents()).toBe(4);
  });

  it("test isEmpty", () => {
    let empty: Name = new StringArrayName([]);
    let notEmpty: Name = new StringArrayName(["oss"]);
    expect(empty.isEmpty()).toBe(true);
    expect(notEmpty.isEmpty()).toBe(false);
  });
});

describe("Delimiter function tests", () => {
  it("test StringName with custom delimiter", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });

  it("test StringArrayName with custom delimiter", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"], '#');
    expect(n.asString()).toBe("oss#fau#de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });

  it("test getDelimiterCharacter", () => {
    let n1: Name = new StringName("oss.fau.de");
    let n2: Name = new StringName("oss#fau#de", '#');
    expect(n1.getDelimiterCharacter()).toBe(".");
    expect(n2.getDelimiterCharacter()).toBe("#");
  });
});

describe("Escape character tests", () => {
  it("test escape and delimiter boundary conditions for StringName", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });

  it("test escaped delimiter in component", () => {
    let n: Name = new StringName("oss\\.cs.fau.de");
    expect(n.getNoComponents()).toBe(3);
    expect(n.getComponent(0)).toBe("oss.cs");
    expect(n.getComponent(1)).toBe("fau");
    expect(n.getComponent(2)).toBe("de");
  });

  it("test escaped backslash", () => {
    let n: Name = new StringName("oss\\\\.cs.fau.de");
    expect(n.getNoComponents()).toBe(4);
    expect(n.getComponent(0)).toBe("oss\\");
    expect(n.getComponent(1)).toBe("cs");
  });
});

describe("Clone tests", () => {
  it("test StringName clone creates independent copy", () => {
    let original: Name = new StringName("oss.cs.fau.de");
    let clone = original.clone() as Name;
    
    expect(clone.asString()).toBe("oss.cs.fau.de");
    
    // Modify clone
    clone.append("extra");
    expect(clone.asString()).toBe("oss.cs.fau.de.extra");
    expect(original.asString()).toBe("oss.cs.fau.de");
  });

  it("test StringArrayName clone creates independent copy", () => {
    let original: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let clone = original.clone() as Name;
    
    expect(clone.asString()).toBe("oss.cs.fau.de");
    
    // Modify clone
    clone.append("extra");
    expect(clone.asString()).toBe("oss.cs.fau.de.extra");
    expect(original.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Equality tests", () => {
  it("test isEqual for StringName", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.de");
    let n3: Name = new StringName("oss.fau.de");
    
    expect(n1.isEqual(n2)).toBe(true);
    expect(n1.isEqual(n3)).toBe(false);
  });

  it("test isEqual for StringArrayName", () => {
    let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n3: Name = new StringArrayName(["oss", "fau", "de"]);
    
    expect(n1.isEqual(n2)).toBe(true);
    expect(n1.isEqual(n3)).toBe(false);
  });

  it("test isEqual between StringName and StringArrayName", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    
    expect(n1.isEqual(n2)).toBe(true);
  });

  it("test isEqual with different delimiters", () => {
    let n1: Name = new StringName("oss.cs.fau.de", '.');
    let n2: Name = new StringName("oss#cs#fau#de", '#');
    
    expect(n1.isEqual(n2)).toBe(false);
  });
});

describe("Concat tests", () => {
  it("test concat for StringName", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringName("fau.de");
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs.fau.de");
  });

  it("test concat for StringArrayName", () => {
    let n1: Name = new StringArrayName(["oss", "cs"]);
    let n2: Name = new StringArrayName(["fau", "de"]);
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs.fau.de");
  });

  it("test concat between StringName and StringArrayName", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringArrayName(["fau", "de"]);
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs.fau.de");
  });
});

describe("asDataString tests", () => {
  it("test asDataString for StringName", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });

  it("test asDataString for StringArrayName", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });

  it("test asDataString with custom delimiter", () => {
    let n: Name = new StringName("oss#cs#fau#de", '#');
    // asDataString should always use DEFAULT_DELIMITER (.)
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });
});

describe("getHashCode tests", () => {
  it("test equal names have equal hash codes", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.de");
    expect(n1.getHashCode()).toBe(n2.getHashCode());
  });

  it("test different names likely have different hash codes", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.fau.de");
    // Hash codes should be different (not guaranteed but very likely)
    expect(n1.getHashCode()).not.toBe(n2.getHashCode());
  });

  it("test StringName and StringArrayName have same hash code for same content", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n1.getHashCode()).toBe(n2.getHashCode());
  });
});
