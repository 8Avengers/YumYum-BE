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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("./entities/comment.entity");
const comment_like_service_1 = require("./comment-like.service");
const post_entity_1 = require("../post/entities/post.entity");
let CommentService = class CommentService {
    constructor(commentRepository, postRepository, commentLikeService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.commentLikeService = commentLikeService;
    }
    async getAllComments(postId, userId) {
        try {
            const existPost = await this.postRepository.findOne({
                where: { id: postId },
                select: ['id'],
            });
            if (!existPost) {
                throw new common_1.NotFoundException('존재하지 않는 포스트입니다.');
            }
            const comments = await this.commentRepository.find({
                where: { deleted_at: null, post: { id: postId } },
                select: {
                    id: true,
                    content: true,
                    updated_at: true,
                    user: { id: true, nickname: true, profile_image: true },
                },
                relations: ['user'],
            });
            const commentIds = comments.map((comment) => comment.id);
            const commentLikes = await this.commentLikeService.getLikesForAllComments(commentIds);
            const likedStatuses = await this.commentLikeService.getLikedStatusforAllComments(commentIds, userId);
            return comments.map((comment) => {
                var _a, _b;
                const likes = ((_a = commentLikes.find((like) => like.commentId === comment.id)) === null || _a === void 0 ? void 0 : _a.totalLikes) || 0;
                const isLiked = ((_b = likedStatuses.find((status) => status.commentId === comment.id)) === null || _b === void 0 ? void 0 : _b.isLiked) || 'False';
                return {
                    id: comment.id,
                    content: comment.content,
                    updated_at: comment.updated_at,
                    user: comment.user,
                    totalLikes: likes,
                    isLiked,
                };
            });
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
    async createComment(postId, userId, content) {
        try {
            const existPost = await this.postRepository.findOne({
                where: { id: postId },
                select: ['id'],
            });
            if (!existPost) {
                throw new common_1.NotFoundException('존재하지 않는 포스트입니다.');
            }
            return await this.commentRepository.insert({
                post: { id: postId },
                user: { id: userId },
                content,
            });
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
    async updateComment(postId, commentId, content) {
        try {
            const existPost = await this.postRepository.findOne({
                where: { id: postId },
                select: ['id'],
            });
            if (!existPost) {
                throw new common_1.NotFoundException('존재하지 않는 포스트입니다.');
            }
            const result = await this.commentRepository.update(commentId, {
                content,
            });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`존재하지 않는 댓글입니다.`);
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
    async deleteComment(postId, commentId) {
        try {
            const existPost = await this.postRepository.findOne({
                where: { id: postId },
                select: ['id'],
            });
            if (!existPost) {
                throw new common_1.NotFoundException('존재하지 않는 포스트입니다.');
            }
            const result = await this.commentRepository.softDelete(commentId);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`존재하지 않는 댓글입니다.`);
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
CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        comment_like_service_1.CommentLikeService])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map