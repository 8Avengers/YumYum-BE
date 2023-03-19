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
exports.CommentLikeController = void 0;
const common_1 = require("@nestjs/common");
const comment_like_service_1 = require("./comment-like.service");
const auth_guards_1 = require("../auth/guards/auth.guards");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CommentLikeController = class CommentLikeController {
    constructor(commentLikeService) {
        this.commentLikeService = commentLikeService;
    }
    async likeComment(commentId, currentUser) {
        return this.commentLikeService.likeComment(commentId, currentUser.id);
    }
    async unlikeComment(commentId, currentUser) {
        return this.commentLikeService.unlikeComment(commentId, currentUser.id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentLikeController.prototype, "likeComment", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommentLikeController.prototype, "unlikeComment", null);
CommentLikeController = __decorate([
    (0, common_1.Controller)('posts/:postId/comments/:commentId/like'),
    __metadata("design:paramtypes", [comment_like_service_1.CommentLikeService])
], CommentLikeController);
exports.CommentLikeController = CommentLikeController;
//# sourceMappingURL=comment-like.controller.js.map