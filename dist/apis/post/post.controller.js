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
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const post_service_1 = require("./post.service");
const create_post_dto_1 = require("./dto/create-post.dto");
const create_restaurant_dto_1 = require("../restaurant/dto/create-restaurant.dto");
const auth_guards_1 = require("../auth/guards/auth.guards");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
let PostController = class PostController {
    constructor(postService) {
        this.postService = postService;
    }
    async getPostById(postId, currentUser) {
        return await this.postService.getPostById(postId, currentUser.id);
    }
    async getPosts(currentUser, page) {
        const posts = await this.postService.getPosts(currentUser.id, page);
        return posts;
    }
    createPost(files, data, { address_name, category_group_code, category_group_name, category_name, id, phone, place_name, road_address_name, x, y, }, currentUser) {
        const parsedMyListId = JSON.parse(data.myListId);
        const parsedRating = JSON.parse(data.rating);
        const parsedHashtagNames = JSON.parse(data.hashtagNames);
        return this.postService.createPost(currentUser.id, address_name, category_group_code, category_group_name, category_name, id, phone, place_name, road_address_name, x, y, parsedMyListId, data.content, parsedRating, data.visibility, parsedHashtagNames, files);
    }
    async updatePost(files, postId, data, { address_name, category_group_code, category_group_name, category_name, id, phone, place_name, road_address_name, x, y, }) {
        let parsedMyListId;
        let parsedRating;
        let parsedHashtagNames;
        if (data.myListId) {
            parsedMyListId = JSON.parse(data.myListId);
        }
        if (data.rating) {
            parsedRating = JSON.parse(data.rating);
        }
        if (data.hashtagNames) {
            parsedHashtagNames = JSON.parse(data.hashtagNames);
        }
        return this.postService.updatePost(postId, address_name, category_group_code, category_group_name, category_name, id, phone, place_name, road_address_name, x, y, parsedMyListId, data.content, parsedRating, data.visibility, parsedHashtagNames, files, data.files);
    }
    async deletePost(postId) {
        return this.postService.deletePost(postId);
    }
    async getTrendingPostsByCategory() {
        return this.postService.getTrendingPosts();
    }
    async getPostsAroundMe(data, currentUser, page) {
        return this.postService.getPostsAroundMe(data.x, data.y, currentUser.id, page);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '포스팅 상세보기' }),
    (0, common_1.Get)('/:postId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPostById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '모든 최신 포스팅 불러오기' }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPosts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '포스트 작성하기' }),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array,
        create_post_dto_1.CreatePostDto,
        create_restaurant_dto_1.CreateRestaurantDto, Object]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "createPost", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '포스트 수정하기' }),
    (0, common_1.Patch)('/:postId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatePost", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '포스트 삭제하기' }),
    (0, common_1.Delete)('/:postId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletePost", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '회원들의 추천 맛집 불러오기' }),
    (0, common_1.Get)('/main/trending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getTrendingPostsByCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '내 주변 피드' }),
    (0, common_1.Get)('/feed/aroundMe'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPostsAroundMe", null);
PostController = __decorate([
    (0, swagger_1.ApiTags)('Post'),
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);
exports.PostController = PostController;
//# sourceMappingURL=post.controller.js.map