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
exports.PostLikeController = void 0;
const common_1 = require("@nestjs/common");
const post_like_service_1 = require("./post-like.service");
const auth_guards_1 = require("../auth/guards/auth.guards");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let PostLikeController = class PostLikeController {
    constructor(postLikeService) {
        this.postLikeService = postLikeService;
    }
    async likePost(postId, currentUser) {
        await this.postLikeService.likePost(postId, currentUser.id);
    }
    async unlikePost(postId, currentUser) {
        await this.postLikeService.unlikePost(postId, currentUser.id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostLikeController.prototype, "likePost", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostLikeController.prototype, "unlikePost", null);
PostLikeController = __decorate([
    (0, common_1.Controller)('posts/:postId/like'),
    __metadata("design:paramtypes", [post_like_service_1.PostLikeService])
], PostLikeController);
exports.PostLikeController = PostLikeController;
//# sourceMappingURL=post-like.controller.js.map