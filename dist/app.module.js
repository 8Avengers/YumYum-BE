"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const map_module_1 = require("./apis/map/map.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_config_service_1 = require("./common/config/typeorm.config.service");
const search_module_1 = require("./apis/search/search.module");
const post_module_1 = require("./apis/post/post.module");
const comment_module_1 = require("./apis/comment/comment.module");
const auth_module_1 = require("./apis/auth/auth.module");
const user_module_1 = require("./apis/user/user.module");
const collection_module_1 = require("./apis/collection/collection.module");
const restaurant_module_1 = require("./apis/restaurant/restaurant.module");
const upload_module_1 = require("./apis/upload/upload.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useClass: typeorm_config_service_1.TypeOrmConfigService,
            }),
            collection_module_1.CollectionModule,
            search_module_1.SearchModule,
            post_module_1.PostModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            comment_module_1.CommentModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            restaurant_module_1.RestaurantModule,
            upload_module_1.UploadModule,
            map_module_1.MapModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map