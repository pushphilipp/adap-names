import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    // @methodproperty constructor
    constructor(source: string[], delimiter?: string) {
        IllegalArgumentException.assert(source !== null && source !== undefined, "Source array must be provided");
        super(delimiter);

        this.components = source.slice();
        this.assertInvariant();
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
        this.assertValidIndex(i);
        return this.components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.assertValidIndex(i);
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");
        this.components[i] = c;
        MethodFailedException.assert(this.components[i] === c, "Component must be updated");
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        this.assertValidIndex(i, true);
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");
        this.components.splice(i, 0, c);
        MethodFailedException.assert(this.components[i] === c, "Component must be inserted");
    }

    // @methodtype command-method
    public append(c: string): void {
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component must be provided");
        this.components.push(c);
        MethodFailedException.assert(this.components[this.components.length - 1] === c, "Component must be appended");
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.assertValidIndex(i);
        this.components.splice(i, 1);
        MethodFailedException.assert(this.components.length >= 0, "Component must be removed");
    }

    private assertValidIndex(i: number, allowEnd: boolean = false): void {
        const upperBound = allowEnd ? this.components.length : this.components.length - 1;
        IllegalArgumentException.assert(Number.isInteger(i), "Index must be an integer");
        IllegalArgumentException.assert(i >= 0, "Index must be non-negative");
        IllegalArgumentException.assert(i <= upperBound, "Index out of bounds");
    }

}