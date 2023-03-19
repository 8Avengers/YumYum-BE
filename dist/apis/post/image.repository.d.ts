import { DataSource, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Post } from './entities/post.entity';
export declare class ImageRepository extends Repository<Image> {
    private dataSource;
    constructor(dataSource: DataSource);
    updatePostImages(newImages: string[], originalImages: string[], post: Post): Promise<void>;
}
