import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    // @methodproperty constructor
    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        
        // Store a defensive copy to avoid external mutations from leaking in.
        this.components = source.slice();
    }

    // @methodtype helper-method
    protected getCloneData(components: string[]): object {
        return {
            components: { value: components.slice(), writable: true, enumerable: true, configurable: true }
        };
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        return this.components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    // @methodtype command-method
    public append(c: string): void {
        this.components.push(c);
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.components.splice(i, 1);
    }
}