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
exports.PostHashtagService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./entities/post.entity");
const hashtag_entity_1 = require("./entities/hashtag.entity");
let PostHashtagService = class PostHashtagService {
    constructor(postRepository, hashtagRepository) {
        this.postRepository = postRepository;
        this.hashtagRepository = hashtagRepository;
    }
    async createOrUpdateHashtags(hashtagNames) {
        try {
            return Promise.all(hashtagNames.map(async (name) => {
                let hashtag = await this.hashtagRepository.findOne({
                    where: { name },
                });
                if (!hashtag) {
                    hashtag = new hashtag_entity_1.Hashtag();
                    hashtag.name = name;
                    await this.hashtagRepository.save(hashtag);
                }
                return hashtag;
            }));
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
};
PostHashtagService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(1, (0, typeorm_1.InjectRepository)(hashtag_entity_1.Hashtag)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PostHashtagService);
exports.PostHashtagService = PostHashtagService;
//# sourceMappingURL=post-hashtag.service.js.map