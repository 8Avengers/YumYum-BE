export declare class CreateMyListDto {
    readonly name: string;
    readonly type?: 'myList';
    readonly description?: string;
    readonly image?: string;
    readonly visibility?: 'public' | 'private';
}
