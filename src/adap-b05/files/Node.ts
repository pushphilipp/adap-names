import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assert(pn !== null && pn !== undefined, "Parent directory must be provided");
        IllegalArgumentException.assert(bn !== null && bn !== undefined, "Base name must be provided");
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert(to !== null && to !== undefined, "Target directory must be provided");
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        const bn = this.doGetBaseName();
        InvalidStateException.assert(bn !== null && bn !== undefined, "Base name must be defined");
        if (this.parentNode !== (this as unknown as Directory)) {
            InvalidStateException.assert(bn.length > 0, "Base name must not be empty");
        }
        return bn;
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(bn !== null && bn !== undefined, "Base name must be provided");
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        IllegalArgumentException.assert(bn !== null && bn !== undefined, "Base name must be provided");

        try {
            const matches: Set<Node> = new Set<Node>();
            this.doFindNodes(bn, matches);
            return matches;
        } catch (ex) {
            if (ex instanceof InvalidStateException) {
                throw new ServiceFailureException("failed to search nodes", ex);
            }
            throw ex;
        }
    }

    // @methodtype helper-method
    protected doFindNodes(bn: string, matches: Set<Node>): void {
        const baseName = this.getBaseName();
        if (baseName === bn) {
            matches.add(this);
        }

        const maybeDir = this as unknown as Directory;
        const children: Iterable<Node> = (maybeDir as any).childNodes ?? [];
        for (const child of children) {
            child.doFindNodes(bn, matches);
        }
    }

}
