import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { Directory } from "./Directory";
import { Node } from "./Node";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        InvalidStateException.assert(this.state !== FileState.DELETED, "Cannot open deleted file");
        InvalidStateException.assert(this.state === FileState.CLOSED, "File must be closed to open");
        this.state = FileState.OPEN;
        MethodFailedException.assert(this.state === FileState.OPEN, "File failed to open");
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(noBytes >= 0, "Number of bytes must be non-negative");
        InvalidStateException.assert(this.state === FileState.OPEN, "File must be open to read");
        return new Int8Array(noBytes);
    }

    public close(): void {
        InvalidStateException.assert(this.state === FileState.OPEN, "File must be open to close");
        this.state = FileState.CLOSED;
        MethodFailedException.assert(this.state === FileState.CLOSED, "File failed to close");
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}