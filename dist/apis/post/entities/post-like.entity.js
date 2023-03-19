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
exports.PostLike = void 0;
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const PrimaryGeneratedColumn_1 = require("typeorm/decorator/columns/PrimaryGeneratedColumn");
const post_entity_1 = require("./post.entity");
let PostLike = class PostLike {
};
__decorate([
    (0, PrimaryGeneratedColumn_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PostLike.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PostLike.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PostLike.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], PostLike.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => user_entity_1.User, (user) => user.postLikes),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], PostLike.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => post_entity_1.Post, (post) => post.postLikes),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", post_entity_1.Post)
], PostLike.prototype, "post", void 0);
PostLike = __decorate([
    (0, typeorm_1.Entity)()
], PostLike);
exports.PostLike = PostLike;
//# sourceMappingURL=post-like.entity.js.map