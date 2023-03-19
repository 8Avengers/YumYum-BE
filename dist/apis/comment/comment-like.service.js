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
exports.CommentLikeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_like_entity_1 = require("./entities/comment-like.entity");
const comment_entity_1 = require("./entities/comment.entity");
let CommentLikeService = class CommentLikeService {
    constructor(commentLikeRepository, commentRepository) {
        this.commentLikeRepository = commentLikeRepository;
        this.commentRepository = commentRepository;
    }
    async getLikesForComment(commentId) {
        try {
            const likes = await this.commentLikeRepository.findAndCount({
                where: { comment: { id: commentId } },
            });
            const count = likes[1];
            return count;
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
    async getLikesForAllComments(commentIds) {
        try {
            const commentLikes = await this.commentLikeRepository.find({
                where: { comment: { id: (0, typeorm_2.In)(commentIds) } },
                select: ['id', 'comment'],
                relations: ['comment'],
            });
            const likes = commentLikes.map(({ comment }) => ({
                commentId: comment.id,
                totalLikes: commentLikes.filter((cl) => cl.comment.id === comment.id)
                    .length,
            }));
            return likes;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async getLikedStatusforAllComments(commentIds, userId) {
        try {
            const commentLikes = await this.commentLikeRepository.find({
                where: {
                    comment: { id: (0, typeorm_2.In)(commentIds) },
                    user: { id: userId },
                },
                relations: ['comment'],
            });
            const likedStatuses = commentIds.map((commentId) => {
                const isLiked = commentLikes.some((like) => like.comment.id === commentId);
                return {
                    commentId,
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
    async likeComment(commentId, userId) {
        try {
            const existComment = await this.commentRepository.findOne({
                where: {
                    id: commentId,
                },
            });
            if (!existComment) {
                throw new common_1.NotFoundException('존재하지 않는 댓글입니다.');
            }
            const existLike = await this.commentLikeRepository.findOne({
                where: {
                    comment: { id: commentId },
                    user: { id: userId },
                },
                withDeleted: true,
            });
            if (existLike && existLike.deleted_at !== null) {
                await this.commentLikeRepository.restore({
                    comment: { id: commentId },
                    user: { id: userId },
                });
            }
            else {
                await this.commentLikeRepository.insert({
                    comment: { id: commentId },
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
    async unlikeComment(commentId, userId) {
        try {
            const existComment = await this.commentRepository.findOne({
                where: {
                    id: commentId,
                },
            });
            if (!existComment) {
                throw new common_1.NotFoundException('존재하지 않는 댓글입니다.');
            }
            const existLike = await this.commentLikeRepository.findOne({
                where: {
                    comment: { id: commentId },
                    user: { id: userId },
                },
                withDeleted: true,
            });
            if (existLike && existLike.deleted_at === null) {
                await this.commentLikeRepository.softDelete({
                    comment: { id: commentId },
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
CommentLikeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_like_entity_1.CommentLike)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CommentLikeService);
exports.CommentLikeService = CommentLikeService;
//# sourceMappingURL=comment-like.service.js.map