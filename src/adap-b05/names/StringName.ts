import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    // @methodproperty constructor
    constructor(source: string, delimiter?: string) {
        IllegalArgumentException.assert(source !== null && source !== undefined, "Source string must be provided");
        super(delimiter);

        const components = this.parseComponents(source, this.delimiter);
        this.rebuildFromComponents(components);
        this.assertInvariant();
    }

    // @methodtype helper-method
    protected getCloneData(components: string[]): object {
        const joined = components.map(c => this.escapeComponent(c, this.delimiter)).join(this.delimiter);
        return {
            name: { value: joined, writable: true, enumerable: true, configurable: true },
            noComponents: { value: components.length, writable: true, enumerable: true, configurable: true }
        };
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.noComponents;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        this.assertValidIndex(i);
        const components = this.getComponents();
        return components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.assertValidIndex(i);
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");
        const components = this.getComponents();
        components[i] = c;
        this.rebuildFromComponents(components);
        MethodFailedException.assert(this.getComponent(i) === c, "Component must be updated");
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        this.assertValidIndex(i, true);
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");
        const components = this.getComponents();
        components.splice(i, 0, c);
        this.rebuildFromComponents(components);
        MethodFailedException.assert(this.getComponent(i) === c, "Component must be inserted");
    }

    // @methodtype command-method
    public append(c: string): void {
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");
        const components = this.getComponents();
        components.push(c);
        this.rebuildFromComponents(components);
        MethodFailedException.assert(this.getComponent(this.noComponents - 1) === c, "Component must be appended");
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.assertValidIndex(i);
        const components = this.getComponents();
        components.splice(i, 1);
        this.rebuildFromComponents(components);
        MethodFailedException.assert(this.noComponents === components.length, "Component must be removed");
    }

    // @methodtype helper-method
    // Lazily parse `name` to components; handles implicit trailing empty components.
    private getComponents(): string[] {
        this.assertInvariant();
        if (this.noComponents === 0) {
            return [];
        }

        if (this.name.length === 0) {
            return new Array(this.noComponents).fill("");
        }

        const parsed = this.parseComponents(this.name, this.delimiter);

        if (parsed.length < this.noComponents) {
            while (parsed.length < this.noComponents) {
                parsed.push("");
            }
        }

        return parsed;
    }

    // @methodtype helper-method
    // Escape each component for the active delimiter and rebuild the canonical string.
    private rebuildFromComponents(components: string[]): void {
        this.noComponents = components.length;
        if (components.length === 0) {
            this.name = "";
            this.assertInvariant();
            return;
        }

        const escapedComponents = components.map(component =>
            this.escapeComponent(component, this.delimiter)
        );
        this.name = escapedComponents.join(this.delimiter);
        this.assertInvariant();
    }

    // @methodtype helper-method
    // Streaming parser: ESCAPE_CHARACTER escapes next char; unescaped delimiter splits.
    private parseComponents(value: string, delimiter: string): string[] {
        if (value.length === 0) {
            return [];
        }

        const components: string[] = [];
        let current = "";
        let escaping = false;

        for (const char of value) {
            if (escaping) {
                current += char;
                escaping = false;
                continue;
            }

            if (char === ESCAPE_CHARACTER) {
                escaping = true;
                continue;
            }

            if (char === delimiter) {
                components.push(current);
                current = "";
                continue;
            }

            current += char;
        }

        if (escaping) {
            current += ESCAPE_CHARACTER;
        }

        components.push(current);

        return components;
    }

    private assertValidIndex(i: number, allowEnd: boolean = false): void {
        const upperBound = allowEnd ? this.noComponents : this.noComponents - 1;
        IllegalArgumentException.assert(Number.isInteger(i), "Index must be an integer");
        IllegalArgumentException.assert(i >= 0, "Index must be non-negative");
        IllegalArgumentException.assert(i <= upperBound, "Index out of bounds");
    }

    protected assertInvariant(): void {
        super.assertInvariant();
        if (this.noComponents === 0) {
            InvalidStateException.assert(this.name === "", "Empty names must not store components");
        } else {
            const parsed = this.parseComponents(this.name, this.delimiter);
            InvalidStateException.assert(parsed.length === this.noComponents, "Component count mismatch");
        }
    }

}