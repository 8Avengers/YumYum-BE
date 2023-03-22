export declare class CreateCollectionDto {
    readonly name: string;
    readonly type?: 'bookmark';
    readonly description?: string;
    readonly image?: string;
    visibility: 'public' | 'private';
}
