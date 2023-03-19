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
exports.MyFeedController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_guards_1 = require("../auth/guards/auth.guards");
const post_service_1 = require("./post.service");
let MyFeedController = class MyFeedController {
    constructor(postService) {
        this.postService = postService;
    }
    async getMyFeed(currentUser) {
        const userId = currentUser.id;
        const myPosts = await this.postService.getPostsByUserId(userId);
        return myPosts;
    }
};
__decorate([
    (0, common_1.Get)('/myfeed'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MyFeedController.prototype, "getMyFeed", null);
MyFeedController = __decorate([
    (0, swagger_1.ApiTags)('나의피드불러오기'),
    (0, common_1.Controller)('/'),
    __metadata("design:paramtypes", [post_service_1.PostService])
], MyFeedController);
exports.MyFeedController = MyFeedController;
//# sourceMappingURL=post-myfeed.controller.js.map