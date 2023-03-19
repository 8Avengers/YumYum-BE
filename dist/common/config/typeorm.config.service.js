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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const comment_entity_1 = require("../../apis/comment/entities/comment.entity");
const comment_like_entity_1 = require("../../apis/comment/entities/comment-like.entity");
const comment_usertag_entity_1 = require("../../apis/comment/entities/comment-usertag.entity");
const hashtag_entity_1 = require("../../apis/post/entities/hashtag.entity");
const image_entity_1 = require("../../apis/post/entities/image.entity");
const post_entity_1 = require("../../apis/post/entities/post.entity");
const post_like_entity_1 = require("../../apis/post/entities/post-like.entity");
const post_usertag_entity_1 = require("../../apis/post/entities/post-usertag.entity");
const restaurant_entity_1 = require("../../apis/restaurant/entities/restaurant.entity");
const user_entity_1 = require("../../apis/user/entities/user.entity");
const snake_naming_strategy_1 = require("typeorm-naming-strategies/snake-naming.strategy");
const collection_entity_1 = require("../../apis/collection/entities/collection.entity");
const follow_entity_1 = require("../../apis/user/entities/follow.entity");
const collection_item_entity_1 = require("../../apis/collection/entities/collection-item.entity");
let TypeOrmConfigService = class TypeOrmConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    createTypeOrmOptions() {
        return {
            type: 'mysql',
            host: this.configService.get('DATABASE_HOST'),
            port: this.configService.get('DATABASE_PORT'),
            username: this.configService.get('DATABASE_USERNAME'),
            password: this.configService.get('DATABASE_PASSWORD'),
            database: this.configService.get('DATABASE_NAME'),
            namingStrategy: new snake_naming_strategy_1.SnakeNamingStrategy(),
            logging: Boolean(this.configService.get('DATABASE_logging')),
            synchronize: Boolean(this.configService.get('DATABASE_SYNC')),
            entities: [
                collection_entity_1.Collection,
                collection_item_entity_1.CollectionItem,
                comment_entity_1.Comment,
                comment_like_entity_1.CommentLike,
                comment_usertag_entity_1.CommentUserTag,
                post_entity_1.Post,
                hashtag_entity_1.Hashtag,
                image_entity_1.Image,
                post_like_entity_1.PostLike,
                post_usertag_entity_1.PostUserTag,
                restaurant_entity_1.Restaurant,
                user_entity_1.User,
                follow_entity_1.Follow,
            ],
        };
    }
};
TypeOrmConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TypeOrmConfigService);
exports.TypeOrmConfigService = TypeOrmConfigService;
//# sourceMappingURL=typeorm.config.service.js.map