// import {
//   Entity,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   DeleteDateColumn,
//   OneToOne,
//   JoinColumn,
//   OneToMany,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { BookmarkCollection } from 'src/apis/bookmark-collection/entities/bookmark-collection.entity';
// import { User } from 'src/apis/user/entities/user.entity';

// @Entity({ name: 'bookmark' })
// export class Bookmark {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @OneToOne((type) => User)
//   @JoinColumn({ name: 'user_id' })
//   user: User;

//   @OneToMany(
//     (type) => BookmarkCollection,
//     (bookmarkCollection) => bookmarkCollection.bookmark,
//   )
//   bookmarkCollections: BookmarkCollection[];

//   @Column({ length: 50 })
//   bookmark_collection_name: string;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;

//   @DeleteDateColumn({ name: 'deleted_at' })
//   deletedAt: Date;
// }
