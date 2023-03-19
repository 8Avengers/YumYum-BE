"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const restaurant_entity_1 = require("../../restaurant/entities/restaurant.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const hashtag_entity_1 = require("./hashtag.entity");
const image_entity_1 = require("./image.entity");
const post_like_entity_1 = require("./post-like.entity");
const comment_entity_1 = require("../../comment/entities/comment.entity");
const post_usertag_entity_1 = require("./post-usertag.entity");
const collection_item_entity_1 = require("../../collection/entities/collection-item.entity");
let Post = class Post {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Post.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Post.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Post.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Post.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['public', 'private'],
        default: 'public',
    }),
    __metadata("design:type", String)
], Post.prototype, "visibility", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => restaurant_entity_1.Restaurant, (restaurant) => restaurant.posts),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", restaurant_entity_1.Restaurant)
], Post.prototype, "restaurant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => image_entity_1.Image, (images) => images.post),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Post.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => post_like_entity_1.PostLike, (postLIkes) => postLIkes.post),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Post.prototype, "postLikes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => comment_entity_1.Comment, (comments) => comments.post),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => user_entity_1.User, (user) => user.posts),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Post.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)((type) => hashtag_entity_1.Hashtag, (hashtags) => hashtags.posts),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Post.prototype, "hashtags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => collection_item_entity_1.CollectionItem, (collectionItem) => collectionItem.post),
    __metadata("design:type", Array)
], Post.prototype, "collectionItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => post_usertag_entity_1.PostUserTag, (postUserTags) => postUserTags.post),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Post.prototype, "postUserTags", void 0);
Post = __decorate([
    (0, typeorm_1.Entity)()
], Post);
exports.Post = Post;
//# sourceMappingURL=post.entity.js.map