import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        IllegalArgumentException.assert(cn !== null && cn !== undefined, "Child node must be provided");
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn !== null && cn !== undefined, "Child node must be provided");
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn !== null && cn !== undefined, "Child node must be provided");
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}