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
exports.MapService = void 0;
const follow_entity_1 = require("../user/entities/follow.entity");
const post_entity_1 = require("../post/entities/post.entity");
const Repository_1 = require("typeorm/repository/Repository");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
let MapService = class MapService {
    constructor(postRepository, followRepository) {
        this.postRepository = postRepository;
        this.followRepository = followRepository;
    }
    async getFollowerPosting(userId) {
        let followerPostingResult = [];
        const followerList = await this.followRepository.find({
            relations: ['following'],
            where: { follower: { id: userId } },
            select: { following: { id: true } },
        });
        console.log('followerList : ', followerList);
        for (let following of followerList) {
            const followerPost = await this.postRepository.find({
                relations: ['restaurant', 'user'],
                where: { user: { id: following.following.id } },
                select: {
                    id: true,
                    rating: true,
                    content: true,
                    updated_at: true,
                    restaurant: {
                        place_name: true,
                        kakao_place_id: true,
                        category_name: true,
                        x: true,
                        y: true,
                    },
                    user: { id: true, nickname: true, profile_image: true },
                },
                order: {
                    updated_at: 'DESC',
                },
            });
            followerPostingResult.push(...followerPost);
        }
        return followerPostingResult;
    }
    async getMyPosting(userId, collectionId) {
        return await this.postRepository.find({
            relations: ['user', 'collectionItems', 'restaurant'],
            where: {
                user: { id: userId },
                collectionItems: { collection: { id: collectionId } },
            },
            select: {
                id: true,
                rating: true,
                collectionItems: {},
                user: { profile_image: true },
                restaurant: { place_name: true, category_name: true, x: true, y: true },
            },
            order: {
                updated_at: 'DESC',
            },
        });
    }
};
MapService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(1, (0, typeorm_1.InjectRepository)(follow_entity_1.Follow)),
    __metadata("design:paramtypes", [Repository_1.Repository,
        Repository_1.Repository])
], MapService);
exports.MapService = MapService;
//# sourceMappingURL=map.service.js.map