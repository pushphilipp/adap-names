import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    // Normalize source into canonical escaped string in `name` and count in `noComponents`.
    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            this.assertSingleCharacter(delimiter);
            this.delimiter = delimiter;
        }

        const components = this.parseComponents(source, this.delimiter);
        this.rebuildFromComponents(components);
    }

    // Human-readable: join parsed components with requested delimiter (no extra escaping here).
    public asString(delimiter: string = this.delimiter): string {
        if (this.noComponents === 0) {
            return "";
        }

        const components = this.getComponents();
        return components.join(delimiter);
    }

    // Machine-readable: always escape for DEFAULT_DELIMITER and join with DEFAULT_DELIMITER.
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

    // Simple query of the active delimiter.
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // Fast emptiness check without parsing strings.
    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    // Number of components represented by `name`.
    public getNoComponents(): number {
        return this.noComponents;
    }

    // Parse on demand and return component at index `x`.
    public getComponent(x: number): string {
        const components = this.getComponents();
        return components[x];
    }

    // Edit-by-parse: mutate array then rebuild canonical `name`.
    public setComponent(n: number, c: string): void {
        const components = this.getComponents();
        components[n] = c;
        this.rebuildFromComponents(components);
    }

    // Insert component at index `n` (JS splice semantics) and rebuild.
    public insert(n: number, c: string): void {
        const components = this.getComponents();
        components.splice(n, 0, c);
        this.rebuildFromComponents(components);
    }

    // Append component at the end and rebuild.
    public append(c: string): void {
        const components = this.getComponents();
        components.push(c);
        this.rebuildFromComponents(components);
    }

    // Remove component at index `n` (if in range) and rebuild.
    public remove(n: number): void {
        const components = this.getComponents();
        components.splice(n, 1);
        this.rebuildFromComponents(components);
    }

    // Concatenate components from another Name instance.
    public concat(other: Name): void {
        const components = this.getComponents();
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        this.rebuildFromComponents(components);
    }

    // Defensive check for custom delimiter validity.
    private assertSingleCharacter(delimiter: string): void {
        if (delimiter.length !== 1) {
            throw new Error("Delimiter must be a single character");
        }
    }

    // Lazily parse `name` to components; handles implicit trailing empty components.
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

    // Escape each component for the active delimiter and rebuild the canonical string.
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

    // Escape backslashes first, then the provided delimiter (order matters).
    private escapeComponent(component: string, delimiter: string): string {
        const escapeRegex = new RegExp(this.escapeForRegExp(ESCAPE_CHARACTER), "g");
        let escaped = component.replace(escapeRegex, `${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}`);

        const delimiterRegex = new RegExp(this.escapeForRegExp(delimiter), "g");
        escaped = escaped.replace(delimiterRegex, `${ESCAPE_CHARACTER}${delimiter}`);

        return escaped;
    }

    // Build a safe single-character regex; cover metacharacters + ESCAPE_CHARACTER.
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
