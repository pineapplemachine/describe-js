export type Descriptor = ((value: any) => string);
export class Describe {
    descriptors: Descriptor[];
    constructor(descriptors?: Descriptor[] | undefined);
    safeString(length: number, value: string): string;
    addDescriptor(descriptor: Descriptor): void;
    describe(value: any): string;
}
export const DefaultDescribe: Describe;
export function addDescriptor(descriptor: Descriptor): void;
export function describe(value: any): string;
export default describe;
