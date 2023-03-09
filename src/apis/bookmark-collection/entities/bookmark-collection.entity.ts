// import { Post } from 'src/apis/post/entities/post.entity';
// import { Restaurant } from 'src/apis/restaurant/entities/restaurant.entity';
// import {
//   Entity,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   DeleteDateColumn,
//   ManyToOne,
//   JoinColumn,
//   ManyToMany,
//   JoinTable,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { Bookmark } from './bookmark.entity';

// @Entity({ name: 'bookmark_collection' })
// export class BookmarkCollection {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;

//   @DeleteDateColumn({ name: 'deleted_at' })
//   deletedAt: Date;

//   @ManyToOne((type) => Bookmark, (bookmark) => bookmark.bookmarkCollections)
//   @JoinColumn({ name: 'bookmark_id' })
//   bookmark: Bookmark;

//   @ManyToMany((type) => Post)
//   @JoinTable({
//     name: 'bookmark_collection_post',
//     joinColumn: {
//       name: 'bookmark_collection_id',
//       referencedColumnName: 'id',
//     },
//     inverseJoinColumn: {
//       name: 'post_id',
//       referencedColumnName: 'id',
//     },
//   })
//   posts: Post[];

//   @ManyToMany((type) => Restaurant)
//   @JoinTable({
//     name: 'bookmark_collection_restaurant',
//     joinColumn: {
//       name: 'bookmark_collection_id',
//       referencedColumnName: 'id',
//     },
//     inverseJoinColumn: {
//       name: 'restaurant_id',
//       referencedColumnName: 'id',
//     },
//   })
//   restaurants: Restaurant[];
// }
