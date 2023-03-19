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
exports.BookmarkController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_guards_1 = require("../auth/guards/auth.guards");
const bookmark_service_1 = require("./bookmark.service");
const bookmark_post_dto_1 = require("./dto/bookmark-post.dto");
const bookmark_restaurant_dto_1 = require("./dto/bookmark-restaurant.dto");
const create_bookmark_dto_1 = require("./dto/create-bookmark.dto");
let BookmarkController = class BookmarkController {
    constructor(bookmarkService) {
        this.bookmarkService = bookmarkService;
    }
    async getBookmarks(currentUser) {
        const bookmarks = await this.bookmarkService.getBookmarks(currentUser.id);
        return await bookmarks;
    }
    async getCollections(collectionId) {
        const collections = await this.bookmarkService.getCollections(collectionId);
        return await collections;
    }
    async createCollection(data, currentUser) {
        return await this.bookmarkService.createCollection(currentUser.id, data.name, data.type);
    }
    async updateCollection(collectionId, name) {
        return await this.bookmarkService.updateCollection(collectionId, name);
    }
    async deleteCollection(collectionId) {
        return await this.bookmarkService.deleteCollection(collectionId);
    }
    async collectionPlusPosting(postId, data) {
        return await this.bookmarkService.collectionPlusPosting(data.collectionId, postId);
    }
    async collectionMinusPosting(postId, data) {
        return await this.bookmarkService.collectionMinusPosting(data.collectionId, postId);
    }
    async collectionPlusRestaurant(restaurantId, data) {
        return await this.bookmarkService.collectionPlusRestaurant(data.collectionId, restaurantId);
    }
    async collectionMinusRestaurant(restaurantId, data) {
        return await this.bookmarkService.collectionMinusRestaurant(data.collectionId, restaurantId);
    }
};
__decorate([
    (0, common_1.Get)('/collections'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: '북마크 전체조회' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '북마크 전체조회 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '북마크 전체조회 실패' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "getBookmarks", null);
__decorate([
    (0, common_1.Get)('/collections/:collectionId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: '북마크 상세조회' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '북마크 상세조회 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '북마크 상세조회 실패' }),
    __param(0, (0, common_1.Param)('collectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "getCollections", null);
__decorate([
    (0, common_1.Post)('/collections'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: '북마크 컬렉션 생성' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '북마크 컬렉션 생성 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '북마크 컬렉션 생성 실패' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bookmark_dto_1.CreateCollectionDto, Object]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "createCollection", null);
__decorate([
    (0, common_1.Put)('/collections/:collectionId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: '북마크 컬렉션 수정' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '북마크 컬렉션 수정 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '북마크 컬렉션 수정 실패' }),
    __param(0, (0, common_1.Param)('collectionId')),
    __param(1, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "updateCollection", null);
__decorate([
    (0, common_1.Delete)('/collections/:collectionId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: '북마크 컬렉션 삭제' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '북마크 컬렉션 삭제 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '북마크 컬렉션 삭제 실패' }),
    __param(0, (0, common_1.Param)('collectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "deleteCollection", null);
__decorate([
    (0, common_1.Post)('/collections/plus/post/:postId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: '북마크 포스팅 추가' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '북마크 포스팅 추가 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '북마크 포스팅 추가 실패' }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, bookmark_post_dto_1.BookmarPostDto]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "collectionPlusPosting", null);
__decorate([
    (0, common_1.Delete)('/collections/minus/post/:postId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: '북마크 포스팅 삭제' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '북마크 포스팅 삭제 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '북마크 포스팅 삭제 실패' }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, bookmark_post_dto_1.BookmarPostDto]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "collectionMinusPosting", null);
__decorate([
    (0, common_1.Post)('/collections/plus/restaurant/:restaurantId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: '북마크 맛집 추가' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '북마크 맛집 추가 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '북마크 맛집 추가 실패' }),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, bookmark_restaurant_dto_1.BookmarRastaurantDto]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "collectionPlusRestaurant", null);
__decorate([
    (0, common_1.Delete)('/collections/minus/restaurant/:restaurantId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: '북마크 맛집 삭제' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '북마크 맛집 삭제 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '북마크 맛집 삭제 실패' }),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, bookmark_restaurant_dto_1.BookmarRastaurantDto]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "collectionMinusRestaurant", null);
BookmarkController = __decorate([
    (0, common_1.Controller)('bookmarks'),
    __metadata("design:paramtypes", [bookmark_service_1.BookmarkService])
], BookmarkController);
exports.BookmarkController = BookmarkController;
//# sourceMappingURL=bookmark.controller.js.map