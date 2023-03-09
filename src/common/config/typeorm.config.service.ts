import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; //필수
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Bookmark } from 'src/apis/bookmark/entities/bookmark.entity';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { CommentLike } from 'src/apis/comment/entities/comment-like.entity';
import { CommentUserTag } from 'src/apis/comment/entities/comment-usertag.entity';
import { Hashtag } from 'src/apis/post/entities/hashtag.entity';
import { Image } from 'src/apis/post/entities/image.entity';
import { Post } from 'src/apis/post/entities/post.entity';
import { PostLike } from 'src/apis/post/entities/post-like.entity';
import { PostUserTag } from 'src/apis/post/entities/post-usertag.entity';
import { Restaurant } from 'src/apis/restaurant/entities/restaurant.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { MyList } from 'src/apis/my-list/entities/my-list.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies/snake-naming.strategy';
import { BookmarkCollection } from 'src/apis/bookmark-collection/entities/bookmark-collection.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {} //필수

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      namingStrategy: new SnakeNamingStrategy(),
      logging: Boolean(this.configService.get<string>('DATABASE_logging')),
      synchronize: Boolean(this.configService.get<string>('DATABASE_SYNC')), // 배포 시 false
      entities: [
        Bookmark, //
        BookmarkCollection, //
        Comment,
        CommentLike,
        CommentUserTag, //
        MyList, //
        Post,
        Hashtag,
        Image,
        PostLike,
        PostUserTag, //
        Restaurant, //
        User, //
      ],
    };
  }
}
