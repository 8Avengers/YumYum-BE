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
exports.MapController = void 0;
const auth_guards_1 = require("./../auth/guards/auth.guards");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const map_service_1 = require("./map.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let MapController = class MapController {
    constructor(mapService) {
        this.mapService = mapService;
    }
    async getFollowerSearchInMap(currentUser) {
        return await this.mapService.getFollowerPosting(currentUser.id);
    }
    async getFollowerSearchInMapList(currentUser) {
        return await this.mapService.getFollowerPostingList(currentUser.id);
    }
    async getMyPostingSearchInMap(collectionId, currentUser) {
        return await this.mapService.getMyPosting(currentUser.id, collectionId);
    }
    async getCloseRestaurant(data) {
        return await this.mapService.getNearRestaurant(data.x, data.y);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '맵 탐색 페이지' }),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, common_1.Get)('/followerPosting'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MapController.prototype, "getFollowerSearchInMap", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '맵 탐색 페이지 리스트' }),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, common_1.Get)('/follower-posting-list'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MapController.prototype, "getFollowerSearchInMapList", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '내 포스팅 지도' }),
    (0, common_1.UseGuards)(auth_guards_1.AuthAccessGuard),
    (0, common_1.Get)('/myListPosting/:collectionId'),
    __param(0, (0, common_1.Param)('collectionId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MapController.prototype, "getMyPostingSearchInMap", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '메인 페이지' }),
    (0, common_1.Get)('/main/near-restaurant'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MapController.prototype, "getCloseRestaurant", null);
MapController = __decorate([
    (0, swagger_1.ApiTags)('Map'),
    (0, common_1.Controller)('map'),
    __metadata("design:paramtypes", [map_service_1.MapService])
], MapController);
exports.MapController = MapController;
//# sourceMappingURL=map.controller.js.map