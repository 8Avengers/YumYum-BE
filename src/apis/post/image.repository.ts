import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class ImageRepository extends Repository<Image> {
  constructor(private dataSource: DataSource) {
    super(Image, dataSource.createEntityManager());
  }

  async updatePostImages(post: Post, imagesData: string[]) {
    try {
      const imagesToDelete = post.images.filter(
        (image) => !imagesData.includes(image.file_name),
      );

      if (imagesToDelete.length > 0) {
        await this.remove(imagesToDelete);
      }

      const newImages = imagesData
        .filter(
          (image) =>
            !post.images.some(
              (existingImage) => existingImage.file_name === image,
            ),
        )
        .map((image) => ({ file_name: image, post }));

      await this.save(newImages);

      return;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }
}
