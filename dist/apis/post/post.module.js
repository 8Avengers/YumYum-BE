"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const post_controller_1 = require("./post.controller");
const post_service_1 = require("./post.service");
const post_entity_1 = require("./entities/post.entity");
const post_like_controller_1 = require("./post-like.controller");
const post_like_service_1 = require("./post-like.service");
const post_like_entity_1 = require("./entities/post-like.entity");
const hashtag_entity_1 = require("./entities/hashtag.entity");
const post_hashtag_service_1 = require("./post-hashtag.service");
const collection_module_1 = require("../collection/collection.module");
const post_myfeed_controller_1 = require("./post-myfeed.controller");
const comment_entity_1 = require("../comment/entities/comment.entity");
const restaurant_module_1 = require("../restaurant/restaurant.module");
const image_entity_1 = require("./entities/image.entity");
const image_repository_1 = require("./image.repository");
const upload_module_1 = require("../upload/upload.module");
const post_user_tag_service_1 = require("./post-user-tag.service");
let PostModule = class PostModule {
};
PostModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([post_entity_1.Post, post_like_entity_1.PostLike, hashtag_entity_1.Hashtag, comment_entity_1.Comment, image_entity_1.Image]),
            collection_module_1.CollectionModule,
            restaurant_module_1.RestaurantModule,
            upload_module_1.UploadModule,
        ],
        controllers: [post_controller_1.PostController, post_like_controller_1.PostLikeController, post_myfeed_controller_1.MyFeedController],
        providers: [
            post_service_1.PostService,
            post_like_service_1.PostLikeService,
            post_hashtag_service_1.PostHashtagService,
            image_repository_1.ImageRepository,
            post_user_tag_service_1.PostUserTagService,
        ],
        exports: [post_service_1.PostService, typeorm_1.TypeOrmModule],
    })
], PostModule);
exports.PostModule = PostModule;
//# sourceMappingURL=post.module.js.map