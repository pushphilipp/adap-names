import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter), "Delimiter must be a single character");
        this.delimiter = delimiter;
    }

    // @methodtype cloning-method
    public clone(): Name {
        this.assertInvariant();

        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }

        const clone = Object.create(Object.getPrototypeOf(this), {
            delimiter: { value: this.delimiter, writable: true, enumerable: true, configurable: true },
            ...this.getCloneData(components)
        });

        MethodFailedException.assert(clone.isEqual(this), "Cloned name must equal original");
        return clone;
    }

    // Hook method for subclasses to provide their specific data for cloning
    protected abstract getCloneData(components: string[]): object;

    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(this.isValidDelimiter(delimiter), "Delimiter must be a single character");
        this.assertInvariant();

        if (this.isEmpty()) {
            return "";
        }

        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }

        const result = components.join(delimiter);
        MethodFailedException.assert(result.length > 0, "asString must return a string representation");
        return result;
    }

    // @methodtype conversion-method
    public toString(): string {
        return this.asDataString();
    }

    // @methodtype conversion-method
    public asDataString(): string {
        this.assertInvariant();

        if (this.isEmpty()) {
            return "";
        }

        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const escaped = this.escapeComponent(this.getComponent(i), DEFAULT_DELIMITER);
            components.push(escaped);
        }

        const result = components.join(DEFAULT_DELIMITER);
        MethodFailedException.assert(result.length > 0, "asDataString must return a string representation");
        return result;
    }

    // @methodtype boolean-query-method
    public isEqual(other: Name): boolean {
        this.assertInvariant();

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

    // @methodtype query-method
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

    // @methodtype boolean-query-method
    public isEmpty(): boolean {
        this.assertInvariant();
        return this.getNoComponents() === 0;
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
        this.assertInvariant();
        return this.delimiter;
    }

    // Narrow inheritance interface - subclasses must implement these
    public abstract getNoComponents(): number;
    public abstract getComponent(i: number): string;
    public abstract setComponent(i: number, c: string): void;
    public abstract insert(i: number, c: string): void;
    public abstract append(c: string): void;
    public abstract remove(i: number): void;

    // @methodtype command-method
    public concat(other: Name): void {
        IllegalArgumentException.assert(other !== null && other !== undefined, "Other name must be provided");
        this.assertInvariant();

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
        MethodFailedException.assert(this.getNoComponents() >= other.getNoComponents(), "Concat must increase component count");
    }

    // @methodtype helper-method
    // Escape backslashes first, then the provided delimiter (order matters).
    protected escapeComponent(component: string, delimiter: string): string {
        const escapeRegex = new RegExp(this.escapeForRegExp(ESCAPE_CHARACTER), "g");
        let escaped = component.replace(escapeRegex, `${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}`);

        const delimiterRegex = new RegExp(this.escapeForRegExp(delimiter), "g");
        escaped = escaped.replace(delimiterRegex, `${ESCAPE_CHARACTER}${delimiter}`);

        return escaped;
    }

    // @methodtype helper-method
    // Build a safe single-character regex; cover metacharacters + ESCAPE_CHARACTER.
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
        InvalidStateException.assert(this.getNoComponents() >= 0, "Number of components cannot be negative");
    }

    private isValidDelimiter(delimiter: string): boolean {
        return delimiter !== undefined && delimiter.length === 1;
    }

}