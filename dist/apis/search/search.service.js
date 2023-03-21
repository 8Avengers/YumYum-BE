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
exports.SearchService = void 0;
const hashtag_entity_1 = require("./../post/entities/hashtag.entity");
const restaurant_entity_1 = require("./../restaurant/entities/restaurant.entity");
const user_entity_1 = require("./../user/entities/user.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Repository_1 = require("typeorm/repository/Repository");
const typeorm_2 = require("typeorm");
let SearchService = class SearchService {
    constructor(userRepository, restaurantRepository, hashtagRepository) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.hashtagRepository = hashtagRepository;
    }
    async getUserSearch(keyword, page) {
        const pageNum = Number(page) - 1;
        const userInOnePage = 15;
        const userSearchResult = await this.userRepository.find({
            where: { nickname: (0, typeorm_2.ILike)(`${keyword}%`), deleted_at: null },
            select: { id: true, nickname: true, profile_image: true },
            skip: pageNum * userInOnePage,
            take: userInOnePage,
        });
        return userSearchResult;
    }
    async getRestaurantSearch(keyword, page) {
        const pageNum = Number(page) - 1;
        const restaurantInOnePage = 15;
        const restaurantSearchResult = await this.restaurantRepository.find({
            where: { place_name: (0, typeorm_2.ILike)(`${keyword}%`), deleted_at: null },
            select: { id: true, place_name: true },
            skip: pageNum * restaurantInOnePage,
            take: restaurantInOnePage,
        });
        return restaurantSearchResult;
    }
    async getHashtagSearch(keyword, page) {
        const pageNum = Number(page) - 1;
        const hashtagInOnePage = 15;
        const hashtagSearchResult = await this.hashtagRepository.find({
            where: { name: (0, typeorm_2.ILike)(`%${keyword}%`), deleted_at: null },
            select: { id: true, name: true },
            skip: pageNum * hashtagInOnePage,
            take: hashtagInOnePage,
        });
        return hashtagSearchResult;
    }
    async getPostSearchByHashtag(hashtag, page) {
        const pageNum = Number(page) - 1;
        const postInOnePageWithSearchHashtag = 15;
        const postSearchByHashtagResult = await this.hashtagRepository.find({
            relations: ['posts'],
            where: [{ deleted_at: null }, { name: hashtag }],
            skip: pageNum * postInOnePageWithSearchHashtag,
            take: postInOnePageWithSearchHashtag,
        });
        return postSearchByHashtagResult;
    }
};
SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __param(2, (0, typeorm_1.InjectRepository)(hashtag_entity_1.Hashtag)),
    __metadata("design:paramtypes", [Repository_1.Repository,
        Repository_1.Repository,
        Repository_1.Repository])
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map