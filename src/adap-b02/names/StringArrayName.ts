import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        if (delimiter !== undefined) {
            this.assertSingleCharacter(delimiter);
            this.delimiter = delimiter;
        }

        // Store a defensive copy to avoid external mutations from leaking in.
        this.components = source.slice();
    }

    public asString(delimiter: string = this.delimiter): string {
        if (this.components.length === 0) {
            return "";
        }

        return this.components.join(delimiter);
    }

    public asDataString(): string {
        if (this.components.length === 0) {
            return "";
        }

        const escapedComponents = this.components.map(component =>
            this.escapeComponent(component, DEFAULT_DELIMITER)
        );

        return escapedComponents.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }

    private assertSingleCharacter(delimiter: string): void {
        if (delimiter.length !== 1) {
            throw new Error("Delimiter must be a single character");
        }
    }

    private escapeComponent(component: string, delimiter: string): string {
        const escapeRegex = new RegExp(this.escapeForRegExp(ESCAPE_CHARACTER), "g");
        let escaped = component.replace(escapeRegex, `${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}`);

        const delimiterRegex = new RegExp(this.escapeForRegExp(delimiter), "g");
        escaped = escaped.replace(delimiterRegex, `${ESCAPE_CHARACTER}${delimiter}`);

        return escaped;
    }

    private escapeForRegExp(character: string): string {
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
