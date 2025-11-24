import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter !== undefined && delimiter.length !== 1) {
            throw new Error("Delimiter must be a single character");
        }
        this.delimiter = delimiter;
    }

    // @methodtype cloning-method
    public clone(): Name {
        // Generic clone: create new instance of same type with same components
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        // Use constructor of concrete class via Object.create
        return Object.create(Object.getPrototypeOf(this), {
            delimiter: { value: this.delimiter, writable: true, enumerable: true, configurable: true },
            ...this.getCloneData(components)
        });
    }

    // Hook method for subclasses to provide their specific data for cloning
    protected abstract getCloneData(components: string[]): object;

    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        if (this.isEmpty()) {
            return "";
        }

        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        return components.join(delimiter);
    }

    // @methodtype conversion-method
    public toString(): string {
        return this.asDataString();
    }

    // @methodtype conversion-method
    public asDataString(): string {
        if (this.isEmpty()) {
            return "";
        }

        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const escaped = this.escapeComponent(this.getComponent(i), DEFAULT_DELIMITER);
            components.push(escaped);
        }

        return components.join(DEFAULT_DELIMITER);
    }

    // @methodtype boolean-query-method
    public isEqual(other: Name): boolean {
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
        return this.getNoComponents() === 0;
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // @methodtype command-method
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    // Narrow inheritance interface - subclasses must implement these
    public abstract getNoComponents(): number;
    public abstract getComponent(i: number): string;
    public abstract setComponent(i: number, c: string): void;
    public abstract insert(i: number, c: string): void;
    public abstract append(c: string): void;
    public abstract remove(i: number): void;

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

}