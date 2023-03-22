export declare class CreatePostDto {
    readonly myListId: string;
    readonly content: string;
    readonly rating: string;
    readonly visibility: 'public' | 'private';
    readonly hashtagNames?: string;
    readonly userTags?: string;
}
