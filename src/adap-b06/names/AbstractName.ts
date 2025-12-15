import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected readonly delimiter: string;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter), "Delimiter must be a single character");
        this.delimiter = delimiter;
        this.assertInvariant();
    }

    public clone(): Name {
        const components = this.getComponentsSnapshot();
        const clone = this.doCreate(components, this.delimiter);
        MethodFailedException.assert(clone.isEqual(this), "Cloned name must equal original");
        return clone;
    }

    protected abstract doCreate(components: string[], delimiter: string): Name;

    protected abstract getComponentsSnapshot(): string[];

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter), "Delimiter must be a single character");
        this.assertInvariant();

        const components = this.getComponentsSnapshot();
        if (components.length === 0) {
            return "";
        }

        const escaped = components.map(component => this.escapeComponent(component, delimiter));
        const result = escaped.join(delimiter);
        MethodFailedException.assert(result.length > 0, "asString must return a string representation");
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        this.assertInvariant();

        const components = this.getComponentsSnapshot();
        if (components.length === 0) {
            return "";
        }

        const escaped = components.map(component => this.escapeComponent(component, DEFAULT_DELIMITER));
        const result = escaped.join(DEFAULT_DELIMITER);
        MethodFailedException.assert(result.length > 0, "asDataString must return a string representation");
        return result;
    }

    public isEqual(other: Object): boolean {
        if (!this.isName(other)) {
            return false;
        }

        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }

        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }

        return true;
    }

    public getHashCode(): number {
        this.assertInvariant();
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i: number = 0; i < s.length; i++) {
            let c: number = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        this.assertInvariant();
        return this.getNoComponents() === 0;
    }

    public getNoComponents(): number {
        return this.getComponentsSnapshot().length;
    }

    public getDelimiterCharacter(): string {
        this.assertInvariant();
        return this.delimiter;
    }

    public getComponent(i: number): string {
        const components = this.getComponentsSnapshot();
        this.assertValidIndex(i, false, components.length);
        return components[i];
    }

    public setComponent(i: number, c: string): Name {
        const components = this.getComponentsSnapshot();
        this.assertValidIndex(i, false, components.length);
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");

        const updated = components.slice();
        updated[i] = c;
        return this.doCreate(updated, this.delimiter);
    }

    public insert(i: number, c: string): Name {
        const components = this.getComponentsSnapshot();
        this.assertValidIndex(i, true, components.length);
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");

        const updated = components.slice();
        updated.splice(i, 0, c);
        return this.doCreate(updated, this.delimiter);
    }

    public append(c: string): Name {
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");
        const components = this.getComponentsSnapshot();

        const updated = components.slice();
        updated.push(c);
        return this.doCreate(updated, this.delimiter);
    }

    public remove(i: number): Name {
        const components = this.getComponentsSnapshot();
        this.assertValidIndex(i, false, components.length);

        const updated = components.slice();
        updated.splice(i, 1);
        return this.doCreate(updated, this.delimiter);
    }

    public concat(other: Name): Name {
        IllegalArgumentException.assert(other !== null && other !== undefined, "Other name must be provided");
        const components = this.getComponentsSnapshot();
        const otherComponents: string[] = [];
        for (let i = 0; i < other.getNoComponents(); i++) {
            otherComponents.push(other.getComponent(i));
        }
        return this.doCreate(components.concat(otherComponents), this.delimiter);
    }

    protected escapeComponent(component: string, delimiter: string): string {
        const escapeRegex = new RegExp(this.escapeForRegExp(ESCAPE_CHARACTER), "g");
        let escaped = component.replace(escapeRegex, `${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}`);

        const delimiterRegex = new RegExp(this.escapeForRegExp(delimiter), "g");
        escaped = escaped.replace(delimiterRegex, `${ESCAPE_CHARACTER}${delimiter}`);

        return escaped;
    }

    protected escapeForRegExp(character: string): string {
        if (character === ESCAPE_CHARACTER) {
            return "\\\\";
        }

        const needsEscape = ".^$|?*+()[]{}-/";
        if (needsEscape.includes(character)) {
            return `\\${character}`;
        }

        return character;
    }

    protected assertInvariant(): void {
        InvalidStateException.assert(this.isValidDelimiter(this.delimiter), "Delimiter must always be a single character");
    }

    private assertValidIndex(i: number, allowEnd: boolean, length: number): void {
        const upperBound = allowEnd ? length : length - 1;
        IllegalArgumentException.assert(Number.isInteger(i), "Index must be an integer");
        IllegalArgumentException.assert(i >= 0, "Index must be non-negative");
        IllegalArgumentException.assert(i <= upperBound, "Index out of bounds");
    }

    private isValidDelimiter(delimiter: string): boolean {
        return delimiter !== undefined && delimiter.length === 1;
    }

    private isName(other: any): other is Name {
        return other && typeof other.getNoComponents === "function" && typeof other.getComponent === "function" && typeof other.getDelimiterCharacter === "function";
    }
}
