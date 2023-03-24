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
exports.MyListController = void 0;
const minus_bookmark_posting_dto_1 = require("./dto/minus-bookmark-posting.dto");
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const swagger_1 = require("@nestjs/swagger");
const create_my_list_dto_1 = require("./dto/create-my-list.dto");
const update_my_list_dto_1 = require("./dto/update-my-list.dto");
const my_list_service_1 = require("./my-list.service");
const add_my_list_posting_dto_1 = require("./dto/add-my-list-posting.dto");
const auth_guards_1 = require("../auth/guards/auth.guards");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const post_service_1 = require("../post/post.service");
const platform_express_1 = require("@nestjs/platform-express");
let MyListController = class MyListController {
    constructor(myListService, postService) {
        this.myListService = myListService;
        this.postService = postService;
    }
    async getMyListDetail(collectionId, page, currentUser) {
        const myLists = await this.myListService.getMyListDetail(collectionId, page, currentUser.id);
        return await myLists;
    }
    async getMyListsDetailPost(restaurantId, collectionId, currentUser, page) {
        console.log('****', currentUser.id);
        const myLists = await this.myListService.getMyListsDetailPost(currentUser.id, restaurantId, collectionId, page);
        return await myLists;
    }
    async getMyListsName(currentUser) {
        const myLists = await this.myListService.getMyListsName(currentUser.id);
        return await myLists;
    }
    async getMyListsMe(currentUser, page) {
        const myLists = await this.myListService.getMyListsMe(currentUser.id, page);
        return await myLists;
    }
    async getMyListsAll(userId, page) {
        const myLists = await this.myListService.getMyListsAll(userId, page);
        return await myLists;
    }
    async createMyList(data, currentUser) {
        return await this.myListService.createMyList(currentUser.id, data.name, data.type);
    }
    async getMyListInfo(collectionId) {
        return this.myListService.getMyListInfo(collectionId);
    }
    async updateMyList(collectionId, file, data, currentUser) {
        const updateMyList = await this.myListService.updateMyList(currentUser.id, collectionId, data.name, data.image, data.description, data.visibility, file);
        const result = {
            name: updateMyList.name,
            image: updateMyList.image,
            description: updateMyList.description,
            visibility: updateMyList.visibility,
        };
        return result;
    }
    async deleteMyList(collectionId, currentUser) {
        return this.myListService.deleteMyList(collectionId);
    }
    async myListPlusPosting(postId, data) {
        return this.myListService.myListPlusPosting(postId, data.collectionId);
    }
    async myListMinusPosting(postId, data, currentUser) {
        return await this.myListService.myListMinusPosting(postId, data.collectionId);
    }
    async myListUpdatePosting(postId, data) {
        return this.myListService.myListUpdatePosting(postId, data.collectionId);
    }
    async HotMyList() {
        return this.myListService.HotMyList();
    }
    async FollowersMyList(currentUser) {
        return this.myListService.FollowersMyList(currentUser.id);
    }
};
__decorate([
    (0, common_1.Get)('/collections/detail/:collectionId'),
    (0, swagger_1.ApiOperation)({ summary: 'MyList 상세보기' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MyList 상세보기 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'MyList 상세보기 실패' }),
    (0, decorators_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    __param(0, (0, decorators_1.Param)('collectionId')),
    __param(1, (0, decorators_1.Query)('page')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "getMyListDetail", null);
__decorate([
    (0, common_1.Get)('/collections/detail/posts/:collectionId/:restaurantId'),
    (0, decorators_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: 'MyList 상세 더보기' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MyList 상세 더보기 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'MyList 상세 더보기 실패' }),
    __param(0, (0, decorators_1.Param)('restaurantId')),
    __param(1, (0, decorators_1.Param)('collectionId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, decorators_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, String]),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "getMyListsDetailPost", null);
__decorate([
    (0, common_1.Get)('/collections/name'),
    (0, decorators_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: 'MyList 이름조회(내꺼)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MyList 이름조회(내꺼) 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'MyList 이름조회(내꺼) 실패' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "getMyListsName", null);
__decorate([
    (0, common_1.Get)('/collections'),
    (0, decorators_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: 'MyList 전체조회(내꺼)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MyList 전체조회(내꺼) 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'MyList 전체조회(내꺼) 실패' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, decorators_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "getMyListsMe", null);
__decorate([
    (0, common_1.Get)('/collections/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'MyList 전체조회(남의꺼)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MyList 전체조회 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'MyList 전체조회 실패' }),
    __param(0, (0, decorators_1.Param)('userId')),
    __param(1, (0, decorators_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "getMyListsAll", null);
__decorate([
    (0, common_1.Post)('/collections'),
    (0, decorators_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: 'MyList 생성' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MyList 생성 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'MyList 생성 실패' }),
    __param(0, (0, decorators_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_my_list_dto_1.CreateMyListDto, Object]),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "createMyList", null);
__decorate([
    (0, common_1.Get)('/collections/update/:collectionId'),
    (0, decorators_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: 'MyList 수정조회' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MyList 수정조회 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'MyList 수정조회 실패' }),
    __param(0, (0, decorators_1.Param)('collectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "getMyListInfo", null);
__decorate([
    (0, common_1.Put)('/collections/:collectionId'),
    (0, decorators_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'MyList 수정' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MyList 수정 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'MyList 수정 실패' }),
    __param(0, (0, decorators_1.Param)('collectionId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, decorators_1.Body)(common_1.ValidationPipe)),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, update_my_list_dto_1.UpdateMyListDto, Object]),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "updateMyList", null);
__decorate([
    (0, common_1.Delete)('/collections/:collectionId'),
    (0, decorators_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: 'MyList 삭제' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MyList 삭제 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'MyList 삭제 실패' }),
    __param(0, (0, decorators_1.Param)('collectionId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "deleteMyList", null);
__decorate([
    (0, common_1.Post)('/collections/plus/:postId'),
    (0, decorators_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: 'MyList 포스팅 추가' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MyList 포스팅 추가 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'MyList 포스팅 추가 실패' }),
    __param(0, (0, decorators_1.Param)('postId')),
    __param(1, (0, decorators_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, add_my_list_posting_dto_1.addCollectionPostingDto]),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "myListPlusPosting", null);
__decorate([
    (0, common_1.Delete)('/collections/minus/:postId'),
    (0, decorators_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: 'MyList 포스팅 삭제' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MyList 포스팅 삭제 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'MyList 포스팅 삭제 실패' }),
    __param(0, (0, decorators_1.Param)('postId')),
    __param(1, (0, decorators_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, minus_bookmark_posting_dto_1.minusCollectionPostingDto, Object]),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "myListMinusPosting", null);
__decorate([
    (0, common_1.Post)('/collections/update/:postId'),
    (0, decorators_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: 'MyList 포스팅 업데이트' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'MyList 포스팅 업데이트 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'MyList 포스팅 업데이트 실패' }),
    __param(0, (0, decorators_1.Param)('postId')),
    __param(1, (0, decorators_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, add_my_list_posting_dto_1.addCollectionPostingDto]),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "myListUpdatePosting", null);
__decorate([
    (0, common_1.Get)('/collections/main/hot'),
    (0, swagger_1.ApiOperation)({ summary: '요즘 뜨는 맛집리스트' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '요즘 뜨는 맛집리스트 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '요즘 뜨는 맛집리스트 실패' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "HotMyList", null);
__decorate([
    (0, common_1.Get)('/collections/main/followers'),
    (0, decorators_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, swagger_1.ApiOperation)({ summary: '내 친구의 맛집리스트' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '내 친구의 맛집리스트 성공' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '내 친구의 맛집리스트 실패' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MyListController.prototype, "FollowersMyList", null);
MyListController = __decorate([
    (0, swagger_1.ApiTags)('my-list'),
    (0, common_1.Controller)('my-list'),
    __metadata("design:paramtypes", [my_list_service_1.MyListService,
        post_service_1.PostService])
], MyListController);
exports.MyListController = MyListController;
//# sourceMappingURL=my-list.controller.js.map