export declare class CreateCollectionDto {
    readonly type?: 'bookmark';
    readonly name: string;
    readonly description: string;
    readonly image: string;
    visibility: 'public' | 'private';
}
