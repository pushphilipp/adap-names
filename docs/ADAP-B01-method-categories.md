# ADAP B01 — Method Types and Properties (Summary)

Source: “ADAP B01 - Method Types and Properties” by Dirk Riehle, FAU Erlangen (CC BY 4.0)

This document lists the method categories and properties described in the lecture, with brief definitions and examples (using the b01 Coordinate/Name classes where possible).

## 1) Method types

A method type classifies a method by its main purpose. A method should have one type/purpose.

- Query methods: return information about the object without changing its state
- Mutation methods: change the object’s state and typically don’t return information
- Helper methods: perform utility work independent of the object’s core state

### Query method subtypes

- Get method (getter)
	- Definition: returns a logical field of the object
	- Prefix: get
	- Naming: get + logical field name
	- Example: `getX(): number`, `getY(): number`, `getR(): number`, `getPhi(): number`

- Boolean query method
	- Definition: returns boolean state about the queried object
	- Prefix: is
	- Example: `isEqual(other: Coordinate): boolean`

- Comparison method
	- Definition: compares two objects on an ordinal scale
	- Naming: describe what is being compared
	- Example: `compareDistance(other: Coordinate): number` (compare distance to origin)

- Conversion method (Interpretation method)
	- Definition: returns a different representation of the object
	- Prefix: as, to
	- Examples: `asDataString(): string`, `toString(): string` (here used for developer/machine-readable output)

### Mutation method subtypes

- Set method (setter)
	- Definition: changes a logical field of the object
	- Prefix: set
	- Examples: `setX(x: number): void`, `setY(y: number): void`, `setR(r: number): void`, `setPhi(phi: number): void`

- Command method
	- Definition: performs a complex change to an object's state
	- Naming: verbs like make, handle, execute, perform, …
	- Example: `multiplyWith(other: Coordinate): void`
	- Note: “Remove vs. Delete” — remove detaches from context; delete destroys the element

- Initialization method
	- Definition: sets some or all of the object’s state at once
	- Prefix: init, initialize
	- Example: `initialize(x?: number, y?: number): void`

- Finalization method
	- Mentioned in classification; typically used to finalize/clean up. Not exemplified in b01 but appears in template lifecycle (`finalize()`).

### Helper method subtypes

- Object creation method (umbrella term)
	- Factory method: creates an object by naming the class
		- Prefix: create (also: new, make)
		- Example: `createOrigin(): Coordinate`
	- Cloning method: creates an object by cloning another object
		- Example: `clone(): Coordinate` (shallow vs. deep cloning distinctions apply)
	- Trader method: creates an object from a specification (mentioned)

- Assertion method
	- Definition: asserts a condition or throws an exception
	- Prefix: assert
	- Example: `assertIsValidPhi(phi: number): void`

- Logging method
	- Mentioned in the classification; logs information, not shown in code examples here

---

## 2) Method properties

Method properties describe particular attributes of methods. A method may have at most one property from any single property category.

Main property categories:
- Method implementation properties (about the implementation style)
- Inheritance interface properties (about inheritance-related behavior)
- Convenience method properties (about simplifying usage)
- Method meta-level properties (about class vs. instance level)
- Method visibility properties (public, protected, …)

### Method implementation properties

- Regular method
	- Definition: performs a task and may rely on other methods
	- Examples: `isEqual`, `calcStraightLineDistance`

- Composing method
	- Definition: organizes a task into several subtasks as a linear succession of method calls to other regular or primitive methods
	- Example: `initialize(x?: number, y?: number)` calling `setX`, `setY`

- Primitive method
	- Definition: carries out one specific task, usually by directly engaging the implementation state; does not use non-primitive methods
	- Naming prefix: `do`, `basic`
	- Example pattern: `setX` -> `doSetX`; `setPhi` ultimately calls `doSetX`, `doSetY`

- Null method
	- Definition: empty implementation (often a default in template/hook patterns)

### Inheritance interface properties

- Template method
	- Definition: defines an algorithmic skeleton and delegates subtasks to (overridable) methods in subclasses
	- Example: `Main.run()` calling `parseArgs`, `initialize`, `execute`, `finalize`

- Hook method
	- Definition: a well-defined overridable subtask in a template method
	- Examples: `Main.parseArgs`, `Main.initialize`, `Main.execute`, `Main.finalize`

### Convenience method properties

- Convenience method
	- Definition: simplifies use of a more complicated method by providing a simpler signature and defaults
	- Example: `reset(): void` calling `initialize(0, 0)`

- Default-value method
	- Definition: returns a predefined value
	- Example: `static getOrigin(): Coordinate` (returns `(0,0)`)

Note: The lecture also mentions meta-level and visibility properties as categories; details are outside the core examples in b01.

---

## 3) Design guidelines

- Single method purpose rule: A method should have one purpose only
	- Benefits: easier to understand and to override
- Exceptions: well-known idioms (increment-and-return), technical requirements (test-and-set), lazy initialization
- Documenting method types and properties: use annotations

---

## Cross-references to b01 code

- Coordinate (b01)
	- Query: `getX`, `getY`, `getR`, `getPhi`, `isEqual`, `compareDistance`, `asDataString`, `toString`
	- Mutation: `setX`, `setY`, `initialize`, `reset` (convenience)
	- Helper: `createOrigin` (factory)
	- Implementation properties: `initialize` (composing), setters with internal `doSet*` in examples, etc.

- Name (b01)
	- Query: `asString(delimiter?)`, `asDataString()`, `getComponent(i)`, `getNoComponents()`
	- Mutation: `setComponent(i,c)`, `insert(i,c)`, `append(c)`, `remove(i)`
	- Helper: not central here; focus is on representation and editing

License: CC BY 4.0 International — © 2012, 2018, 2024 Dirk Riehle (some rights reserved)
