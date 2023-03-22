"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const bookmark_controller_1 = require("./bookmark.controller");
const bookmark_service_1 = require("./bookmark.service");
const post_entity_1 = require("../post/entities/post.entity");
const collection_entity_1 = require("../collection/entities/collection.entity");
const collection_item_entity_1 = require("./entities/collection-item.entity");
const my_list_controller_1 = require("./my-list.controller");
const my_list_service_1 = require("./my-list.service");
const comment_entity_1 = require("../comment/entities/comment.entity");
const post_like_entity_1 = require("../post/entities/post-like.entity");
const hashtag_entity_1 = require("../post/entities/hashtag.entity");
const restaurant_module_1 = require("../restaurant/restaurant.module");
const upload_module_1 = require("../upload/upload.module");
const post_service_1 = require("../post/post.service");
const post_like_service_1 = require("../post/post-like.service");
const image_repository_1 = require("../post/image.repository");
const post_hashtag_service_1 = require("../post/post-hashtag.service");
const image_entity_1 = require("../post/entities/image.entity");
const post_module_1 = require("../post/post.module");
const follow_entity_1 = require("../user/entities/follow.entity");
const user_entity_1 = require("../user/entities/user.entity");
const upload_service_1 = require("../upload/upload.service");
let CollectionModule = class CollectionModule {
};
CollectionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                collection_entity_1.Collection,
                post_entity_1.Post,
                collection_item_entity_1.CollectionItem,
                post_like_entity_1.PostLike,
                comment_entity_1.Comment,
                image_entity_1.Image,
                hashtag_entity_1.Hashtag,
                follow_entity_1.Follow,
                user_entity_1.User,
                upload_module_1.UploadModule,
            ]),
            restaurant_module_1.RestaurantModule,
            upload_module_1.UploadModule,
            (0, common_1.forwardRef)(() => post_module_1.PostModule),
        ],
        controllers: [bookmark_controller_1.BookmarkController, my_list_controller_1.MyListController],
        providers: [
            bookmark_service_1.BookmarkService,
            my_list_service_1.MyListService,
            post_hashtag_service_1.PostHashtagService,
            post_service_1.PostService,
            post_like_service_1.PostLikeService,
            image_repository_1.ImageRepository,
            upload_service_1.UploadService,
        ],
        exports: [my_list_service_1.MyListService, typeorm_1.TypeOrmModule],
    })
], CollectionModule);
exports.CollectionModule = CollectionModule;
//# sourceMappingURL=collection.module.js.map