import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    private readonly name: string;
    private readonly components: string[];

    constructor(source: string, delimiter?: string) {
        IllegalArgumentException.assert(source !== null && source !== undefined, "Source string must be provided");
        const del = delimiter ?? DEFAULT_DELIMITER;
        super(del);

        this.components = this.parseComponents(source, this.delimiter);
        const escaped = this.components.map(component => this.escapeComponent(component, this.delimiter));
        this.name = escaped.join(this.delimiter);
        this.assertInvariant();
    }

    protected getComponentsSnapshot(): string[] {
        return this.components.slice();
    }

    protected doCreate(components: string[], delimiter: string): Name {
        const escaped = components.map(component => this.escapeComponent(component, delimiter));
        return new StringName(escaped.join(delimiter), delimiter);
    }

    protected assertInvariant(): void {
        super.assertInvariant();
        const reparsed = this.parseComponents(this.name, this.delimiter);
        InvalidStateException.assert(reparsed.length === this.components.length, "Component count mismatch");
        for (let i = 0; i < reparsed.length; i++) {
            InvalidStateException.assert(reparsed[i] === this.components[i], "Components must remain stable");
        }
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
}
