import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Hashtag } from './entities/hashtag.entity';
export declare class PostHashtagService {
    private readonly postRepository;
    private readonly hashtagRepository;
    constructor(postRepository: Repository<Post>, hashtagRepository: Repository<Hashtag>);
    createOrUpdateHashtags(hashtagNames: string[]): Promise<Hashtag[]>;
}
