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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostLikeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_like_entity_1 = require("./entities/post-like.entity");
const post_entity_1 = require("./entities/post.entity");
let PostLikeService = class PostLikeService {
    constructor(postLikeRepository, postRepository) {
        this.postLikeRepository = postLikeRepository;
        this.postRepository = postRepository;
    }
    async getLikesForPost(postId) {
        try {
            const postLikes = await this.postLikeRepository.findAndCount({
                where: { post: { id: postId } },
            });
            const count = postLikes[1];
            return count;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async getLikesForAllPosts(postIds) {
        try {
            const postLikes = await this.postLikeRepository.find({
                select: ['id', 'post'],
                where: { post: { id: (0, typeorm_2.In)(postIds) } },
                relations: ['post'],
            });
            const likes = postLikes.map(({ post }) => ({
                postId: post.id,
                totalLikes: postLikes.filter((pl) => pl.post.id === post.id).length,
            }));
            return likes;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async getLikedStatusforOnePost(postId, userId) {
        try {
            const postliked = await this.postLikeRepository.findOne({
                where: { post: { id: postId }, user: { id: userId } },
            });
            console.log('postLiked', postliked);
            return {
                isLiked: postliked ? 'True' : 'False',
            };
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async getLikedStatusforAllPosts(postIds, userId) {
        try {
            const postLikes = await this.postLikeRepository.find({
                where: {
                    post: { id: (0, typeorm_2.In)(postIds) },
                    user: { id: userId },
                },
                relations: ['post'],
            });
            const likedStatuses = postIds.map((postId) => {
                const isLiked = postLikes.some((like) => like.post.id === postId);
                return {
                    postId,
                    isLiked: isLiked ? 'True' : 'False',
                };
            });
            return likedStatuses;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async likePost(postId, userId) {
        try {
            const existingPost = await this.postRepository.findOne({
                where: { id: postId },
            });
            if (!existingPost) {
                throw new common_1.NotFoundException('존재하지 않는 포스트입니다.');
            }
            const existLike = await this.postLikeRepository.findOne({
                where: {
                    post: { id: postId },
                    user: { id: userId },
                },
                withDeleted: true,
            });
            if (existLike && existLike.deleted_at !== null) {
                await this.postLikeRepository.restore({
                    post: { id: postId },
                    user: { id: userId },
                });
            }
            else {
                await this.postLikeRepository.insert({
                    post: { id: postId },
                    user: { id: userId },
                });
            }
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
    async unlikePost(postId, userId) {
        try {
            const existingPost = await this.postRepository.findOne({
                where: { id: postId },
            });
            if (!existingPost) {
                throw new common_1.NotFoundException('존재하지 않는 포스트입니다.');
            }
            const existLike = await this.postLikeRepository.findOne({
                where: {
                    post: { id: postId },
                    user: { id: userId },
                },
                withDeleted: true,
            });
            if (existLike && existLike.deleted_at === null) {
                await this.postLikeRepository.softDelete({
                    post: { id: postId },
                    user: { id: userId },
                });
            }
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
};
PostLikeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_like_entity_1.PostLike)),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PostLikeService);
exports.PostLikeService = PostLikeService;
//# sourceMappingURL=post-like.service.js.map