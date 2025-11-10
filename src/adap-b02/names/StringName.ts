import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            this.assertSingleCharacter(delimiter);
            this.delimiter = delimiter;
        }

        const components = this.parseComponents(source, this.delimiter);
        this.rebuildFromComponents(components);
    }

    public asString(delimiter: string = this.delimiter): string {
        if (this.noComponents === 0) {
            return "";
        }

        const components = this.getComponents();
        return components.join(delimiter);
    }

    public asDataString(): string {
        if (this.noComponents === 0) {
            return "";
        }

        const components = this.getComponents();
        const escapedComponents = components.map(component =>
            this.escapeComponent(component, DEFAULT_DELIMITER)
        );

        return escapedComponents.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        const components = this.getComponents();
        return components[x];
    }

    public setComponent(n: number, c: string): void {
        const components = this.getComponents();
        components[n] = c;
        this.rebuildFromComponents(components);
    }

    public insert(n: number, c: string): void {
        const components = this.getComponents();
        components.splice(n, 0, c);
        this.rebuildFromComponents(components);
    }

    public append(c: string): void {
        const components = this.getComponents();
        components.push(c);
        this.rebuildFromComponents(components);
    }

    public remove(n: number): void {
        const components = this.getComponents();
        components.splice(n, 1);
        this.rebuildFromComponents(components);
    }

    public concat(other: Name): void {
        const components = this.getComponents();
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        this.rebuildFromComponents(components);
    }

    private assertSingleCharacter(delimiter: string): void {
        if (delimiter.length !== 1) {
            throw new Error("Delimiter must be a single character");
        }
    }

    private getComponents(): string[] {
        if (this.noComponents === 0) {
            return [];
        }

        if (this.name.length === 0) {
            return new Array(this.noComponents).fill("");
        }

        const parsed = this.parseComponents(this.name, this.delimiter);

        if (parsed.length < this.noComponents) {
            // In the special case of trailing empty components that are
            // represented implicitly, pad the array to the expected size.
            while (parsed.length < this.noComponents) {
                parsed.push("");
            }
        }

        return parsed;
    }

    private rebuildFromComponents(components: string[]): void {
        this.noComponents = components.length;
        if (components.length === 0) {
            this.name = "";
            return;
        }

        const escapedComponents = components.map(component =>
            this.escapeComponent(component, this.delimiter)
        );
        this.name = escapedComponents.join(this.delimiter);
    }

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
