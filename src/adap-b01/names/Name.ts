export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    // @methodtype initialization-method
    constructor(other: string[], delimiter?: string) {
        // Handle the optional delimiter parameter
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        // Store the components
        this.components = other;
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    // @methodtype conversion-method
    public asDataString(): string {
        // First, escape each component properly
        const escapedComponents = this.components.map(component => {
            return this.escapeComponent(component);
        });
        
        // Then join with the default delimiter
        return escapedComponents.join(DEFAULT_DELIMITER);
    }

    // @methodtype helper-method
    private escapeComponent(component: string): string {
        // Escape backslashes first (to avoid double-escaping)
        let escaped = component.replace(/\\/g, '\\\\');
        
        // Then escape the default delimiter
        escaped = escaped.replace(/\./g, '\\.');
        
        return escaped;
    }

    // @methodtype get-method
    /** Returns properly masked component string */
    public getComponent(i: number): string {
        return this.components[i];
    }

    // @methodtype set-method
    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

     // @methodtype get-method
     /** Returns number of components in Name instance */
     public getNoComponents(): number {
        return this.components.length;
    }

    // @methodtype command-method
    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    // @methodtype command-method
    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        this.components.push(c);
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.components.splice(i, 1);
    }

}
