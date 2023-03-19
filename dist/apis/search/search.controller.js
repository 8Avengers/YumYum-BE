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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const search_service_1 = require("./search.service");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    async getUserSearch(keyword) {
        console.log(keyword);
        return await this.searchService.getUserSearch(keyword);
    }
    async getRestaurantSearch(keyword) {
        return await this.searchService.getRestaurantSearch(keyword);
    }
    async getHashtagSearch(keyword) {
        return await this.searchService.getHashtagSearch(keyword);
    }
    async getPostSearchByHashtag(hashtag) {
        return await this.searchService.getPostSearchByHashtag(hashtag);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '회원 검색 및 데이터 받기' }),
    (0, common_1.Get)('/user'),
    __param(0, (0, common_1.Query)('keyword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "getUserSearch", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '음식점 정보 검색 및 데이터 받기' }),
    (0, common_1.Get)('/restaurant'),
    __param(0, (0, common_1.Query)('keyword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "getRestaurantSearch", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '해시태그 정보 검색 및 데이터 받기' }),
    (0, common_1.Get)('/hashtag'),
    __param(0, (0, common_1.Query)('keyword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "getHashtagSearch", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '해시태그를 기반으로 포스팅 불러오기' }),
    (0, common_1.Get)('/post'),
    __param(0, (0, common_1.Query)('hashtag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "getPostSearchByHashtag", null);
SearchController = __decorate([
    (0, swagger_1.ApiTags)('Search'),
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
exports.SearchController = SearchController;
//# sourceMappingURL=search.controller.js.map