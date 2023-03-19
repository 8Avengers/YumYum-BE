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
exports.PostUserTagService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const post_entity_1 = require("./entities/post.entity");
const post_usertag_entity_1 = require("./entities/post-usertag.entity");
const typeorm_3 = require("typeorm");
let PostUserTagService = class PostUserTagService {
    constructor(userRepository, postRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }
    async tagUsersInPost(postId, usernames) {
        const post = await this.postRepository.findOne({ where: { id: postId } });
        const users = await this.userRepository.find({
            where: { nickname: (0, typeorm_3.In)(usernames) },
        });
        const userTags = [];
        for (const username of usernames) {
            const user = users.find((u) => u.nickname === username);
            const postUserTag = new post_usertag_entity_1.PostUserTag();
            postUserTag.post = post;
            postUserTag.user = user;
            userTags.push(postUserTag);
        }
        post.postUserTags = userTags;
        return this.postRepository.save(post);
    }
};
PostUserTagService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PostUserTagService);
exports.PostUserTagService = PostUserTagService;
//# sourceMappingURL=post-user-tag.service.js.map