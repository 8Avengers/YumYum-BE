"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_profile_controller_1 = require("./user-profile.controller");
const user_profile_service_1 = require("./user-profile.service");
const collection_entity_1 = require("../collection/entities/collection.entity");
const follow_entity_1 = require("./entities/follow.entity");
const user_signup_controller_1 = require("./user-signup.controller");
const user_signup_service_1 = require("./user-signup.service");
const upload_module_1 = require("./../upload/upload.module");
const upload_service_1 = require("../upload/upload.service");
const post_module_1 = require("../post/post.module");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, collection_entity_1.Collection, follow_entity_1.Follow]),
            upload_module_1.UploadModule,
            post_module_1.PostModule,
        ],
        controllers: [user_profile_controller_1.UserProfileController, user_signup_controller_1.UserSignupController],
        providers: [user_profile_service_1.UserProfileService, user_signup_service_1.UserSignupService, upload_service_1.UploadService],
        exports: [user_profile_service_1.UserProfileService, user_signup_service_1.UserSignupService, typeorm_1.TypeOrmModule],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map