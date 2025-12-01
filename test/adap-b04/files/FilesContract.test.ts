import { describe, it, expect } from "vitest";

import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";
import { Directory } from "../../../src/adap-b04/files/Directory";
import { File } from "../../../src/adap-b04/files/File";
import { RootNode } from "../../../src/adap-b04/files/RootNode";

const root = RootNode.getRootNode();

describe("File contract enforcement", () => {
  it("enforces valid parent and base name", () => {
    expect(() => new File("data.txt", root)).not.toThrow();
    expect(() => new File("data.txt", null as unknown as Directory)).toThrow(IllegalArgumentException);
  });

  it("checks state transitions for open/close/read", () => {
    const file = new File("sample.txt", root);
    file.open();
    expect(() => file.open()).toThrow(InvalidStateException);
    expect(file.read(4).length).toBe(4);
    expect(() => file.read(-1)).toThrow(IllegalArgumentException);
    file.close();
    expect(() => file.close()).toThrow(InvalidStateException);
    expect(() => file.read(1)).toThrow(InvalidStateException);
  });
});
