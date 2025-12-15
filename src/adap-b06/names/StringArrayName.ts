import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    private readonly components: string[];

    constructor(source: string[], delimiter?: string) {
        IllegalArgumentException.assert(source !== null && source !== undefined, "Source array must be provided");
        super(delimiter);

        this.components = source.slice();
        this.assertInvariant();
    }

    protected getComponentsSnapshot(): string[] {
        return this.components.slice();
    }

    protected doCreate(components: string[], delimiter: string): Name {
        return new StringArrayName(components, delimiter);
    }

    protected assertInvariant(): void {
        super.assertInvariant();
        MethodFailedException.assert(this.components.length >= 0, "Number of components must be non-negative");
    }
}
