import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    // @methodproperty constructor
    constructor(source: string, delimiter?: string) {
        super(delimiter);
        
        const components = this.parseComponents(source, this.delimiter);
        this.rebuildFromComponents(components);
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
        const components = this.getComponents();
        return components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        const components = this.getComponents();
        components[i] = c;
        this.rebuildFromComponents(components);
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        const components = this.getComponents();
        components.splice(i, 0, c);
        this.rebuildFromComponents(components);
    }

    // @methodtype command-method
    public append(c: string): void {
        const components = this.getComponents();
        components.push(c);
        this.rebuildFromComponents(components);
    }

    // @methodtype command-method
    public remove(i: number): void {
        const components = this.getComponents();
        components.splice(i, 1);
        this.rebuildFromComponents(components);
    }

    // @methodtype helper-method
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

    // @methodtype helper-method
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
}